import { Router, type Request, type Response } from 'express';
import { getBranchById, getAllBranches } from '../config/branches.js';
import {
  createReconciliation,
  getReconciliationByBranch,
  getAllReconciliations,
  getReconciliationById,
  approveReconciliation,
  rejectReconciliation,
  overrideReconciliation,
} from '../services/reconciliation.js';
import { getTotalApprovedExpenses } from '../services/expense.js';
import { restockInventory, getInventoryByBranch, adjustInventory } from '../services/inventory.js';
import { createOutletOrder, getOrdersByBranch } from '../services/unifiedOrders.js';
import {
  createCustomer,
  getCustomersByBranch,
  getAllCustomers,
  deleteCustomer,
} from '../services/customer.js';

const router = Router();

interface ReconcileBody {
  kas_fisik: number;
  catatan?: string;
}

interface ReconcileSuccessResponse {
  success: true;
  id_rekonsiliasi: string;
  id_cabang: string;
  nama_cabang: string;
  kas_digital: number;
  kas_fisik: number;
  selisih: number;
  status: string;
  approval_status: string;
  message: string;
}

interface ReconcileErrorResponse {
  success: false;
  error: string;
}

type ReconcileResponse = ReconcileSuccessResponse | ReconcileErrorResponse;

router.post(
  '/:id_cabang/reconcile',
  async (req: Request<{ id_cabang: string }, ReconcileResponse, ReconcileBody>, res: Response<ReconcileResponse>) => {
    try {
      const { id_cabang } = req.params;
      const { kas_fisik, catatan } = req.body;

      if (typeof kas_fisik !== 'number' || kas_fisik < 0) {
        res.status(400).json({
          success: false,
          error: 'kas_fisik harus berupa angka non-negatif.',
        });
        return;
      }

      const branch = await getBranchById(id_cabang);
      if (!branch) {
        res.status(404).json({
          success: false,
          error: `Cabang dengan ID "${id_cabang}" tidak ditemukan.`,
        });
        return;
      }

      const totalExpenses = await getTotalApprovedExpenses(id_cabang);
      const kas_digital = branch.omzet - totalExpenses;

      const log = await createReconciliation({
        id_cabang,
        kas_digital,
        kas_fisik,
        catatan,
      });

      const formatIDR = (n: number) =>
        new Intl.NumberFormat('id-ID', {
          style: 'currency',
          currency: 'IDR',
          minimumFractionDigits: 0,
        }).format(n);

      let statusMessage: string;
      if (log.status === 'Cocok') {
        statusMessage = `AUDIT BERHASIL: Saldo kas fisik COCOK (Selisih Rp0) dengan pencatatan digital untuk ${branch.nama_cabang}. Status: Reconciled & Buku Terkunci.`;
      } else {
        const discrepancyText =
          log.selisih > 0
            ? `Surplus Kelebihan Kas Fisik sebesar Rp${Math.abs(log.selisih).toLocaleString('id-ID')}`
            : `Defisit Kekurangan Kas Fisik sebesar Rp${Math.abs(log.selisih).toLocaleString('id-ID')}`;
        statusMessage = `LOG SELISIH DITERBITKAN: Ditemukan selisih (${discrepancyText}) dibanding sisa omzet buku digital (${formatIDR(kas_digital)}). Laporan dikirim ke sistem audit pusat.`;
      }

    res.status(201).json({
      success: true,
      id_rekonsiliasi: log.id_rekonsiliasi,
      id_cabang: log.id_cabang,
      nama_cabang: branch.nama_cabang,
      kas_digital: log.kas_digital,
      kas_fisik: log.kas_fisik,
      selisih: log.selisih,
      status: log.status,
      approval_status: log.approval_status,
      message: statusMessage,
    });
    } catch (error) {
      console.error('[Branches] POST /:id_cabang/reconcile error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
      });
    }
  }
);

interface HistoryResponse {
  success: true;
  id_cabang: string;
  total_logs: number;
  logs: Array<{
    id_rekonsiliasi: string;
    tanggal: string;
    kas_digital: number;
    kas_fisik: number;
    selisih: number;
    status: string;
    approval_status: string;
    catatan?: string;
    catatan_owner?: string;
  }>;
}

