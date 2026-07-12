"use strict";
// ==========================================
// EXPENSE SERVICE - FR-FIN-08 Core Implementation
// Formulir input pengeluaran operasional harian
// (tanggal, nominal, kategori kustom, bukti nota)
// Extends: FR-FIN-02 (approval), FR-FIN-03 (overbudget)
// ==========================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_CATEGORIES = void 0;
exports.getCategoriesFromDB = getCategoriesFromDB;
exports.getCategories = getCategories;
exports.addCategoryToDB = addCategoryToDB;
exports.addCategory = addCategory;
exports.createExpense = createExpense;
exports.getExpenseById = getExpenseById;
exports.getExpensesByBranch = getExpensesByBranch;
exports.getApprovedExpensesByBranch = getApprovedExpensesByBranch;
exports.getTotalApprovedExpenses = getTotalApprovedExpenses;
exports.updateExpenseStatus = updateExpenseStatus;
exports.getAllExpenses = getAllExpenses;
exports.getExpensesByBranchAndCategory = getExpensesByBranchAndCategory;
const prisma_js_1 = require("../lib/prisma.js");
exports.DEFAULT_CATEGORIES = [
    'BBM',
    'Sewa & Utilitas',
    'Gaji',
    'Belanja Darurat',
    'Pemeliharaan',
    'Lain-lain',
];
// ==========================================
// CUSTOM CATEGORIES (stored in DB via ExpenseCategory model)
// ==========================================
let cachedCategories = null;
/**
 * Get all expense categories (from DB + defaults)
 */
async function getCategoriesFromDB() {
    if (cachedCategories)
        return cachedCategories;
    const dbCategories = await prisma_js_1.prisma.expenseCategory.findMany({
        orderBy: { name: 'asc' },
    });
    cachedCategories = [...exports.DEFAULT_CATEGORIES, ...dbCategories.map((c) => c.name)];
    return cachedCategories;
}
/**
 * Sync function for routes that don't need DB (e.g., simple GET)
 */
function getCategories() {
    // Return cached or default if available
    if (cachedCategories)
        return cachedCategories;
    return exports.DEFAULT_CATEGORIES;
}
/**
 * Add custom category to database
 */
async function addCategoryToDB(name) {
    try {
        await prisma_js_1.prisma.expenseCategory.create({
            data: { id: `CAT-${Date.now()}`, name },
        });
        cachedCategories = null; // Invalidate cache
        return true;
    }
    catch {
        return false;
    }
}
/**
 * Legacy sync function for addCategory
 */
function addCategory(name) {
    // This is sync for backward compatibility
    // In production, use addCategoryToDB
    const all = getCategories();
    if (all.includes(name))
        return false;
    exports.DEFAULT_CATEGORIES.push(name);
    return true;
}
// ==========================================
// EXPENSE CRUD OPERATIONS
// ==========================================
/**
 * Create new expense (Pending status)
 */
async function createExpense(params) {
    const id_expense = `EXP-${Date.now().toString(36).toUpperCase()}`;
    const expense = await prisma_js_1.prisma.expense.create({
        data: {
            id_expense,
            id_cabang: params.id_cabang,
            tanggal: params.tanggal,
            nominal: params.nominal,
            deskripsi: params.deskripsi,
            kategori: params.kategori,
            bukti_nota_url: params.bukti_nota_url ?? '',
            status: 'Pending',
            tanggal_pengajuan: new Date(),
        },
    });
    return {
        id_expense: expense.id_expense,
        id_cabang: expense.id_cabang,
        tanggal: expense.tanggal,
        nominal: expense.nominal,
        deskripsi: expense.deskripsi,
        kategori: expense.kategori,
        bukti_nota_url: expense.bukti_nota_url,
        status: expense.status,
        tanggal_pengajuan: expense.tanggal_pengajuan,
        created_at: expense.created_at,
        updated_at: expense.updated_at,
    };
}
/**
 * Get expense by ID
 */
async function getExpenseById(id_expense) {
    const expense = await prisma_js_1.prisma.expense.findUnique({
        where: { id_expense },
    });
    if (!expense)
        return null;
    return {
        id_expense: expense.id_expense,
        id_cabang: expense.id_cabang,
        tanggal: expense.tanggal,
        nominal: expense.nominal,
        deskripsi: expense.deskripsi,
        kategori: expense.kategori,
        bukti_nota_url: expense.bukti_nota_url,
        status: expense.status,
        tanggal_pengajuan: expense.tanggal_pengajuan,
        tanggal_approval: expense.tanggal_approval ?? undefined,
        catatan_approval: expense.catatan_approval ?? undefined,
        created_at: expense.created_at,
        updated_at: expense.updated_at,
    };
}
/**
 * Get all expenses for a branch
 */
