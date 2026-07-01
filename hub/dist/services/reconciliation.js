"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createReconciliation = createReconciliation;
exports.getReconciliationByBranch = getReconciliationByBranch;
exports.getAllReconciliations = getAllReconciliations;
exports.getLatestReconciliation = getLatestReconciliation;
const RECONCILIATION_LOGS = [];
function createReconciliation(params) {
    const selisih = params.kas_fisik - params.kas_digital;
    const log = {
        id_rekonsiliasi: `REC-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
        id_cabang: params.id_cabang,
        tanggal: new Date(),
        kas_digital: params.kas_digital,
        kas_fisik: params.kas_fisik,
        selisih,
        status: selisih === 0 ? 'Cocok' : 'Selisih',
        catatan: params.catatan,
        created_at: new Date(),
    };
    RECONCILIATION_LOGS.push(log);
    return log;
}
function getReconciliationByBranch(id_cabang) {
    return RECONCILIATION_LOGS.filter((log) => log.id_cabang === id_cabang);
}
function getAllReconciliations() {
    return [...RECONCILIATION_LOGS];
}
function getLatestReconciliation(id_cabang) {
    const logs = getReconciliationByBranch(id_cabang);
    return logs.length > 0 ? logs[logs.length - 1] : undefined;
}
//# sourceMappingURL=reconciliation.js.map