import type { CashBookEntry } from '@laundrot/shared-types';

const CASH_BOOK: CashBookEntry[] = [];

export interface CreateJournalParams {
  id_cabang: string;
  id_transaksi: string;
  nominal: number;
  tipe: 'Pemasukan' | 'Pengeluaran';
  deskripsi: string;
}

export function createJournalEntry(params: CreateJournalParams): CashBookEntry {
  const entry: CashBookEntry = {
    id_jurnal: `JRN-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
    id_cabang: params.id_cabang,
    id_transaksi: params.id_transaksi,
    nominal: params.nominal,
    tipe: params.tipe,
    deskripsi: params.deskripsi,
    tanggal_jurnal: new Date(),
    created_at: new Date(),
  };

  CASH_BOOK.push(entry);
  return entry;
}

export function getJournalByBranch(id_cabang: string): CashBookEntry[] {
  return CASH_BOOK.filter((entry) => entry.id_cabang === id_cabang);
}

export function getAllJournalEntries(): CashBookEntry[] {
  return [...CASH_BOOK];
}

export function getJournalSummary(id_cabang?: string): {
  total_pemasukan: number;
  total_pengeluaran: number;
  saldo: number;
  total_entries: number;
} {
  const entries = id_cabang ? getJournalByBranch(id_cabang) : CASH_BOOK;

  const total_pemasukan = entries
    .filter((e) => e.tipe === 'Pemasukan')
    .reduce((sum, e) => sum + e.nominal, 0);

  const total_pengeluaran = entries
    .filter((e) => e.tipe === 'Pengeluaran')
    .reduce((sum, e) => sum + e.nominal, 0);

  return {
    total_pemasukan,
    total_pengeluaran,
    saldo: total_pemasukan - total_pengeluaran,
    total_entries: entries.length,
  };
}
