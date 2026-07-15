import { Router, type Request, type Response } from 'express';
import type { OrderStatus } from '@laundrot/shared-types';
import { findNearestBranch } from '../services/georouting.js';
import { checkQuota, generateDelayMessage, getNextBusinessDay } from '../services/quota.js';
import { prisma } from '../lib/prisma.js';
import {
  updateOrderStatus,
  updateOrderStatus as updateOrderStatusDb,
  createOrderFromWhatsApp,
  getIncomingOrdersByBranch,
  getIncomingOrdersByBranchFromDB,
  getAllOrdersByBranch,
  getOrderById,
  assignOrderToCourier,
  getAssignedOrdersByCourier,
  getAssignedOrdersByCourierFromDB,
  reorderCourierTasks,
} from '../config/orders.js';
import {
  createWhatsAppOrder,
  getAllOrders,
  getOrdersByBranch,
  getAllWhatsAppOrders,
  getWhatsAppOrdersByBranch,
  getOrderStats,
  type UnifiedOrder,
} from '../services/unifiedOrders.js';
import { createJournalEntry, getJournalSummary } from '../services/cashbook.js';
import { getBranchById } from '../config/branches.js';
import { getCourierById } from '../config/couriers.js';
// FR-KUR-SYNC: Data Synchronization imports
import {
  assignmentGuardrail,
  updateCourierWorkloadOnAssignment,
  getBranchCouriersWithWorkload,
  performBilateralValidation,
  getCourierWorkloadStats,
} from '../services/courierSync.js';

const router = Router();

// ==========================================
// ORDERS ROUTES - FR-LOG-01, FR-LOG-02 Implementation
// WhatsApp Order Hub allocates orders to nearest branch
// Branch admin receives and processes allocated orders
// ==========================================

interface AllocateOrderBody {
  alamat_pelanggan: string;
  koordinat: {
    latitude: number;
    longitude: number;
  };
  id_pelanggan?: string;
  catatan?: string;
}

interface AllocateSuccessResponse {
  success: true;
  status: 'Dialokasikan';
  id_cabang: string;
  nama_cabang: string;
  distance_km: number;
  sisa_kuota: number;
  message: string;
}

interface QuotaFullResponse {
  success: false;
  status: 'Kuota Penuh';
  id_cabang: string;
  nama_cabang: string;
  kuota_harian: number;
  kuota_terpakai: number;
  reschedule_date: string;
  whatsapp_template: string;
}

type AllocateResponse = AllocateSuccessResponse | QuotaFullResponse;

router.post('/allocate', async (req: Request<{}, AllocateResponse, AllocateOrderBody>, res: Response<AllocateResponse>) => {
  try {
    const { alamat_pelanggan, koordinat } = req.body;

    if (!koordinat || typeof koordinat.latitude !== 'number' || typeof koordinat.longitude !== 'number') {
      res.status(400).json({
        success: false,
        status: 'Kuota Penuh',
        id_cabang: '',
        nama_cabang: '',
        kuota_harian: 0,
        kuota_terpakai: 0,
        reschedule_date: '',
        whatsapp_template: 'Error: Koordinat pelanggan tidak valid.',
      });
      return;
    }

    const nearest = await findNearestBranch(koordinat);

  if (!nearest) {
    res.status(503).json({
      success: false,
      status: 'Kuota Penuh',
      id_cabang: '',
      nama_cabang: '',
      kuota_harian: 0,
      kuota_terpakai: 0,
      reschedule_date: '',
      whatsapp_template: 'Error: Tidak ada cabang aktif yang tersedia.',
    });
    return;
  }

  const quota = await checkQuota(nearest.branch.id_cabang);

  if (!quota) {
    res.status(500).json({
      success: false,
      status: 'Kuota Penuh',
      id_cabang: nearest.branch.id_cabang,
      nama_cabang: nearest.branch.nama_cabang,
      kuota_harian: 0,
      kuota_terpakai: 0,
      reschedule_date: '',
      whatsapp_template: 'Error: Data cabang tidak ditemukan.',
    });
    return;
  }

  if (!quota.available) {
    const rescheduleDate = getNextBusinessDay();
    const whatsappTemplate = generateDelayMessage(nearest.branch, rescheduleDate);

    res.status(200).json({
      success: false,
      status: 'Kuota Penuh',
      id_cabang: nearest.branch.id_cabang,
      nama_cabang: nearest.branch.nama_cabang,
      kuota_harian: quota.kuota_harian,
      kuota_terpakai: quota.kuota_terpakai,
      reschedule_date: rescheduleDate.toISOString(),
      whatsapp_template: whatsappTemplate,
    });
    return;
  }

  res.status(200).json({
    success: true,
    status: 'Dialokasikan',
    id_cabang: nearest.branch.id_cabang,
    nama_cabang: nearest.branch.nama_cabang,
    distance_km: Math.round(nearest.distance_km * 100) / 100,
    sisa_kuota: quota.sisa_kuota,
    message: `Pesanan dari "${alamat_pelanggan}" dialokasikan ke ${nearest.branch.nama_cabang} (${Math.round(nearest.distance_km * 100) / 100} km).`,
  });
  } catch (error) {
    console.error('[Orders] POST /allocate error:', error);
    res.status(500).json({
      success: false,
      status: 'Kuota Penuh',
      id_cabang: '',
      nama_cabang: '',
      kuota_harian: 0,
      kuota_terpakai: 0,
      reschedule_date: '',
      whatsapp_template: 'Error: Internal server error.',
    });
  }
});

