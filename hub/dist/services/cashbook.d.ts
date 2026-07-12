import type { CashBookEntry } from '@laundrot/shared-types';
export interface CreateJournalParams {
    id_cabang: string;
    id_transaksi: string;
    nominal: number;
    tipe: 'Pemasukan' | 'Pengeluaran';
    deskripsi: string;
}
/**
 * Create new journal entry
 */
export declare function createJournalEntry(params: CreateJournalParams): Promise<CashBookEntry>;
/**
 * Get journal entries by branch
 */
export declare function getJournalByBranch(id_cabang: string): Promise<CashBookEntry[]>;
/**
 * Get all journal entries
 */
export declare function getAllJournalEntries(): Promise<CashBookEntry[]>;
/**
 * Get journal summary (totals)
 */
export declare function getJournalSummary(id_cabang?: string): Promise<{
    total_pemasukan: number;
    total_pengeluaran: number;
    saldo: number;
    total_entries: number;
}>;
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
export declare function getMonthlyTrendsByBranch(id_cabang: string, bulan?: number): Promise<MonthlyTrend[]>;
/**
 * Get all branches with their monthly trends (for consolidated dashboard)
 */
export declare function getAllBranchesMonthlyTrends(branchId?: string): Promise<BranchTrendData[]>;
//# sourceMappingURL=cashbook.d.ts.map