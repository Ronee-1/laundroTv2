"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const branches_js_1 = require("../config/branches.js");
const logistics_js_1 = require("../services/logistics.js");
const inventory_js_1 = require("../services/inventory.js");
// ==========================================
// LOGISTICS ROUTES - FR-LOG-02 Core Implementation
// Admin Cabang men-generate rute harian (batching) yang hanya mengeksekusi
// daftar pesanan teralokasi di cabangnya sendiri
// Mendukung: FR-LOG-01 (georouting), FR-INV-01 (inventory monitoring)
// ==========================================
const router = (0, express_1.Router)();
router.post('/ship', async (req, res) => {
    try {
        const { branchId, sentItems } = req.body;
        if (!branchId || !sentItems) {
            res.status(400).json({ success: false, error: 'branchId dan sentItems wajib diisi.' });
            return;
        }
        const branch = await (0, branches_js_1.getBranchById)(branchId);
        if (!branch) {
            res.status(404).json({ success: false, error: `Cabang "${branchId}" tidak ditemukan.` });
            return;
        }
        const existing = await (0, logistics_js_1.getInTransitByBranch)(branchId);
        if (existing.length > 0) {
            res.status(409).json({ success: false, error: 'Sudah ada pengiriman In-Transit untuk cabang ini.' });
            return;
        }
        const log = await (0, logistics_js_1.createShipment)(branchId, sentItems);
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
    }
    catch (error) {
        console.error('[Logistics] POST /ship error:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});
router.post('/:id/verify', async (req, res) => {
    try {
        const { id } = req.params;
        const { receivedItems } = req.body;
        if (!receivedItems) {
            res.status(400).json({ success: false, error: 'receivedItems wajib diisi.' });
            return;
        }
        const log = await (0, logistics_js_1.getLogisticsById)(id);
        if (!log) {
            res.status(404).json({ success: false, error: `Logistik "${id}" tidak ditemukan.` });
            return;
        }
        const updated = await (0, logistics_js_1.verifyShipment)(id, receivedItems);
        if (!updated) {
            res.status(400).json({ success: false, error: 'Pengiriman tidak dalam status In-Transit atau sudah diverifikasi.' });
            return;
        }
        await (0, inventory_js_1.restockInventory)(updated.branchId, {
            detergen: updated.receivedItems.detergen,
            pelembut: updated.receivedItems.pelembut,
            plastik: updated.receivedItems.plastik,
        });
        const branch = await (0, branches_js_1.getBranchById)(updated.branchId);
        const branchName = branch?.nama_cabang ?? updated.branchId;
        let message;
        if (updated.status === 'Completed') {
            message = `Verifikasi berhasil! Stok ${branchName} telah ditambah sesuai jumlah pengiriman.`;
        }
        else {
            message = `Verifikasi selesai dengan selisih. Stok ${branchName} ditambahkan sebesar jumlah fisik yang diterima.`;
        }
        res.status(200).json({
            success: true,
            logistics: {
                id: updated.id,
                branchId: updated.branchId,
                sentItems: updated.sentItems,
                receivedItems: updated.receivedItems,
                discrepancy: updated.discrepancy,
                status: updated.status,
                timestamp: updated.timestamp.toISOString(),
            },
            stock_updated: true,
            message,
        });
    }
    catch (error) {
        console.error('[Logistics] POST /:id/verify error:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});
router.get('/branch/:id_cabang', async (req, res) => {
    try {
        const { id_cabang } = req.params;
        const logs = await (0, logistics_js_1.getLogisticsByBranch)(id_cabang);
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
    }
    catch (error) {
        console.error('[Logistics] GET /branch/:id_cabang error:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});
router.get('/all', async (_req, res) => {
    try {
        const logs = await (0, logistics_js_1.getAllLogistics)();
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
    }
    catch (error) {
        console.error('[Logistics] GET /all error:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});
router.get('/replenishment', async (_req, res) => {
    try {
        const branches = await (0, branches_js_1.getAllBranches)();
        const recommendations = [];
        for (const b of branches) {
            const rec = await (0, logistics_js_1.getReplenishmentRecommendation)(b.id_cabang);
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
    }
    catch (error) {
        console.error('[Logistics] GET /replenishment error:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});
// Additional logistics routes
router.get('/active', async (_req, res) => {
    try {
        const logs = await (0, logistics_js_1.getActiveShipments)();
        res.json({ success: true, logs });
    }
    catch (error) {
        console.error('[Logistics] GET /active error:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});
router.patch('/:id/start', async (req, res) => {
    try {
        const { id } = req.params;
        const log = await (0, logistics_js_1.startRoute)(id);
        if (!log) {
            res.status(404).json({ success: false, error: 'Pengiriman tidak ditemukan atau tidak dalam status In-Transit.' });
            return;
        }
        res.json({ success: true, log });
    }
    catch (error) {
        console.error('[Logistics] PATCH /:id/start error:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});
router.patch('/:id/handover', async (req, res) => {
    try {
        const { id } = req.params;
        const log = await (0, logistics_js_1.handoverShipment)(id);
        if (!log) {
            res.status(404).json({ success: false, error: 'Pengiriman tidak ditemukan atau tidak dalam status Driver-En-Route.' });
            return;
        }
        res.json({ success: true, log });
    }
    catch (error) {
        console.error('[Logistics] PATCH /:id/handover error:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});
exports.default = router;
//# sourceMappingURL=logistics.js.map