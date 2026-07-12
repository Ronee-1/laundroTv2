"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createOrderFromWhatsApp = createOrderFromWhatsApp;
exports.getOrdersByBranchFromDB = getOrdersByBranchFromDB;
exports.getIncomingOrdersByBranchFromDB = getIncomingOrdersByBranchFromDB;
exports.getAssignedOrdersByCourierFromDB = getAssignedOrdersByCourierFromDB;
exports.getAllOrdersFromDB = getAllOrdersFromDB;
exports.getOrderByIdFromDB = getOrderByIdFromDB;
exports.updateOrderStatusInDB = updateOrderStatusInDB;
exports.assignOrderToCourierInDB = assignOrderToCourierInDB;
exports.getOrdersByCourier = getOrdersByCourier;
exports.getOrdersByBranch = getOrdersByBranch;
exports.getOrderById = getOrderById;
exports.updateOrderStatus = updateOrderStatus;
exports.createOrderFromWhatsAppSync = createOrderFromWhatsAppSync;
exports.getIncomingOrdersByBranch = getIncomingOrdersByBranch;
exports.getAllOrdersByBranch = getAllOrdersByBranch;
exports.assignOrderToCourier = assignOrderToCourier;
exports.getCourierTaskSequence = getCourierTaskSequence;
exports.setCourierTaskSequence = setCourierTaskSequence;
exports.reorderCourierTasks = reorderCourierTasks;
exports.getAssignedOrdersByCourier = getAssignedOrdersByCourier;
const prisma_js_1 = require("../lib/prisma.js");
// ==========================================
// ORDERS CONFIG - FR-LOG-01, FR-LOG-02, FR-005 Integration
// WhatsApp Order Hub allocates orders to nearest branch
// Branch admin receives allocated orders for batch processing
// FR-005: Admin can assign orders to couriers with task ordering
// ==========================================
// Default orders (fallback) - Sample data untuk testing
const DEFAULT_ORDERS = [
    {
        id_order: 'ORD-001',
        id_cabang: 'CBG-001',
        id_pelanggan: 'PLG-001',
        id_kurir: undefined,
        alamat_penjemputan: 'Jl. Kemang Selatan No. 5, Jakarta Selatan',
        alamat_pengantaran: 'Jl. Kemang Selatan No. 5, Jakarta Selatan',
        koordinat_penjemputan: { latitude: -6.2650, longitude: 106.8130 },
        koordinat_pengantaran: { latitude: -6.2650, longitude: 106.8130 },
        status: 'Pending',
        berat_kg: 3.5,
        total_harga: 70000,
        tanggal_order: new Date(),
        created_at: new Date(),
        updated_at: new Date(),
        customer_name: 'Budi Santoso',
        customer_whatsapp: '081234567890',
        service_type: 'Laundry Kiloan',
        wilayah: 'Jakarta Selatan',
    },
    {
        id_order: 'ORD-002',
        id_cabang: 'CBG-001',
        id_pelanggan: 'PLG-002',
        id_kurir: undefined,
        alamat_penjemputan: 'Jl. Ampera Raya No. 15, Jakarta Selatan',
        alamat_pengantaran: 'Jl. Ampera Raya No. 15, Jakarta Selatan',
        koordinat_penjemputan: { latitude: -6.2800, longitude: 106.8200 },
        koordinat_pengantaran: { latitude: -6.2800, longitude: 106.8200 },
        status: 'Pending',
        berat_kg: 2.0,
        total_harga: 40000,
        tanggal_order: new Date(),
        created_at: new Date(),
        updated_at: new Date(),
        customer_name: 'Siti Rahayu',
        customer_whatsapp: '087654321098',
        service_type: 'Laundry Kiloan',
        wilayah: 'Jakarta Selatan',
    },
    {
        id_order: 'ORD-003',
        id_cabang: 'CBG-001',
        id_pelanggan: 'PLG-003',
        id_kurir: undefined,
        alamat_penjemputan: 'Jl. Lebak Bulus No. 8, Jakarta Selatan',
        alamat_pengantaran: 'Jl. Lebak Bulus No. 8, Jakarta Selatan',
        koordinat_penjemputan: { latitude: -6.2900, longitude: 106.8300 },
        koordinat_pengantaran: { latitude: -6.2900, longitude: 106.8300 },
        status: 'Pending',
        berat_kg: 1.5,
        total_harga: 30000,
        tanggal_order: new Date(),
        created_at: new Date(),
        updated_at: new Date(),
        customer_name: 'Ahmad Fauzi',
        customer_whatsapp: '081987654321',
        service_type: 'Express Laundry',
        wilayah: 'Jakarta Selatan',
    },
];
// ==========================================
// ORDER CRUD OPERATIONS
// ==========================================
/**
 * Create order from WhatsApp Hub allocation (async)
 */
