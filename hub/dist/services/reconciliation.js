"use strict";
// ==========================================
// RECONCILIATION SERVICE - FR-FIN-09 Core Implementation
// Audit & Rekonsiliasi Kas - formulir input kas fisik vs kas digital harian
// Sistem menghitung selisih (discrepancy) dan menyimpan log audit
// Mendukung indikator sukses: Selisih kas = Rp0
// ==========================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.createReconciliation = createReconciliation;
exports.getReconciliationByBranch = getReconciliationByBranch;
exports.getAllReconciliations = getAllReconciliations;
exports.getLatestReconciliation = getLatestReconciliation;
exports.getReconciliationById = getReconciliationById;
exports.approveReconciliation = approveReconciliation;
exports.rejectReconciliation = rejectReconciliation;
exports.overrideReconciliation = overrideReconciliation;
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
        approval_status: 'Pending',
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
function getReconciliationById(id_rekonsiliasi) {
    return RECONCILIATION_LOGS.find((log) => log.id_rekonsiliasi === id_rekonsiliasi);
}
function approveReconciliation(id_rekonsiliasi, catatan_owner) {
    const log = getReconciliationById(id_rekonsiliasi);
    if (!log || log.approval_status !== 'Pending')
        return null;
    log.approval_status = 'Disetujui';
    log.catatan_owner = catatan_owner;
    return log;
}
function rejectReconciliation(id_rekonsiliasi, catatan_owner) {
    const log = getReconciliationById(id_rekonsiliasi);
    if (!log || log.approval_status !== 'Pending')
        return null;
    log.approval_status = 'Ditolak';
    log.catatan_owner = catatan_owner;
    return log;
}
function overrideReconciliation(id_rekonsiliasi, new_kas_fisik, catatan_owner) {
    const log = getReconciliationById(id_rekonsiliasi);
    if (!log)
        return null;
    log.kas_fisik = new_kas_fisik;
    log.selisih = new_kas_fisik - log.kas_digital;
    log.status = log.selisih === 0 ? 'Cocok' : 'Selisih';
    log.approval_status = 'Pending';
    log.catatan_owner = catatan_owner ?? log.catatan_owner;
    return log;
}
//# sourceMappingURL=reconciliation.js.map