// ==========================================
// WHATSAPP HUB ALLOCATION ENDPOINT - FR-LOG-01
// Allocates order from WhatsApp to nearest branch
// Order is immediately visible in branch admin dashboard
// ==========================================

interface WhatsAppAllocateBody {
  customer_name: string;
  customer_whatsapp: string;
  service_type: string;
  wilayah: string;
  berat_kg: number;
  alamat_penjemputan: string;
  google_maps_url: string;
  koordinat: {
    latitude: number;
    longitude: number;
  };
}

interface WhatsAppAllocateSuccessResponse {
  success: true;
  id_order: string;
  id_cabang: string;
  nama_cabang: string;
  distance_km: number;
  message: string;
}

interface WhatsAppAllocateErrorResponse {
  success: false;
  error: string;
  id_cabang?: string;
  nama_cabang?: string;
}

type WhatsAppAllocateResponse = WhatsAppAllocateSuccessResponse | WhatsAppAllocateErrorResponse;

router.post(
  '/whatsapp-allocate',
  async (req: Request<{}, WhatsAppAllocateResponse, WhatsAppAllocateBody>, res: Response<WhatsAppAllocateResponse>) => {
    try {
      const { customer_name, customer_whatsapp, service_type, wilayah, berat_kg, alamat_penjemputan, google_maps_url, koordinat } = req.body;

      // Validate required fields
      if (!customer_name || !customer_whatsapp || !alamat_penjemputan || !koordinat) {
        res.status(400).json({
          success: false,
          error: 'Field wajib: customer_name, customer_whatsapp, alamat_penjemputan, koordinat.',
        });
        return;
      }

      if (!koordinat || typeof koordinat.latitude !== 'number' || typeof koordinat.longitude !== 'number') {
        res.status(400).json({
          success: false,
          error: 'Koordinat tidak valid. Harus memiliki latitude dan longitude.',
        });
        return;
      }

      // Find nearest branch using georouting (FR-LOG-01)
      const nearest = await findNearestBranch(koordinat);

      if (!nearest) {
        res.status(400).json({
          success: false,
          error: 'Tidak ada cabang aktif yang tersedia untuk dialokasikan.',
        });
        return;
      }

      // Check quota availability
      const quota = await checkQuota(nearest.branch.id_cabang);

      if (quota && !quota.available) {
        res.status(200).json({
          success: false,
          error: 'Kuota harian cabang telah penuh.',
          id_cabang: nearest.branch.id_cabang,
          nama_cabang: nearest.branch.nama_cabang,
        });
        return;
      }

      // Create order in the nearest branch (FR-LOG-02 - branch receives order)
      const order = await createOrderFromWhatsApp({
        id_cabang: nearest.branch.id_cabang,
        customer_name,
        customer_whatsapp,
        service_type: service_type || 'Laundry Kiloan',
        berat_kg: berat_kg || 0,
        wilayah,
        alamat_penjemputan,
        koordinat_penjemputan: koordinat,
        google_maps_url: google_maps_url || '',
      });

      const branch = await getBranchById(nearest.branch.id_cabang);

      // Return success with order details - branch admin will see this in their dashboard
      res.status(201).json({
        success: true,
        id_order: order.id_order,
        id_cabang: nearest.branch.id_cabang,
        nama_cabang: branch?.nama_cabang ?? nearest.branch.nama_cabang,
        distance_km: Math.round(nearest.distance_km * 100) / 100,
        message: `Pesanan dari ${customer_name} berhasil dialokasikan ke ${branch?.nama_cabang ?? nearest.branch.nama_cabang}. Order ID: ${order.id_order}`,
      });
    } catch (error) {
      console.error('[Orders] POST /whatsapp-allocate error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
      });
    }
  }
);

