"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const branches_js_1 = require("../config/branches.js");
const logistics_js_1 = require("../services/logistics.js");
const inventory_js_1 = require("../services/inventory.js");
const router = (0, express_1.Router)();
router.post('/ship', (req, res) => {
    const { branchId, sentItems } = req.body;
    if (!branchId || !sentItems) {
        res.status(400).json({ success: false, error: 'branchId dan sentItems wajib diisi.' });
        return;
    }
    const branch = (0, branches_js_1.getBranchById)(branchId);
    if (!branch) {
        res.status(404).json({ success: false, error: `Cabang "${branchId}" tidak ditemukan.` });
        return;
    }
    const existing = (0, logistics_js_1.getInTransitByBranch)(branchId);
    if (existing.length > 0) {
        res.status(409).json({ success: false, error: 'Sudah ada pengiriman In-Transit untuk cabang ini.' });
        return;
    }
    const log = (0, logistics_js_1.createShipment)(branchId, sentItems);
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
});
router.post('/:id/verify', (req, res) => {
    const { id } = req.params;
    const { receivedItems } = req.body;
    if (!receivedItems) {
        res.status(400).json({ success: false, error: 'receivedItems wajib diisi.' });
        return;
    }
    const log = (0, logistics_js_1.getLogisticsById)(id);
    if (!log) {
        res.status(404).json({ success: false, error: `Log logistik "${id}" tidak ditemukan.` });
        return;
    }
    const updated = (0, logistics_js_1.verifyShipment)(id, receivedItems);
    if (!updated) {
        res.status(400).json({ success: false, error: 'Pengiriman tidak dalam status In-Transit atau sudah diverifikasi.' });
        return;
    }
    (0, inventory_js_1.restockInventory)(updated.branchId, {
        detergen: updated.receivedItems.detergen,
        pelembut: updated.receivedItems.pelembut,
        plastik: updated.receivedItems.plastik,
    });
    const branch = (0, branches_js_1.getBranchById)(updated.branchId);
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
});
router.get('/branch/:id_cabang', (req, res) => {
    const { id_cabang } = req.params;
    const logs = (0, logistics_js_1.getLogisticsByBranch)(id_cabang);
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
});
router.get('/all', (_req, res) => {
    const logs = (0, logistics_js_1.getAllLogistics)();
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
});
router.get('/replenishment', (_req, res) => {
    const recommendations = branches_js_1.BRANCHES.map((b) => {
        const rec = (0, logistics_js_1.getReplenishmentRecommendation)(b.id_cabang);
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
});
router.patch('/:id/start-route', (req, res) => {
    const { id } = req.params;
    const log = (0, logistics_js_1.startRoute)(id);
    if (!log) {
        res.status(400).json({ success: false, error: 'Pengiriman tidak ditemukan atau bukan dalam status In-Transit.' });
        return;
    }
    const branch = (0, branches_js_1.getBranchById)(log.branchId);
    res.status(200).json({
        success: true,
        logistics: { id: log.id, branchId: log.branchId, status: log.status, timestamp: log.timestamp.toISOString() },
        message: `Kurir mulai menuju ${branch?.nama_cabang ?? log.branchId}. Status: Driver-En-Route.`,
    });
});
router.patch('/:id/handover', (req, res) => {
    const { id } = req.params;
    const log = (0, logistics_js_1.handoverShipment)(id);
    if (!log) {
        res.status(400).json({ success: false, error: 'Pengiriman tidak ditemukan atau bukan dalam status Driver-En-Route.' });
        return;
    }
    const branch = (0, branches_js_1.getBranchById)(log.branchId);
    res.status(200).json({
        success: true,
        logistics: { id: log.id, branchId: log.branchId, status: log.status, timestamp: log.timestamp.toISOString() },
        message: `Barang telah diserahterimakan ke ${branch?.nama_cabang ?? log.branchId}. Menunggu verifikasi Admin Cabang.`,
    });
});
router.get('/active', (_req, res) => {
    const logs = (0, logistics_js_1.getActiveShipments)();
    res.status(200).json({
        success: true,
        logs: logs.map((l) => {
            const branch = (0, branches_js_1.getBranchById)(l.branchId);
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
});
router.get('/active/:id_cabang', (req, res) => {
    const { id_cabang } = req.params;
    const logs = (0, logistics_js_1.getActiveShipmentsByBranch)(id_cabang);
    res.status(200).json({
        success: true,
        logs: logs.map((l) => {
            const branch = (0, branches_js_1.getBranchById)(l.branchId);
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
});
exports.default = router;
//# sourceMappingURL=logistics.js.map