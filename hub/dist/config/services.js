"use strict";
// ==========================================
// SERVICE TARIFF CONFIG - FR-SERVICE-01
// Master tarif layanan laundry harian
// Harga dikunci dari database - tidak ada input manual
// ==========================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.getActiveServicesFromDB = getActiveServicesFromDB;
exports.getAllServicesFromDB = getAllServicesFromDB;
exports.getServiceByIdFromDB = getServiceByIdFromDB;
exports.getActiveServices = getActiveServices;
exports.getServiceById = getServiceById;
exports.calculateTotalHarga = calculateTotalHarga;
exports.formatServiceOption = formatServiceOption;
exports.seedDefaultServices = seedDefaultServices;
const prisma_js_1 = require("../lib/prisma.js");
// ==========================================
// SERVICE TARIFF CRUD OPERATIONS
// ==========================================
/**
 * Get all active services from database
 */
async function getActiveServicesFromDB() {
    const services = await prisma_js_1.prisma.serviceTariff.findMany({
        where: { is_active: true },
        orderBy: { id_layanan: 'asc' },
    });
    return services.map((s) => ({
        id_layanan: s.id_layanan,
        nama_layanan: s.nama_layanan,
        kategori: s.kategori,
        satuan: s.satuan,
        harga_per_satuan: s.harga_per_satuan,
        estimasi_hari: s.estimasi_hari,
        is_active: s.is_active,
    }));
}
/**
 * Get all services from database
 */
async function getAllServicesFromDB() {
    const services = await prisma_js_1.prisma.serviceTariff.findMany({
        orderBy: { id_layanan: 'asc' },
    });
    return services.map((s) => ({
        id_layanan: s.id_layanan,
        nama_layanan: s.nama_layanan,
        kategori: s.kategori,
        satuan: s.satuan,
        harga_per_satuan: s.harga_per_satuan,
        estimasi_hari: s.estimasi_hari,
        is_active: s.is_active,
    }));
}
/**
 * Get service by ID from database
 */
async function getServiceByIdFromDB(id_layanan) {
    const service = await prisma_js_1.prisma.serviceTariff.findUnique({
        where: { id_layanan },
    });
    if (!service)
        return null;
    return {
        id_layanan: service.id_layanan,
        nama_layanan: service.nama_layanan,
        kategori: service.kategori,
        satuan: service.satuan,
        harga_per_satuan: service.harga_per_satuan,
        estimasi_hari: service.estimasi_hari,
        is_active: service.is_active,
    };
}
/**
 * Get active services - sync version for simple routes
 */
function getActiveServices() {
    // Default services if DB not available
    return DEFAULT_SERVICES;
}
/**
 * Get service by ID - sync version
 */
function getServiceById(id_layanan) {
    return DEFAULT_SERVICES.find((s) => s.id_layanan === id_layanan);
}
/**
 * Calculate total price
 */
function calculateTotalHarga(id_layanan, qty) {
    const service = getServiceById(id_layanan);
    if (!service)
        return 0;
    return qty * service.harga_per_satuan;
}
/**
 * Format service option for display
 */
function formatServiceOption(service) {
    return `${service.nama_layanan} (${service.estimasi_hari} Hari) - Rp${service.harga_per_satuan.toLocaleString('id-ID')} / ${service.satuan}`;
}
// Default services (fallback)
const DEFAULT_SERVICES = [
    {
        id_layanan: 'SRV-001',
        nama_layanan: 'Cuci Kering Setrika Reguler',
        kategori: 'kiloan',
        satuan: 'kg',
        harga_per_satuan: 8000,
        estimasi_hari: 2,
        is_active: true,
    },
    {
        id_layanan: 'SRV-002',
        nama_layanan: 'Cuci Kering Setrika Ekspres',
        kategori: 'kiloan',
        satuan: 'kg',
        harga_per_satuan: 12000,
        estimasi_hari: 1,
        is_active: true,
    },
    {
        id_layanan: 'SRV-003',
        nama_layanan: 'Bedcover Reguler',
        kategori: 'bedcover',
        satuan: 'pcs',
        harga_per_satuan: 25000,
        estimasi_hari: 3,
        is_active: true,
    },
    {
        id_layanan: 'SRV-004',
        nama_layanan: 'Bedcover Ekspres',
        kategori: 'bedcover',
        satuan: 'pcs',
        harga_per_satuan: 35000,
        estimasi_hari: 1,
        is_active: true,
    },
    {
        id_layanan: 'SRV-005',
        nama_layanan: 'Setrika Only',
        kategori: 'satuan',
        satuan: 'kg',
        harga_per_satuan: 4000,
        estimasi_hari: 1,
        is_active: true,
    },
    {
        id_layanan: 'SRV-006',
        nama_layanan: 'Cuci Only',
        kategori: 'satuan',
        satuan: 'kg',
        harga_per_satuan: 5000,
        estimasi_hari: 1,
        is_active: true,
    },
];
/**
 * Seed default services to database (for initial setup)
 */
async function seedDefaultServices() {
    for (const service of DEFAULT_SERVICES) {
        await prisma_js_1.prisma.serviceTariff.upsert({
            where: { id_layanan: service.id_layanan },
            update: {},
            create: {
                id_layanan: service.id_layanan,
                nama_layanan: service.nama_layanan,
                kategori: service.kategori,
                satuan: service.satuan,
                harga_per_satuan: service.harga_per_satuan,
                estimasi_hari: service.estimasi_hari,
                is_active: service.is_active,
            },
        });
    }
    console.log('[Services] Default services seeded');
}
//# sourceMappingURL=services.js.map