// ==========================================
// BRANCH INCOMING ORDERS ENDPOINT - FR-LOG-02
// Get all incoming/pending orders for a specific branch
// Branch admin can view orders allocated from WhatsApp Hub
// ==========================================

// Helper function to extract coordinates from Google Maps URL
function extractCoordinatesFromGmapsUrl(url: string): { lat: number; lng: number } | null {
  if (!url) return null;
  try {
    // Pattern: @lat,lng
    const atMatch = url.match(/@(-?\d+\.?\d*),(-?\d+\.?\d*)/);
    if (atMatch) return { lat: parseFloat(atMatch[1]), lng: parseFloat(atMatch[2]) };
    // Pattern: ?q=lat,lng
    const qMatch = url.match(/[?&]q=(-?\d+\.?\d*),(-?\d+\.?\d*)/);
    if (qMatch) return { lat: parseFloat(qMatch[1]), lng: parseFloat(qMatch[2]) };
    // Pattern: destination=lat,lng
    const destMatch = url.match(/destination=(-?\d+\.?\d*),(-?\d+\.?\d*)/);
    if (destMatch) return { lat: parseFloat(destMatch[1]), lng: parseFloat(destMatch[2]) };
    return null;
  } catch {
    return null;
  }
}

// Normalize WhatsApp number for matching
function normalizeWhatsApp(wa: string): string {
  return wa.replace(/[^0-9]/g, '');
}

interface BranchIncomingOrdersResponse {
  success: true;
  id_cabang: string;
  total_orders: number;
  orders: Array<{
    id_order: string;
    customer_name: string;
    customer_whatsapp: string;
    service_type: string;
    service_name: string;
    wilayah: string;
    berat_kg: number;
    alamat_penjemputan: string;
    google_maps_url: string;
    gmaps_link: string;
    latitude: number;
    longitude: number;
    status: string;
    tanggal_order: string;
  }>;
}

interface BranchIncomingOrdersErrorResponse {
  success: false;
  error: string;
}

type BranchIncomingOrdersResponseType = BranchIncomingOrdersResponse | BranchIncomingOrdersErrorResponse;

