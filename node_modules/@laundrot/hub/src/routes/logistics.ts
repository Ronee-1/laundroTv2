import { Router, type Request, type Response } from 'express';
import { getBranchById, getAllBranches } from '../config/branches.js';
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
  async (req: Request<Record<string, never>, ShipSuccessResponse | ErrorResponse, ShipBody>, res: Response<ShipSuccessResponse | ErrorResponse>) => {
    try {
      const { branchId, sentItems } = req.body;

      if (!branchId || !sentItems) {
        res.status(400).json({ success: false, error: 'branchId dan sentItems wajib diisi.' });
        return;
      }

      const branch = await getBranchById(branchId);
      if (!branch) {
        res.status(404).json({ success: false, error: `Cabang "${branchId}" tidak ditemukan.` });
        return;
      }

      const existing = await getInTransitByBranch(branchId);
      if (existing.length > 0) {
        res.status(409).json({ success: false, error: 'Sudah ada pengiriman In-Transit untuk cabang ini.' });
        return;
      }

      const log = await createShipment(branchId, sentItems);

      res.status(201).json({
        success: true,
        logistics: {
          id: log.id,
          branchId: log.branchId,
          sentItems: log.sentItems,
          status: log.status,
          timestamp: log.timestamp.toISOString(),
        },
        message: `Pengirimanlogistik ke ${branch.nama_cabang} berhasil dibuat. Status: In-Transit.`,
      });
    } catch (error) {
      console.error('[Logistics] POST /ship error:', error);
      res.status(500).json({ success: false, error: 'Internal server error' });
    }
  }
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
  async (req: Request<{ id: string }, VerifySuccessResponse | ErrorResponse, VerifyBody>, res: Response<VerifySuccessResponse | ErrorResponse>) => {
    try {
      const { id } = req.params;
      const { receivedItems } = req.body;

      if (!receivedItems) {
        res.status(400).json({ success: false, error: 'receivedItems wajib diisi.' });
        return;
      }

      const log = await getLogisticsById(id);
      if (!log) {
        res.status(404).json({ success: false, error: `Logistik "${id}" tidak ditemukan.` });
        return;
      }

      const updated = await verifyShipment(id, receivedItems);
      if (!updated) {
        res.status(400).json({ success: false, error: 'Pengiriman tidak dalam status In-Transit atau sudah diverifikasi.' });
        return;
      }

      await restockInventory(updated.branchId, {
        detergen: updated.receivedItems!.detergen,
        pelembut: updated.receivedItems!.pelembut,
        plastik: updated.receivedItems!.plastik,
      });

      const branch = await getBranchById(updated.branchId);
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
    } catch (error) {
      console.error('[Logistics] POST /:id/verify error:', error);
      res.status(500).json({ success: false, error: 'Internal server error' });
    }
  }
);

interface BranchLogisticsResponse {
  success: boolean;
  branchId?: string;
  logs?: Array<{
    id: string;
    branchId: string;
    sentItems: StockCapacity;
    receivedItems: StockCapacity | null;
    discrepancy: StockCapacity | null;
    status: string;
    timestamp: string;
  }>;
  error?: string;
}

router.get(
  '/branch/:id_cabang',
  async (req: Request<{ id_cabang: string }>, res: Response<BranchLogisticsResponse>) => {
    try {
      const { id_cabang } = req.params;
      const logs = await getLogisticsByBranch(id_cabang);

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
    } catch (error) {
      console.error('[Logistics] GET /branch/:id_cabang error:', error);
      res.status(500).json({ success: false, error: 'Internal server error' });
    }
  }
);

interface AllLogisticsResponse {
  success: boolean;
  logs?: Array<{
    id: string;
    branchId: string;
    sentItems: StockCapacity;
    receivedItems: StockCapacity | null;
    discrepancy: StockCapacity | null;
    status: string;
    timestamp: string;
  }>;
  error?: string;
}

router.get(
  '/all',
  async (_req: Request, res: Response<AllLogisticsResponse>) => {
    try {
      const logs = await getAllLogistics();

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
    } catch (error) {
      console.error('[Logistics] GET /all error:', error);
      res.status(500).json({ success: false, error: 'Internal server error' });
    }
  }
);

interface ReplenishmentResponse {
  success: boolean;
  recommendations?: Array<{
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
  error?: string;
}

router.get(
  '/replenishment',
  async (_req: Request, res: Response<ReplenishmentResponse>) => {
    try {
      const branches = await getAllBranches();
      const recommendations = [];

      for (const b of branches) {
        const rec = await getReplenishmentRecommendation(b.id_cabang);
        recommendations.push({
          branchId: rec.branchId,
          nama_cabang: b.nama_cabang,
          items: rec.items,
          needs_replenishment: rec.needs_replenishment,
        });
      }

      res.status(200).json({
        success: true,
        recommendations,
      });
    } catch (error) {
      console.error('[Logistics] GET /replenishment error:', error);
      res.status(500).json({ success: false, error: 'Internal server error' });
    }
  }
);

// Additional logistics routes
router.get('/active', async (_req: Request, res: Response) => {
  try {
    const logs = await getActiveShipments();
    res.json({ success: true, logs });
  } catch (error) {
    console.error('[Logistics] GET /active error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

router.patch('/:id/start', async (req: Request<{ id: string }>, res: Response) => {
  try {
    const { id } = req.params;
    const log = await startRoute(id);
    if (!log) {
      res.status(404).json({ success: false, error: 'Pengiriman tidak ditemukan atau tidak dalam status In-Transit.' });
      return;
    }
    res.json({ success: true, log });
  } catch (error) {
    console.error('[Logistics] PATCH /:id/start error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

router.patch('/:id/handover', async (req: Request<{ id: string }>, res: Response) => {
  try {
    const { id } = req.params;
    const log = await handoverShipment(id);
    if (!log) {
      res.status(404).json({ success: false, error: 'Pengiriman tidak ditemukan atau tidak dalam status Driver-En-Route.' });
      return;
    }
    res.json({ success: true, log });
  } catch (error) {
    console.error('[Logistics] PATCH /:id/handover error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

export default router;
