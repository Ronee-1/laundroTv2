import { Router, type Request, type Response } from 'express';
import type { OrderStatus } from '@laundrot/shared-types';
import { findNearestBranch } from '../services/georouting.js';
import { checkQuota, generateDelayMessage, getNextBusinessDay } from '../services/quota.js';
import {
  updateOrderStatus,
  createOrderFromWhatsApp,
  getIncomingOrdersByBranch,
  getAllOrdersByBranch,
  assignOrderToCourier,
  getAssignedOrdersByCourier,
  reorderCourierTasks,
} from '../config/orders.js';
import { createJournalEntry } from '../services/cashbook.js';
import { getBranchById } from '../config/branches.js';
import { getCourierById } from '../config/couriers.js';

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

router.post('/allocate', (req: Request<{}, AllocateResponse, AllocateOrderBody>, res: Response<AllocateResponse>) => {
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

  const nearest = findNearestBranch(koordinat);

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

  const quota = checkQuota(nearest.branch.id_cabang);

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
  (req: Request<{}, WhatsAppAllocateResponse, WhatsAppAllocateBody>, res: Response<WhatsAppAllocateResponse>) => {
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
    const nearest = findNearestBranch(koordinat);

    if (!nearest) {
      res.status(400).json({
        success: false,
        error: 'Tidak ada cabang aktif yang tersedia untuk dialokasikan.',
      });
      return;
    }

    // Check quota availability
    const quota = checkQuota(nearest.branch.id_cabang);

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
    const order = createOrderFromWhatsApp({
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

    const branch = getBranchById(nearest.branch.id_cabang);

    // Return success with order details - branch admin will see this in their dashboard
    res.status(201).json({
      success: true,
      id_order: order.id_order,
      id_cabang: nearest.branch.id_cabang,
      nama_cabang: branch?.nama_cabang ?? nearest.branch.nama_cabang,
      distance_km: Math.round(nearest.distance_km * 100) / 100,
      message: `Pesanan dari ${customer_name} berhasil dialokasikan ke ${branch?.nama_cabang ?? nearest.branch.nama_cabang}. Order ID: ${order.id_order}`,
    });
  },
);

// ==========================================
// BRANCH INCOMING ORDERS ENDPOINT - FR-LOG-02
// Get all incoming/pending orders for a specific branch
// Branch admin can view orders allocated from WhatsApp Hub
// ==========================================

interface BranchIncomingOrdersResponse {
  success: true;
  id_cabang: string;
  total_orders: number;
  orders: Array<{
    id_order: string;
    customer_name: string;
    customer_whatsapp: string;
    service_type: string;
    wilayah: string;
    berat_kg: number;
    alamat_penjemputan: string;
    google_maps_url: string;
    koordinat_penjemputan: { latitude: number; longitude: number };
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
  (req: Request<{ id_cabang: string }>, res: Response<BranchIncomingOrdersResponseType>) => {
    const { id_cabang } = req.params;

    const branch = getBranchById(id_cabang);
    if (!branch) {
      res.status(404).json({
        success: false,
        error: `Cabang "${id_cabang}" tidak ditemukan.`,
      });
      return;
    }

    const incomingOrders = getIncomingOrdersByBranch(id_cabang);

    res.status(200).json({
      success: true,
      id_cabang,
      total_orders: incomingOrders.length,
      orders: incomingOrders.map((o) => ({
        id_order: o.id_order,
        customer_name: o.customer_name ?? 'Unknown',
        customer_whatsapp: o.customer_whatsapp ?? '',
        service_type: o.service_type ?? 'Laundry Kiloan',
        wilayah: o.wilayah ?? '',
        berat_kg: o.berat_kg ?? 0,
        alamat_penjemputan: o.alamat_penjemputan,
        google_maps_url: o.google_maps_url ?? '',
        koordinat_penjemputan: o.koordinat_penjemputan,
        status: o.status,
        tanggal_order: o.tanggal_order.toISOString(),
      })),
    });
  },
);

// Get all orders for branch (including processed)
router.get(
  '/branch/:id_cabang/all',
  (req: Request<{ id_cabang: string }>, res: Response) => {
    const { id_cabang } = req.params;

    const branch = getBranchById(id_cabang);
    if (!branch) {
      res.status(404).json({ success: false, error: `Cabang "${id_cabang}" tidak ditemukan.` });
      return;
    }

    const orders = getAllOrdersByBranch(id_cabang);

    res.status(200).json({
      success: true,
      id_cabang,
      total_orders: orders.length,
      orders,
    });
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
  (req: Request<{ id_order: string }, AssignOrderResponse, AssignOrderBody>, res: Response<AssignOrderResponse>) => {
    const { id_order } = req.params;
    const { id_kurir, assigned_by } = req.body;

    if (!id_kurir) {
      res.status(400).json({
        success: false,
        error: 'id_kurir wajib diisi.',
      });
      return;
    }

    const order = getAllOrdersByBranch('').find((o) => o.id_order === id_order);
    if (!order) {
      res.status(404).json({
        success: false,
        error: `Pesanan dengan ID "${id_order}" tidak ditemukan.`,
      });
      return;
    }

    // Verify courier exists
    const courier = getCourierById(id_kurir);
    if (!courier) {
      res.status(404).json({
        success: false,
        error: `Kurir dengan ID "${id_kurir}" tidak ditemukan.`,
      });
      return;
    }

    // Verify courier belongs to the same branch as the order
    if (courier.id_cabang !== order.id_cabang) {
      res.status(400).json({
        success: false,
        error: `Kurir ${id_kurir} tidak bertugas di cabang ${order.id_cabang}. Kurir hanya bisa menerima pesanan dari cabangnya sendiri.`,
      });
      return;
    }

    const updatedOrder = assignOrderToCourier(id_order, id_kurir, assigned_by);

    if (!updatedOrder) {
      res.status(404).json({
        success: false,
        error: `Gagal assigning order: Pesanan tidak ditemukan.`,
      });
      return;
    }

    res.status(200).json({
      success: true,
      id_order: updatedOrder.id_order,
      id_kurir: updatedOrder.id_kurir ?? id_kurir,
      nama_kurir: courier.nama_kurir,
      message: `Pesanan ${id_order} berhasil dialokasikan ke kurir ${courier.nama_kurir} (${id_kurir}).`,
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
  (req: Request<{}, ReorderTasksResponse, ReorderTasksBody>, res: Response<ReorderTasksResponse>) => {
    const { id_kurir, ordered_task_ids } = req.body;

    if (!id_kurir || !ordered_task_ids || !Array.isArray(ordered_task_ids)) {
      res.status(400).json({
        success: false,
        error: 'id_kurir dan ordered_task_ids (array) wajib diisi.',
      });
      return;
    }

    const courier = getCourierById(id_kurir);
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
  (req: Request<{ id_kurir: string }, any>, res: Response) => {
    const { id_kurir } = req.params;

    const courier = getCourierById(id_kurir);
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
  status: any;
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
  (req: Request<{ id_order: string }, UpdateStatusResponse, UpdateStatusBody>, res: Response<UpdateStatusResponse>) => {
    const { id_order } = req.params;
    const { status } = req.body;

    if (!status || !VALID_STATUSES.includes(status)) {
      res.status(400).json({
        success: false,
        id_order,
        status: '',
        id_cabang: '',
        message: `Status tidak valid. Status yang diizinkan: ${VALID_STATUSES.join(', ')}`,
      });
      return;
    }

    const updatedOrder = updateOrderStatus(id_order, status);

    if (!updatedOrder) {
      res.status(404).json({
        success: false,
        id_order,
        status: '',
        id_cabang: '',
        message: `Pesanan dengan ID "${id_order}" tidak ditemukan.`,
      });
      return;
    }

    let journal = undefined;

    if (status === 'Selesai' || status === 'Lunas' || status === 'Done') {
      const branch = getBranchById(updatedOrder.id_cabang);
      const nominal = updatedOrder.total_harga ?? 0;

      const entry = createJournalEntry({
        id_cabang: updatedOrder.id_cabang,
        id_transaksi: updatedOrder.id_order,
        nominal,
        tipe: 'Pemasukan',
        deskripsi: `Pendapatan pesanan ${updatedOrder.id_order} dari ${branch?.nama_cabang ?? updatedOrder.id_cabang}`,
      });

      journal = {
        id_jurnal: entry.id_jurnal,
        nominal: entry.nominal,
        tipe: entry.tipe,
        deskripsi: entry.deskripsi,
        tanggal_jurnal: entry.tanggal_jurnal.toISOString(),
      };
    }

    res.status(200).json({
      success: true,
      id_order: updatedOrder.id_order,
      status: updatedOrder.status,
      id_cabang: updatedOrder.id_cabang,
      journal,
      message:
        journal
          ? `Status pesanan diubah menjadi "${status}". Jurnal otomatis tercatat di Buku Kas Pusat.`
          : `Status pesanan diubah menjadi "${status}".`,
    });
  },
);

export default router;
