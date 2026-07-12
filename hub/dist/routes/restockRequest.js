"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const branches_js_1 = require("../config/branches.js");
const inventory_js_1 = require("../services/inventory.js");
const restockRequest_js_1 = require("../services/restockRequest.js");
const router = (0, express_1.Router)();
router.post('/request', async (req, res) => {
    try {
        const { id_cabang } = req.query;
        const { detergen, pelembut, plastik, catatan } = req.body;
        if (!id_cabang) {
            res.status(400).json({
                success: false,
                error: 'id_cabang wajib ada di query parameter',
            });
            return;
        }
        const branch = await (0, branches_js_1.getBranchById)(id_cabang);
        if (!branch) {
            res.status(404).json({
                success: false,
                error: `Cabang "${id_cabang}" tidak ditemukan.`,
            });
            return;
        }
        const requested_items = { detergen, pelembut, plastik };
        const hasItem = Object.values(requested_items).some((v) => v && v > 0);
        if (!hasItem) {
            res.status(400).json({
                success: false,
                error: 'Minimal satu item restok harus diisi nilainya.',
            });
            return;
        }
        const request = await (0, restockRequest_js_1.createRestockRequest)({
            id_cabang,
            nama_cabang: branch.nama_cabang,
            created_by: 'Admin',
            requested_items,
            catatan,
        });
        res.status(201).json({
            success: true,
            request: {
                id_request: request.id_request,
                id_cabang: request.id_cabang,
                requested_items: request.requested_items,
                status: request.status,
                created_at: request.created_at.toISOString(),
            },
            message: `Pengajuan restok ke ${branch.nama_cabang} berhasil. Menunggu persetujuan Owner.`,
        });
    }
    catch (error) {
        console.error('[RestockRequest] POST /request error:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error',
        });
    }
});
// Get pending requests (Owner view)
router.get('/pending', async (_req, res) => {
    try {
        const requests = await (0, restockRequest_js_1.getPendingRequests)();
        res.json({
            success: true,
            total: requests.length,
            requests: requests.map((r) => ({
                id_request: r.id_request,
                id_cabang: r.id_cabang,
                nama_cabang: r.nama_cabang,
                requested_items: r.requested_items,
                created_at: r.created_at.toISOString(),
            })),
        });
    }
    catch (error) {
        console.error('[RestockRequest] GET /pending error:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});
// Get all requests (filtered by branch or all)
router.get('/', async (req, res) => {
    try {
        const { id_cabang, status } = req.query;
        let requests = id_cabang ? await (0, restockRequest_js_1.getRequestsByBranch)(id_cabang) : await (0, restockRequest_js_1.getAllRequests)();
        if (status)
            requests = requests.filter((r) => r.status === status);
        res.json({
            success: true,
            total: requests.length,
            requests: requests.map((r) => ({
                id_request: r.id_request,
                id_cabang: r.id_cabang,
                nama_cabang: r.nama_cabang,
                created_by: r.created_by,
                requested_items: r.requested_items,
                status: r.status,
                catatan: r.catatan,
                reviewed_by: r.reviewed_by,
                created_at: r.created_at.toISOString(),
                reviewed_at: r.reviewed_at?.toISOString(),
            })),
        });
    }
    catch (error) {
        console.error('[RestockRequest] GET / error:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});
// Approve request (Owner only)
router.patch('/:id_request/approve', async (req, res) => {
    try {
        const { id_request } = req.params;
        const { reviewed_by } = req.body;
        const request = await (0, restockRequest_js_1.approveRequest)(id_request, reviewed_by ?? 'Owner');
        if (!request) {
            res.status(404).json({ success: false, error: 'Pengajuan tidak ditemukan atau sudah diproses.' });
            return;
        }
        // Apply restock to inventory
        await (0, inventory_js_1.restockInventory)(request.id_cabang, {
            detergen: request.requested_items.detergen,
            pelembut: request.requested_items.pelembut,
            plastik: request.requested_items.plastik,
        });
        res.json({
            success: true,
            message: `Pengajuan restok ${request.id_request} DISETUJUI. Stok ${request.nama_cabang} bertambah.`,
        });
    }
    catch (error) {
        console.error('[RestockRequest] PATCH /approve error:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});
// Reject request (Owner only)
router.patch('/:id_request/reject', async (req, res) => {
    try {
        const { id_request } = req.params;
        const { reviewed_by, catatan } = req.body;
        const request = await (0, restockRequest_js_1.rejectRequest)(id_request, reviewed_by ?? 'Owner', catatan);
        if (!request) {
            res.status(404).json({ success: false, error: 'Pengajuan tidak ditemukan atau sudah diproses.' });
            return;
        }
        res.json({
            success: true,
            message: `Pengajuan restok ${id_request} DITOLAK.`,
        });
    }
    catch (error) {
        console.error('[RestockRequest] PATCH /reject error:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});
exports.default = router;
//# sourceMappingURL=restockRequest.js.map