router.get(
  '/:id_cabang/reconcile/history',
  async (req: Request<{ id_cabang: string }>, res: Response<HistoryResponse | ReconcileErrorResponse>) => {
    try {
      const { id_cabang } = req.params;

      const branch = await getBranchById(id_cabang);
      if (!branch) {
        res.status(404).json({
          success: false,
          error: `Cabang dengan ID "${id_cabang}" tidak ditemukan.`,
        });
        return;
      }

      const logs = await getReconciliationByBranch(id_cabang);

      res.status(200).json({
        success: true,
        id_cabang,
        total_logs: logs.length,
        logs: logs.map((log) => ({
          id_rekonsiliasi: log.id_rekonsiliasi,
          tanggal: log.tanggal.toISOString(),
          kas_digital: log.kas_digital,
          kas_fisik: log.kas_fisik,
          selisih: log.selisih,
          status: log.status,
          approval_status: log.approval_status,
          catatan: log.catatan,
          catatan_owner: log.catatan_owner,
        })),
      });
    } catch (error) {
      console.error('[Branches] GET /:id_cabang/reconcile/history error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
      });
    }
  }
);

interface AllHistoryResponse {
  success: boolean;
  total_logs?: number;
  logs?: Array<{
    id_rekonsiliasi: string;
    id_cabang: string;
    nama_cabang: string;
    tanggal: string;
    kas_digital: number;
    kas_fisik: number;
    selisih: number;
    status: string;
    approval_status: string;
    catatan?: string;
    catatan_owner?: string;
  }>;
  error?: string;
}

router.get(
  '/reconcile/all',
  async (_req: Request, res: Response<AllHistoryResponse>) => {
    try {
      const logs = await getAllReconciliations();
      const branches = await getAllBranches();
      const branchMap = new Map(branches.map(b => [b.id_cabang, b]));

      res.status(200).json({
        success: true,
        total_logs: logs.length,
        logs: logs.map((log) => {
          const branch = branchMap.get(log.id_cabang);
          return {
            id_rekonsiliasi: log.id_rekonsiliasi,
            id_cabang: log.id_cabang,
            nama_cabang: branch?.nama_cabang ?? log.id_cabang,
            tanggal: log.tanggal.toISOString(),
            kas_digital: log.kas_digital,
            kas_fisik: log.kas_fisik,
            selisih: log.selisih,
            status: log.status,
            approval_status: log.approval_status,
            catatan: log.catatan,
            catatan_owner: log.catatan_owner,
          };
        }),
      });
    } catch (error) {
      console.error('[Branches] GET /reconcile/all error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
      });
    }
  }
);

interface ApproveBody {
  catatan_owner?: string;
}

interface ApproveSuccessResponse {
  success: true;
  id_rekonsiliasi: string;
  approval_status: string;
  message: string;
}

router.patch(
  '/reconcile/:id/approve',
  async (req: Request<{ id: string }, ApproveSuccessResponse | ReconcileErrorResponse, ApproveBody>, res: Response<ApproveSuccessResponse | ReconcileErrorResponse>) => {
    try {
      const { id } = req.params;
      const { catatan_owner } = req.body;

      const log = await approveReconciliation(id, catatan_owner);
      if (!log) {
        res.status(400).json({
          success: false,
          error: 'Rekonsiliasi tidak ditemukan atau sudah diproses.',
        });
        return;
      }

      res.status(200).json({
        success: true,
        id_rekonsiliasi: log.id_rekonsiliasi,
        approval_status: log.approval_status,
        message: 'Rekonsiliasi telah disetujui.',
      });
    } catch (error) {
      console.error('[Branches] PATCH /reconcile/:id/approve error:', error);
      res.status(500).json({ success: false, error: 'Internal server error' });
    }
  }
);

router.patch(
  '/reconcile/:id/reject',
  async (req: Request<{ id: string }, ApproveSuccessResponse | ReconcileErrorResponse, ApproveBody>, res: Response<ApproveSuccessResponse | ReconcileErrorResponse>) => {
    try {
      const { id } = req.params;
      const { catatan_owner } = req.body;

      const log = await rejectReconciliation(id, catatan_owner);
      if (!log) {
        res.status(400).json({
          success: false,
          error: 'Rekonsiliasi tidak ditemukan atau sudah diproses.',
        });
        return;
      }

      res.status(200).json({
        success: true,
        id_rekonsiliasi: log.id_rekonsiliasi,
        approval_status: log.approval_status,
        message: 'Rekonsiliasi telah ditolak.',
      });
    } catch (error) {
      console.error('[Branches] PATCH /reconcile/:id/reject error:', error);
      res.status(500).json({ success: false, error: 'Internal server error' });
    }
  }
);

interface OverrideBody {
  kas_fisik: number;
  catatan_owner?: string;
}

interface OverrideSuccessResponse {
  success: true;
  id_rekonsiliasi: string;
  kas_digital: number;
  kas_fisik: number;
  selisih: number;
  status: string;
  approval_status: string;
  message: string;
}

