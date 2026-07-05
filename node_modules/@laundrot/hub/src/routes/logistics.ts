import { Router, type Request, type Response } from 'express';
import { getBranchById, BRANCHES } from '../config/branches.js';
import {
  createShipment,
  verifyShipment,
  getLogisticsByBranch,
  getInTransitByBranch,
  getAllLogistics,
  getLogisticsById,
  getReplenishmentRecommendation,
  getActiveShipments,
  getActiveShipmentsByBranch,
  startRoute,
  handoverShipment,
} from '../services/logistics.js';
import { restockInventory } from '../services/inventory.js';
import type { StockCapacity } from '@laundrot/shared-types';

// ==========================================
// LOGISTICS ROUTES - FR-LOG-02 Core Implementation
// Admin Cabang men-generate rute harian (batching) yang hanya mengeksekusi
// daftar pesanan teralokasi di cabangnya sendiri
// Mendukung: FR-LOG-01 (georouting), FR-INV-01 (inventory monitoring)
// ==========================================

const router = Router();

interface ErrorResponse {
  success: false;
  error: string;
}

interface ShipBody {
  branchId: string;
  sentItems: StockCapacity;
}

interface ShipSuccessResponse {
  success: true;
  logistics: {
    id: string;
    branchId: string;
    sentItems: StockCapacity;
    status: string;
    timestamp: string;
  };
  message: string;
}

router.post(
  '/ship',
  (req: Request<Record<string, never>, ShipSuccessResponse | ErrorResponse, ShipBody>, res: Response<ShipSuccessResponse | ErrorResponse>) => {
    const { branchId, sentItems } = req.body;

    if (!branchId || !sentItems) {
      res.status(400).json({ success: false, error: 'branchId dan sentItems wajib diisi.' });
      return;
    }

    const branch = getBranchById(branchId);
    if (!branch) {
      res.status(404).json({ success: false, error: `Cabang "${branchId}" tidak ditemukan.` });
      return;
    }

    const existing = getInTransitByBranch(branchId);
    if (existing.length > 0) {
      res.status(409).json({ success: false, error: 'Sudah ada pengiriman In-Transit untuk cabang ini.' });
      return;
    }

    const log = createShipment(branchId, sentItems);

    res.status(201).json({
      success: true,
      logistics: {
        id: log.id,
        branchId: log.branchId,
        sentItems: log.sentItems,
        status: log.status,
        timestamp: log.timestamp.toISOString(),
      },
      message: `Pengiriman logistik ke ${branch.nama_cabang} berhasil dibuat. Status: In-Transit.`,
    });
  },
);

interface VerifyBody {
  receivedItems: StockCapacity;
}

interface VerifySuccessResponse {
  success: true;
  logistics: {
    id: string;
    branchId: string;
    sentItems: StockCapacity;
    receivedItems: StockCapacity;
    discrepancy: StockCapacity | null;
    status: string;
    timestamp: string;
  };
  stock_updated: boolean;
  message: string;
}

router.post(
  '/:id/verify',
  (req: Request<{ id: string }, VerifySuccessResponse | ErrorResponse, VerifyBody>, res: Response<VerifySuccessResponse | ErrorResponse>) => {
    const { id } = req.params;
    const { receivedItems } = req.body;

    if (!receivedItems) {
      res.status(400).json({ success: false, error: 'receivedItems wajib diisi.' });
      return;
    }

    const log = getLogisticsById(id);
    if (!log) {
      res.status(404).json({ success: false, error: `Log logistik "${id}" tidak ditemukan.` });
      return;
    }

    const updated = verifyShipment(id, receivedItems);
    if (!updated) {
      res.status(400).json({ success: false, error: 'Pengiriman tidak dalam status In-Transit atau sudah diverifikasi.' });
      return;
    }

    restockInventory(updated.branchId, {
      detergen: updated.receivedItems!.detergen,
      pelembut: updated.receivedItems!.pelembut,
      plastik: updated.receivedItems!.plastik,
    });

    const branch = getBranchById(updated.branchId);
    const branchName = branch?.nama_cabang ?? updated.branchId;

    let message: string;
    if (updated.status === 'Completed') {
      message = `Verifikasi berhasil! Stok ${branchName} telah ditambah sesuai jumlah pengiriman.`;
    } else {
      message = `Verifikasi selesai dengan selisih. Stok ${branchName} ditambahkan sebesar jumlah fisik yang diterima.`;
    }

    res.status(200).json({
      success: true,
      logistics: {
        id: updated.id,
        branchId: updated.branchId,
        sentItems: updated.sentItems,
        receivedItems: updated.receivedItems!,
        discrepancy: updated.discrepancy,
        status: updated.status,
        timestamp: updated.timestamp.toISOString(),
      },
      stock_updated: true,
      message,
    });
  },
);

interface BranchLogisticsResponse {
  success: true;
  branchId: string;
  logs: Array<{
    id: string;
    branchId: string;
    sentItems: StockCapacity;
    receivedItems: StockCapacity | null;
    discrepancy: StockCapacity | null;
    status: string;
    timestamp: string;
  }>;
}

