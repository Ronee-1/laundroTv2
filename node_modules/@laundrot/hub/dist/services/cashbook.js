"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createJournalEntry = createJournalEntry;
exports.getJournalByBranch = getJournalByBranch;
exports.getAllJournalEntries = getAllJournalEntries;
exports.getJournalSummary = getJournalSummary;
const CASH_BOOK = [];
function createJournalEntry(params) {
    const entry = {
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
function getJournalByBranch(id_cabang) {
    return CASH_BOOK.filter((entry) => entry.id_cabang === id_cabang);
}
function getAllJournalEntries() {
    return [...CASH_BOOK];
}
function getJournalSummary(id_cabang) {
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
//# sourceMappingURL=cashbook.js.map