router.patch(
  '/reconcile/:id/override',
  async (req: Request<{ id: string }, OverrideSuccessResponse | ReconcileErrorResponse, OverrideBody>, res: Response<OverrideSuccessResponse | ReconcileErrorResponse>) => {
    try {
      const { id } = req.params;
      const { kas_fisik, catatan_owner } = req.body;

      if (typeof kas_fisik !== 'number' || kas_fisik < 0) {
        res.status(400).json({
          success: false,
          error: 'kas_fisik harus berupa angka non-negatif.',
        });
        return;
      }

      const log = await overrideReconciliation(id, kas_fisik, catatan_owner);
      if (!log) {
        res.status(404).json({
          success: false,
          error: 'Rekonsiliasi tidak ditemukan.',
        });
        return;
      }

      res.status(200).json({
        success: true,
        id_rekonsiliasi: log.id_rekonsiliasi,
        kas_digital: log.kas_digital,
        kas_fisik: log.kas_fisik,
        selisih: log.selisih,
        status: log.status,
        approval_status: log.approval_status,
        message: 'Data rekonsiliasi telah di-override oleh Owner.',
      });
    } catch (error) {
      console.error('[Branches] PATCH /reconcile/:id/override error:', error);
      res.status(500).json({ success: false, error: 'Internal server error' });
    }
  }
);

interface RestockBody {
  detergen?: number;
  pelembut?: number;
  plastik?: number;
}

interface RestockSuccessResponse {
  success: true;
  id_cabang: string;
  nama_cabang: string;
  stocks: Array<{
    item: string;
    stok_saat_ini: number;
    safety_threshold: number;
    max_capacity: number;
    status: string;
  }>;
  message: string;
}

type RestockResponse = RestockSuccessResponse | ReconcileErrorResponse;

router.post(
  '/:id_cabang/restock',
  async (req: Request<{ id_cabang: string }, RestockResponse, RestockBody>, res: Response<RestockResponse>) => {
    try {
      const { id_cabang } = req.params;
      const { detergen, pelembut, plastik } = req.body;

      const branch = await getBranchById(id_cabang);
      if (!branch) {
        res.status(404).json({
          success: false,
          error: `Cabang dengan ID "${id_cabang}" tidak ditemukan.`,
        });
        return;
      }

      const updated = await restockInventory(id_cabang, {
        detergen: detergen ? parseInt(String(detergen), 10) || 0 : 0,
        pelembut: pelembut ? parseInt(String(pelembut), 10) || 0 : 0,
        plastik: plastik ? parseInt(String(plastik), 10) || 0 : 0,
      });

      if (!updated) {
        res.status(404).json({
          success: false,
          error: 'Data inventaris cabang tidak ditemukan.',
        });
        return;
      }

      res.status(200).json({
        success: true,
        id_cabang,
        nama_cabang: branch.nama_cabang,
        stocks: updated.stocks.map((s) => ({
          item: s.item,
          stok_saat_ini: s.stok_saat_ini,
          safety_threshold: s.safety_threshold,
          max_capacity: s.max_capacity,
          status: s.status,
        })),
        message: `Stok gudang cabang ${branch.nama_cabang} berhasil diisi ulang!`,
      });
    } catch (error) {
      console.error('[Branches] POST /:id_cabang/restock error:', error);
      res.status(500).json({ success: false, error: 'Internal server error' });
    }
  }
);

interface InventoryResponse {
  success: true;
  id_cabang: string;
  stocks: Array<{
    item: string;
    satuan: string;
    stok_saat_ini: number;
    safety_threshold: number;
    max_capacity: number;
    status: string;
  }>;
}

router.get(
  '/:id_cabang/inventory',
  async (req: Request<{ id_cabang: string }>, res: Response<InventoryResponse | ReconcileErrorResponse>) => {
    try {
      const { id_cabang } = req.params;

      const inv = await getInventoryByBranch(id_cabang);
      if (!inv) {
        res.status(404).json({
          success: false,
          error: `Inventaris cabang "${id_cabang}" tidak ditemukan.`,
        });
        return;
      }

      res.status(200).json({
        success: true,
        id_cabang,
        stocks: inv.stocks.map((s) => ({
          item: s.item,
          satuan: s.satuan,
          stok_saat_ini: s.stok_saat_ini,
          safety_threshold: s.safety_threshold,
          max_capacity: s.max_capacity,
          status: s.status,
        })),
      });
    } catch (error) {
      console.error('[Branches] GET /:id_cabang/inventory error:', error);
      res.status(500).json({ success: false, error: 'Internal server error' });
    }
  }
);

