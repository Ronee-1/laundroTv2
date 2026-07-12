import { prisma } from '../lib/prisma.js';
import type { CashBookEntry, TransactionType } from '@laundrot/shared-types';

// ==========================================
// CASHBOOK SERVICE - FR-FIN-01 Core Implementation
// Jurnal transaksi otomatis ke Outlet Utama dengan tag cabang asal
// Seluruh transaksi dari 5 cabang masuk ke database jurnal tunggal
// Mendukung: FR-FIN-02 (approval), FR-OWN-01 (dashboard)
// ==========================================

export interface CreateJournalParams {
  id_cabang: string;
  id_transaksi: string;
  nominal: number;
  tipe: 'Pemasukan' | 'Pengeluaran';
  deskripsi: string;
}

// ==========================================
// CASHBOOK CRUD OPERATIONS
// ==========================================

/**
 * Create new journal entry
 */
export async function createJournalEntry(params: CreateJournalParams): Promise<CashBookEntry> {
  const id_jurnal = `JRN-${Date.now().toString(36).toUpperCase()}`;

  const entry = await prisma.cashBookEntry.create({
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
    tipe: entry.tipe as TransactionType,
    deskripsi: entry.deskripsi,
    tanggal_jurnal: entry.tanggal_jurnal,
    created_at: entry.created_at,
  };
}

/**
 * Get journal entries by branch
 */
export async function getJournalByBranch(id_cabang: string): Promise<CashBookEntry[]> {
  const entries = await prisma.cashBookEntry.findMany({
    where: { id_cabang },
    orderBy: { tanggal_jurnal: 'desc' },
  });

  return entries.map((e) => ({
    id_jurnal: e.id_jurnal,
    id_cabang: e.id_cabang,
    id_transaksi: e.id_transaksi,
    nominal: e.nominal,
    tipe: e.tipe as TransactionType,
    deskripsi: e.deskripsi,
    tanggal_jurnal: e.tanggal_jurnal,
    created_at: e.created_at,
  }));
}

/**
 * Get all journal entries
 */
export async function getAllJournalEntries(): Promise<CashBookEntry[]> {
  const entries = await prisma.cashBookEntry.findMany({
    orderBy: { tanggal_jurnal: 'desc' },
  });

  return entries.map((e) => ({
    id_jurnal: e.id_jurnal,
    id_cabang: e.id_cabang,
    id_transaksi: e.id_transaksi,
    nominal: e.nominal,
    tipe: e.tipe as TransactionType,
    deskripsi: e.deskripsi,
    tanggal_jurnal: e.tanggal_jurnal,
    created_at: e.created_at,
  }));
}

/**
 * Get journal summary (totals)
 */
export async function getJournalSummary(id_cabang?: string): Promise<{
  total_pemasukan: number;
  total_pengeluaran: number;
  saldo: number;
  total_entries: number;
}> {
  const whereClause = id_cabang ? { id_cabang } : {};

  const [pemasukan, pengeluaran, totalEntries] = await Promise.all([
    prisma.cashBookEntry.aggregate({
      where: { ...whereClause, tipe: 'Pemasukan' },
      _sum: { nominal: true },
    }),
    prisma.cashBookEntry.aggregate({
      where: { ...whereClause, tipe: 'Pengeluaran' },
      _sum: { nominal: true },
    }),
    prisma.cashBookEntry.count({ where: whereClause }),
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

// ==========================================
// MONTHLY TREND DATA (for charts)
// ==========================================

export interface MonthlyTrend {
  bulan: string;
  tahun: number;
  total_pemasukan: number;
  total_pengeluaran: number;
  profit: number;
}

export interface BranchTrendData {
  id_cabang: string;
  nama_cabang: string;
  monthly_trends: MonthlyTrend[];
  total_profit: number;
}

/**
 * Get monthly cash flow and profit trends for a specific branch
 */
export async function getMonthlyTrendsByBranch(id_cabang: string, bulan?: number): Promise<MonthlyTrend[]> {
  // Default to last 6 months if not specified
  const monthsToFetch = bulan ?? 6;
  const now = new Date();
  const startDate = new Date(now.getFullYear(), now.getMonth() - monthsToFetch + 1, 1);

  const entries = await prisma.cashBookEntry.findMany({
    where: {
      id_cabang,
      tanggal_jurnal: {
        gte: startDate,
      },
    },
    orderBy: { tanggal_jurnal: 'asc' },
  });

  // Group by month
  const monthlyMap = new Map<string, MonthlyTrend>();

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
      } else {
        existing.total_pengeluaran += entry.nominal;
      }
      existing.profit = existing.total_pemasukan - existing.total_pengeluaran;
    }
  }

  return Array.from(monthlyMap.values()).sort((a, b) => {
    if (a.tahun !== b.tahun) return a.tahun - b.tahun;
    return new Date(`1 ${a.bulan}`).getMonth() - new Date(`1 ${b.bulan}`).getMonth();
  });
}

/**
 * Get all branches with their monthly trends (for consolidated dashboard)
 */
export async function getAllBranchesMonthlyTrends(branchId?: string): Promise<BranchTrendData[]> {
  const branches = await prisma.branch.findMany({
    where: branchId ? { id_cabang: branchId } : undefined,
    orderBy: { id_cabang: 'asc' },
  });

  const trends = await Promise.all(
    branches.map(async (branch) => {
      const monthlyTrends = await getMonthlyTrendsByBranch(branch.id_cabang, 6);
      const totalProfit = monthlyTrends.reduce((sum, m) => sum + m.profit, 0);

      return {
        id_cabang: branch.id_cabang,
        nama_cabang: branch.nama_cabang,
        monthly_trends: monthlyTrends,
        total_profit: totalProfit,
      };
    })
  );

  return trends;
}