router.get(
  '/branch/:id_cabang/incoming',
  async (req: Request<{ id_cabang: string }>, res: Response<BranchIncomingOrdersResponseType>) => {
    try {
      const { id_cabang } = req.params;

      // Get orders from in-memory store (WhatsApp Hub orders with status 'Pending')
      const incomingOrders = await getIncomingOrdersByBranch(id_cabang);

      // Get orders from database (Outlet Reception + WhatsApp orders)
      let dbOrders: any[] = [];
      let dbError: string | null = null;

      try {
        // Direct Prisma query to ensure we get fresh data
        const prismaOrders = await prisma.order.findMany({
          where: { id_cabang },
          orderBy: { tanggal_order: 'desc' },
        });

        // Get all customers for this branch
        const allCustomers = await prisma.customer.findMany({
          where: { id_cabang },
          select: {
            id_pelanggan: true,
            nama: true,
            whatsapp: true,
            alamat_maps: true,
            google_maps_url: true,
          },
        });

        // Create customer lookup maps
        const customerMapById = new Map(allCustomers.map(c => [c.id_pelanggan, c]));
        const customerMapByWhatsApp = new Map(
          allCustomers.filter(c => c.whatsapp).map(c => [normalizeWhatsApp(c.whatsapp), c])
        );

        // Transform and join with customer data
        dbOrders = prismaOrders.map((o: any) => {
          // Find customer by id_pelanggan or whatsapp
          let customer = customerMapById.get(o.id_pelanggan);
          if (!customer && o.customer_whatsapp) {
            customer = customerMapByWhatsApp.get(normalizeWhatsApp(o.customer_whatsapp));
          }

          // Prioritas GMaps URL: order.google_maps_url > customer.alamat_maps > customer.google_maps_url
          const gmapsUrl = o.google_maps_url || customer?.alamat_maps || customer?.google_maps_url || '';

          // Extract coordinates
          let lat = o.latitude_penjemputan || 0;
          let lng = o.longitude_penjemputan || 0;

          if ((lat === 0 || lng === 0) && gmapsUrl) {
            const coords = extractCoordinatesFromGmapsUrl(gmapsUrl);
            if (coords) {
              lat = coords.lat;
              lng = coords.lng;
            }
          }

          // Navigation URL for Google Maps
          const navigationUrl = (lat !== 0 && lng !== 0)
            ? `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`
            : gmapsUrl;

          return {
            id_order: o.id_order,
            id_cabang: o.id_cabang,
            customer_name: o.customer_name || customer?.nama || 'Unknown',
            customer_whatsapp: o.customer_whatsapp || customer?.whatsapp || '',
            service_type: o.service_type || o.service_name || 'Laundry',
            service_name: o.service_name || '',
            wilayah: o.wilayah || '',
            berat_kg: o.berat_kg || 0,
            alamat_penjemputan: o.alamat_penjemputan || '',
            google_maps_url: navigationUrl,
            gmaps_link: gmapsUrl,
            latitude: lat,
            longitude: lng,
            status: o.status,
            tanggal_order: o.tanggal_order instanceof Date ? o.tanggal_order.toISOString() : String(o.tanggal_order),
            source: o.source || 'whatsapp',
            id_kurir: o.id_kurir || undefined,
          };
        });

        console.log(`[INCOMING ORDERS] Found ${dbOrders.length} orders from database for branch ${id_cabang}`);
        console.log(`[INCOMING ORDERS] Found ${allCustomers.length} customers in branch ${id_cabang}`);
      } catch (error: any) {
        dbError = error.message;
        console.error('[INCOMING ORDERS] Error fetching from database:', error);
      }

      // Statuses that mean the order is COMPLETED and should NEVER show in incoming list
      const COMPLETED_STATUSES = ['Done', 'Dibatalkan', 'Lunas', 'Selesai'];

      // Helper: check if order has NOT been assigned to any courier
      const isUnassigned = (o: any) => !o.id_kurir || o.id_kurir === '' || o.id_kurir === null;

      // Log untuk debugging
      console.log(`[INCOMING ORDERS] In-memory orders: ${incomingOrders.length}, DB orders: ${dbOrders.length}`);
      if (dbError) {
        console.log(`[INCOMING ORDERS] DB Error: ${dbError} - falling back to in-memory only`);
      }

      // Combine both sources - TAMPILKAN SEMUA PESANAN YANG BELUM SELESAI
      // Termasuk pesanan yang sudah/tidak ditugaskan ke kurir
      const allIncomingOrders = [
        // WhatsApp orders dari memory: only show if status is 'Pending' AND no courier assigned
        ...incomingOrders
          .filter((o) => o.status === 'Pending' && isUnassigned(o))
          .map((o) => ({
            id_order: o.id_order,
            customer_name: o.customer_name ?? 'Unknown',
            customer_whatsapp: o.customer_whatsapp ?? '',
            service_type: o.service_type ?? 'Laundry Kiloan',
            service_name: '',
            wilayah: o.wilayah ?? '',
            berat_kg: o.berat_kg ?? 0,
            alamat_penjemputan: o.alamat_penjemputan,
            google_maps_url: o.google_maps_url ?? '',
            gmaps_link: o.google_maps_url ?? '',
            latitude: o.koordinat_penjemputan?.latitude ?? 0,
            longitude: o.koordinat_penjemputan?.longitude ?? 0,
            status: o.status,
            tanggal_order: o.tanggal_order instanceof Date ? o.tanggal_order.toISOString() : String(o.tanggal_order),
            source: 'whatsapp',
          })),
        // Database orders: TAMPILKAN JIKA status BUKAN completed
        ...dbOrders
          .filter((o) => !COMPLETED_STATUSES.includes(o.status))
          .map((o) => ({
            id_order: o.id_order,
            customer_name: o.customer_name ?? 'Unknown',
            customer_whatsapp: o.customer_whatsapp ?? '',
            service_type: o.service_type ?? o.service_name ?? 'Layanan Outlet',
            service_name: o.service_name ?? '',
            wilayah: o.wilayah ?? '',
            berat_kg: o.berat_kg ?? o.qty ?? 0,
            alamat_penjemputan: o.alamat_penjemputan ?? '',
            google_maps_url: o.google_maps_url ?? '',
            gmaps_link: o.gmaps_link ?? '',
            latitude: o.latitude ?? 0,
            longitude: o.longitude ?? 0,
            status: o.status,
            tanggal_order: o.tanggal_order instanceof Date ? o.tanggal_order.toISOString() : String(o.tanggal_order),
            source: o.source ?? 'outlet',
          })),
      ];

      console.log(`[INCOMING ORDERS] Total incoming: ${allIncomingOrders.length}`);

      res.status(200).json({
        success: true,
        id_cabang,
        total_orders: allIncomingOrders.length,
        orders: allIncomingOrders,
      });
    } catch (error) {
      console.error('[Orders] GET /branch/:id_cabang/incoming error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
      });
    }
  }
);