async function getExpensesByBranch(id_cabang) {
    const expenses = await prisma_js_1.prisma.expense.findMany({
        where: { id_cabang },
        orderBy: { created_at: 'desc' },
    });
    return expenses.map((e) => ({
        id_expense: e.id_expense,
        id_cabang: e.id_cabang,
        tanggal: e.tanggal,
        nominal: e.nominal,
        deskripsi: e.deskripsi,
        kategori: e.kategori,
        bukti_nota_url: e.bukti_nota_url,
        status: e.status,
        tanggal_pengajuan: e.tanggal_pengajuan,
        tanggal_approval: e.tanggal_approval ?? undefined,
        catatan_approval: e.catatan_approval ?? undefined,
        created_at: e.created_at,
        updated_at: e.updated_at,
    }));
}
/**
 * Get approved expenses for a branch
 */
async function getApprovedExpensesByBranch(id_cabang) {
    const expenses = await prisma_js_1.prisma.expense.findMany({
        where: { id_cabang, status: 'Approve' },
        orderBy: { created_at: 'desc' },
    });
    return expenses.map((e) => ({
        id_expense: e.id_expense,
        id_cabang: e.id_cabang,
        tanggal: e.tanggal,
        nominal: e.nominal,
        deskripsi: e.deskripsi,
        kategori: e.kategori,
        bukti_nota_url: e.bukti_nota_url,
        status: e.status,
        tanggal_pengajuan: e.tanggal_pengajuan,
        tanggal_approval: e.tanggal_approval ?? undefined,
        catatan_approval: e.catatan_approval ?? undefined,
        created_at: e.created_at,
        updated_at: e.updated_at,
    }));
}
/**
 * Get total approved expenses for a branch
 */
async function getTotalApprovedExpenses(id_cabang) {
    const result = await prisma_js_1.prisma.expense.aggregate({
        where: { id_cabang, status: 'Approve' },
        _sum: { nominal: true },
    });
    return result._sum.nominal ?? 0;
}
/**
 * Update expense status (approve/reject)
 */
async function updateExpenseStatus(id_expense, status, catatan) {
    try {
        const expense = await prisma_js_1.prisma.expense.update({
            where: { id_expense },
            data: {
                status,
                tanggal_approval: new Date(),
                catatan_approval: catatan,
            },
        });
        return {
            id_expense: expense.id_expense,
            id_cabang: expense.id_cabang,
            tanggal: expense.tanggal,
            nominal: expense.nominal,
            deskripsi: expense.deskripsi,
            kategori: expense.kategori,
            bukti_nota_url: expense.bukti_nota_url,
            status: expense.status,
            tanggal_pengajuan: expense.tanggal_pengajuan,
            tanggal_approval: expense.tanggal_approval ?? undefined,
            catatan_approval: expense.catatan_approval ?? undefined,
            created_at: expense.created_at,
            updated_at: expense.updated_at,
        };
    }
    catch {
        return null;
    }
}
/**
 * Get all expenses (admin)
 */
async function getAllExpenses() {
    const expenses = await prisma_js_1.prisma.expense.findMany({
        orderBy: { created_at: 'desc' },
    });
    return expenses.map((e) => ({
        id_expense: e.id_expense,
        id_cabang: e.id_cabang,
        tanggal: e.tanggal,
        nominal: e.nominal,
        deskripsi: e.deskripsi,
        kategori: e.kategori,
        bukti_nota_url: e.bukti_nota_url,
        status: e.status,
        tanggal_pengajuan: e.tanggal_pengajuan,
        tanggal_approval: e.tanggal_approval ?? undefined,
        catatan_approval: e.catatan_approval ?? undefined,
        created_at: e.created_at,
        updated_at: e.updated_at,
    }));
}
/**
 * Get expense breakdown by category for a branch
 */
async function getExpensesByBranchAndCategory(id_cabang) {
    const expenses = await getApprovedExpensesByBranch(id_cabang);
    const breakdown = {};
    for (const cat of exports.DEFAULT_CATEGORIES) {
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