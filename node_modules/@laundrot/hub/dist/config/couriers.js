"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCourierByIdFromDB = getCourierByIdFromDB;
exports.getCouriersByBranchFromDB = getCouriersByBranchFromDB;
exports.getAllCouriersFromDB = getAllCouriersFromDB;
exports.updateCourierAvailability = updateCourierAvailability;
exports.getCourierById = getCourierById;
exports.getCouriersByBranch = getCouriersByBranch;
exports.seedDefaultCouriers = seedDefaultCouriers;
const prisma_js_1 = require("../lib/prisma.js");
// ==========================================
// COURIERS CONFIG - FR-LOG-02, FR-LOG-03 Integration
// Branch admin assigns orders to couriers
// Courier views tasks in mobile app (TugasHarian)
// ==========================================
// Default couriers (fallback)
const DEFAULT_COURIERS = [
    {
        id_kurir: 'KUR-001',
        id_cabang: 'CBG-001',
        nama_kurir: 'Budi Santoso',
        nomor_telepon: '+6281234567890',
        is_available: true,
        created_at: new Date('2024-01-01'),
        updated_at: new Date('2024-01-01'),
    },
    {
        id_kurir: 'KUR-002',
        id_cabang: 'CBG-001',
        nama_kurir: 'Agus Wijaya',
        nomor_telepon: '+6281234567891',
        is_available: true,
        created_at: new Date('2024-01-01'),
        updated_at: new Date('2024-01-01'),
    },
    {
        id_kurir: 'KUR-003',
        id_cabang: 'CBG-002',
        nama_kurir: 'Dedi Kurniawan',
        nomor_telepon: '+6281234567892',
        is_available: true,
        created_at: new Date('2024-01-01'),
        updated_at: new Date('2024-01-01'),
    },
    {
        id_kurir: 'KUR-004',
        id_cabang: 'CBG-003',
        nama_kurir: 'Rina Susanti',
        nomor_telepon: '+6281234567893',
        is_available: true,
        created_at: new Date('2024-01-01'),
        updated_at: new Date('2024-01-01'),
    },
    {
        id_kurir: 'KUR-005',
        id_cabang: 'CBG-004',
        nama_kurir: 'Eko Prasetyo',
        nomor_telepon: '+6281234567894',
        is_available: true,
        created_at: new Date('2024-01-01'),
        updated_at: new Date('2024-01-01'),
    },
];
// ==========================================
// COURIER CRUD OPERATIONS
// ==========================================
/**
 * Get courier by ID from database
 */
async function getCourierByIdFromDB(id_kurir) {
    const courier = await prisma_js_1.prisma.courier.findUnique({
        where: { id_kurir },
    });
    if (!courier)
        return null;
    return {
        id_kurir: courier.id_kurir,
        id_cabang: courier.id_cabang,
        nama_kurir: courier.nama_kurir,
        nomor_telepon: courier.nomor_telepon,
        is_available: courier.is_available,
        created_at: courier.created_at,
        updated_at: courier.updated_at,
    };
}
/**
 * Get all couriers for a branch from database
 */
async function getCouriersByBranchFromDB(id_cabang) {
    const couriers = await prisma_js_1.prisma.courier.findMany({
        where: { id_cabang },
        orderBy: { nama_kurir: 'asc' },
    });
    return couriers.map((c) => ({
        id_kurir: c.id_kurir,
        id_cabang: c.id_cabang,
        nama_kurir: c.nama_kurir,
        nomor_telepon: c.nomor_telepon,
        is_available: c.is_available,
        created_at: c.created_at,
        updated_at: c.updated_at,
    }));
}
/**
 * Get all couriers from database
 */
async function getAllCouriersFromDB() {
    const couriers = await prisma_js_1.prisma.courier.findMany({
        orderBy: [
            { id_cabang: 'asc' },
            { nama_kurir: 'asc' },
        ],
    });
    return couriers.map((c) => ({
        id_kurir: c.id_kurir,
        id_cabang: c.id_cabang,
        nama_kurir: c.nama_kurir,
        nomor_telepon: c.nomor_telepon,
        is_available: c.is_available,
        created_at: c.created_at,
        updated_at: c.updated_at,
    }));
}
/**
 * Update courier availability
 */
async function updateCourierAvailability(id_kurir, is_available) {
    try {
        const courier = await prisma_js_1.prisma.courier.update({
            where: { id_kurir },
            data: { is_available },
        });
        return {
            id_kurir: courier.id_kurir,
            id_cabang: courier.id_cabang,
            nama_kurir: courier.nama_kurir,
            nomor_telepon: courier.nomor_telepon,
            is_available: courier.is_available,
            created_at: courier.created_at,
            updated_at: courier.updated_at,
        };
    }
    catch {
        return null;
    }
}
// ==========================================
// SYNC FUNCTIONS (for backward compatibility) - Now using database
// ==========================================
/**
 * Get courier by ID - uses database
 */
async function getCourierById(id_kurir) {
    try {
        const courier = await prisma_js_1.prisma.courier.findUnique({
            where: { id_kurir },
        });
        if (!courier)
            return null;
        return {
            id_kurir: courier.id_kurir,
            id_cabang: courier.id_cabang,
            nama_kurir: courier.nama_kurir,
            nomor_telepon: courier.nomor_telepon,
            is_available: courier.is_available,
            created_at: courier.created_at,
            updated_at: courier.updated_at,
        };
    }
    catch (error) {
        console.error(`[Couriers] Error getting courier ${id_kurir}:`, error);
        // Fallback to in-memory
        return DEFAULT_COURIERS.find((c) => c.id_kurir === id_kurir) ?? null;
    }
}
/**
 * Get all couriers for a specific branch - uses database
 */
async function getCouriersByBranch(id_cabang) {
    try {
        const couriers = await prisma_js_1.prisma.courier.findMany({
            where: { id_cabang },
            orderBy: { nama_kurir: 'asc' },
        });
        return couriers.map((c) => ({
            id_kurir: c.id_kurir,
            id_cabang: c.id_cabang,
            nama_kurir: c.nama_kurir,
            nomor_telepon: c.nomor_telepon,
            is_available: c.is_available,
            created_at: c.created_at,
            updated_at: c.updated_at,
        }));
    }
    catch (error) {
        console.error(`[Couriers] Error getting couriers for branch ${id_cabang}:`, error);
        // Fallback to in-memory
        return DEFAULT_COURIERS.filter((c) => c.id_cabang === id_cabang);
    }
}
/**
 * Seed default couriers to database (for initial setup)
 */
async function seedDefaultCouriers() {
    for (const courier of DEFAULT_COURIERS) {
        await prisma_js_1.prisma.courier.upsert({
            where: { id_kurir: courier.id_kurir },
            update: {},
            create: {
                id_kurir: courier.id_kurir,
                id_cabang: courier.id_cabang,
                nama_kurir: courier.nama_kurir,
                nomor_telepon: courier.nomor_telepon,
                is_available: courier.is_available,
            },
        });
    }
    console.log('[Couriers] Default couriers seeded');
}
//# sourceMappingURL=couriers.js.map