async function createOrderFromWhatsApp(params) {
    const id_order = `ORD-WA-${Date.now().toString(36).toUpperCase()}`;
    const order = await prisma_js_1.prisma.order.create({
        data: {
            id_order,
            id_cabang: params.id_cabang,
            id_pelanggan: `PLG-${Date.now()}`,
            alamat_penjemputan: params.alamat_penjemputan,
            alamat_pengantaran: params.alamat_penjemputan,
            latitude_penjemputan: params.koordinat_penjemputan.latitude,
            longitude_penjemputan: params.koordinat_penjemputan.longitude,
            latitude_pengantaran: params.koordinat_penjemputan.latitude,
            longitude_pengantaran: params.koordinat_penjemputan.longitude,
            status: 'Pending',
            berat_kg: params.berat_kg,
            customer_name: params.customer_name,
            customer_whatsapp: params.customer_whatsapp,
            service_type: params.service_type,
            wilayah: params.wilayah,
            google_maps_url: params.google_maps_url,
            source: 'whatsapp',
        },
    });
    return {
        id_order: order.id_order,
        id_cabang: order.id_cabang,
        id_pelanggan: order.id_pelanggan,
        id_kurir: order.id_kurir ?? undefined,
        alamat_penjemputan: order.alamat_penjemputan,
        alamat_pengantaran: order.alamat_pengantaran,
        koordinat_penjemputan: {
            latitude: order.latitude_penjemputan,
            longitude: order.longitude_penjemputan,
        },
        koordinat_pengantaran: {
            latitude: order.latitude_pengantaran,
            longitude: order.longitude_pengantaran,
        },
        status: order.status,
        catatan: order.catatan ?? undefined,
        berat_kg: order.berat_kg ?? undefined,
        total_harga: order.total_harga ?? undefined,
        tanggal_order: order.tanggal_order,
        tanggal_selesai: order.tanggal_selesai ?? undefined,
        customer_name: order.customer_name ?? undefined,
        customer_whatsapp: order.customer_whatsapp ?? undefined,
        service_type: order.service_type ?? undefined,
        wilayah: order.wilayah ?? undefined,
        google_maps_url: order.google_maps_url ?? undefined,
        source: order.source ?? undefined,
        created_at: order.created_at,
        updated_at: order.updated_at,
    };
}
/**
 * Get orders by branch from database (async)
 */
async function getOrdersByBranchFromDB(id_cabang) {
    const orders = await prisma_js_1.prisma.order.findMany({
        where: { id_cabang },
        orderBy: { tanggal_order: 'desc' },
    });
    return orders.map(mapPrismaOrderToOrder);
}
/**
 * Get incoming orders (Pending) for a branch from database (async)
 */
async function getIncomingOrdersByBranchFromDB(id_cabang) {
    const orders = await prisma_js_1.prisma.order.findMany({
        where: { id_cabang, status: 'Pending' },
        orderBy: { tanggal_order: 'desc' },
    });
    return orders.map(mapPrismaOrderToOrder);
}
/**
 * Get orders assigned to a courier from database (async)
 */
