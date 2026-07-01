"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_CATEGORIES = void 0;
exports.getCategories = getCategories;
exports.addCategory = addCategory;
exports.createExpense = createExpense;
exports.getExpenseById = getExpenseById;
exports.getExpensesByBranch = getExpensesByBranch;
exports.getApprovedExpensesByBranch = getApprovedExpensesByBranch;
exports.getTotalApprovedExpenses = getTotalApprovedExpenses;
exports.updateExpenseStatus = updateExpenseStatus;
exports.getAllExpenses = getAllExpenses;
exports.getExpensesByBranchAndCategory = getExpensesByBranchAndCategory;
exports.DEFAULT_CATEGORIES = [
    'BBM',
    'Sewa & Utilitas',
    'Gaji',
    'Belanja Darurat',
    'Pemeliharaan',
    'Lain-lain',
];
const customCategories = [];
function getCategories() {
    return [...exports.DEFAULT_CATEGORIES, ...customCategories];
}
function addCategory(name) {
    const all = getCategories();
    if (all.includes(name))
        return false;
    customCategories.push(name);
    return true;
}
const EXPENSES = [
    {
        id_expense: 'EXP-SEED-001',
        id_cabang: 'CBG-001',
        tanggal: new Date('2026-06-25'),
        nominal: 350000,
        deskripsi: 'Pengisian bensin truk rute lingkar luar Depok',
        kategori: 'BBM',
        bukti_nota_url: '',
        status: 'Approve',
        tanggal_pengajuan: new Date('2026-06-25'),
        tanggal_approval: new Date('2026-06-25'),
        created_at: new Date('2026-06-25'),
        updated_at: new Date('2026-06-25'),
    },
    {
        id_expense: 'EXP-SEED-002',
        id_cabang: 'CBG-002',
        tanggal: new Date('2026-06-26'),
        nominal: 1500000,
        deskripsi: 'Pembayaran tagihan listrik laundry kilat',
        kategori: 'Sewa & Utilitas',
        bukti_nota_url: '',
        status: 'Approve',
        tanggal_pengajuan: new Date('2026-06-26'),
        tanggal_approval: new Date('2026-06-26'),
        created_at: new Date('2026-06-26'),
        updated_at: new Date('2026-06-26'),
    },
    {
        id_expense: 'EXP-SEED-003',
        id_cabang: 'CBG-003',
        tanggal: new Date('2026-06-27'),
        nominal: 1200000,
        deskripsi: 'Uang lembur kurir akhir pekan',
        kategori: 'Gaji',
        bukti_nota_url: '',
        status: 'Approve',
        tanggal_pengajuan: new Date('2026-06-27'),
        tanggal_approval: new Date('2026-06-27'),
        created_at: new Date('2026-06-27'),
        updated_at: new Date('2026-06-27'),
    },
    {
        id_expense: 'EXP-SEED-004',
        id_cabang: 'CBG-002',
        tanggal: new Date('2026-06-28'),
        nominal: 800000,
        deskripsi: 'Pembelian darurat 4 jerigen detergen di agen lokal',
        kategori: 'Belanja Darurat',
        bukti_nota_url: '',
        status: 'Approve',
        tanggal_pengajuan: new Date('2026-06-28'),
        tanggal_approval: new Date('2026-06-28'),
        created_at: new Date('2026-06-28'),
        updated_at: new Date('2026-06-28'),
    },
];
function createExpense(params) {
    const expense = {
        id_expense: `EXP-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
        id_cabang: params.id_cabang,
        tanggal: params.tanggal,
        nominal: params.nominal,
        deskripsi: params.deskripsi,
        kategori: params.kategori,
        bukti_nota_url: params.bukti_nota_url,
        status: 'Pending',
        tanggal_pengajuan: new Date(),
        created_at: new Date(),
        updated_at: new Date(),
    };
    EXPENSES.push(expense);
    return expense;
}
function getExpenseById(id_expense) {
    return EXPENSES.find((e) => e.id_expense === id_expense);
}
function getExpensesByBranch(id_cabang) {
    return EXPENSES.filter((e) => e.id_cabang === id_cabang);
}
function getApprovedExpensesByBranch(id_cabang) {
    return EXPENSES.filter((e) => e.id_cabang === id_cabang && e.status === 'Approve');
}
function getTotalApprovedExpenses(id_cabang) {
    return getApprovedExpensesByBranch(id_cabang).reduce((sum, e) => sum + e.nominal, 0);
}
function updateExpenseStatus(id_expense, status, catatan) {
    const expense = getExpenseById(id_expense);
    if (!expense)
        return null;
    expense.status = status;
    expense.updated_at = new Date();
    if (status === 'Approve' || status === 'Reject') {
        expense.tanggal_approval = new Date();
        expense.catatan_approval = catatan;
    }
    return expense;
}
function getAllExpenses() {
    return [...EXPENSES];
}
function getExpensesByBranchAndCategory(id_cabang) {
    const expenses = getExpensesByBranch(id_cabang).filter((e) => e.status === 'Approve');
    const breakdown = {};
    for (const cat of exports.DEFAULT_CATEGORIES) {
        breakdown[cat] = 0;
    }
    for (const cat of customCategories) {
        breakdown[cat] = 0;
    }
    for (const expense of expenses) {
        if (breakdown[expense.kategori] !== undefined) {
            breakdown[expense.kategori] += expense.nominal;
        }
        else {
            breakdown[expense.kategori] = expense.nominal;
        }
    }
    return breakdown;
}
//# sourceMappingURL=expense.js.map