"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prisma_js_1 = require("../lib/prisma.js");
const couriers_js_1 = require("../config/couriers.js");
const orders_js_1 = require("../config/orders.js");
// FR-KUR-SYNC: Data Synchronization imports
const courierSync_js_1 = require("../services/courierSync.js");
const router = (0, express_1.Router)();
function buildGoogleMapsUrl(lat, lng) {
    return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
}
// FR-KUR-001: Get courier tasks with proper berat_kg and alamat_penjemputan
router.get('/:id_kurir/tasks', async (req, res) => {
    const { id_kurir } = req.params;
    const requestedCabang = req.query.id_cabang;
    console.log(`[GET /couriers/${id_kurir}/tasks] Requested branch filter: ${requestedCabang}`);
    const courier = await (0, couriers_js_1.getCourierById)(id_kurir);
    if (!courier) {
        res.status(404).json({
            success: false,
            error: `Kurir dengan ID "${id_kurir}" tidak ditemukan.`,
        });
        return;
    }
    console.log(`[GET /couriers/${id_kurir}/tasks] Courier found: ${courier.nama_kurir}, branch: ${courier.id_cabang}`);
    // FR-KUR-001: Branch context validation
    if (requestedCabang && requestedCabang !== courier.id_cabang) {
        res.status(403).json({
            success: false,
            error: `Akses ditolak: Kurir ${id_kurir} hanya dapat mengakses data cabang ${courier.id_cabang}. Percobaan akses lintas cabang terdeteksi.`,
        });
        return;
    }
    // Get orders from BOTH in-memory store AND database
    let allOrders = [];
    // 1. Get from in-memory store
    const { orders: memoryOrders, sequences: memorySequences } = (0, orders_js_1.getAssignedOrdersByCourier)(id_kurir);
    allOrders = [...memoryOrders];
    console.log(`[GET /couriers/${id_kurir}/tasks] In-memory orders: ${memoryOrders.length}`);
    // 2. Get from database
    try {
        // First, let's check what orders exist in DB for this courier
        const allDbOrdersForCourier = await prisma_js_1.prisma.order.findMany({
            where: { id_kurir },
        });
        console.log(`[GET /couriers/${id_kurir}/tasks] Total orders in DB for this courier: ${allDbOrdersForCourier.length}`);
        if (allDbOrdersForCourier.length > 0) {
            console.log(`[GET /couriers/${id_kurir}/tasks] DB orders breakdown:`);
            allDbOrdersForCourier.forEach((o) => {
                console.log(`  - ${o.id_order}: status=${o.status}, id_kurir=${o.id_kurir}`);
            });
        }
        const dbOrders = await (0, orders_js_1.getAssignedOrdersByCourierFromDB)(id_kurir);
        // Merge database orders, avoiding duplicates
        const memoryIds = new Set(memoryOrders.map((o) => o.id_order));
        const newDbOrders = dbOrders.filter((o) => !memoryIds.has(o.id_order));
        allOrders = [...allOrders, ...newDbOrders];
        console.log(`[GET /couriers/${id_kurir}/tasks] Found ${dbOrders.length} active orders from database`);
    }
    catch (error) {
        console.error(`[GET /couriers/${id_kurir}/tasks] Error fetching from database:`, error);
    }
    // Get sequences from in-memory store (if any)
    const sequences = memorySequences;
    console.log(`[GET /couriers/${id_kurir}/tasks] Total orders for courier: ${allOrders.length}`);
    // FR-KUR-001: Map all required fields including berat_kg and alamat_penjemputan
    const tugas = allOrders.map((order) => {
        const sequence = sequences.find((s) => s.id_order === order.id_order);
        // FR-KUR-001: berat_kg - show only if explicitly set and > 0
        const beratKg = order.berat_kg ?? null;
        // FR-KUR-001: Build Google Maps URL safely
        let googleMapsUrl = '#';
        if (order.koordinat_penjemputan?.latitude && order.koordinat_penjemputan?.longitude) {
            googleMapsUrl = buildGoogleMapsUrl(order.koordinat_penjemputan.latitude, order.koordinat_penjemputan.longitude);
        }
        return {
            id_order: order.id_order,
            alamat_penjemputan: order.alamat_penjemputan || 'Alamat tidak tersedia',
            alamat_pengantaran: order.alamat_pengantaran || order.alamat_penjemputan || '',
            koordinat_penjemputan: order.koordinat_penjemputan || { latitude: 0, longitude: 0 },
            koordinat_pengantaran: order.koordinat_pengantaran || { latitude: 0, longitude: 0 },
            status: order.status,
            berat_kg: beratKg,
            google_maps_url: googleMapsUrl,
            urutan: sequence?.urutan,
            // FR-KUR-001: Include customer info for display
            customer_name: order.customer_name,
            customer_whatsapp: order.customer_whatsapp,
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
router.get('/branch/:id_cabang', async (req, res) => {
    const { id_cabang } = req.params;
    try {
        // Get couriers with live workload data (FR-KUR-SYNC)
        const couriersWithWorkload = await (0, courierSync_js_1.getBranchCouriersWithWorkload)(id_cabang);
        // Perform bilateral validation on all couriers
        const validations = await Promise.all(couriersWithWorkload.map(async (c) => (0, courierSync_js_1.performBilateralValidation)(c.id_kurir)));
        res.status(200).json({
            success: true,
            id_cabang,
            couriers: couriersWithWorkload.map((c, i) => ({
                id_kurir: c.id_kurir,
                nama_kurir: c.nama_kurir,
                nomor_telepon: '', // Not exposed for security
                is_available: c.is_available,
                status: c.status, // FR-KUR-SYNC: Available/Busy/Offline
                active_tasks: c.active_tasks, // FR-KUR-SYNC: Live task count from DB
                last_assigned: c.last_assigned,
                current_task: c.current_task, // Current active task with address
                verification: {
                    courier_id: c.id_kurir,
                    courier_status: c.is_available ? 'Online' : 'Offline',
                    assigned_tasks_count: validations[i].assigned_tasks_count,
                    branch_id: c.id_kurir.split('-')[0], // Extract branch prefix
                    discrepancy: validations[i].discrepancy,
                },
            })),
        });
    }
    catch (error) {
        console.error(`[GET /couriers/branch/${id_cabang}] Error:`, error);
        res.status(500).json({
            success: false,
            error: 'Gagal mengambil data kurir.',
        });
    }
});
// ==========================================
// FR-KUR-SYNC: VERIFY COURIER INTEGRITY
// ==========================================
router.get('/:id_kurir/verify', async (req, res) => {
    const { id_kurir } = req.params;
    try {
        const verification = await (0, courierSync_js_1.performBilateralValidation)(id_kurir);
        const workload = await (0, courierSync_js_1.getCourierWorkloadStats)(id_kurir);
        res.status(200).json({
            success: true,
            verification,
            workload,
        });
    }
    catch (error) {
        console.error(`[GET /couriers/${id_kurir}/verify] Error:`, error);
        res.status(500).json({
            success: false,
            error: 'Gagal verifikasi kurir.',
        });
    }
});
// ==========================================
// DEBUG: List all orders for a courier
// ==========================================
router.get('/:id_kurir/debug-orders', async (req, res) => {
    const { id_kurir } = req.params;
    try {
        const courier = await (0, couriers_js_1.getCourierById)(id_kurir);
        if (!courier) {
            res.status(404).json({
                success: false,
                error: `Kurir "${id_kurir}" tidak ditemukan.`,
            });
            return;
        }
        // Get all orders assigned to this courier
        const allOrders = await prisma_js_1.prisma.order.findMany({
            where: { id_kurir },
            orderBy: { assigned_at: 'desc' },
        });
        res.status(200).json({
            success: true,
            courier: {
                id_kurir: courier.id_kurir,
                nama_kurir: courier.nama_kurir,
                id_cabang: courier.id_cabang,
            },
            total_orders: allOrders.length,
            orders: allOrders.map(o => ({
                id_order: o.id_order,
                status: o.status,
                id_cabang: o.id_cabang,
                customer_name: o.customer_name,
                assigned_at: o.assigned_at,
            })),
        });
    }
    catch (error) {
        console.error(`[GET /couriers/${id_kurir}/debug-orders] Error:`, error);
        res.status(500).json({
            success: false,
            error: 'Gagal mengambil data debug.',
        });
    }
});
exports.default = router;
//# sourceMappingURL=couriers.js.map