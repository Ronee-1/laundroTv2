"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const services_js_1 = require("../config/services.js");
const router = (0, express_1.Router)();
// GET all active service tariffs
router.get('/tariffs', async (_req, res) => {
    try {
        const services = await (0, services_js_1.getActiveServicesFromDB)();
        res.status(200).json({
            success: true,
            services: services.map((s) => ({
                id_layanan: s.id_layanan,
                nama_layanan: s.nama_layanan,
                kategori: s.kategori,
                satuan: s.satuan,
                harga_per_satuan: s.harga_per_satuan,
                estimasi_hari: s.estimasi_hari,
            })),
        });
    }
    catch (error) {
        console.error('[Services] GET /tariffs error:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});
router.post('/calculate', (req, res) => {
    const { id_layanan, qty } = req.body;
    if (!id_layanan || typeof qty !== 'number' || qty <= 0) {
        res.status(400).json({ success: false, error: 'id_layanan dan qty (positif) wajib diisi.' });
        return;
    }
    const services = (0, services_js_1.getActiveServices)();
    const service = services.find((s) => s.id_layanan === id_layanan);
    if (!service) {
        res.status(404).json({ success: false, error: `Layanan "${id_layanan}" tidak ditemukan.` });
        return;
    }
    const total_harga = (0, services_js_1.calculateTotalHarga)(id_layanan, qty);
    res.status(200).json({
        success: true,
        id_layanan,
        qty,
        harga_per_satuan: service.harga_per_satuan,
        total_harga,
        formatted: `Rp${total_harga.toLocaleString('id-ID')}`,
    });
});
exports.default = router;
//# sourceMappingURL=services.js.map