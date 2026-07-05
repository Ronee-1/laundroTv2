"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const georouting_js_1 = require("../services/georouting.js");
const quota_js_1 = require("../services/quota.js");
const orders_js_1 = require("../config/orders.js");
const cashbook_js_1 = require("../services/cashbook.js");
const branches_js_1 = require("../config/branches.js");
const router = (0, express_1.Router)();
router.post('/allocate', (req, res) => {
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
    const nearest = (0, georouting_js_1.findNearestBranch)(koordinat);
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
    const quota = (0, quota_js_1.checkQuota)(nearest.branch.id_cabang);
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
        const rescheduleDate = (0, quota_js_1.getNextBusinessDay)();
        const whatsappTemplate = (0, quota_js_1.generateDelayMessage)(nearest.branch, rescheduleDate);
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
router.post('/whatsapp-allocate', (req, res) => {
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
    const nearest = (0, georouting_js_1.findNearestBranch)(koordinat);
    if (!nearest) {
        res.status(400).json({
            success: false,
            error: 'Tidak ada cabang aktif yang tersedia untuk dialokasikan.',
        });
        return;
    }
    // Check quota availability
    const quota = (0, quota_js_1.checkQuota)(nearest.branch.id_cabang);
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
    const order = (0, orders_js_1.createOrderFromWhatsApp)({
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
    const branch = (0, branches_js_1.getBranchById)(nearest.branch.id_cabang);
    // Return success with order details - branch admin will see this in their dashboard
    res.status(201).json({
        success: true,
        id_order: order.id_order,
        id_cabang: nearest.branch.id_cabang,
        nama_cabang: branch?.nama_cabang ?? nearest.branch.nama_cabang,
        distance_km: Math.round(nearest.distance_km * 100) / 100,
        message: `Pesanan dari ${customer_name} berhasil dialokasikan ke ${branch?.nama_cabang ?? nearest.branch.nama_cabang}. Order ID: ${order.id_order}`,
    });
});
router.get('/branch/:id_cabang/incoming', (req, res) => {
    const { id_cabang } = req.params;
    const branch = (0, branches_js_1.getBranchById)(id_cabang);
    if (!branch) {
        res.status(404).json({
            success: false,
            error: `Cabang "${id_cabang}" tidak ditemukan.`,
        });
        return;
    }
    const incomingOrders = (0, orders_js_1.getIncomingOrdersByBranch)(id_cabang);
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
});
// Get all orders for branch (including processed)
router.get('/branch/:id_cabang/all', (req, res) => {
    const { id_cabang } = req.params;
    const branch = (0, branches_js_1.getBranchById)(id_cabang);
    if (!branch) {
        res.status(404).json({ success: false, error: `Cabang "${id_cabang}" tidak ditemukan.` });
        return;
    }
    const orders = (0, orders_js_1.getAllOrdersByBranch)(id_cabang);
    res.status(200).json({
        success: true,
        id_cabang,
        total_orders: orders.length,
        orders,
    });
});
const VALID_STATUSES = [
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
router.patch('/:id_order/status', (req, res) => {
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
    const updatedOrder = (0, orders_js_1.updateOrderStatus)(id_order, status);
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
        const branch = (0, branches_js_1.getBranchById)(updatedOrder.id_cabang);
        const nominal = updatedOrder.total_harga ?? 0;
        const entry = (0, cashbook_js_1.createJournalEntry)({
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
        message: journal
            ? `Status pesanan diubah menjadi "${status}". Jurnal otomatis tercatat di Buku Kas Pusat.`
            : `Status pesanan diubah menjadi "${status}".`,
    });
});
exports.default = router;
//# sourceMappingURL=orders.js.map