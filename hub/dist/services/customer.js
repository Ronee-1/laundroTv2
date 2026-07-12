"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCustomer = createCustomer;
exports.getCustomersByBranch = getCustomersByBranch;
exports.getAllCustomers = getAllCustomers;
exports.getCustomerById = getCustomerById;
exports.updateCustomer = updateCustomer;
exports.deleteCustomer = deleteCustomer;
exports.searchCustomers = searchCustomers;
const prisma_js_1 = require("../lib/prisma.js");
async function createCustomer(data) {
    const customer = await prisma_js_1.prisma.customer.create({
        data: {
            id_cabang: data.id_cabang,
            nama: data.nama,
            whatsapp: data.whatsapp,
            alamat_maps: data.alamat_maps,
            google_maps_url: data.google_maps_url,
        },
    });
    return {
        id_pelanggan: customer.id_pelanggan,
        id_cabang: customer.id_cabang,
        nama: customer.nama,
        whatsapp: customer.whatsapp,
        alamat_maps: customer.alamat_maps,
        google_maps_url: customer.google_maps_url ?? undefined,
        created_at: customer.created_at,
    };
}
async function getCustomersByBranch(id_cabang) {
    const customers = await prisma_js_1.prisma.customer.findMany({
        where: { id_cabang },
        orderBy: { created_at: 'desc' },
    });
    return customers.map((c) => ({
        id_pelanggan: c.id_pelanggan,
        id_cabang: c.id_cabang,
        nama: c.nama,
        whatsapp: c.whatsapp,
        alamat_maps: c.alamat_maps,
        google_maps_url: c.google_maps_url ?? undefined,
        created_at: c.created_at,
    }));
}
async function getAllCustomers() {
    const customers = await prisma_js_1.prisma.customer.findMany({
        orderBy: { created_at: 'desc' },
    });
    return customers.map((c) => ({
        id_pelanggan: c.id_pelanggan,
        id_cabang: c.id_cabang,
        nama: c.nama,
        whatsapp: c.whatsapp,
        alamat_maps: c.alamat_maps,
        google_maps_url: c.google_maps_url ?? undefined,
        created_at: c.created_at,
    }));
}
async function getCustomerById(id_pelanggan) {
    const customer = await prisma_js_1.prisma.customer.findUnique({
        where: { id_pelanggan },
    });
    if (!customer)
        return null;
    return {
        id_pelanggan: customer.id_pelanggan,
        id_cabang: customer.id_cabang,
        nama: customer.nama,
        whatsapp: customer.whatsapp,
        alamat_maps: customer.alamat_maps,
        google_maps_url: customer.google_maps_url ?? undefined,
        created_at: customer.created_at,
    };
}
async function updateCustomer(id_pelanggan, data) {
    const customer = await prisma_js_1.prisma.customer.update({
        where: { id_pelanggan },
        data: {
            ...(data.nama && { nama: data.nama }),
            ...(data.whatsapp && { whatsapp: data.whatsapp }),
            ...(data.alamat_maps && { alamat_maps: data.alamat_maps }),
            ...(data.google_maps_url !== undefined && { google_maps_url: data.google_maps_url }),
        },
    });
    return {
        id_pelanggan: customer.id_pelanggan,
        id_cabang: customer.id_cabang,
        nama: customer.nama,
        whatsapp: customer.whatsapp,
        alamat_maps: customer.alamat_maps,
        google_maps_url: customer.google_maps_url ?? undefined,
        created_at: customer.created_at,
    };
}
async function deleteCustomer(id_pelanggan) {
    try {
        await prisma_js_1.prisma.customer.delete({
            where: { id_pelanggan },
        });
        return true;
    }
    catch {
        return false;
    }
}
async function searchCustomers(id_cabang, query) {
    const customers = await prisma_js_1.prisma.customer.findMany({
        where: {
            id_cabang,
            OR: [
                { nama: { contains: query, mode: 'insensitive' } },
                { whatsapp: { contains: query, mode: 'insensitive' } },
            ],
        },
        orderBy: { created_at: 'desc' },
        take: 20,
    });
    return customers.map((c) => ({
        id_pelanggan: c.id_pelanggan,
        id_cabang: c.id_cabang,
        nama: c.nama,
        whatsapp: c.whatsapp,
        alamat_maps: c.alamat_maps,
        google_maps_url: c.google_maps_url ?? undefined,
        created_at: c.created_at,
    }));
}
//# sourceMappingURL=customer.js.map