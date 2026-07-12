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
const prisma_js_1 = require("../lib/prisma.js");
// ==========================================
// RECONCILIATION CRUD OPERATIONS
// ==========================================
/**
 * Create new reconciliation log
 */
async function createReconciliation(params) {
    const id_rekonsiliasi = `REC-${Date.now().toString(36).toUpperCase()}`;
    const selisih = params.kas_fisik - params.kas_digital;
    const log = await prisma_js_1.prisma.reconciliationLog.create({
        data: {
            id_rekonsiliasi,
            id_cabang: params.id_cabang,
            kas_digital: params.kas_digital,
            kas_fisik: params.kas_fisik,
            selisih,
            status: selisih === 0 ? 'Cocok' : 'Selisih',
            approval_status: 'Pending',
            catatan: params.catatan,
        },
    });
    return {
        id_rekonsiliasi: log.id_rekonsiliasi,
        id_cabang: log.id_cabang,
        tanggal: log.tanggal,
        kas_digital: log.kas_digital,
        kas_fisik: log.kas_fisik,
        selisih: log.selisih,
        status: log.status,
        approval_status: log.approval_status,
        catatan: log.catatan ?? undefined,
        catatan_owner: log.catatan_owner ?? undefined,
        created_at: log.created_at,
    };
}
/**
 * Get reconciliation logs by branch
 */
async function getReconciliationByBranch(id_cabang) {
    const logs = await prisma_js_1.prisma.reconciliationLog.findMany({
        where: { id_cabang },
        orderBy: { tanggal: 'desc' },
    });
    return logs.map((log) => ({
        id_rekonsiliasi: log.id_rekonsiliasi,
        id_cabang: log.id_cabang,
        tanggal: log.tanggal,
        kas_digital: log.kas_digital,
        kas_fisik: log.kas_fisik,
        selisih: log.selisih,
        status: log.status,
        approval_status: log.approval_status,
        catatan: log.catatan ?? undefined,
        catatan_owner: log.catatan_owner ?? undefined,
        created_at: log.created_at,
    }));
}
/**
 * Get all reconciliations
 */
async function getAllReconciliations() {
    const logs = await prisma_js_1.prisma.reconciliationLog.findMany({
        orderBy: { tanggal: 'desc' },
    });
    return logs.map((log) => ({
        id_rekonsiliasi: log.id_rekonsiliasi,
        id_cabang: log.id_cabang,
        tanggal: log.tanggal,
        kas_digital: log.kas_digital,
        kas_fisik: log.kas_fisik,
        selisih: log.selisih,
        status: log.status,
        approval_status: log.approval_status,
        catatan: log.catatan ?? undefined,
        catatan_owner: log.catatan_owner ?? undefined,
        created_at: log.created_at,
    }));
}
/**
 * Get latest reconciliation for a branch
 */
async function getLatestReconciliation(id_cabang) {
    const log = await prisma_js_1.prisma.reconciliationLog.findFirst({
        where: { id_cabang },
        orderBy: { tanggal: 'desc' },
    });
    if (!log)
        return null;
    return {
        id_rekonsiliasi: log.id_rekonsiliasi,
        id_cabang: log.id_cabang,
        tanggal: log.tanggal,
        kas_digital: log.kas_digital,
        kas_fisik: log.kas_fisik,
        selisih: log.selisih,
        status: log.status,
        approval_status: log.approval_status,
        catatan: log.catatan ?? undefined,
        catatan_owner: log.catatan_owner ?? undefined,
        created_at: log.created_at,
    };
}
/**
 * Get reconciliation by ID
 */
async function getReconciliationById(id_rekonsiliasi) {
    const log = await prisma_js_1.prisma.reconciliationLog.findUnique({
        where: { id_rekonsiliasi },
    });
    if (!log)
        return null;
    return {
        id_rekonsiliasi: log.id_rekonsiliasi,
        id_cabang: log.id_cabang,
        tanggal: log.tanggal,
        kas_digital: log.kas_digital,
        kas_fisik: log.kas_fisik,
        selisih: log.selisih,
        status: log.status,
        approval_status: log.approval_status,
        catatan: log.catatan ?? undefined,
        catatan_owner: log.catatan_owner ?? undefined,
        created_at: log.created_at,
    };
}
/**
 * Approve reconciliation
 */
async function approveReconciliation(id_rekonsiliasi, catatan_owner) {
    try {
        const log = await prisma_js_1.prisma.reconciliationLog.update({
            where: { id_rekonsiliasi },
            data: {
                approval_status: 'Disetujui',
                catatan_owner,
            },
        });
        return {
            id_rekonsiliasi: log.id_rekonsiliasi,
            id_cabang: log.id_cabang,
            tanggal: log.tanggal,
            kas_digital: log.kas_digital,
            kas_fisik: log.kas_fisik,
            selisih: log.selisih,
            status: log.status,
            approval_status: log.approval_status,
            catatan: log.catatan ?? undefined,
            catatan_owner: log.catatan_owner ?? undefined,
            created_at: log.created_at,
        };
    }
    catch {
        return null;
    }
}
/**
 * Reject reconciliation
 */
async function rejectReconciliation(id_rekonsiliasi, catatan_owner) {
    try {
        const log = await prisma_js_1.prisma.reconciliationLog.update({
            where: { id_rekonsiliasi },
            data: {
                approval_status: 'Ditolak',
                catatan_owner,
            },
        });
        return {
            id_rekonsiliasi: log.id_rekonsiliasi,
            id_cabang: log.id_cabang,
            tanggal: log.tanggal,
            kas_digital: log.kas_digital,
            kas_fisik: log.kas_fisik,
            selisih: log.selisih,
            status: log.status,
            approval_status: log.approval_status,
            catatan: log.catatan ?? undefined,
            catatan_owner: log.catatan_owner ?? undefined,
            created_at: log.created_at,
        };
    }
    catch {
        return null;
    }
}
/**
 * Override reconciliation (adjust values)
 */
async function overrideReconciliation(id_rekonsiliasi, new_kas_fisik, catatan_owner) {
    try {
        const existing = await prisma_js_1.prisma.reconciliationLog.findUnique({
            where: { id_rekonsiliasi },
        });
        if (!existing)
            return null;
        const selisih = new_kas_fisik - existing.kas_digital;
        const log = await prisma_js_1.prisma.reconciliationLog.update({
            where: { id_rekonsiliasi },
            data: {
                kas_fisik: new_kas_fisik,
                selisih,
                status: selisih === 0 ? 'Cocok' : 'Selisih',
                approval_status: 'Pending',
                catatan_owner: catatan_owner ?? existing.catatan_owner ?? undefined,
            },
        });
        return {
            id_rekonsiliasi: log.id_rekonsiliasi,
            id_cabang: log.id_cabang,
            tanggal: log.tanggal,
            kas_digital: log.kas_digital,
            kas_fisik: log.kas_fisik,
            selisih: log.selisih,
            status: log.status,
            approval_status: log.approval_status,
            catatan: log.catatan ?? undefined,
            catatan_owner: log.catatan_owner ?? undefined,
            created_at: log.created_at,
        };
    }
    catch {
        return null;
    }
}
//# sourceMappingURL=reconciliation.js.map