// Get all orders for branch (including processed)
router.get(
  '/branch/:id_cabang/all',
  async (req: Request<{ id_cabang: string }>, res: Response) => {
    try {
      const { id_cabang } = req.params;

      const branch = await getBranchById(id_cabang);
      if (!branch) {
        res.status(404).json({ success: false, error: `Cabang "${id_cabang}" tidak ditemukan.` });
        return;
      }

      // Get from in-memory store
      const memoryOrders = await getAllOrdersByBranch(id_cabang);

      // Get from database
      let dbOrders: any[] = [];
      try {
        dbOrders = await getOrdersByBranch(id_cabang);
      } catch (error) {
        console.error('[BRANCH ALL ORDERS] Error fetching from database:', error);
      }

      res.status(200).json({
        success: true,
        id_cabang,
        total_orders: memoryOrders.length + dbOrders.length,
        orders: {
          whatsapp: memoryOrders,
          outlet: dbOrders,
        },
      });
    } catch (error) {
      console.error('[Orders] GET /branch/:id_cabang/all error:', error);
      res.status(500).json({ success: false, error: 'Internal server error' });
    }
  }
);

// ==========================================
// GET ALL ORDERS FOR OWNER (WhatsApp Hub)
// Fetches all orders from all branches
// ==========================================
router.get(
  '/all',
  async (_req: Request, res: Response) => {
    try {
      // Get from in-memory store
      const memoryOrders = getAllOrdersByBranch('');

      // Get from database
      const dbOrders = await getOrdersByBranch('');

      res.status(200).json({
        success: true,
        total_orders: memoryOrders.length + dbOrders.length,
        orders: {
          whatsapp: memoryOrders,
          outlet: dbOrders,
        },
      });
    } catch (error) {
      console.error('[ALL ORDERS] Error fetching orders:', error);
      res.status(500).json({
        success: false,
        error: 'Gagal mengambil data order.',
      });
    }
  },
);

// ==========================================
// FR-005: Assign Order to Courier
// Assigns a specific order to a courier for pickup/delivery
// Admin can plot task sequence manually
// ==========================================
interface AssignOrderBody {
  id_kurir: string;
  assigned_by?: string;
}

interface AssignOrderSuccessResponse {
  success: true;
  id_order: string;
  id_kurir: string;
  nama_kurir: string;
  message: string;
}

interface AssignOrderErrorResponse {
  success: false;
  error: string;
}

type AssignOrderResponse = AssignOrderSuccessResponse | AssignOrderErrorResponse;