interface AdjustBody {
  item: 'Detergen' | 'Pelembut' | 'Plastik';
  stok_baru: number;
  alasan: string;
}

router.post(
  '/:id_cabang/adjust',
  async (req: Request<{ id_cabang: string }, any, AdjustBody>, res: Response) => {
    try {
      const { id_cabang } = req.params;
      const { item, stok_baru, alasan } = req.body;

      if (!item || typeof stok_baru !== 'number' || stok_baru < 0 || !alasan) {
        res.status(400).json({
          success: false,
          error: 'Data tidak lengkap atau tidak valid.',
        });
        return;
      }

      const updated = await adjustInventory(id_cabang, {
        item,
        stok_baru,
        alasan,
      });

      if (!updated) {
        res.status(404).json({
          success: false,
          error: 'Data inventaris cabang tidak ditemukan.',
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Penyesuaian stok berhasil disimpan dan dicatat sebagai anomali.',
      });
    } catch (error) {
      console.error('[Branches] POST /:id_cabang/adjust error:', error);
      res.status(500).json({ success: false, error: 'Internal server error' });
    }
  }
);

// ==========================================
// FR-012: Daily Financial Summary for Admin Audit
// Returns today's income, expenses, and remaining cash
// ==========================================
type DailySummaryResponse = | { success: true; id_cabang: string; total_pemasukan: number; total_pengeluaran: number; sisa_kas: number; transaction_count: number }
  | { success: false; error: string };

router.get(
  '/:id_cabang/daily-summary',
  async (req: Request<{ id_cabang: string }, DailySummaryResponse>, res: Response<DailySummaryResponse>) => {
    try {
      const { id_cabang } = req.params;

      const branch = await getBranchById(id_cabang);
      if (!branch) {
        res.status(404).json({ success: false, error: `Cabang dengan ID "${id_cabang}" tidak ditemukan.` });
        return;
      }

      // Calculate from approved expenses
      const total_pengeluaran = await getTotalApprovedExpenses(id_cabang);
      const total_pemasukan = branch.omzet * 0.7; // Mock: 70% of omzet as today's income
      const sisa_kas = total_pemasukan - total_pengeluaran;

      res.status(200).json({
        success: true,
        id_cabang,
        total_pemasukan,
        total_pengeluaran,
        sisa_kas,
        transaction_count: Math.floor(Math.random() * 20) + 5, // Mock transaction count
      });
    } catch (error) {
      console.error('[Branches] GET /:id_cabang/daily-summary error:', error);
      res.status(500).json({ success: false, error: 'Internal server error' });
    }
  }
);

interface CustomerBody {
  nama: string;
  whatsapp: string;
  alamat_maps: string;
}

router.post(
  '/:id_cabang/customer',
  async (req: Request<{ id_cabang: string }, any, CustomerBody>, res: Response) => {
    try {
      const { id_cabang } = req.params;
      const { nama, whatsapp, alamat_maps } = req.body;

      if (!nama || !whatsapp || !alamat_maps) {
        res.status(400).json({
          success: false,
          error: 'Semua data wajib diisi.',
        });
        return;
      }

      if (
        !alamat_maps.includes('google.com/maps') &&
        !alamat_maps.includes('maps.google.com') &&
        !alamat_maps.includes('maps.app.goo.gl')
      ) {
        res.status(400).json({
          success: false,
          error: 'Wajib memasukkan Link Google Maps',
        });
        return;
      }

      const customer = await createCustomer({
        id_cabang,
        nama,
        whatsapp,
        alamat_maps,
      });

      res.status(201).json({
        success: true,
        message: `Data pelanggan ${nama} berhasil disimpan di cabang ${id_cabang}.`,
        customer,
      });
    } catch (error) {
      console.error('[Branches] POST /:id_cabang/customer error:', error);
      res.status(500).json({
        success: false,
        error: 'Gagal menyimpan data pelanggan.',
      });
    }
  }
);

// ==========================================
// CUSTOMER ROUTES - CRUD Operations
// ==========================================

// Get all customers for a branch
router.get(
  '/:id_cabang/customers',
  async (req: Request<{ id_cabang: string }>, res: Response) => {
    try {
      const { id_cabang } = req.params;

      const branch = await getBranchById(id_cabang);
      if (!branch) {
        res.status(404).json({
          success: false,
          error: `Cabang dengan ID "${id_cabang}" tidak ditemukan.`,
        });
        return;
      }

      const customers = await getCustomersByBranch(id_cabang);
      res.status(200).json({
        success: true,
        id_cabang,
        total_customers: customers.length,
        customers,
      });
    } catch (error) {
      console.error('[Branches] GET /:id_cabang/customers error:', error);
      res.status(500).json({ success: false, error: 'Internal server error' });
    }
  }
);

// Get all customers (for Owner/Admin with access to all branches)
router.get(
  '/customers/all',
  async (_req: Request, res: Response) => {
    try {
      const customers = await getAllCustomers();
      res.status(200).json({
        success: true,
        total_customers: customers.length,
        customers,
      });
    } catch (error) {
      console.error('[CUSTOMER] Error fetching all customers:', error);
      res.status(500).json({
        success: false,
        error: 'Gagal mengambil data pelanggan.',
      });
    }
  },
);

// Delete a customer
router.delete(
  '/:id_cabang/customer/:id_pelanggan',
  async (req: Request<{ id_cabang: string; id_pelanggan: string }>, res: Response) => {
    const { id_cabang, id_pelanggan } = req.params;

    try {
      const deleted = await deleteCustomer(id_pelanggan);
      if (!deleted) {
        res.status(404).json({
          success: false,
          error: 'Pelanggan tidak ditemukan.',
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: `Pelanggan berhasil dihapus.`,
      });
    } catch (error) {
      console.error('[CUSTOMER] Error deleting customer:', error);
      res.status(500).json({
        success: false,
        error: 'Gagal menghapus pelanggan.',
      });
    }
  },
);

// ==========================================
// OUTLET ORDER ROUTES - FR-SERVICE-01
// Create and manage outlet orders
// ==========================================

interface CreateOutletOrderBody {
  id_pelanggan: string;
  customer_name: string;
  customer_whatsapp: string;
  id_layanan: string;
  service_name: string;
  qty: number;
  berat_kg?: number;
  total_harga: number;
  satuan?: string;
  status?: string;
}

router.post(
  '/:id_cabang/orders',
  async (req: Request<{ id_cabang: string }, any, CreateOutletOrderBody>, res: Response) => {
    const { id_cabang } = req.params;
    const { id_pelanggan, customer_name, customer_whatsapp, id_layanan, service_name, qty, berat_kg, total_harga, satuan, status } = req.body;

    // Validate required fields
    if (!customer_name || !id_layanan || typeof qty !== 'number' || qty <= 0 || typeof total_harga !== 'number') {
      res.status(400).json({
        success: false,
        error: 'Data tidak lengkap. Pastikan customer_name, id_layanan, qty, dan total_harga diisi dengan benar.',
      });
      return;
    }

    const branch = getBranchById(id_cabang);
    if (!branch) {
      res.status(404).json({
        success: false,
        error: `Cabang dengan ID "${id_cabang}" tidak ditemukan.`,
      });
      return;
    }

    try {
      const order = await createOutletOrder({
        id_cabang,
        id_pelanggan: id_pelanggan || `PLG-${Date.now()}`,
        customer_name,
        customer_whatsapp: customer_whatsapp || '',
        id_layanan,
        service_name: service_name || id_layanan,
        qty,
        satuan: satuan || 'pcs',
        berat_kg: berat_kg || qty,
        total_harga,
        status: status || 'Baru',
      });

      console.log(`[OUTLET ORDER] Created: ${order.id_order} at ${id_cabang} - ${customer_name} - ${service_name}`);

      res.status(201).json({
        success: true,
        message: `Order berhasil dicatat! Total: Rp${total_harga.toLocaleString('id-ID')}`,
        order: {
          id_order: order.id_order,
          id_cabang: order.id_cabang,
          customer_name: order.customer_name,
          service_name: order.service_name,
          qty: order.qty,
          satuan: order.satuan,
          total_harga: order.total_harga,
          status: order.status,
        },
      });
    } catch (error) {
      console.error('[OUTLET ORDER] Error creating order:', error);
      res.status(500).json({
        success: false,
        error: 'Gagal menyimpan order. Silakan coba lagi.',
      });
    }
  },
);

// Get all orders for a branch (outlet orders)
router.get(
  '/:id_cabang/orders',
  async (req: Request<{ id_cabang: string }>, res: Response) => {
    const { id_cabang } = req.params;

    const branch = getBranchById(id_cabang);
    if (!branch) {
      res.status(404).json({
        success: false,
        error: `Cabang dengan ID "${id_cabang}" tidak ditemukan.`,
      });
      return;
    }

    try {
      const orders = await getOrdersByBranch(id_cabang);

      res.status(200).json({
        success: true,
        id_cabang,
        total_orders: orders.length,
        orders,
      });
    } catch (error) {
      console.error('[BRANCH ORDERS] Error fetching orders:', error);
      res.status(500).json({
        success: false,
        error: 'Gagal mengambil data order.',
      });
    }
  },
);

export default router;
