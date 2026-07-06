"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const couriers_js_1 = require("../config/couriers.js");
const orders_js_1 = require("../config/orders.js");
// ==========================================
// COURIERS ROUTES - FR-LOG-03, FR-005 Implementation
// Courier task management and branch courier listing
// FR-005: Admin can assign orders to couriers and plot task sequence
// ==========================================
const router = (0, express_1.Router)();
function buildGoogleMapsUrl(lat, lng) {
    return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
}
router.get('/:id_kurir/tasks', (req, res) => {
    const { id_kurir } = req.params;
    const requestedCabang = req.query.id_cabang;
    const courier = (0, couriers_js_1.getCourierById)(id_kurir);
    if (!courier) {
        res.status(404).json({
            success: false,
            error: `Kurir dengan ID "${id_kurir}" tidak ditemukan.`,
        });
        return;
    }
    if (requestedCabang && requestedCabang !== courier.id_cabang) {
        res.status(403).json({
            success: false,
            error: `Akses ditolak: Kurir ${id_kurir} hanya dapat mengakses data cabang ${courier.id_cabang}. Percobaan akses lintas cabang terdeteksi.`,
        });
        return;
    }
    // FR-005: Get assigned orders with sequence ordering
    const { orders: assignedOrders, sequences } = (0, orders_js_1.getAssignedOrdersByCourier)(id_kurir);
    const tugas = assignedOrders.map((order) => {
        const sequence = sequences.find((s) => s.id_order === order.id_order);
        return {
            id_order: order.id_order,
            alamat_penjemputan: order.alamat_penjemputan,
            alamat_pengantaran: order.alamat_pengantaran,
            koordinat_penjemputan: order.koordinat_penjemputan,
            koordinat_pengantaran: order.koordinat_pengantaran,
            status: order.status,
            berat_kg: order.berat_kg,
            google_maps_url: buildGoogleMapsUrl(order.koordinat_penjemputan.latitude, order.koordinat_penjemputan.longitude),
            urutan: sequence?.urutan,
        };
    });
    res.status(200).json({
        success: true,
        id_kurir: courier.id_kurir,
        nama_kurir: courier.nama_kurir,
        id_cabang: courier.id_cabang,
        total_tugas: tugas.length,
        urutan_tugas: sequences.length > 0 && sequences.length === tugas.length,
        tugas,
    });
});
router.get('/branch/:id_cabang', (req, res) => {
    const { id_cabang } = req.params;
    const couriers = (0, couriers_js_1.getCouriersByBranch)(id_cabang);
    res.status(200).json({
        success: true,
        id_cabang,
        couriers: couriers.map((c) => ({
            id_kurir: c.id_kurir,
            nama_kurir: c.nama_kurir,
            nomor_telepon: c.nomor_telepon,
            is_available: c.is_available,
        })),
    });
});
exports.default = router;
//# sourceMappingURL=couriers.js.map