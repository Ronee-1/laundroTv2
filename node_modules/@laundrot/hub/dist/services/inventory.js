"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SAFETY_THRESHOLDS = void 0;
exports.getInventoryByBranch = getInventoryByBranch;
exports.getAllInventory = getAllInventory;
exports.getInventoryStatus = getInventoryStatus;
exports.restockInventory = restockInventory;
exports.adjustInventory = adjustInventory;
exports.getAnomalies = getAnomalies;
exports.initializeBranchInventory = initializeBranchInventory;
const prisma_js_1 = require("../lib/prisma.js");
const branches_js_1 = require("../config/branches.js");
function determineStatus(stok, threshold) {
    if (stok <= 0)
        return 'Kritis';
    if (stok < threshold * 0.5)
        return 'Kritis';
    if (stok <= threshold)
        return 'Menipis';
    return 'Aman';
}
// Safety Stock Thresholds per PRD:
exports.SAFETY_THRESHOLDS = {
    detergen: 50,
    pelembut: 50,
    plastik: 100,
};
// ==========================================
// INVENTORY CRUD OPERATIONS
// ==========================================
/**
 * Get inventory by branch
 */
async function getInventoryByBranch(id_cabang) {
    const items = await prisma_js_1.prisma.inventoryItem.findMany({
        where: { id_cabang },
    });
    if (items.length === 0)
        return null;
    const stocks = items.map((item) => ({
        item: item.item,
        satuan: item.satuan,
        stok_saat_ini: item.stok_saat_ini,
        safety_threshold: item.safety_threshold,
        max_capacity: item.max_capacity,
        status: determineStatus(item.stok_saat_ini, item.safety_threshold),
    }));
    return {
        id_cabang,
        stocks,
        last_updated: new Date(),
    };
}
/**
 * Get all inventory across all branches
 */
async function getAllInventory() {
    const items = await prisma_js_1.prisma.inventoryItem.findMany({
        orderBy: [
            { id_cabang: 'asc' },
            { item: 'asc' },
        ],
    });
    // Group by branch
    const grouped = new Map();
    for (const item of items) {
        const entry = {
            item: item.item,
            satuan: item.satuan,
            stok_saat_ini: item.stok_saat_ini,
            safety_threshold: item.safety_threshold,
            max_capacity: item.max_capacity,
            status: determineStatus(item.stok_saat_ini, item.safety_threshold),
        };
        if (!grouped.has(item.id_cabang)) {
            grouped.set(item.id_cabang, []);
        }
        grouped.get(item.id_cabang).push(entry);
    }
    const inventories = [];
    for (const [id_cabang, stocks] of grouped) {
        inventories.push({
            id_cabang,
            stocks,
            last_updated: new Date(),
        });
    }
    return inventories;
}
/**
 * Get inventory status for a branch
 */
async function getInventoryStatus(id_cabang) {
    const inventory = await getInventoryByBranch(id_cabang);
    if (!inventory)
        return 'Kritis';
    const hasKritis = inventory.stocks.some((s) => s.status === 'Kritis');
    if (hasKritis)
        return 'Kritis';
    const hasMenipis = inventory.stocks.some((s) => s.status === 'Menipis');
    if (hasMenipis)
        return 'Menipis';
    return 'Aman';
}
/**
 * Restock inventory items for a branch
 */
async function restockInventory(id_cabang, additions) {
    const itemMap = {
        'Detergen': additions.detergen,
        'Pelembut': additions.pelembut,
        'Plastik': additions.plastik,
    };
    // Update each item
    for (const [itemName, addAmount] of Object.entries(itemMap)) {
        if (!addAmount || addAmount <= 0)
            continue;
        const current = await prisma_js_1.prisma.inventoryItem.findUnique({
            where: {
                id_cabang_item: {
                    id_cabang,
                    item: itemName,
                },
            },
        });
        if (current) {
            const newStok = Math.min(current.stok_saat_ini + addAmount, current.max_capacity);
            await prisma_js_1.prisma.inventoryItem.update({
                where: {
                    id_cabang_item: {
                        id_cabang,
                        item: itemName,
                    },
                },
                data: { stok_saat_ini: newStok },
            });
        }
    }
    return getInventoryByBranch(id_cabang);
}
/**
 * Adjust inventory manually (with anomaly logging)
 */
async function adjustInventory(id_cabang, adjustments) {
    const current = await prisma_js_1.prisma.inventoryItem.findUnique({
        where: {
            id_cabang_item: {
                id_cabang,
                item: adjustments.item,
            },
        },
    });
    if (!current)
        return null;
    const stok_lama = current.stok_saat_ini;
    // Update inventory
    await prisma_js_1.prisma.inventoryItem.update({
        where: {
            id_cabang_item: {
                id_cabang,
                item: adjustments.item,
            },
        },
        data: { stok_saat_ini: adjustments.stok_baru },
    });
    // Log anomaly
    const branch = await (0, branches_js_1.getBranchById)(id_cabang);
    const nama_cabang = branch?.nama_cabang ?? id_cabang;
    await prisma_js_1.prisma.inventoryAnomaly.create({
        data: {
            id_cabang,
            nama_cabang,
            item: adjustments.item,
            stok_lama,
            stok_baru: adjustments.stok_baru,
            alasan: adjustments.alasan,
        },
    });
    return getInventoryByBranch(id_cabang);
}
/**
 * Get all inventory anomalies
 */
async function getAnomalies() {
    const anomalies = await prisma_js_1.prisma.inventoryAnomaly.findMany({
        orderBy: { timestamp: 'desc' },
        take: 100, // Limit to recent 100
    });
    return anomalies.map((a) => ({
        id: a.id,
        id_cabang: a.id_cabang,
        nama_cabang: a.nama_cabang,
        item: a.item,
        stok_lama: a.stok_lama,
        stok_baru: a.stok_baru,
        alasan: a.alasan,
        timestamp: a.timestamp.toISOString(),
    }));
}
/**
 * Initialize inventory for a new branch
 */
async function initializeBranchInventory(id_cabang) {
    const defaultItems = [
        { item: 'Detergen', satuan: 'pcs', stok: 50, threshold: 50, capacity: 100 },
        { item: 'Pelembut', satuan: 'pcs', stok: 50, threshold: 50, capacity: 80 },
        { item: 'Plastik', satuan: 'pcs', stok: 100, threshold: 100, capacity: 200 },
    ];
    for (const item of defaultItems) {
        await prisma_js_1.prisma.inventoryItem.upsert({
            where: {
                id_cabang_item: {
                    id_cabang,
                    item: item.item,
                },
            },
            update: {},
            create: {
                id_cabang,
                item: item.item,
                satuan: item.satuan,
                stok_saat_ini: item.stok,
                safety_threshold: item.threshold,
                max_capacity: item.capacity,
            },
        });
    }
}
//# sourceMappingURL=inventory.js.map