router.patch(
  '/:id_order/assign',
  async (req: Request<{ id_order: string }>, res: Response) => {
    const { id_order } = req.params;
    const { id_kurir, assigned_by } = req.body;

    if (!id_kurir) {
      res.status(400).json({
        success: false,
        error: 'id_kurir wajib diisi.',
      });
      return;
    }

    // ============================================================
    // FIND ORDER - Check both in-memory and database
    // ============================================================
    let order: any = null;
    let orderSource: 'memory' | 'database' = 'memory';
    const id_cabang = '';

    // First, check in-memory orders
    order = getAllOrdersByBranch('').find((o) => o.id_order === id_order);

    // If not found in memory, check database
    if (!order) {
      try {
        const dbOrder = await prisma.order.findUnique({
          where: { id_order },
        });
        if (dbOrder) {
          order = dbOrder;
          orderSource = 'database';
        }
      } catch (error) {
        console.error('[PATCH /orders/:id_order/assign] Error checking database:', error);
      }
    }

    if (!order) {
      res.status(404).json({
        success: false,
        error: `Pesanan dengan ID "${id_order}" tidak ditemukan.`,
      });
      return;
    }

    // CASE A: Courier Mismatch / Inactive State Check
    console.log(`[PATCH /orders/${id_order}/assign] Running integrity check for courier ${id_kurir}...`);

    const guardResult = await assignmentGuardrail(id_kurir, order.id_cabang);

    if (!guardResult.approved) {
      console.log(`[PATCH /orders/${id_order}/assign] REJECTED: ${guardResult.errorMessage}`);
      res.status(400).json({
        success: false,
        error: guardResult.errorCode,
        message: guardResult.errorMessage,
        id_kurir,
        id_cabang: order.id_cabang,
        verification: {
          courier_id: id_kurir,
          courier_status: 'Invalid',
          assigned_tasks_count: 0,
          branch_id: order.id_cabang,
        },
      });
      return;
    }

    // Get courier info
    const courier = await getCourierById(id_kurir);
    if (!courier) {
      res.status(404).json({
        success: false,
        error: `Kurir dengan ID "${id_kurir}" tidak ditemukan.`,
      });
      return;
    }

    console.log(`[PATCH /orders/${id_order}/assign] APPROVED: Courier ${id_kurir} validated. Current workload: ${guardResult.validation?.workloadCount}`);

    // ============================================================
    // ASSIGNMENT PROCEEDS - Update in correct source
    // ============================================================

    let updatedOrder: any = null;

    if (orderSource === 'memory') {
      // Update in-memory order
      updatedOrder = await assignOrderToCourier(id_order, id_kurir, assigned_by);
    } else {
      // Update database order
      updatedOrder = await prisma.order.update({
        where: { id_order },
        data: {
          id_kurir,
          assigned_by,
          assigned_at: new Date(),
          status: 'Diproses',
        },
      });
    }

    if (!updatedOrder) {
      res.status(404).json({
        success: false,
        error: `Gagal assigning order: Pesanan tidak ditemukan.`,
      });
      return;
    }

    // Get updated workload stats
    const workloadStats = await getCourierWorkloadStats(id_kurir);

    console.log(`[PATCH /orders/${id_order}/assign] SUCCESS: Order assigned to ${courier.nama_kurir}. New workload: ${workloadStats?.totalActiveTasks}`);

    res.status(200).json({
      success: true,
      id_order: updatedOrder.id_order,
      id_kurir: updatedOrder.id_kurir ?? id_kurir,
      nama_kurir: courier.nama_kurir,
      id_cabang: courier.id_cabang,
      message: `Pesanan ${id_order} berhasil dialokasikan ke kurir ${courier.nama_kurir} (${id_kurir})`,
      workload: {
        active_tasks: workloadStats?.totalActiveTasks ?? 0,
        status: workloadStats?.status ?? 'Available',
      },
      verification: {
        courier_id: id_kurir,
        courier_status: courier.is_available ? 'Online' : 'Offline',
        assigned_tasks_count: workloadStats?.totalActiveTasks ?? 0,
        branch_id: courier.id_cabang,
      },
    });
  },
);

// ==========================================
// FR-005: Reorder Courier Tasks
// Allows Admin to manually plot/sequence the order of courier tasks
// ==========================================
interface ReorderTasksBody {
  id_kurir: string;
  ordered_task_ids: string[];
}

interface ReorderTasksSuccessResponse {
  success: true;
  id_kurir: string;
  nama_kurir: string;
  sequences: Array<{
    id_order: string;
    urutan: number;
  }>;
  message: string;
}

type ReorderTasksResponse = ReorderTasksSuccessResponse | AssignOrderErrorResponse;

router.put(
  '/reorder-tasks',
  async (req: Request<{}, ReorderTasksResponse, ReorderTasksBody>, res: Response<ReorderTasksResponse>) => {
    const { id_kurir, ordered_task_ids } = req.body;

    if (!id_kurir || !ordered_task_ids || !Array.isArray(ordered_task_ids)) {
      res.status(400).json({
        success: false,
        error: 'id_kurir dan ordered_task_ids (array) wajib diisi.',
      });
      return;
    }

    const courier = await getCourierById(id_kurir);
    if (!courier) {
      res.status(404).json({
        success: false,
        error: `Kurir dengan ID "${id_kurir}" tidak ditemukan.`,
      });
      return;
    }

    const sequences = reorderCourierTasks(id_kurir, ordered_task_ids);

    res.status(200).json({
      success: true,
      id_kurir,
      nama_kurir: courier.nama_kurir,
      sequences: sequences.map((s) => ({ id_order: s.id_order, urutan: s.urutan })),
      message: `Urutan tugas kurir ${courier.nama_kurir} berhasil diplot ulang. Total: ${sequences.length} tugas.`,
    });
  },
);

