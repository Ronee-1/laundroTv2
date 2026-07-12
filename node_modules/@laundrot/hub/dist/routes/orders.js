"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const georouting_js_1 = require("../services/georouting.js");
const quota_js_1 = require("../services/quota.js");
const prisma_js_1 = require("../lib/prisma.js");
const orders_js_1 = require("../config/orders.js");
const unifiedOrders_js_1 = require("../services/unifiedOrders.js");
const cashbook_js_1 = require("../services/cashbook.js");
const branches_js_1 = require("../config/branches.js");
const couriers_js_1 = require("../config/couriers.js");
// FR-KUR-SYNC: Data Synchronization imports
const courierSync_js_1 = require("../services/courierSync.js");
const router = (0, express_1.Router)();
router.post('/allocate', async (req, res) => {
    try {
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
        const nearest = await (0, georouting_js_1.findNearestBranch)(koordinat);
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
        const quota = await (0, quota_js_1.checkQuota)(nearest.branch.id_cabang);
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
    }
    catch (error) {
        console.error('[Orders] POST /allocate error:', error);
        res.status(500).json({
            success: false,
            status: 'Kuota Penuh',
            id_cabang: '',
            nama_cabang: '',
            kuota_harian: 0,
            kuota_terpakai: 0,
            reschedule_date: '',
            whatsapp_template: 'Error: Internal server error.',
        });
    }
});
router.post('/whatsapp-allocate', async (req, res) => {
    try {
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
        const nearest = await (0, georouting_js_1.findNearestBranch)(koordinat);
        if (!nearest) {
            res.status(400).json({
                success: false,
                error: 'Tidak ada cabang aktif yang tersedia untuk dialokasikan.',
            });
            return;
        }
        // Check quota availability
        const quota = await (0, quota_js_1.checkQuota)(nearest.branch.id_cabang);
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
        const order = await (0, orders_js_1.createOrderFromWhatsApp)({
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
        const branch = await (0, branches_js_1.getBranchById)(nearest.branch.id_cabang);
        // Return success with order details - branch admin will see this in their dashboard
        res.status(201).json({
            success: true,
            id_order: order.id_order,
            id_cabang: nearest.branch.id_cabang,
            nama_cabang: branch?.nama_cabang ?? nearest.branch.nama_cabang,
            distance_km: Math.round(nearest.distance_km * 100) / 100,
            message: `Pesanan dari ${customer_name} berhasil dialokasikan ke ${branch?.nama_cabang ?? nearest.branch.nama_cabang}. Order ID: ${order.id_order}`,
        });
    }
    catch (error) {
        console.error('[Orders] POST /whatsapp-allocate error:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error',
        });
    }
});
router.get('/branch/:id_cabang/incoming', async (req, res) => {
    try {
        const { id_cabang } = req.params;
        // Get orders from in-memory store (WhatsApp Hub orders with status 'Pending')
        const incomingOrders = await (0, orders_js_1.getIncomingOrdersByBranch)(id_cabang);
        // Get orders from database (Outlet Reception + WhatsApp orders)
        let dbOrders = [];
        let dbError = null;
        try {
            // Direct Prisma query to ensure we get fresh data
            const prismaOrders = await prisma_js_1.prisma.order.findMany({
                where: { id_cabang },
                orderBy: { tanggal_order: 'desc' },
            });
            // Transform to expected format
            dbOrders = prismaOrders.map((o) => ({
                id_order: o.id_order,
                id_cabang: o.id_cabang,
                customer_name: o.customer_name || 'Unknown',
                customer_whatsapp: o.customer_whatsapp || '',
                service_type: o.service_type || o.service_name || 'Laundry',
                service_name: o.service_name || '',
                wilayah: o.wilayah || '',
                berat_kg: o.berat_kg || 0,
                qty: o.qty || 0,
                alamat_penjemputan: o.alamat_penjemputan || '',
                google_maps_url: o.google_maps_url || '',
                koordinat_penjemputan: {
                    latitude: o.latitude_penjemputan || 0,
                    longitude: o.longitude_penjemputan || 0,
                },
                status: o.status,
                tanggal_order: o.tanggal_order,
                source: o.source || 'whatsapp',
                id_kurir: o.id_kurir || undefined,
            }));
            console.log(`[INCOMING ORDERS] Found ${dbOrders.length} orders from database for branch ${id_cabang}`);
        }
        catch (error) {
            dbError = error.message;
            console.error('[INCOMING ORDERS] Error fetching from database:', error);
        }
        // Statuses that mean the order is COMPLETED and should NEVER show in incoming list
        const COMPLETED_STATUSES = ['Done', 'Dibatalkan', 'Lunas', 'Selesai'];
        // Helper: check if order has NOT been assigned to any courier
        const isUnassigned = (o) => !o.id_kurir || o.id_kurir === '' || o.id_kurir === null;
        // Log untuk debugging
        console.log(`[INCOMING ORDERS] In-memory orders: ${incomingOrders.length}, DB orders: ${dbOrders.length}`);
        if (dbError) {
            console.log(`[INCOMING ORDERS] DB Error: ${dbError} - falling back to in-memory only`);
        }
        // Combine both sources - TAMPILKAN SEMUA PESANAN YANG BELUM SELESAI
        // Termasuk pesanan yang sudah/tidak ditugaskan ke kurir
        const allIncomingOrders = [
            // WhatsApp orders dari memory: only show if status is 'Pending' AND no courier assigned
            ...incomingOrders
                .filter((o) => o.status === 'Pending' && isUnassigned(o))
                .map((o) => ({
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
                tanggal_order: o.tanggal_order instanceof Date ? o.tanggal_order.toISOString() : String(o.tanggal_order),
                source: 'whatsapp',
            })),
            // Database orders: TAMPILKAN JIKA status BUKAN completed
            // HAPUS filter isUnassigned agar pesanan yang sudah/tidak ditugaskan tetap muncul
            ...dbOrders
                .filter((o) => !COMPLETED_STATUSES.includes(o.status))
                .map((o) => ({
                id_order: o.id_order,
                customer_name: o.customer_name ?? 'Unknown',
                customer_whatsapp: o.customer_whatsapp ?? '',
                service_type: o.service_type ?? o.service_name ?? 'Layanan Outlet',
                wilayah: o.wilayah ?? '',
                berat_kg: o.berat_kg ?? o.qty ?? 0,
                alamat_penjemputan: o.alamat_penjemputan ?? '',
                google_maps_url: o.google_maps_url ?? '',
                koordinat_penjemputan: o.koordinat_penjemputan ?? { latitude: 0, longitude: 0 },
                status: o.status,
                tanggal_order: o.tanggal_order instanceof Date ? o.tanggal_order.toISOString() : String(o.tanggal_order),
                source: o.source ?? 'outlet',
            })),
        ];
        console.log(`[INCOMING ORDERS] Total incoming: ${allIncomingOrders.length}`);
        res.status(200).json({
            success: true,
            id_cabang,
            total_orders: allIncomingOrders.length,
            orders: allIncomingOrders,
        });
    }
    catch (error) {
        console.error('[Orders] GET /branch/:id_cabang/incoming error:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error',
        });
    }
});
// Get all orders for branch (including processed)
router.get('/branch/:id_cabang/all', async (req, res) => {
    try {
        const { id_cabang } = req.params;
        const branch = await (0, branches_js_1.getBranchById)(id_cabang);
        if (!branch) {
            res.status(404).json({ success: false, error: `Cabang "${id_cabang}" tidak ditemukan.` });
            return;
        }
        // Get from in-memory store
        const memoryOrders = await (0, orders_js_1.getAllOrdersByBranch)(id_cabang);
        // Get from database
        let dbOrders = [];
        try {
            dbOrders = await (0, unifiedOrders_js_1.getOrdersByBranch)(id_cabang);
        }
        catch (error) {
            console.error('[BRANCH ALL ORDERS] Error fetching from database:', error);
        }
        res.status(200).json({
            success: true,
            id_cabang,
            total_orders: memoryOrders.length + dbOrders.length,
            orders: {
                whatsapp: memoryOrders,
                outlet: dbOrders,
            },
        });
    }
    catch (error) {
        console.error('[Orders] GET /branch/:id_cabang/all error:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});
// ==========================================
// GET ALL ORDERS FOR OWNER (WhatsApp Hub)
// Fetches all orders from all branches
// ==========================================
router.get('/all', async (_req, res) => {
    try {
        // Get from in-memory store
        const memoryOrders = (0, orders_js_1.getAllOrdersByBranch)('');
        // Get from database
        const dbOrders = await (0, unifiedOrders_js_1.getOrdersByBranch)('');
        res.status(200).json({
            success: true,
            total_orders: memoryOrders.length + dbOrders.length,
            orders: {
                whatsapp: memoryOrders,
                outlet: dbOrders,
            },
        });
    }
    catch (error) {
        console.error('[ALL ORDERS] Error fetching orders:', error);
        res.status(500).json({
            success: false,
            error: 'Gagal mengambil data order.',
        });
    }
});
router.patch('/:id_order/assign', async (req, res) => {
    const { id_order } = req.params;
    const { id_kurir, assigned_by } = req.body;
    if (!id_kurir) {
        res.status(400).json({
            success: false,
            error: 'id_kurir wajib diisi.',
        });
        return;
    }
    // ============================================================
    // FIND ORDER - Check both in-memory and database
    // ============================================================
    let order = null;
    let orderSource = 'memory';
    const id_cabang = '';
    // First, check in-memory orders
    order = (0, orders_js_1.getAllOrdersByBranch)('').find((o) => o.id_order === id_order);
    // If not found in memory, check database
    if (!order) {
        try {
            const dbOrder = await prisma_js_1.prisma.order.findUnique({
                where: { id_order },
            });
            if (dbOrder) {
                order = dbOrder;
                orderSource = 'database';
            }
        }
        catch (error) {
            console.error('[PATCH /orders/:id_order/assign] Error checking database:', error);
        }
    }
    if (!order) {
        res.status(404).json({
            success: false,
            error: `Pesanan dengan ID "${id_order}" tidak ditemukan.`,
        });
        return;
    }
    // CASE A: Courier Mismatch / Inactive State Check
    console.log(`[PATCH /orders/${id_order}/assign] Running integrity check for courier ${id_kurir}...`);
    const guardResult = await (0, courierSync_js_1.assignmentGuardrail)(id_kurir, order.id_cabang);
    if (!guardResult.approved) {
        console.log(`[PATCH /orders/${id_order}/assign] REJECTED: ${guardResult.errorMessage}`);
        res.status(400).json({
            success: false,
            error: guardResult.errorCode,
            message: guardResult.errorMessage,
            id_kurir,
            id_cabang: order.id_cabang,
            verification: {
                courier_id: id_kurir,
                courier_status: 'Invalid',
                assigned_tasks_count: 0,
                branch_id: order.id_cabang,
            },
        });
        return;
    }
    // Get courier info
    const courier = await (0, couriers_js_1.getCourierById)(id_kurir);
    if (!courier) {
        res.status(404).json({
            success: false,
            error: `Kurir dengan ID "${id_kurir}" tidak ditemukan.`,
        });
        return;
    }
    console.log(`[PATCH /orders/${id_order}/assign] APPROVED: Courier ${id_kurir} validated. Current workload: ${guardResult.validation?.workloadCount}`);
    // ============================================================
    // ASSIGNMENT PROCEEDS - Update in correct source
    // ============================================================
    let updatedOrder = null;
    if (orderSource === 'memory') {
        // Update in-memory order
        updatedOrder = await (0, orders_js_1.assignOrderToCourier)(id_order, id_kurir, assigned_by);
    }
    else {
        // Update database order
        updatedOrder = await prisma_js_1.prisma.order.update({
            where: { id_order },
            data: {
                id_kurir,
                assigned_by,
                assigned_at: new Date(),
                status: 'Diproses',
            },
        });
    }
    if (!updatedOrder) {
        res.status(404).json({
            success: false,
            error: `Gagal assigning order: Pesanan tidak ditemukan.`,
        });
        return;
    }
    // Get updated workload stats
    const workloadStats = await (0, courierSync_js_1.getCourierWorkloadStats)(id_kurir);
    console.log(`[PATCH /orders/${id_order}/assign] SUCCESS: Order assigned to ${courier.nama_kurir}. New workload: ${workloadStats?.totalActiveTasks}`);
    res.status(200).json({
        success: true,
        id_order: updatedOrder.id_order,
        id_kurir: updatedOrder.id_kurir ?? id_kurir,
        nama_kurir: courier.nama_kurir,
        id_cabang: courier.id_cabang,
        message: `Pesanan ${id_order} berhasil dialokasikan ke kurir ${courier.nama_kurir} (${id_kurir})`,
        workload: {
            active_tasks: workloadStats?.totalActiveTasks ?? 0,
            status: workloadStats?.status ?? 'Available',
        },
        verification: {
            courier_id: id_kurir,
            courier_status: courier.is_available ? 'Online' : 'Offline',
            assigned_tasks_count: workloadStats?.totalActiveTasks ?? 0,
            branch_id: courier.id_cabang,
        },
    });
});
router.put('/reorder-tasks', async (req, res) => {
    const { id_kurir, ordered_task_ids } = req.body;
    if (!id_kurir || !ordered_task_ids || !Array.isArray(ordered_task_ids)) {
        res.status(400).json({
            success: false,
            error: 'id_kurir dan ordered_task_ids (array) wajib diisi.',
        });
        return;
    }
    const courier = await (0, couriers_js_1.getCourierById)(id_kurir);
    if (!courier) {
        res.status(404).json({
            success: false,
            error: `Kurir dengan ID "${id_kurir}" tidak ditemukan.`,
        });
        return;
    }
    const sequences = (0, orders_js_1.reorderCourierTasks)(id_kurir, ordered_task_ids);
    res.status(200).json({
        success: true,
        id_kurir,
        nama_kurir: courier.nama_kurir,
        sequences: sequences.map((s) => ({ id_order: s.id_order, urutan: s.urutan })),
        message: `Urutan tugas kurir ${courier.nama_kurir} berhasil diplot ulang. Total: ${sequences.length} tugas.`,
    });
});
// ==========================================
// FR-005: Get Courier Tasks with Sequence
// Returns tasks in their manually plotted sequence
// ==========================================
router.get('/courier/:id_kurir/sequence', async (req, res) => {
    const { id_kurir } = req.params;
    const courier = await (0, couriers_js_1.getCourierById)(id_kurir);
    if (!courier) {
        res.status(404).json({
            success: false,
            error: `Kurir dengan ID "${id_kurir}" tidak ditemukan.`,
        });
        return;
    }
    const { orders, sequences } = (0, orders_js_1.getAssignedOrdersByCourier)(id_kurir);
    res.status(200).json({
        success: true,
        id_kurir,
        nama_kurir: courier.nama_kurir,
        id_cabang: courier.id_cabang,
        total_tugas: orders.length,
        sequences: sequences.map((s) => ({
            id_order: s.id_order,
            urutan: s.urutan,
            alamat_penjemputan: s.alamat_penjemputan,
            status: s.status,
            berat_kg: s.berat_kg,
            assigned_at: s.assigned_at?.toISOString(),
        })),
        orders: orders.map((o) => ({
            id_order: o.id_order,
            alamat_penjemputan: o.alamat_penjemputan,
            status: o.status,
            berat_kg: o.berat_kg,
        })),
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
router.patch('/:id_order/status', async (req, res) => {
    try {
        const { id_order } = req.params;
        // Sanitize the order ID - trim whitespace
        const sanitizedOrderId = id_order.trim();
        const { status, id_kurir } = req.body;
        console.log(`[PATCH /orders/:id_order/status] Request received: id_order=${sanitizedOrderId}, status=${status}, id_kurir=${id_kurir || 'none'}`);
        if (!status || !VALID_STATUSES.includes(status)) {
            res.status(400).json({
                success: false,
                id_order: sanitizedOrderId,
                status: '',
                id_cabang: '',
                message: `Status tidak valid. Status yang diizinkan: ${VALID_STATUSES.join(', ')}`,
            });
            return;
        }
        // ============================================================
        // FIND ORDER - Check database FIRST for courier assignments
        // Courier assignments MUST update database for persistence
        // ============================================================
        let order = null;
        let orderSource = null;
        // Check database FIRST (orders from outlet/wahatsapp are stored in DB)
        try {
            const dbOrder = await prisma_js_1.prisma.order.findUnique({
                where: { id_order: sanitizedOrderId },
            });
            if (dbOrder) {
                order = dbOrder;
                orderSource = 'database';
                console.log(`[PATCH /orders/:id_order/status] Found order in database: ${sanitizedOrderId} | id_kurir before: ${dbOrder.id_kurir || 'NULL'}`);
            }
        }
        catch (error) {
            console.error(`[PATCH /orders/:id_order/status] Error checking database:`, error);
        }
        // Only check in-memory if NOT found in database
        if (!order) {
            const memoryOrder = (0, orders_js_1.getOrderById)(sanitizedOrderId);
            if (memoryOrder) {
                order = memoryOrder;
                orderSource = 'memory';
                console.log(`[PATCH /orders/:id_order/status] Found order in memory: ${sanitizedOrderId}`);
            }
        }
        if (!order) {
            console.log(`[PATCH /orders/:id_order/status] Order NOT FOUND: ${sanitizedOrderId}`);
            res.status(404).json({
                success: false,
                id_order: sanitizedOrderId,
                status: '',
                id_cabang: '',
                message: `Pesanan dengan ID "${sanitizedOrderId}" tidak ditemukan.`,
            });
            return;
        }
        console.log(`[PATCH /orders/:id_order/status] Order found: ${sanitizedOrderId}, source=${orderSource}, current status=${order.status}`);
        // ============================================================
        // UPDATE ORDER - For courier assignments, ALWAYS update database
        // ============================================================
        let updatedOrder = null;
        const shouldAssignCourier = id_kurir && (status === 'Diproses' || status === 'Pickup');
        console.log(`[PATCH /orders/:id_order/status] shouldAssignCourier=${shouldAssignCourier}, orderSource=${orderSource}`);
        // Validate courier exists before assignment
        if (shouldAssignCourier && id_kurir) {
            try {
                const courierCheck = await prisma_js_1.prisma.courier.findUnique({
                    where: { id_kurir },
                });
                if (!courierCheck) {
                    console.log(`[PATCH /orders/:id_order/status] ERROR: Courier ${id_kurir} not found in database!`);
                    res.status(400).json({
                        success: false,
                        id_order: sanitizedOrderId,
                        status: '',
                        id_cabang: order.id_cabang ?? '',
                        message: `Kurir dengan ID "${id_kurir}" tidak ditemukan dalam database.`,
                    });
                    return;
                }
                console.log(`[PATCH /orders/:id_order/status] Courier validation OK: ${courierCheck.nama_kurir}`);
            }
            catch (error) {
                console.error(`[PATCH /orders/:id_order/status] Error checking courier:`, error);
            }
        }
        if (orderSource === 'database' || shouldAssignCourier) {
            // MUST update database for persistence
            // Also update in-memory for real-time sync if order exists there
            try {
                const updateData = { status };
                if (shouldAssignCourier) {
                    updateData.id_kurir = id_kurir;
                    updateData.assigned_at = new Date();
                }
                console.log(`[PATCH /orders/:id_order/status] Updating DB with:`, JSON.stringify(updateData));
                updatedOrder = await prisma_js_1.prisma.order.update({
                    where: { id_order: sanitizedOrderId },
                    data: updateData,
                });
                console.log(`[PATCH /orders/:id_order/status] DB update SUCCESS!`);
                console.log(`[PATCH /orders/:id_order/status] Updated order details:`, {
                    id_order: updatedOrder.id_order,
                    status: updatedOrder.status,
                    id_kurir: updatedOrder.id_kurir,
                    assigned_at: updatedOrder.assigned_at,
                });
                // Also update in-memory for real-time sync
                if (orderSource === 'memory') {
                    (0, orders_js_1.updateOrderStatus)(sanitizedOrderId, status);
                    if (shouldAssignCourier) {
                        (0, orders_js_1.assignOrderToCourier)(sanitizedOrderId, id_kurir);
                    }
                    // Re-fetch from DB to get updated order
                    order = await prisma_js_1.prisma.order.findUnique({ where: { id_order: sanitizedOrderId } });
                }
            }
            catch (error) {
                console.error(`[PATCH /orders/:id_order/status] DB update error:`, error);
                res.status(500).json({
                    success: false,
                    id_order: sanitizedOrderId,
                    status: '',
                    id_cabang: order.id_cabang ?? '',
                    message: 'Gagal mengupdate pesanan di database.',
                });
                return;
            }
        }
        else {
            // Fallback: update in-memory only (for legacy/edge cases)
            updatedOrder = (0, orders_js_1.updateOrderStatus)(sanitizedOrderId, status);
            if (shouldAssignCourier) {
                (0, orders_js_1.assignOrderToCourier)(sanitizedOrderId, id_kurir);
            }
        }
        let journal = undefined;
        if (status === 'Selesai' || status === 'Lunas' || status === 'Done') {
            const branch = await (0, branches_js_1.getBranchById)(order.id_cabang);
            const nominal = updatedOrder?.total_harga ?? order.total_harga ?? 0;
            try {
                const entry = await (0, cashbook_js_1.createJournalEntry)({
                    id_cabang: order.id_cabang,
                    id_transaksi: sanitizedOrderId,
                    nominal,
                    tipe: 'Pemasukan',
                    deskripsi: `Pendapatan pesanan ${sanitizedOrderId} dari ${branch?.nama_cabang ?? order.id_cabang ?? 'Unknown'}`,
                });
                journal = {
                    id_jurnal: entry.id_jurnal,
                    nominal: entry.nominal,
                    tipe: entry.tipe,
                    deskripsi: entry.deskripsi,
                    tanggal_jurnal: entry.tanggal_jurnal.toISOString(),
                };
            }
            catch (error) {
                console.error(`[PATCH /orders/:id_order/status] Error creating journal entry:`, error);
            }
        }
        res.status(200).json({
            success: true,
            id_order: sanitizedOrderId,
            status: updatedOrder?.status ?? status,
            id_cabang: order.id_cabang ?? '',
            journal,
            message: journal
                ? `Status pesanan diubah menjadi "${status}". Jurnal otomatis tercatat di Buku Kas Pusat.`
                : `Pesanan berhasil${shouldAssignCourier ? ` ditugaskan ke kurir ${id_kurir}` : ''}.`,
        });
    }
    catch (error) {
        console.error('[Orders] PATCH /:id_order/status error:', error);
        res.status(500).json({
            success: false,
            id_order: '',
            status: '',
            id_cabang: '',
            message: 'Internal server error',
        });
    }
});
exports.default = router;
//# sourceMappingURL=orders.js.map