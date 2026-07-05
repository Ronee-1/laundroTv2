import { useState, useEffect, useMemo } from 'react';
import type { UserRole } from '../App';
import { ExpenseModal } from './ExpenseModal';
import { CategoryModal } from './CategoryModal';

// ==========================================
// EXPENSE FORM - FR-FIN-02 Core Implementation
// Antarmuka persetujuan/penolakan permohonan pengeluaran darurat
// FR-FIN-02: Admin Pusat Approve/Reject permohonan pengeluaran kas/stok darurat
// Supporting: FR-FIN-03 (Overbudget validation)
// ==========================================

interface ExpenseEntry {
  id_expense: string;
  id_cabang: string;
  tanggal: string;
  nominal: number;
  deskripsi: string;
  kategori: string;
  status: string;
}

interface BranchOption { id: string; nama: string; }

interface Props {
  userRole: UserRole;
  selectedAdminBranch: string;
  triggerNotification: (msg: string, type?: 'success' | 'error' | 'warning') => void;
}

const BRANCH_OPTIONS: BranchOption[] = [
  { id: 'CBG-001', nama: 'Cabang Depok (Pusat)' },
  { id: 'CBG-002', nama: 'Cabang Jakarta Selatan' },
  { id: 'CBG-003', nama: 'Cabang Bekasi Timur' },
  { id: 'CBG-004', nama: 'Cabang Tangerang Kota' },
  { id: 'CBG-005', nama: 'Cabang Bogor Raya' },
];

function formatIDR(num: number): string {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num);
}

