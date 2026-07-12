"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createShipment = createShipment;
exports.verifyShipment = verifyShipment;
exports.getLogisticsByBranch = getLogisticsByBranch;
exports.getInTransitByBranch = getInTransitByBranch;
exports.getActiveShipments = getActiveShipments;
exports.getActiveShipmentsByBranch = getActiveShipmentsByBranch;
exports.startRoute = startRoute;
exports.handoverShipment = handoverShipment;
exports.getAllLogistics = getAllLogistics;
exports.getLogisticsById = getLogisticsById;
exports.getReplenishmentRecommendation = getReplenishmentRecommendation;
const prisma_js_1 = require("../lib/prisma.js");
const inventory_js_1 = require("./inventory.js");
// ==========================================
// LOGISTICS CRUD OPERATIONS
// ==========================================
/**
 * Create new shipment log
 */
async function createShipment(branchId, sentItems) {
    const id = `LOG-${Date.now().toString(36).toUpperCase()}`;
    const log = await prisma_js_1.prisma.logisticsLog.create({
        data: {
            id_cabang: branchId,
            sent_items: sentItems,
            status: 'In-Transit',
        },
    });
    return {
        id: log.id,
        branchId: log.id_cabang,
        sentItems: log.sent_items,
        receivedItems: null,
        discrepancy: null,
        status: log.status,
        timestamp: log.timestamp,
    };
}
/**
 * Verify shipment received
 */
async function verifyShipment(logId, receivedItems) {
    try {
        const log = await prisma_js_1.prisma.logisticsLog.findUnique({
            where: { id: logId },
        });
        if (!log || (log.status !== 'Awaiting-Verification' && log.status !== 'In-Transit')) {
            return null;
        }
        const discrepancy = {
            detergen: receivedItems.detergen - log.sent_items.detergen,
            pelembut: receivedItems.pelembut - log.sent_items.pelembut,
            plastik: receivedItems.plastik - log.sent_items.plastik,
        };
        const hasDiscrepancy = discrepancy.detergen !== 0 || discrepancy.pelembut !== 0 || discrepancy.plastik !== 0;
        const updated = await prisma_js_1.prisma.logisticsLog.update({
            where: { id: logId },
            data: {
                received_items: receivedItems,
                discrepancy: hasDiscrepancy ? discrepancy : undefined,
                status: hasDiscrepancy ? 'Completed-Discrepancy' : 'Completed',
            },
        });
        return {
            id: updated.id,
            branchId: updated.id_cabang,
            sentItems: updated.sent_items,
            receivedItems: updated.received_items,
            discrepancy: updated.discrepancy,
            status: updated.status,
            timestamp: updated.timestamp,
        };
    }
    catch {
        return null;
    }
}
/**
 * Get logistics by branch
 */
async function getLogisticsByBranch(branchId) {
    const logs = await prisma_js_1.prisma.logisticsLog.findMany({
        where: { id_cabang: branchId },
        orderBy: { timestamp: 'desc' },
    });
    return logs.map((log) => ({
        id: log.id,
        branchId: log.id_cabang,
        sentItems: log.sent_items,
        receivedItems: log.received_items,
        discrepancy: log.discrepancy,
        status: log.status,
        timestamp: log.timestamp,
    }));
}
/**
 * Get in-transit shipments for a branch
 */
async function getInTransitByBranch(branchId) {
    const logs = await prisma_js_1.prisma.logisticsLog.findMany({
        where: { id_cabang: branchId, status: 'In-Transit' },
        orderBy: { timestamp: 'desc' },
    });
    return logs.map((log) => ({
        id: log.id,
        branchId: log.id_cabang,
        sentItems: log.sent_items,
        receivedItems: log.received_items,
        discrepancy: log.discrepancy,
        status: log.status,
        timestamp: log.timestamp,
    }));
}
/**
 * Get all active shipments
 */
async function getActiveShipments() {
    const logs = await prisma_js_1.prisma.logisticsLog.findMany({
        where: {
            status: {
                in: ['In-Transit', 'Driver-En-Route', 'Awaiting-Verification'],
            },
        },
        orderBy: { timestamp: 'desc' },
    });
    return logs.map((log) => ({
        id: log.id,
        branchId: log.id_cabang,
        sentItems: log.sent_items,
        receivedItems: log.received_items,
        discrepancy: log.discrepancy,
        status: log.status,
        timestamp: log.timestamp,
    }));
}
/**
 * Get active shipments for a specific branch
 */