async function getAssignedOrdersByCourierFromDB(id_kurir) {
    const orders = await prisma_js_1.prisma.order.findMany({
        where: {
            id_kurir,
            status: {
                notIn: ['Done', 'Dibatalkan', 'Selesai', 'Lunas'],
            },
        },
        orderBy: { assigned_at: 'asc' },
    });
    return orders.map(mapPrismaOrderToOrder);
}
/**
 * Get all orders from database (async)
 */
async function getAllOrdersFromDB() {
    const orders = await prisma_js_1.prisma.order.findMany({
        orderBy: { tanggal_order: 'desc' },
    });
    return orders.map(mapPrismaOrderToOrder);
}
/**
 * Get order by ID from database (async)
 */
async function getOrderByIdFromDB(id_order) {
    const order = await prisma_js_1.prisma.order.findUnique({
        where: { id_order },
    });
    if (!order)
        return null;
    return mapPrismaOrderToOrder(order);
}
/**
 * Update order status in database (async)
 */
async function updateOrderStatusInDB(id_order, newStatus) {
    try {
        const updateData = { status: newStatus };
        if (newStatus === 'Selesai' || newStatus === 'Lunas' || newStatus === 'Done') {
            updateData.tanggal_selesai = new Date();
        }
        const order = await prisma_js_1.prisma.order.update({
            where: { id_order },
            data: updateData,
        });
        return mapPrismaOrderToOrder(order);
    }
    catch {
        return null;
    }
}
/**
 * Assign order to courier (async)
 */
async function assignOrderToCourierInDB(id_order, id_kurir, assigned_by) {
    try {
        const order = await prisma_js_1.prisma.order.update({
            where: { id_order },
            data: {
                id_kurir,
                assigned_by,
                assigned_at: new Date(),
            },
        });
        return mapPrismaOrderToOrder(order);
    }
    catch {
        return null;
    }
}
/**
 * Map Prisma Order to Order type
 */
