"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createJournalEntry = createJournalEntry;
exports.getJournalByBranch = getJournalByBranch;
exports.getAllJournalEntries = getAllJournalEntries;
exports.getJournalSummary = getJournalSummary;
exports.getMonthlyTrendsByBranch = getMonthlyTrendsByBranch;
exports.getAllBranchesMonthlyTrends = getAllBranchesMonthlyTrends;
const prisma_js_1 = require("../lib/prisma.js");
// ==========================================
// CASHBOOK CRUD OPERATIONS
// ==========================================
/**
 * Create new journal entry
 */
async function createJournalEntry(params) {
    const id_jurnal = `JRN-${Date.now().toString(36).toUpperCase()}`;
    const entry = await prisma_js_1.prisma.cashBookEntry.create({
        data: {
            id_jurnal,
            id_cabang: params.id_cabang,
            id_transaksi: params.id_transaksi,
            nominal: params.nominal,
            tipe: params.tipe,
            deskripsi: params.deskripsi,
            tanggal_jurnal: new Date(),
        },
    });
    return {
        id_jurnal: entry.id_jurnal,
        id_cabang: entry.id_cabang,
        id_transaksi: entry.id_transaksi,
        nominal: entry.nominal,
        tipe: entry.tipe,
        deskripsi: entry.deskripsi,
        tanggal_jurnal: entry.tanggal_jurnal,
        created_at: entry.created_at,
    };
}
/**
 * Get journal entries by branch
 */
async function getJournalByBranch(id_cabang) {
    const entries = await prisma_js_1.prisma.cashBookEntry.findMany({
        where: { id_cabang },
        orderBy: { tanggal_jurnal: 'desc' },
    });
    return entries.map((e) => ({
        id_jurnal: e.id_jurnal,
        id_cabang: e.id_cabang,
        id_transaksi: e.id_transaksi,
        nominal: e.nominal,
        tipe: e.tipe,
        deskripsi: e.deskripsi,
        tanggal_jurnal: e.tanggal_jurnal,
        created_at: e.created_at,
    }));
}
/**
 * Get all journal entries
 */
async function getAllJournalEntries() {
    const entries = await prisma_js_1.prisma.cashBookEntry.findMany({
        orderBy: { tanggal_jurnal: 'desc' },
    });
    return entries.map((e) => ({
        id_jurnal: e.id_jurnal,
        id_cabang: e.id_cabang,
        id_transaksi: e.id_transaksi,
        nominal: e.nominal,
        tipe: e.tipe,
        deskripsi: e.deskripsi,
        tanggal_jurnal: e.tanggal_jurnal,
        created_at: e.created_at,
    }));
}
/**
 * Get journal summary (totals)
 */
async function getJournalSummary(id_cabang) {
    const whereClause = id_cabang ? { id_cabang } : {};
    const [pemasukan, pengeluaran, totalEntries] = await Promise.all([
        prisma_js_1.prisma.cashBookEntry.aggregate({
            where: { ...whereClause, tipe: 'Pemasukan' },
            _sum: { nominal: true },
        }),
        prisma_js_1.prisma.cashBookEntry.aggregate({
            where: { ...whereClause, tipe: 'Pengeluaran' },
            _sum: { nominal: true },
        }),
        prisma_js_1.prisma.cashBookEntry.count({ where: whereClause }),
    ]);
    const total_pemasukan = pemasukan._sum.nominal ?? 0;
    const total_pengeluaran = pengeluaran._sum.nominal ?? 0;
    return {
        total_pemasukan,
        total_pengeluaran,
        saldo: total_pemasukan - total_pengeluaran,
        total_entries: totalEntries,
    };
}
/**
 * Get monthly cash flow and profit trends for a specific branch
 */
async function getMonthlyTrendsByBranch(id_cabang, bulan) {
    // Default to last 6 months if not specified
    const monthsToFetch = bulan ?? 6;
    const now = new Date();
    const startDate = new Date(now.getFullYear(), now.getMonth() - monthsToFetch + 1, 1);
    const entries = await prisma_js_1.prisma.cashBookEntry.findMany({
        where: {
            id_cabang,
            tanggal_jurnal: {
                gte: startDate,
            },
        },
        orderBy: { tanggal_jurnal: 'asc' },
    });
    // Group by month
    const monthlyMap = new Map();
    for (let i = 0; i < monthsToFetch; i++) {
        const date = new Date(now.getFullYear(), now.getMonth() - monthsToFetch + i + 1, 1);
        const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        const bulanNama = date.toLocaleDateString('id-ID', { month: 'long' });
        monthlyMap.set(key, {
            bulan: bulanNama,
            tahun: date.getFullYear(),
            total_pemasukan: 0,
            total_pengeluaran: 0,
            profit: 0,
        });
    }
    for (const entry of entries) {
        const date = new Date(entry.tanggal_jurnal);
        const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        const existing = monthlyMap.get(key);
        if (existing) {
            if (entry.tipe === 'Pemasukan') {
                existing.total_pemasukan += entry.nominal;
            }
            else {
                existing.total_pengeluaran += entry.nominal;
            }
            existing.profit = existing.total_pemasukan - existing.total_pengeluaran;
        }
    }
    return Array.from(monthlyMap.values()).sort((a, b) => {
        if (a.tahun !== b.tahun)
            return a.tahun - b.tahun;
        return new Date(`1 ${a.bulan}`).getMonth() - new Date(`1 ${b.bulan}`).getMonth();
    });
}
/**
 * Get all branches with their monthly trends (for consolidated dashboard)
 */
async function getAllBranchesMonthlyTrends(branchId) {
    const branches = await prisma_js_1.prisma.branch.findMany({
        where: branchId ? { id_cabang: branchId } : undefined,
        orderBy: { id_cabang: 'asc' },
    });
    const trends = await Promise.all(branches.map(async (branch) => {
        const monthlyTrends = await getMonthlyTrendsByBranch(branch.id_cabang, 6);
        const totalProfit = monthlyTrends.reduce((sum, m) => sum + m.profit, 0);
        return {
            id_cabang: branch.id_cabang,
            nama_cabang: branch.nama_cabang,
            monthly_trends: monthlyTrends,
            total_profit: totalProfit,
        };
    }));
    return trends;
}
//# sourceMappingURL=cashbook.js.map