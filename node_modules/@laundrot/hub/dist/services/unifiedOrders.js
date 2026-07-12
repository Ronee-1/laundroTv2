"use strict";
// ==========================================
// UNIFIED ORDERS STORAGE SERVICE
// Uses Prisma ORM to store all orders in PostgreSQL
// Supports both WhatsApp Hub and Outlet Reception orders
// ==========================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.createWhatsAppOrder = createWhatsAppOrder;
exports.getWhatsAppOrdersByBranch = getWhatsAppOrdersByBranch;
exports.getAllWhatsAppOrders = getAllWhatsAppOrders;
exports.createOutletOrder = createOutletOrder;
exports.getOutletOrdersByBranch = getOutletOrdersByBranch;
exports.getAllOutletOrders = getAllOutletOrders;
exports.getAllOrders = getAllOrders;
exports.getOrdersByBranch = getOrdersByBranch;
exports.getOrderStats = getOrderStats;
const prisma_js_1 = require("../lib/prisma.js");
let orderCounter = 1;
function generateOrderId(prefix = 'ORD') {
    const id = `${prefix}-${String(orderCounter++).padStart(6, '0')}`;
    return id;
}
// ==========================================
// WhatsApp Order Management (using Prisma)
// ==========================================
async function createWhatsAppOrder(data) {
    const id_order = generateOrderId('ORD-WA');
    const order = await prisma_js_1.prisma.order.create({
        data: {
            id_order,
            id_cabang: data.id_cabang,
            id_pelanggan: `PLG-${Date.now()}`,
            alamat_penjemputan: data.alamat_penjemputan,
            alamat_pengantaran: data.alamat_penjemputan,
            latitude_penjemputan: data.koordinat_penjemputan.latitude,
            longitude_penjemputan: data.koordinat_penjemputan.longitude,
            latitude_pengantaran: data.koordinat_penjemputan.latitude,
            longitude_pengantaran: data.koordinat_penjemputan.longitude,
            status: data.status || 'Baru',
            berat_kg: data.berat_kg,
            total_harga: data.total_harga,
            customer_name: data.customer_name,
            customer_whatsapp: data.customer_whatsapp,
            service_name: data.service_name,
            wilayah: data.wilayah,
            google_maps_url: data.google_maps_url,
            source: 'whatsapp',
        },
    });
    console.log(`[UNIFIED ORDERS] WhatsApp order created in DB: ${id_order} at ${data.id_cabang}`);
    return {
        id_order: order.id_order,
        id_cabang: order.id_cabang,
        customer_name: order.customer_name || '',
        customer_whatsapp: order.customer_whatsapp || '',
        service_name: order.service_name || '',
        berat_kg: order.berat_kg || 0,
        total_harga: order.total_harga || 0,
        status: order.status,
        sumber: 'whatsapp',
        tanggal_order: order.tanggal_order,
        wilayah: order.wilayah || '',
        alamat_penjemputan: order.alamat_penjemputan,
        google_maps_url: order.google_maps_url || '',
        koordinat_penjemputan: {
            latitude: order.latitude_penjemputan,
            longitude: order.longitude_penjemputan,
        },
        id_kurir: order.id_kurir || undefined,
    };
}
async function getWhatsAppOrdersByBranch(id_cabang) {
    const orders = await prisma_js_1.prisma.order.findMany({
        where: { id_cabang, source: 'whatsapp' },
        orderBy: { tanggal_order: 'desc' },
    });
    return orders.map((o) => ({
        id_order: o.id_order,
        id_cabang: o.id_cabang,
        customer_name: o.customer_name || '',
        customer_whatsapp: o.customer_whatsapp || '',
        service_name: o.service_name || '',
        berat_kg: o.berat_kg || 0,
        total_harga: o.total_harga || 0,
        status: o.status,
        sumber: 'whatsapp',
        tanggal_order: o.tanggal_order,
        wilayah: o.wilayah || '',
        alamat_penjemputan: o.alamat_penjemputan,
        google_maps_url: o.google_maps_url || '',
        koordinat_penjemputan: {
            latitude: o.latitude_penjemputan,
            longitude: o.longitude_penjemputan,
        },
        id_kurir: o.id_kurir || undefined,
    }));
}
async function getAllWhatsAppOrders() {
    const orders = await prisma_js_1.prisma.order.findMany({
        where: { source: 'whatsapp' },
        orderBy: { tanggal_order: 'desc' },
    });
    return orders.map((o) => ({
        id_order: o.id_order,
        id_cabang: o.id_cabang,
        customer_name: o.customer_name || '',
        customer_whatsapp: o.customer_whatsapp || '',
        service_name: o.service_name || '',
        berat_kg: o.berat_kg || 0,
        total_harga: o.total_harga || 0,
        status: o.status,
        sumber: 'whatsapp',
        tanggal_order: o.tanggal_order,
        wilayah: o.wilayah || '',
        alamat_penjemputan: o.alamat_penjemputan,
        google_maps_url: o.google_maps_url || '',
        koordinat_penjemputan: {
            latitude: o.latitude_penjemputan,
            longitude: o.longitude_penjemputan,
        },
        id_kurir: o.id_kurir || undefined,
    }));
}
// ==========================================
// Outlet Order Management (using Prisma)
// ==========================================
async function createOutletOrder(data) {
    const id_order = generateOrderId('ORD-O');
    const order = await prisma_js_1.prisma.order.create({
        data: {
            id_order,
            id_cabang: data.id_cabang,
            id_pelanggan: data.id_pelanggan,
            alamat_penjemputan: '',
            alamat_pengantaran: '',
            latitude_penjemputan: 0,
            longitude_penjemputan: 0,
            latitude_pengantaran: 0,
            longitude_pengantaran: 0,
            status: data.status || 'Baru',
            berat_kg: data.berat_kg,
            total_harga: data.total_harga,
            customer_name: data.customer_name,
            customer_whatsapp: data.customer_whatsapp,
            service_name: data.service_name,
            source: 'outlet',
            qty: data.qty,
            satuan: data.satuan,
        },
    });
    console.log(`[UNIFIED ORDERS] Outlet order created in DB: ${id_order} at ${data.id_cabang}`);
    return {
        id_order: order.id_order,
        id_cabang: order.id_cabang,
        customer_name: order.customer_name || '',
        customer_whatsapp: order.customer_whatsapp || '',
        service_name: order.service_name || '',
        berat_kg: order.berat_kg || 0,
        total_harga: order.total_harga || 0,
        status: order.status,
        sumber: 'outlet',
        tanggal_order: order.tanggal_order,
        id_pelanggan: order.id_pelanggan,
        id_layanan: data.id_layanan,
        qty: order.qty || 0,
        satuan: order.satuan || 'pcs',
        id_kurir: order.id_kurir || undefined,
    };
}
async function getOutletOrdersByBranch(id_cabang) {
    const orders = await prisma_js_1.prisma.order.findMany({
        where: { id_cabang, source: 'outlet' },
        orderBy: { tanggal_order: 'desc' },
    });
    return orders.map((o) => ({
        id_order: o.id_order,
        id_cabang: o.id_cabang,
        customer_name: o.customer_name || '',
        customer_whatsapp: o.customer_whatsapp || '',
        service_name: o.service_name || '',
        berat_kg: o.berat_kg || 0,
        total_harga: o.total_harga || 0,
        status: o.status,
        sumber: 'outlet',
        tanggal_order: o.tanggal_order,
        id_pelanggan: o.id_pelanggan,
        id_layanan: '',
        qty: o.qty || 0,
        satuan: o.satuan || 'pcs',
        id_kurir: o.id_kurir || undefined,
    }));
}
async function getAllOutletOrders() {
    const orders = await prisma_js_1.prisma.order.findMany({
        where: { source: 'outlet' },
        orderBy: { tanggal_order: 'desc' },
    });
    return orders.map((o) => ({
        id_order: o.id_order,
        id_cabang: o.id_cabang,
        customer_name: o.customer_name || '',
        customer_whatsapp: o.customer_whatsapp || '',
        service_name: o.service_name || '',
        berat_kg: o.berat_kg || 0,
        total_harga: o.total_harga || 0,
        status: o.status,
        sumber: 'outlet',
        tanggal_order: o.tanggal_order,
        id_pelanggan: o.id_pelanggan,
        id_layanan: '',
        qty: o.qty || 0,
        satuan: o.satuan || 'pcs',
        id_kurir: o.id_kurir || undefined,
    }));
}
// ==========================================
// Unified Order Access (using Prisma)
// ==========================================
async function getAllOrders() {
    const orders = await prisma_js_1.prisma.order.findMany({
        orderBy: { tanggal_order: 'desc' },
    });
    return orders.map((o) => {
        if (o.source === 'outlet') {
            return {
                id_order: o.id_order,
                id_cabang: o.id_cabang,
                customer_name: o.customer_name || '',
                customer_whatsapp: o.customer_whatsapp || '',
                service_name: o.service_name || '',
                berat_kg: o.berat_kg || 0,
                total_harga: o.total_harga || 0,
                status: o.status,
                sumber: 'outlet',
                tanggal_order: o.tanggal_order,
                id_pelanggan: o.id_pelanggan,
                id_layanan: '',
                qty: o.qty || 0,
                satuan: o.satuan || 'pcs',
                id_kurir: o.id_kurir || undefined,
            };
        }
        else {
            return {
                id_order: o.id_order,
                id_cabang: o.id_cabang,
                customer_name: o.customer_name || '',
                customer_whatsapp: o.customer_whatsapp || '',
                service_name: o.service_name || '',
                berat_kg: o.berat_kg || 0,
                total_harga: o.total_harga || 0,
                status: o.status,
                sumber: 'whatsapp',
                tanggal_order: o.tanggal_order,
                wilayah: o.wilayah || '',
                alamat_penjemputan: o.alamat_penjemputan,
                google_maps_url: o.google_maps_url || '',
                koordinat_penjemputan: {
                    latitude: o.latitude_penjemputan,
                    longitude: o.longitude_penjemputan,
                },
                id_kurir: o.id_kurir || undefined,
            };
        }
    });
}
async function getOrdersByBranch(id_cabang) {
    const whereClause = id_cabang ? { id_cabang } : {};
    const orders = await prisma_js_1.prisma.order.findMany({
        where: whereClause,
        orderBy: { tanggal_order: 'desc' },
    });
    return orders.map((o) => {
        if (o.source === 'outlet') {
            return {
                id_order: o.id_order,
                id_cabang: o.id_cabang,
                customer_name: o.customer_name || '',
                customer_whatsapp: o.customer_whatsapp || '',
                service_name: o.service_name || '',
                berat_kg: o.berat_kg || 0,
                total_harga: o.total_harga || 0,
                status: o.status,
                sumber: 'outlet',
                tanggal_order: o.tanggal_order,
                id_pelanggan: o.id_pelanggan,
                id_layanan: o.id_layanan || '',
                qty: o.qty || 0,
                satuan: o.satuan || 'pcs',
                id_kurir: o.id_kurir || undefined,
            };
        }
        else {
            return {
                id_order: o.id_order,
                id_cabang: o.id_cabang,
                customer_name: o.customer_name || '',
                customer_whatsapp: o.customer_whatsapp || '',
                service_name: o.service_name || '',
                berat_kg: o.berat_kg || 0,
                total_harga: o.total_harga || 0,
                status: o.status,
                sumber: 'whatsapp',
                tanggal_order: o.tanggal_order,
                wilayah: o.wilayah || '',
                alamat_penjemputan: o.alamat_penjemputan,
                google_maps_url: o.google_maps_url || '',
                koordinat_penjemputan: {
                    latitude: o.latitude_penjemputan,
                    longitude: o.longitude_penjemputan,
                },
                id_kurir: o.id_kurir || undefined,
            };
        }
    });
}
// ==========================================
// Statistics (using Prisma)
// ==========================================
async function getOrderStats() {
    const allOrders = await prisma_js_1.prisma.order.findMany();
    const totalWhatsApp = allOrders.filter((o) => o.source === 'whatsapp').length;
    const totalOutlet = allOrders.filter((o) => o.source === 'outlet').length;
    const totalOrders = totalWhatsApp + totalOutlet;
    const ordersByBranch = {};
    for (const order of allOrders) {
        if (!ordersByBranch[order.id_cabang]) {
            ordersByBranch[order.id_cabang] = { whatsapp: 0, outlet: 0, total: 0 };
        }
        ordersByBranch[order.id_cabang].total++;
        if (order.source === 'whatsapp') {
            ordersByBranch[order.id_cabang].whatsapp++;
        }
        else if (order.source === 'outlet') {
            ordersByBranch[order.id_cabang].outlet++;
        }
    }
    const totalRevenue = allOrders
        .filter((o) => o.status === 'Selesai' || o.status === 'Lunas')
        .reduce((sum, o) => sum + (o.total_harga || 0), 0);
    return {
        total_orders: totalOrders,
        whatsapp_orders: totalWhatsApp,
        outlet_orders: totalOutlet,
        total_revenue: totalRevenue,
        orders_by_branch: ordersByBranch,
    };
}
//# sourceMappingURL=unifiedOrders.js.map