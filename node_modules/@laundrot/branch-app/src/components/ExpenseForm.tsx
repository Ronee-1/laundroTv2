import { useState, useEffect, useMemo } from 'react';
import type { UserRole } from '../App.tsx';
import { ExpenseModal } from './ExpenseModal.tsx';
import { CategoryModal } from './CategoryModal.tsx';

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
  const [categories, setCategories] = useState<string[]>(['BBM', 'Sewa & Utilitas', 'Gaji', 'Belanja Darurat', 'Pemeliharaan', 'Lain-lain']);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterBranch, setFilterBranch] = useState('all');

  useEffect(() => {
    fetch('/api/expenses/categories')
      .then((r) => r.json())
      .then((json) => { if (json.success && Array.isArray(json.categories)) setCategories(json.categories); })
      .catch(() => {});
  }, []);

  const mockExpenses: ExpenseEntry[] = useMemo(() => [
    { id_expense: 'EXP-SEED-001', id_cabang: 'CBG-001', tanggal: '2026-06-25', nominal: 350000, kategori: 'BBM', deskripsi: 'Pengisian bensin truk rute lingkar luar Depok', status: 'Approve' },
    { id_expense: 'EXP-SEED-002', id_cabang: 'CBG-002', tanggal: '2026-06-26', nominal: 1500000, kategori: 'Sewa & Utilitas', deskripsi: 'Pembayaran tagihan listrik laundry kilat', status: 'Approve' },
    { id_expense: 'EXP-SEED-003', id_cabang: 'CBG-003', tanggal: '2026-06-27', nominal: 1200000, kategori: 'Gaji', deskripsi: 'Uang lembur kurir akhir pekan', status: 'Approve' },
    { id_expense: 'EXP-SEED-004', id_cabang: 'CBG-002', tanggal: '2026-06-28', nominal: 800000, kategori: 'Belanja Darurat', deskripsi: 'Pembelian darurat 4 jerigen detergen di agen lokal', status: 'Approve' },
  ], []);

  const filteredExpenses = useMemo(() => {
    return mockExpenses.filter((e) => {
      const matchBranch = filterBranch === 'all' || e.id_cabang === filterBranch;
      const matchCategory = filterCategory === 'all' || e.kategori === filterCategory;
      const matchSearch = e.deskripsi.toLowerCase().includes(searchQuery.toLowerCase()) || e.kategori.toLowerCase().includes(searchQuery.toLowerCase());
      return matchBranch && matchCategory && matchSearch;
    });
  }, [mockExpenses, filterBranch, filterCategory, searchQuery]);

  return (
    <div className="space-y-8 max-w-[1400px]">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#0F172A] tracking-tight">Catatan Pengeluaran</h1>
          <p className="text-slate-500 text-sm mt-1.5">Transparansi pengeluaran harian operasional di bawah validasi pagu anggaran.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowCategoryModal(true)}
            className="bg-white hover:bg-slate-50 text-slate-700 px-5 py-2.5 rounded-xl text-sm font-semibold border border-slate-200 transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-md"
          >
            Kategori Baru
          </button>
          <button
            onClick={() => setShowExpenseModal(true)}
            className="bg-[#0F172A] hover:bg-slate-800 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-md"
          >
            + Tambah Pengeluaran
          </button>
        </div>
      </div>

      <div className="bg-white p-6 rounded-4xl border border-slate-100 shadow-card flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="w-full md:w-1/3 relative">
          <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
          <input
            type="text"
            placeholder="Cari deskripsi, kategori..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-transparent pl-10 pr-4 py-3 rounded-xl text-sm text-[#0F172A] placeholder-slate-400 focus:outline-none focus:bg-white focus:border-blue-600/30 transition-all"
          />
        </div>
        <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
          {userRole === 'Owner' && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 font-medium">Cabang:</span>
              <select
                value={filterBranch}
                onChange={(e) => setFilterBranch(e.target.value)}
                className="bg-slate-50 border border-transparent rounded-xl px-4 py-3 text-sm text-[#0F172A] focus:outline-none focus:bg-white focus:border-blue-600/30 transition-all"
              >
                <option value="all">Semua Cabang</option>
                {BRANCH_OPTIONS.map((b) => (<option key={b.id} value={b.id}>{b.nama}</option>))}
              </select>
            </div>
          )}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-medium">Kategori:</span>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="bg-slate-50 border border-transparent rounded-xl px-4 py-3 text-sm text-[#0F172A] focus:outline-none focus:bg-white focus:border-blue-600/30 transition-all"
            >
              <option value="all">Semua</option>
              {categories.map((cat) => (<option key={cat} value={cat}>{cat}</option>))}
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-4xl border border-slate-100 shadow-card overflow-hidden">
        <div className="p-7 pb-0 flex justify-between items-center">
          <h3 className="text-base font-bold text-[#0F172A]">Log Pengeluaran</h3>
          <span className="text-xs text-slate-400 font-medium">{filteredExpenses.length} entri</span>
        </div>
        <div className="p-7 pt-4 overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 text-[11px] uppercase tracking-wider font-semibold">
                <th className="py-3.5 px-4">Tanggal</th>
                <th className="py-3.5 px-4">Cabang</th>
                <th className="py-3.5 px-4">Kategori</th>
                <th className="py-3.5 px-4">Deskripsi</th>
                <th className="py-3.5 px-4 text-right">Nominal</th>
                <th className="py-3.5 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-sm">
              {filteredExpenses.length === 0 ? (
                <tr><td colSpan={6} className="py-12 text-center text-slate-400">Tidak ada data yang sesuai filter.</td></tr>
              ) : (
                filteredExpenses.map((exp) => (
                  <tr key={exp.id_expense} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 px-4 text-slate-500">{exp.tanggal}</td>
                    <td className="py-4 px-4 font-semibold text-[#0F172A]">{BRANCH_OPTIONS.find((b) => b.id === exp.id_cabang)?.nama ?? exp.id_cabang}</td>
                    <td className="py-4 px-4">
                      <span className="bg-slate-100 text-slate-600 px-2.5 py-1 rounded-lg font-medium text-[11px]">{exp.kategori}</span>
                    </td>
                    <td className="py-4 px-4 text-slate-500 max-w-xs truncate">{exp.deskripsi}</td>
                    <td className="py-4 px-4 text-right font-semibold text-[#0F172A]">{formatIDR(exp.nominal)}</td>
                    <td className="py-4 px-4 text-center">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#ECFDF5] text-[#047857] rounded-lg font-semibold text-[10px]">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
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

      {showExpenseModal && (
        <ExpenseModal branches={BRANCH_OPTIONS} userRole={userRole} selectedAdminBranch={selectedAdminBranch} onClose={() => setShowExpenseModal(false)} onSuccess={(msg) => triggerNotification(msg, 'success')} onError={(msg) => triggerNotification(msg, 'error')} />
      )}
      {showCategoryModal && (
        <CategoryModal onClose={() => setShowCategoryModal(false)} onSuccess={(msg, cats) => { if (cats) setCategories(cats); triggerNotification(msg, 'success'); }} onError={(msg) => triggerNotification(msg, 'error')} />
      )}
    </div>
  );
}