async function getActiveShipmentsByBranch(branchId) {
    const logs = await prisma_js_1.prisma.logisticsLog.findMany({
        where: {
            id_cabang: branchId,
            status: {
                in: ['In-Transit', 'Driver-En-Route', 'Awaiting-Verification'],
            },
        },
        orderBy: { timestamp: 'desc' },
    });
    return logs.map((log) => ({
        id: log.id,
        branchId: log.id_cabang,
        sentItems: log.sent_items,
        receivedItems: log.received_items,
        discrepancy: log.discrepancy,
        status: log.status,
        timestamp: log.timestamp,
    }));
}
/**
 * Start route (driver en route)
 */
async function startRoute(logId) {
    try {
        const log = await prisma_js_1.prisma.logisticsLog.findUnique({
            where: { id: logId },
        });
        if (!log || log.status !== 'In-Transit')
            return null;
        const updated = await prisma_js_1.prisma.logisticsLog.update({
            where: { id: logId },
            data: { status: 'Driver-En-Route' },
        });
        return {
            id: updated.id,
            branchId: updated.id_cabang,
            sentItems: updated.sent_items,
            receivedItems: null,
            discrepancy: null,
            status: updated.status,
            timestamp: updated.timestamp,
        };
    }
    catch {
        return null;
    }
}
/**
 * Handover shipment (awaiting verification)
 */
async function handoverShipment(logId) {
    try {
        const log = await prisma_js_1.prisma.logisticsLog.findUnique({
            where: { id: logId },
        });
        if (!log || log.status !== 'Driver-En-Route')
            return null;
        const updated = await prisma_js_1.prisma.logisticsLog.update({
            where: { id: logId },
            data: { status: 'Awaiting-Verification' },
        });
        return {
            id: updated.id,
            branchId: updated.id_cabang,
            sentItems: updated.sent_items,
            receivedItems: null,
            discrepancy: null,
            status: updated.status,
            timestamp: updated.timestamp,
        };
    }
    catch {
        return null;
    }
}
/**
 * Get all logistics
 */
async function getAllLogistics() {
    const logs = await prisma_js_1.prisma.logisticsLog.findMany({
        orderBy: { timestamp: 'desc' },
    });
    return logs.map((log) => ({
        id: log.id,
        branchId: log.id_cabang,
        sentItems: log.sent_items,
        receivedItems: log.received_items,
        discrepancy: log.discrepancy,
        status: log.status,
        timestamp: log.timestamp,
    }));
}
/**
 * Get logistics by ID
 */
async function getLogisticsById(logId) {
    const log = await prisma_js_1.prisma.logisticsLog.findUnique({
        where: { id: logId },
    });
    if (!log)
        return null;
    return {
        id: log.id,
        branchId: log.id_cabang,
        sentItems: log.sent_items,
        receivedItems: log.received_items,
        discrepancy: log.discrepancy,
        status: log.status,
        timestamp: log.timestamp,
    };
}
/**
 * Get replenishment recommendation for a branch
 */
async function getReplenishmentRecommendation(branchId) {
    const inventory = await (0, inventory_js_1.getInventoryByBranch)(branchId);
    if (!inventory) {
        return { branchId, items: [], needs_replenishment: false };
    }
    const items = inventory.stocks.map((s) => {
        const is_below_threshold = s.stok_saat_ini <= s.safety_threshold;
        const kebutuhan = Math.max(s.max_capacity - s.stok_saat_ini, 0);
        return {
            item: s.item,
            satuan: s.satuan,
            stok_saat_ini: s.stok_saat_ini,
            max_capacity: s.max_capacity,
            safety_threshold: s.safety_threshold,
            kebutuhan,
            is_below_threshold,
        };
    });
    const needs_replenishment = items.some((i) => i.is_below_threshold);
    return { branchId, items, needs_replenishment };
}
//# sourceMappingURL=logistics.js.map