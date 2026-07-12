"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MACRO_FINANCIALS = void 0;
exports.getOrCreateBudget = getOrCreateBudget;
exports.getBudget = getBudget;
exports.getSisaPagu = getSisaPagu;
exports.deductBudget = deductBudget;
exports.checkOverbudget = checkOverbudget;
exports.getAllBudgets = getAllBudgets;
exports.updateBudgetPagu = updateBudgetPagu;
const prisma_js_1 = require("../lib/prisma.js");
// Re-export MACRO_FINANCIALS from branches for compatibility
var branches_js_1 = require("../config/branches.js");
Object.defineProperty(exports, "MACRO_FINANCIALS", { enumerable: true, get: function () { return branches_js_1.MACRO_FINANCIALS; } });
/**
 * Get current month name in Indonesian
 */
function getCurrentMonth() {
    return new Date().toLocaleDateString('id-ID', { month: 'long' });
}
/**
 * Get or create budget for a branch in a specific month/year
 */
async function getOrCreateBudget(id_cabang, bulan, tahun) {
    const targetBulan = bulan ?? getCurrentMonth();
    const targetTahun = tahun ?? new Date().getFullYear();
    let budget = await prisma_js_1.prisma.monthlyBudget.findUnique({
        where: {
            id_cabang_bulan_tahun: {
                id_cabang,
                bulan: targetBulan,
                tahun: targetTahun,
            },
        },
    });
    // If no budget exists for this month, create default budget
    if (!budget) {
        const DEFAULT_PAGU = 5000000; // Default Rp 5.000.000 per bulan
        budget = await prisma_js_1.prisma.monthlyBudget.create({
            data: {
                id_cabang,
                bulan: targetBulan,
                tahun: targetTahun,
                pagu_anggaran: DEFAULT_PAGU,
                terpakai: 0,
            },
        });
    }
    return {
        id: budget.id,
        id_cabang: budget.id_cabang,
        bulan: budget.bulan,
        tahun: budget.tahun,
        pagu_anggaran: budget.pagu_anggaran,
        terpakai: budget.terpakai,
    };
}
/**
 * Get budget for a branch (legacy sync signature for compatibility)
 */
async function getBudget(id_cabang, bulan, tahun) {
    return getOrCreateBudget(id_cabang, bulan, tahun);
}
/**
 * Get remaining budget (sisa pagu)
 */
async function getSisaPagu(id_cabang) {
    const budget = await getOrCreateBudget(id_cabang);
    if (!budget)
        return 0;
    return budget.pagu_anggaran - budget.terpakai;
}
/**
 * Deduct from budget when expense is approved
 */
async function deductBudget(id_cabang, nominal) {
    const budget = await getOrCreateBudget(id_cabang);
    if (!budget)
        return false;
    const sisa = budget.pagu_anggaran - budget.terpakai;
    if (nominal > sisa)
        return false;
    // Update terpakai in database
    await prisma_js_1.prisma.monthlyBudget.update({
        where: {
            id_cabang_bulan_tahun: {
                id_cabang,
                bulan: budget.bulan,
                tahun: budget.tahun,
            },
        },
        data: {
            terpakai: {
                increment: nominal,
            },
        },
    });
    return true;
}
/**
 * Check if expense would exceed budget
 */
async function checkOverbudget(id_cabang, nominal) {
    const budget = await getOrCreateBudget(id_cabang);
    if (!budget) {
        return {
            overbudget: true,
            sisa_pagu: 0,
            pagu_anggaran: 0,
            terpakai: 0,
            requested: nominal,
            projected_total: nominal,
        };
    }
    const sisa_pagu = budget.pagu_anggaran - budget.terpakai;
    const projected_total = budget.terpakai + nominal;
    return {
        overbudget: nominal > sisa_pagu,
        sisa_pagu,
        pagu_anggaran: budget.pagu_anggaran,
        terpakai: budget.terpakai,
        requested: nominal,
        projected_total,
    };
}
/**
 * Get all budgets (for admin purposes)
 */
async function getAllBudgets() {
    const budgets = await prisma_js_1.prisma.monthlyBudget.findMany({
        orderBy: [
            { tahun: 'desc' },
            { bulan: 'desc' },
            { id_cabang: 'asc' },
        ],
    });
    return budgets.map((b) => ({
        id: b.id,
        id_cabang: b.id_cabang,
        bulan: b.bulan,
        tahun: b.tahun,
        pagu_anggaran: b.pagu_anggaran,
        terpakai: b.terpakai,
    }));
}
/**
 * Update budget pagu (for owner to adjust)
 */
async function updateBudgetPagu(id_cabang, pagu_anggaran, bulan, tahun) {
    const targetBulan = bulan ?? getCurrentMonth();
    const targetTahun = tahun ?? new Date().getFullYear();
    const budget = await prisma_js_1.prisma.monthlyBudget.upsert({
        where: {
            id_cabang_bulan_tahun: {
                id_cabang,
                bulan: targetBulan,
                tahun: targetTahun,
            },
        },
        update: {
            pagu_anggaran,
        },
        create: {
            id_cabang,
            bulan: targetBulan,
            tahun: targetTahun,
            pagu_anggaran,
            terpakai: 0,
        },
    });
    return {
        id: budget.id,
        id_cabang: budget.id_cabang,
        bulan: budget.bulan,
        tahun: budget.tahun,
        pagu_anggaran: budget.pagu_anggaran,
        terpakai: budget.terpakai,
    };
}
//# sourceMappingURL=budget.js.map