// ==========================================
// FR-005: Get Courier Tasks with Sequence
// Returns tasks in their manually plotted sequence
// ==========================================
router.get(
  '/courier/:id_kurir/sequence',
  async (req: Request<{ id_kurir: string }, any>, res: Response) => {
    const { id_kurir } = req.params;

    const courier = await getCourierById(id_kurir);
    if (!courier) {
      res.status(404).json({
        success: false,
        error: `Kurir dengan ID "${id_kurir}" tidak ditemukan.`,
      });
      return;
    }

    const { orders, sequences } = getAssignedOrdersByCourier(id_kurir);

    res.status(200).json({
      success: true,
      id_kurir,
      nama_kurir: courier.nama_kurir,
      id_cabang: courier.id_cabang,
      total_tugas: orders.length,
      sequences: sequences.map((s) => ({
        id_order: s.id_order,
        urutan: s.urutan,
        alamat_penjemputan: s.alamat_penjemputan,
        status: s.status,
        berat_kg: s.berat_kg,
        assigned_at: s.assigned_at?.toISOString(),
      })),
      orders: orders.map((o) => ({
        id_order: o.id_order,
        alamat_penjemputan: o.alamat_penjemputan,
        status: o.status,
        berat_kg: o.berat_kg,
      })),
    });
  },
);

const VALID_STATUSES: string[] = [
  'Pending',
  'Diproses',
  'Siap Diantar',
  'Dalam Pengiriman',
  'Selesai',
  'Lunas',
  'Dibatalkan',
  'On Route',
  'Arrived',
  'Done',
];

interface UpdateStatusBody {
  status: string;
  id_kurir?: string;
}

interface UpdateStatusResponse {
  success: boolean;
  id_order: string;
  status: string;
  id_cabang: string;
  journal?: {
    id_jurnal: string;
    nominal: number;
    tipe: string;
    deskripsi: string;
    tanggal_jurnal: string;
  };
  message: string;
}

