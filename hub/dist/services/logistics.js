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
const inventory_js_1 = require("./inventory.js");
const LOGISTICS = [];
let nextId = 1;
function generateId() {
    return `LOG-${String(nextId++).padStart(4, '0')}`;
}
function createShipment(branchId, sentItems) {
    const log = {
        id: generateId(),
        branchId,
        sentItems,
        receivedItems: null,
        discrepancy: null,
        status: 'In-Transit',
        timestamp: new Date(),
    };
    LOGISTICS.push(log);
    return log;
}
function verifyShipment(logId, receivedItems) {
    const log = LOGISTICS.find((l) => l.id === logId);
    if (!log || (log.status !== 'Awaiting-Verification' && log.status !== 'In-Transit'))
        return null;
    log.receivedItems = receivedItems;
    const discrepancy = {
        detergen: receivedItems.detergen - log.sentItems.detergen,
        pelembut: receivedItems.pelembut - log.sentItems.pelembut,
        plastik: receivedItems.plastik - log.sentItems.plastik,
    };
    const hasDiscrepancy = discrepancy.detergen !== 0 || discrepancy.pelembut !== 0 || discrepancy.plastik !== 0;
    log.discrepancy = hasDiscrepancy ? discrepancy : null;
    log.status = hasDiscrepancy ? 'Completed-Discrepancy' : 'Completed';
    return log;
}
function getLogisticsByBranch(branchId) {
    return LOGISTICS.filter((l) => l.branchId === branchId);
}
function getInTransitByBranch(branchId) {
    return LOGISTICS.filter((l) => l.branchId === branchId && l.status === 'In-Transit');
}
function getActiveShipments() {
    return LOGISTICS.filter((l) => l.status === 'In-Transit' || l.status === 'Driver-En-Route' || l.status === 'Awaiting-Verification');
}
function getActiveShipmentsByBranch(branchId) {
    return LOGISTICS.filter((l) => l.branchId === branchId &&
        (l.status === 'In-Transit' || l.status === 'Driver-En-Route' || l.status === 'Awaiting-Verification'));
}
function startRoute(logId) {
    const log = LOGISTICS.find((l) => l.id === logId);
    if (!log || log.status !== 'In-Transit')
        return null;
    log.status = 'Driver-En-Route';
    return log;
}
function handoverShipment(logId) {
    const log = LOGISTICS.find((l) => l.id === logId);
    if (!log || log.status !== 'Driver-En-Route')
        return null;
    log.status = 'Awaiting-Verification';
    return log;
}
function getAllLogistics() {
    return [...LOGISTICS];
}
function getLogisticsById(logId) {
    return LOGISTICS.find((l) => l.id === logId);
}
function getReplenishmentRecommendation(branchId) {
    const inventory = (0, inventory_js_1.getInventoryByBranch)(branchId);
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