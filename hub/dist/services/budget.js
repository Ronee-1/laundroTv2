"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MACRO_FINANCIALS = void 0;
exports.getBudget = getBudget;
exports.getSisaPagu = getSisaPagu;
exports.deductBudget = deductBudget;
exports.checkOverbudget = checkOverbudget;
const branches_js_1 = require("../config/branches.js");
Object.defineProperty(exports, "MACRO_FINANCIALS", { enumerable: true, get: function () { return branches_js_1.MACRO_FINANCIALS; } });
const BUDGETS = [
    {
        id_cabang: 'CBG-001',
        bulan: 'Juli',
        tahun: 2026,
        pagu_anggaran: 5000000,
        terpakai: 350000,
    },
    {
        id_cabang: 'CBG-002',
        bulan: 'Juli',
        tahun: 2026,
        pagu_anggaran: 5000000,
        terpakai: 2300000,
    },
    {
        id_cabang: 'CBG-003',
        bulan: 'Juli',
        tahun: 2026,
        pagu_anggaran: 4000000,
        terpakai: 1200000,
    },
    {
        id_cabang: 'CBG-004',
        bulan: 'Juli',
        tahun: 2026,
        pagu_anggaran: 4500000,
        terpakai: 2800000,
    },
    {
        id_cabang: 'CBG-005',
        bulan: 'Juli',
        tahun: 2026,
        pagu_anggaran: 4000000,
        terpakai: 3850000, // Near limit - 96.25% utilized
    },
];
function getBudget(id_cabang, bulan, tahun) {
    const now = new Date();
    const targetBulan = bulan ?? now.toLocaleDateString('id-ID', { month: 'long' });
    const targetTahun = tahun ?? now.getFullYear();
    return BUDGETS.find((b) => b.id_cabang === id_cabang && b.bulan === targetBulan && b.tahun === targetTahun);
}
function getSisaPagu(id_cabang) {
    const budget = getBudget(id_cabang);
    if (!budget)
        return 0;
    return budget.pagu_anggaran - budget.terpakai;
}
function deductBudget(id_cabang, nominal) {
    const budget = getBudget(id_cabang);
    if (!budget)
        return false;
    const sisa = budget.pagu_anggaran - budget.terpakai;
    if (nominal > sisa)
        return false;
    budget.terpakai += nominal;
    return true;
}
function checkOverbudget(id_cabang, nominal) {
    const budget = getBudget(id_cabang);
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
//# sourceMappingURL=budget.js.map