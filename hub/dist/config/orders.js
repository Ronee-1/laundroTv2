"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ORDERS = void 0;
exports.getOrdersByCourier = getOrdersByCourier;
exports.getOrdersByBranch = getOrdersByBranch;
exports.getOrderById = getOrderById;
exports.updateOrderStatus = updateOrderStatus;
exports.createOrderFromWhatsApp = createOrderFromWhatsApp;
exports.getIncomingOrdersByBranch = getIncomingOrdersByBranch;
exports.getAllOrdersByBranch = getAllOrdersByBranch;
exports.assignOrderToCourier = assignOrderToCourier;
exports.getCourierTaskSequence = getCourierTaskSequence;
exports.setCourierTaskSequence = setCourierTaskSequence;
exports.reorderCourierTasks = reorderCourierTasks;
exports.getAssignedOrdersByCourier = getAssignedOrdersByCourier;
// ==========================================
// ORDERS CONFIG - FR-LOG-01, FR-LOG-02, FR-005 Integration
// WhatsApp Order Hub allocates orders to nearest branch
// Branch admin receives allocated orders for batch processing
// FR-005: Admin can assign orders to couriers with task ordering
// ==========================================
exports.ORDERS = [
    {
        id_order: 'ORD-001',
        id_cabang: 'CBG-001',
        id_pelanggan: 'PLG-001',
        id_kurir: 'KUR-001',
        alamat_penjemputan: 'Jl. Kemang Selatan No. 5, Jakarta Selatan',
        alamat_pengantaran: 'Jl. Kemang Selatan No. 5, Jakarta Selatan',
        koordinat_penjemputan: { latitude: -6.2650, longitude: 106.8130 },
        koordinat_pengantaran: { latitude: -6.2650, longitude: 106.8130 },
        status: 'Pending',
        berat_kg: 3.5,
        total_harga: 70000,
        tanggal_order: new Date('2024-06-01'),
        created_at: new Date('2024-06-01'),
        updated_at: new Date('2024-06-01'),
    },
    {
        id_order: 'ORD-002',
        id_cabang: 'CBG-001',
        id_pelanggan: 'PLG-002',
        id_kurir: 'KUR-001',
        alamat_penjemputan: 'Jl. Bangka Raya No. 12, Jakarta Selatan',
        alamat_pengantaran: 'Jl. Bangka Raya No. 12, Jakarta Selatan',
        koordinat_penjemputan: { latitude: -6.2710, longitude: 106.8200 },
        koordinat_pengantaran: { latitude: -6.2710, longitude: 106.8200 },
        status: 'On Route',
        berat_kg: 2.0,
        total_harga: 40000,
        tanggal_order: new Date('2024-06-01'),
        created_at: new Date('2024-06-01'),
        updated_at: new Date('2024-06-01'),
    },
    {
        id_order: 'ORD-003',
        id_cabang: 'CBG-002',
        id_pelanggan: 'PLG-003',
        id_kurir: 'KUR-003',
        alamat_penjemputan: 'Jl. Puri Indah Blok A No. 8, Jakarta Barat',
        alamat_pengantaran: 'Jl. Puri Indah Blok A No. 8, Jakarta Barat',
        koordinat_penjemputan: { latitude: -6.1850, longitude: 106.7400 },
        koordinat_pengantaran: { latitude: -6.1850, longitude: 106.7400 },
        status: 'Pending',
        berat_kg: 5.0,
        total_harga: 100000,
        tanggal_order: new Date('2024-06-01'),
        created_at: new Date('2024-06-01'),
        updated_at: new Date('2024-06-01'),
    },
    {
        id_order: 'ORD-004',
        id_cabang: 'CBG-003',
        id_pelanggan: 'PLG-004',
        id_kurir: 'KUR-004',
        alamat_penjemputan: 'Jl. Pemuda No. 30, Jakarta Timur',
        alamat_pengantaran: 'Jl. Pemuda No. 30, Jakarta Timur',
        koordinat_penjemputan: { latitude: -6.1920, longitude: 106.8900 },
        koordinat_pengantaran: { latitude: -6.1920, longitude: 106.8900 },
        status: 'Pending',
        berat_kg: 4.0,
        total_harga: 80000,
        tanggal_order: new Date('2024-06-01'),
        created_at: new Date('2024-06-01'),
        updated_at: new Date('2024-06-01'),
    },
];
function getOrdersByCourier(id_kurir, id_cabang) {
    return exports.ORDERS.filter((o) => o.id_kurir === id_kurir && o.id_cabang === id_cabang);
}
function getOrdersByBranch(id_cabang) {
    return exports.ORDERS.filter((o) => o.id_cabang === id_cabang);
}
function getOrderById(id_order) {
    return exports.ORDERS.find((o) => o.id_order === id_order);
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
function createOrderFromWhatsApp(params) {
    const id_order = `ORD-WA-${Date.now()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
    const order = {
        id_order,
        id_cabang: params.id_cabang,
        id_pelanggan: `PLG-${Date.now()}`,
        id_kurir: '', // Will be assigned by branch admin
        alamat_penjemputan: params.alamat_penjemputan,
        alamat_pengantaran: params.alamat_penjemputan,
        koordinat_penjemputan: params.koordinat_penjemputan,
        koordinat_pengantaran: params.koordinat_penjemputan,
        status: 'Pending',
        berat_kg: params.berat_kg,
        total_harga: 0, // Will be calculated based on service
        customer_name: params.customer_name,
        customer_whatsapp: params.customer_whatsapp,
        service_type: params.service_type,
        wilayah: params.wilayah,
        google_maps_url: params.google_maps_url,
        tanggal_order: new Date(),
        created_at: new Date(),
        updated_at: new Date(),
    };
    exports.ORDERS.push(order);
    return order;
}
// Get all incoming orders for a branch (WhatsApp allocated orders)
function getIncomingOrdersByBranch(id_cabang) {
    return exports.ORDERS.filter((o) => o.id_cabang === id_cabang && o.status === 'Pending');
}
// Get all orders for branch (including processed)
function getAllOrdersByBranch(id_cabang) {
    return exports.ORDERS.filter((o) => o.id_cabang === id_cabang);
}
// ==========================================
// FR-005: Assign Order to Courier
// Assigns an order to a specific courier for pickup/delivery
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
    const orders = exports.ORDERS.filter((o) => o.id_kurir === id_kurir);
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
                berat_kg: order.berat_kg,
                assigned_at: order.assigned_at,
            });
        }
    });
    TASK_SEQUENCES.set(id_kurir, sequences);
    return sequences;
}
// ==========================================
// FR-005: Get Orders Assigned to Courier (with sequence)
// Returns orders in their manually plotted sequence
// ==========================================
function getAssignedOrdersByCourier(id_kurir) {
    const orders = exports.ORDERS.filter((o) => o.id_kurir === id_kurir && o.status !== 'Done' && o.status !== 'Dibatalkan');
    const sequences = getCourierTaskSequence(id_kurir);
    // Sort orders by sequence if exists, otherwise by assignment date
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
        // Fallback: sort by assigned_at
        const dateA = a.assigned_at?.getTime() || 0;
        const dateB = b.assigned_at?.getTime() || 0;
        return dateA - dateB;
    });
    return { orders: orderedOrders, sequences };
}
//# sourceMappingURL=orders.js.map