router.patch(
  '/:id_order/status',
  async (req: Request<{ id_order: string }, UpdateStatusResponse, UpdateStatusBody>, res: Response<UpdateStatusResponse>) => {
    try {
      const { id_order } = req.params;
      // Sanitize the order ID - trim whitespace
      const sanitizedOrderId = id_order.trim();
      const { status, id_kurir } = req.body;

      console.log(`[PATCH /orders/:id_order/status] Request received: id_order=${sanitizedOrderId}, status=${status}, id_kurir=${id_kurir || 'none'}`);

      if (!status || !VALID_STATUSES.includes(status)) {
        res.status(400).json({
          success: false,
          id_order: sanitizedOrderId,
          status: '',
          id_cabang: '',
          message: `Status tidak valid. Status yang diizinkan: ${VALID_STATUSES.join(', ')}`,
        });
        return;
      }

      // ============================================================
      // FIND ORDER - Check database FIRST for courier assignments
      // Courier assignments MUST update database for persistence
      // ============================================================
      let order: any = null;
      let orderSource: 'memory' | 'database' | null = null;

      // Check database FIRST (orders from outlet/wahatsapp are stored in DB)
      try {
        const dbOrder = await prisma.order.findUnique({
          where: { id_order: sanitizedOrderId },
        });
        if (dbOrder) {
          order = dbOrder;
          orderSource = 'database';
          console.log(`[PATCH /orders/:id_order/status] Found order in database: ${sanitizedOrderId} | id_kurir before: ${dbOrder.id_kurir || 'NULL'}`);
        }
      } catch (error) {
        console.error(`[PATCH /orders/:id_order/status] Error checking database:`, error);
      }

      // Only check in-memory if NOT found in database
      if (!order) {
        const memoryOrder = getOrderById(sanitizedOrderId);
        if (memoryOrder) {
          order = memoryOrder;
          orderSource = 'memory';
          console.log(`[PATCH /orders/:id_order/status] Found order in memory: ${sanitizedOrderId}`);
        }
      }

      if (!order) {
        console.log(`[PATCH /orders/:id_order/status] Order NOT FOUND: ${sanitizedOrderId}`);
        res.status(404).json({
          success: false,
          id_order: sanitizedOrderId,
          status: '',
          id_cabang: '',
          message: `Pesanan dengan ID "${sanitizedOrderId}" tidak ditemukan.`,
        });
        return;
      }

      console.log(`[PATCH /orders/:id_order/status] Order found: ${sanitizedOrderId}, source=${orderSource}, current status=${order.status}`);

      // ============================================================
      // UPDATE ORDER - For courier assignments, ALWAYS update database
      // ============================================================
      let updatedOrder: any = null;
      const shouldAssignCourier = id_kurir && (status === 'Diproses' || status === 'Pickup');
      console.log(`[PATCH /orders/:id_order/status] shouldAssignCourier=${shouldAssignCourier}, orderSource=${orderSource}`);

      // Validate courier exists before assignment
      if (shouldAssignCourier && id_kurir) {
        try {
          const courierCheck = await prisma.courier.findUnique({
            where: { id_kurir },
          });
          if (!courierCheck) {
            console.log(`[PATCH /orders/:id_order/status] ERROR: Courier ${id_kurir} not found in database!`);
            res.status(400).json({
              success: false,
              id_order: sanitizedOrderId,
              status: '',
              id_cabang: order.id_cabang ?? '',
              message: `Kurir dengan ID "${id_kurir}" tidak ditemukan dalam database.`,
            });
            return;
          }
          console.log(`[PATCH /orders/:id_order/status] Courier validation OK: ${courierCheck.nama_kurir}`);
        } catch (error) {
          console.error(`[PATCH /orders/:id_order/status] Error checking courier:`, error);
        }
      }

      if (orderSource === 'database' || shouldAssignCourier) {
        // MUST update database for persistence
        // Also update in-memory for real-time sync if order exists there
        try {
          const updateData: any = { status };
          if (shouldAssignCourier) {
            updateData.id_kurir = id_kurir;
            updateData.assigned_at = new Date();
          }
          console.log(`[PATCH /orders/:id_order/status] Updating DB with:`, JSON.stringify(updateData));
          updatedOrder = await prisma.order.update({
            where: { id_order: sanitizedOrderId },
            data: updateData,
          });
          console.log(`[PATCH /orders/:id_order/status] DB update SUCCESS!`);
          console.log(`[PATCH /orders/:id_order/status] Updated order details:`, {
            id_order: updatedOrder.id_order,
            status: updatedOrder.status,
            id_kurir: updatedOrder.id_kurir,
            assigned_at: updatedOrder.assigned_at,
          });

          // Also update in-memory for real-time sync
          if (orderSource === 'memory') {
            updateOrderStatus(sanitizedOrderId, status);
            if (shouldAssignCourier) {
              assignOrderToCourier(sanitizedOrderId, id_kurir);
            }
            // Re-fetch from DB to get updated order
            order = await prisma.order.findUnique({ where: { id_order: sanitizedOrderId } });
          }
        } catch (error) {
          console.error(`[PATCH /orders/:id_order/status] DB update error:`, error);
          res.status(500).json({
            success: false,
            id_order: sanitizedOrderId,
            status: '',
            id_cabang: order.id_cabang ?? '',
            message: 'Gagal mengupdate pesanan di database.',
          });
          return;
        }
      } else {
        // Fallback: update in-memory only (for legacy/edge cases)
        updatedOrder = updateOrderStatus(sanitizedOrderId, status);
        if (shouldAssignCourier) {
          assignOrderToCourier(sanitizedOrderId, id_kurir);
        }
      }

      let journal = undefined;

      if (status === 'Selesai' || status === 'Lunas' || status === 'Done') {
        const branch = await getBranchById(order.id_cabang);
        const nominal = updatedOrder?.total_harga ?? order.total_harga ?? 0;

        try {
          const entry = await createJournalEntry({
            id_cabang: order.id_cabang,
            id_transaksi: sanitizedOrderId,
            nominal,
            tipe: 'Pemasukan',
            deskripsi: `Pendapatan pesanan ${sanitizedOrderId} dari ${branch?.nama_cabang ?? order.id_cabang ?? 'Unknown'}`,
          });

          journal = {
            id_jurnal: entry.id_jurnal,
            nominal: entry.nominal,
            tipe: entry.tipe,
            deskripsi: entry.deskripsi,
            tanggal_jurnal: entry.tanggal_jurnal.toISOString(),
          };
        } catch (error) {
          console.error(`[PATCH /orders/:id_order/status] Error creating journal entry:`, error);
        }
      }

      res.status(200).json({
        success: true,
        id_order: sanitizedOrderId,
        status: updatedOrder?.status ?? status,
        id_cabang: order.id_cabang ?? '',
        journal,
        message: journal
          ? `Status pesanan diubah menjadi "${status}". Jurnal otomatis tercatat di Buku Kas Pusat.`
          : `Pesanan berhasil${shouldAssignCourier ? ` ditugaskan ke kurir ${id_kurir}` : ''}.`,
      });
    } catch (error) {
      console.error('[Orders] PATCH /:id_order/status error:', error);
      res.status(500).json({
        success: false,
        id_order: '',
        status: '',
        id_cabang: '',
        message: 'Internal server error',
      });
    }
  }
);

export default router;