function mapPrismaOrderToOrder(order) {
    return {
        id_order: order.id_order,
        id_cabang: order.id_cabang,
        id_pelanggan: order.id_pelanggan,
        id_kurir: order.id_kurir ?? undefined,
        alamat_penjemputan: order.alamat_penjemputan,
        alamat_pengantaran: order.alamat_pengantaran,
        koordinat_penjemputan: {
            latitude: order.latitude_penjemputan,
            longitude: order.longitude_penjemputan,
        },
        koordinat_pengantaran: {
            latitude: order.latitude_pengantaran,
            longitude: order.longitude_pengantaran,
        },
        status: order.status,
        catatan: order.catatan ?? undefined,
        berat_kg: order.berat_kg ?? undefined,
        total_harga: order.total_harga ?? undefined,
        tanggal_order: order.tanggal_order,
        tanggal_selesai: order.tanggal_selesai ?? undefined,
        customer_name: order.customer_name ?? undefined,
        customer_whatsapp: order.customer_whatsapp ?? undefined,
        service_type: order.service_type ?? undefined,
        wilayah: order.wilayah ?? undefined,
        google_maps_url: order.google_maps_url ?? undefined,
        source: order.source ?? undefined,
        assigned_by: order.assigned_by ?? undefined,
        assigned_at: order.assigned_at ?? undefined,
        created_at: order.created_at,
        updated_at: order.updated_at,
    };
}
// ==========================================
// SYNC FUNCTIONS (for backward compatibility)
// ==========================================
function getOrdersByCourier(id_kurir, id_cabang) {
    return DEFAULT_ORDERS.filter((o) => o.id_kurir === id_kurir && o.id_cabang === id_cabang);
}
function getOrdersByBranch(id_cabang) {
    return DEFAULT_ORDERS.filter((o) => o.id_cabang === id_cabang);
}
function getOrderById(id_order) {
    return DEFAULT_ORDERS.find((o) => o.id_order === id_order);
}
function updateOrderStatus(id_order, newStatus) {
    const order = getOrderById(id_order);
    if (!order)
        return null;
    order.status = newStatus;
    order.updated_at = new Date();
    if (newStatus === 'Selesai' || newStatus === 'Lunas' || newStatus === 'Done') {
        order.tanggal_selesai = new Date();
    }
    return order;
}
function createOrderFromWhatsAppSync(params) {
    const id_order = `ORD-WA-${Date.now()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
    const order = {
        id_order,
        id_cabang: params.id_cabang,
        id_pelanggan: `PLG-${Date.now()}`,
        id_kurir: '',
        alamat_penjemputan: params.alamat_penjemputan,
        alamat_pengantaran: params.alamat_penjemputan,
        koordinat_penjemputan: params.koordinat_penjemputan,
        koordinat_pengantaran: params.koordinat_penjemputan,
        status: 'Pending',
        berat_kg: params.berat_kg,
        total_harga: 0,
        customer_name: params.customer_name,
        customer_whatsapp: params.customer_whatsapp,
        service_type: params.service_type,
        wilayah: params.wilayah,
        google_maps_url: params.google_maps_url,
        tanggal_order: new Date(),
        created_at: new Date(),
        updated_at: new Date(),
    };
    DEFAULT_ORDERS.push(order);
    return order;
}
// Get all incoming orders for a branch (WhatsApp allocated orders)
function getIncomingOrdersByBranch(id_cabang) {
    return DEFAULT_ORDERS.filter((o) => o.id_cabang === id_cabang && o.status === 'Pending');
}
// Get all orders for branch (including processed)
function getAllOrdersByBranch(id_cabang) {
    return DEFAULT_ORDERS.filter((o) => o.id_cabang === id_cabang);
}
// ==========================================
// FR-005: Assign Order to Courier
// ==========================================
function assignOrderToCourier(id_order, id_kurir, assigned_by) {
    const order = getOrderById(id_order);
    if (!order)
        return null;
    order.id_kurir = id_kurir;
    order.assigned_by = assigned_by;
    order.assigned_at = new Date();
    order.updated_at = new Date();
    return order;
}
// Manual task ordering storage
const TASK_SEQUENCES = new Map();
function getCourierTaskSequence(id_kurir) {
    return TASK_SEQUENCES.get(id_kurir) || [];
}
function setCourierTaskSequence(id_kurir, sequences) {
    TASK_SEQUENCES.set(id_kurir, sequences);
}
function reorderCourierTasks(id_kurir, orderedTaskIds) {
    const orders = DEFAULT_ORDERS.filter((o) => o.id_kurir === id_kurir);
    const sequences = [];
    orderedTaskIds.forEach((id_order, index) => {
        const order = orders.find((o) => o.id_order === id_order);
        if (order) {
            sequences.push({
                id_order: order.id_order,
                urutan: index + 1,
                id_kurir: id_kurir,
                alamat_penjemputan: order.alamat_penjemputan,
                status: order.status,
                berat_kg: order.berat_kg ?? undefined,
                assigned_at: order.assigned_at ?? undefined,
            });
        }
    });
    TASK_SEQUENCES.set(id_kurir, sequences);
    return sequences;
}
// ==========================================
// FR-005: Get Orders Assigned to Courier (with sequence)
// ==========================================
function getAssignedOrdersByCourier(id_kurir) {
    const orders = DEFAULT_ORDERS.filter((o) => o.id_kurir === id_kurir && o.status !== 'Done' && o.status !== 'Dibatalkan');
    const sequences = getCourierTaskSequence(id_kurir);
    const orderedOrders = [...orders].sort((a, b) => {
        const seqA = sequences.find((s) => s.id_order === a.id_order);
        const seqB = sequences.find((s) => s.id_order === b.id_order);
        if (seqA && seqB) {
            return seqA.urutan - seqB.urutan;
        }
        if (seqA)
            return -1;
        if (seqB)
            return 1;
        const dateA = a.assigned_at?.getTime() || 0;
        const dateB = b.assigned_at?.getTime() || 0;
        return dateA - dateB;
    });
    return { orders: orderedOrders, sequences };
}
//# sourceMappingURL=orders.js.map