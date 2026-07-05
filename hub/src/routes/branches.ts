import { Router, type Request, type Response } from 'express';
import { getBranchById } from '../config/branches.js';
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
  (req: Request<{ id_cabang: string }, ReconcileResponse, ReconcileBody>, res: Response<ReconcileResponse>) => {
    const { id_cabang } = req.params;
    const { kas_fisik, catatan } = req.body;

    if (typeof kas_fisik !== 'number' || kas_fisik < 0) {
      res.status(400).json({
        success: false,
        error: 'kas_fisik harus berupa angka non-negatif.',
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

    const totalExpenses = getTotalApprovedExpenses(id_cabang);
    const kas_digital = branch.omzet - totalExpenses;

    const log = createReconciliation({
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
  },
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
  (req: Request<{ id_cabang: string }>, res: Response<HistoryResponse | ReconcileErrorResponse>) => {
    const { id_cabang } = req.params;

    const branch = getBranchById(id_cabang);
    if (!branch) {
      res.status(404).json({
        success: false,
        error: `Cabang dengan ID "${id_cabang}" tidak ditemukan.`,
      });
      return;
    }

    const logs = getReconciliationByBranch(id_cabang);

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
  },
);

interface AllHistoryResponse {
  success: true;
  total_logs: number;
  logs: Array<{
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
}

router.get(
  '/reconcile/all',
  (_req: Request, res: Response<AllHistoryResponse>) => {
    const logs = getAllReconciliations();

    res.status(200).json({
      success: true,
      total_logs: logs.length,
      logs: logs.map((log) => {
        const branch = getBranchById(log.id_cabang);
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
  },
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
  (req: Request<{ id: string }, ApproveSuccessResponse | ReconcileErrorResponse, ApproveBody>, res: Response<ApproveSuccessResponse | ReconcileErrorResponse>) => {
    const { id } = req.params;
    const { catatan_owner } = req.body;

    const log = approveReconciliation(id, catatan_owner);
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
  },
);

router.patch(
  '/reconcile/:id/reject',
  (req: Request<{ id: string }, ApproveSuccessResponse | ReconcileErrorResponse, ApproveBody>, res: Response<ApproveSuccessResponse | ReconcileErrorResponse>) => {
    const { id } = req.params;
    const { catatan_owner } = req.body;

    const log = rejectReconciliation(id, catatan_owner);
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
  },
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
  (req: Request<{ id: string }, OverrideSuccessResponse | ReconcileErrorResponse, OverrideBody>, res: Response<OverrideSuccessResponse | ReconcileErrorResponse>) => {
    const { id } = req.params;
    const { kas_fisik, catatan_owner } = req.body;

    if (typeof kas_fisik !== 'number' || kas_fisik < 0) {
      res.status(400).json({
        success: false,
        error: 'kas_fisik harus berupa angka non-negatif.',
      });
      return;
    }

    const log = overrideReconciliation(id, kas_fisik, catatan_owner);
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
  },
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
  (req: Request<{ id_cabang: string }, RestockResponse, RestockBody>, res: Response<RestockResponse>) => {
    const { id_cabang } = req.params;
    const { detergen, pelembut, plastik } = req.body;

    const branch = getBranchById(id_cabang);
    if (!branch) {
      res.status(404).json({
        success: false,
        error: `Cabang dengan ID "${id_cabang}" tidak ditemukan.`,
      });
      return;
    }

    const updated = restockInventory(id_cabang, {
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
  },
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
  (req: Request<{ id_cabang: string }>, res: Response<InventoryResponse | ReconcileErrorResponse>) => {
    const { id_cabang } = req.params;

    const inv = getInventoryByBranch(id_cabang);
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
  },
);

interface AdjustBody {
  item: 'Detergen' | 'Pelembut' | 'Plastik';
  stok_baru: number;
  alasan: string;
}

router.post(
  '/:id_cabang/adjust',
  (req: Request<{ id_cabang: string }, any, AdjustBody>, res: Response) => {
    const { id_cabang } = req.params;
    const { item, stok_baru, alasan } = req.body;

    if (!item || typeof stok_baru !== 'number' || stok_baru < 0 || !alasan) {
      res.status(400).json({
        success: false,
        error: 'Data tidak lengkap atau tidak valid.',
      });
      return;
    }

    const updated = adjustInventory(id_cabang, {
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
  },
);

interface CustomerBody {
  nama: string;
  whatsapp: string;
  alamat_maps: string;
}

const CUSTOMERS: Array<CustomerBody & { id_pelanggan: string; id_cabang: string }> = [];
let nextCustomerId = 1;

router.post(
  '/:id_cabang/customer',
  (req: Request<{ id_cabang: string }, any, CustomerBody>, res: Response) => {
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

    const newCustomer = {
      id_pelanggan: `PLG-${String(nextCustomerId++).padStart(3, '0')}`,
      id_cabang,
      nama,
      whatsapp,
      alamat_maps,
    };

    CUSTOMERS.push(newCustomer);

    res.status(201).json({
      success: true,
      message: `Data pelanggan ${nama} berhasil disimpan mandiri di cabang ${id_cabang}.`,
      customer: newCustomer,
    });
  },
);

export default router;