export function ExpenseForm({ userRole, selectedAdminBranch, triggerNotification }: Props) {
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [categories, setCategories] = useState<string[]>(['BBM', 'Sewa & Utilitas', 'Gaji', 'Belanja Darurat', 'Pemeliharaan', 'Lain-Lain']);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterBranch, setFilterBranch] = useState('all');

  useEffect(() => {
    fetch('/api/expenses/categories')
      .then((r) => r.json())
      .then((json) => { if (json.success && Array.isArray(json.categories)) setCategories(json.categories); })
      .catch(() => {});
  }, []);

  const mockExpenses: ExpenseEntry[] = [
    { id_expense: 'EXP-SEED-001', id_cabang: 'CBG-001', tanggal: '2026-06-25', nominal: 350000, kategori: 'BBM', deskripsi: 'Pengisian bensin truk rute lingkar luar Depok', status: 'Approve' },
    { id_expense: 'EXP-SEED-002', id_cabang: 'CBG-002', tanggal: '2026-06-26', nominal: 1500000, kategori: 'Sewa & Utilitas', deskripsi: 'Pembayaran tagihan listrik laundry kilat', status: 'Approve' },
    { id_expense: 'EXP-SEED-003', id_cabang: 'CBG-003', tanggal: '2026-06-27', nominal: 1200000, kategori: 'Gaji', deskripsi: 'Uang lembur kurir akhir pekan', status: 'Approve' },
    { id_expense: 'EXP-SEED-004', id_cabang: 'CBG-002', tanggal: '2026-06-28', nominal: 800000, kategori: 'Belanja Darurat', deskripsi: 'Pembelian darurat 4 jerigen detergen di agen lokal', status: 'Approve' },
  ];

  const filteredExpenses = useMemo(() => {
    return mockExpenses.filter((e) => {
      const matchBranch = filterBranch === 'all' || e.id_cabang === filterBranch;
      const matchCategory = filterCategory === 'all' || e.kategori === filterCategory;
      const matchSearch = e.deskripsi.toLowerCase().includes(searchQuery.toLowerCase()) || e.kategori.toLowerCase().includes(searchQuery.toLowerCase());
      return matchBranch && matchCategory && matchSearch;
    });
  }, [mockExpenses, filterBranch, filterCategory, searchQuery]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-navy tracking-tight">Catatan Pengeluaran</h1>
          <p className="text-sm text-slate-500 mt-1">Transparansi pengeluaran operasional</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowCategoryModal(true)}
            className="bg-white border border-slate-200 text-navy px-4 py-2 rounded-2xl text-sm font-medium hover:border-deep-blue transition-all"
          >
            + Kategori
          </button>
          <button
            onClick={() => setShowExpenseModal(true)}
            className="bg-deep-blue text-white px-4 py-2 rounded-2xl text-sm font-medium hover:bg-navy transition-all"
          >
            + Tambah Pengeluaran
          </button>
        </div>
      </div>

      {/* Filters - Premium Flat Design */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col md:flex-row gap-4 items-center">
        <div className="w-full md:w-1/3 relative">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
          <input
            type="text"
            placeholder="Cari deskripsi..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-slate-200 pl-10 pr-4 py-3 rounded-2xl text-sm text-navy placeholder:text-slate-400 focus:outline-none focus:border-deep-blue transition-all"
          />
        </div>
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {userRole === 'Owner' && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500">Cabang:</span>
              <select
                value={filterBranch}
                onChange={(e) => setFilterBranch(e.target.value)}
                className="bg-white border border-slate-200 rounded-2xl px-3 py-2 text-sm text-navy focus:outline-none focus:border-deep-blue transition-all"
              >
                <option value="all">Semua</option>
                {BRANCH_OPTIONS.map((b) => <option key={b.id} value={b.id}>{b.nama}</option>)}
              </select>
            </div>
          )}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500">Kategori:</span>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="bg-white border border-slate-200 rounded-2xl px-3 py-2 text-sm text-navy focus:outline-none focus:border-deep-blue transition-all"
            >
              <option value="all">Semua</option>
              {categories.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Table - Premium Design */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex justify-between items-center">
          <h3 className="text-base font-semibold text-navy">Log Pengeluaran</h3>
          <span className="text-xs text-slate-400">{filteredExpenses.length} entri</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-200 text-xs text-slate-400 uppercase tracking-wider font-medium">
                <th className="py-3 px-4">Tanggal</th>
                <th className="py-3 px-4">Cabang</th>
                <th className="py-3 px-4">Kategori</th>
                <th className="py-3 px-4">Deskripsi</th>
                <th className="py-3 px-4 text-right">Nominal</th>
                <th className="py-3 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filteredExpenses.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">Tidak ada data</td>
                </tr>
              ) : (
                filteredExpenses.map((exp) => (
                  <tr key={exp.id_expense} className="hover:bg-base-bg transition-all">
                    <td className="py-3 px-4 text-slate-500">{exp.tanggal}</td>
                    <td className="py-3 px-4 font-medium text-navy">{BRANCH_OPTIONS.find((b) => b.id === exp.id_cabang)?.nama ?? exp.id_cabang}</td>
                    <td className="py-3 px-4">
                      <span className="bg-base-bg text-slate-600 px-2 py-0.5 rounded-lg text-xs font-medium">{exp.kategori}</span>
                    </td>
                    <td className="py-3 px-4 text-slate-500 max-w-xs truncate">{exp.deskripsi}</td>
                    <td className="py-3 px-4 text-right font-semibold text-navy">{formatIDR(exp.nominal)}</td>
                    <td className="py-3 px-4 text-center">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-teal-50 text-teal border border-teal-200 rounded-lg text-xs font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-teal"></span>
                        {exp.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      {showExpenseModal && (
        <ExpenseModal
          branches={BRANCH_OPTIONS}
          userRole={userRole}
          selectedAdminBranch={selectedAdminBranch}
          onClose={() => setShowExpenseModal(false)}
          onSuccess={(msg) => triggerNotification(msg, 'success')}
          onError={(msg) => triggerNotification(msg, 'error')}
        />
      )}
      {showCategoryModal && (
        <CategoryModal
          onClose={() => setShowCategoryModal(false)}
          onSuccess={(msg, cats) => { if (cats) setCategories(cats); triggerNotification(msg, 'success'); }}
          onError={(msg) => triggerNotification(msg, 'error')}
        />
      )}
    </div>
  );
}
