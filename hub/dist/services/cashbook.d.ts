import type { CashBookEntry } from '@laundrot/shared-types';
export interface CreateJournalParams {
    id_cabang: string;
    id_transaksi: string;
    nominal: number;
    tipe: 'Pemasukan' | 'Pengeluaran';
    deskripsi: string;
}
export declare function createJournalEntry(params: CreateJournalParams): CashBookEntry;
export declare function getJournalByBranch(id_cabang: string): CashBookEntry[];
export declare function getAllJournalEntries(): CashBookEntry[];
export declare function getJournalSummary(id_cabang?: string): {
    total_pemasukan: number;
    total_pengeluaran: number;
    saldo: number;
    total_entries: number;
};
//# sourceMappingURL=cashbook.d.ts.map