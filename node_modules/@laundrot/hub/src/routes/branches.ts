import { Router, type Request, type Response } from 'express';
import { getBranchById } from '../config/branches.js';
import { createReconciliation, getReconciliationByBranch } from '../services/reconciliation.js';
import { getTotalApprovedExpenses } from '../services/expense.js';
import { restockInventory, getInventoryByBranch } from '../services/inventory.js';

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
    catatan?: string;
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
        catatan: log.catatan,
      })),
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
        status: s.status,
      })),
    });
  },
);

export default router;