router.get(
  '/branch/:id_cabang',
  (req: Request<{ id_cabang: string }>, res: Response<BranchLogisticsResponse | ErrorResponse>) => {
    const { id_cabang } = req.params;
    const logs = getLogisticsByBranch(id_cabang);

    res.status(200).json({
      success: true,
      branchId: id_cabang,
      logs: logs.map((l) => ({
        id: l.id,
        branchId: l.branchId,
        sentItems: l.sentItems,
        receivedItems: l.receivedItems,
        discrepancy: l.discrepancy,
        status: l.status,
        timestamp: l.timestamp.toISOString(),
      })),
    });
  },
);

interface AllLogisticsResponse {
  success: true;
  logs: Array<{
    id: string;
    branchId: string;
    sentItems: StockCapacity;
    receivedItems: StockCapacity | null;
    discrepancy: StockCapacity | null;
    status: string;
    timestamp: string;
  }>;
}

router.get(
  '/all',
  (_req: Request, res: Response<AllLogisticsResponse>) => {
    const logs = getAllLogistics();

    res.status(200).json({
      success: true,
      logs: logs.map((l) => ({
        id: l.id,
        branchId: l.branchId,
        sentItems: l.sentItems,
        receivedItems: l.receivedItems,
        discrepancy: l.discrepancy,
        status: l.status,
        timestamp: l.timestamp.toISOString(),
      })),
    });
  },
);

interface ReplenishmentResponse {
  success: true;
  recommendations: Array<{
    branchId: string;
    nama_cabang: string;
    items: Array<{
      item: string;
      satuan: string;
      stok_saat_ini: number;
      max_capacity: number;
      safety_threshold: number;
      kebutuhan: number;
      is_below_threshold: boolean;
    }>;
    needs_replenishment: boolean;
  }>;
}

router.get(
  '/replenishment',
  (_req: Request, res: Response<ReplenishmentResponse>) => {
    const recommendations = BRANCHES.map((b) => {
      const rec = getReplenishmentRecommendation(b.id_cabang);
      return {
        branchId: rec.branchId,
        nama_cabang: b.nama_cabang,
        items: rec.items,
        needs_replenishment: rec.needs_replenishment,
      };
    });

    res.status(200).json({
      success: true,
      recommendations,
    });
  },
);

interface StatusChangeResponse {
  success: true;
  logistics: {
    id: string;
    branchId: string;
    status: string;
    timestamp: string;
  };
  message: string;
}

router.patch(
  '/:id/start-route',
  (req: Request<{ id: string }>, res: Response<StatusChangeResponse | ErrorResponse>) => {
    const { id } = req.params;
    const log = startRoute(id);
    if (!log) {
      res.status(400).json({ success: false, error: 'Pengiriman tidak ditemukan atau bukan dalam status In-Transit.' });
      return;
    }
    const branch = getBranchById(log.branchId);
    res.status(200).json({
      success: true,
      logistics: { id: log.id, branchId: log.branchId, status: log.status, timestamp: log.timestamp.toISOString() },
      message: `Kurir mulai menuju ${branch?.nama_cabang ?? log.branchId}. Status: Driver-En-Route.`,
    });
  },
);

router.patch(
  '/:id/handover',
  (req: Request<{ id: string }>, res: Response<StatusChangeResponse | ErrorResponse>) => {
    const { id } = req.params;
    const log = handoverShipment(id);
    if (!log) {
      res.status(400).json({ success: false, error: 'Pengiriman tidak ditemukan atau bukan dalam status Driver-En-Route.' });
      return;
    }
    const branch = getBranchById(log.branchId);
    res.status(200).json({
      success: true,
      logistics: { id: log.id, branchId: log.branchId, status: log.status, timestamp: log.timestamp.toISOString() },
      message: `Barang telah diserahterimakan ke ${branch?.nama_cabang ?? log.branchId}. Menunggu verifikasi Admin Cabang.`,
    });
  },
);

interface ActiveShipmentsResponse {
  success: true;
  logs: Array<{
    id: string;
    branchId: string;
    nama_cabang: string;
    sentItems: StockCapacity;
    status: string;
    timestamp: string;
  }>;
}

router.get(
  '/active',
  (_req: Request, res: Response<ActiveShipmentsResponse>) => {
    const logs = getActiveShipments();
    res.status(200).json({
      success: true,
      logs: logs.map((l) => {
        const branch = getBranchById(l.branchId);
        return {
          id: l.id,
          branchId: l.branchId,
          nama_cabang: branch?.nama_cabang ?? l.branchId,
          sentItems: l.sentItems,
          status: l.status,
          timestamp: l.timestamp.toISOString(),
        };
      }),
    });
  },
);

router.get(
  '/active/:id_cabang',
  (req: Request<{ id_cabang: string }>, res: Response<ActiveShipmentsResponse>) => {
    const { id_cabang } = req.params;
    const logs = getActiveShipmentsByBranch(id_cabang);
    res.status(200).json({
      success: true,
      logs: logs.map((l) => {
        const branch = getBranchById(l.branchId);
        return {
          id: l.id,
          branchId: l.branchId,
          nama_cabang: branch?.nama_cabang ?? l.branchId,
          sentItems: l.sentItems,
          status: l.status,
          timestamp: l.timestamp.toISOString(),
        };
      }),
    });
  },
);

export default router;
