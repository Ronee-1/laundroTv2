import { useState, useEffect, useMemo } from 'react';
import type { UserRole } from '../App.tsx';
import { RestockModal } from './RestockModal.tsx';
import { ExpenseModal } from './ExpenseModal.tsx';

interface StockEntry {
  item: string;
  satuan: string;
  stok_saat_ini: number;
  safety_threshold: number;
  status: 'Aman' | 'Menipis' | 'Habis';
}

interface BranchFinancial {
  id_cabang: string;
  nama_cabang: string;
  wilayah: string;
  total_pemasukan: number;
  total_pengeluaran: number;
  omzet: number;
  saldo: number;
  pagu_anggaran: number;
  terpakai: number;
  sisa_pagu: number;
  utilization_percent: number;
  health_status: 'Healthy' | 'Warning' | 'Critical';
  category_breakdown: Record<string, number>;
  alerts: Array<{ kategori: string; nominal: number; percent_of_total: number; message: string }>;
  transaction_count: number;
  map_coordinates: { latitude: number; longitude: number; pin_color: 'green' | 'yellow' | 'red' };
  inventory: { stocks: StockEntry[]; overall_status: 'Aman' | 'Menipis' | 'Habis' };
}

interface DashboardData {
  success: boolean;
  summary: {
    total_pemasukan: number;
    total_pengeluaran: number;
    total_saldo: number;
    total_omzet: number;
    total_cabang: number;
    active_branches: number;
    branches_needing_attention: number;
  };
  per_cabang: BranchFinancial[];
  generated_at: string;
}

interface Props {
  userRole: UserRole;
  selectedAdminBranch: string;
  triggerNotification: (msg: string, type?: 'success' | 'error' | 'warning') => void;
}

function formatIDR(num: number): string {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num);
}

const MAP_COORDS: Record<string, { x: number; y: number }> = {
  'CBG-001': { x: 45, y: 70 },
  'CBG-002': { x: 40, y: 45 },
  'CBG-003': { x: 70, y: 50 },
  'CBG-004': { x: 20, y: 40 },
  'CBG-005': { x: 48, y: 90 },
};

function getBranchStatus(b: BranchFinancial): string {
  const hasLowStock = b.inventory.stocks.some((s) => s.stok_saat_ini < s.safety_threshold);
  const isOverBudget = b.total_pengeluaran > b.pagu_anggaran;
  const isCloseBudget = b.total_pengeluaran >= b.pagu_anggaran * 0.9;
  if (hasLowStock || isOverBudget) return 'Kritis';
  if (isCloseBudget) return 'Butuh Perhatian';
  return 'Aman';
}

function statusStyle(status: string) {
  if (status === 'Aman') return { bg: 'bg-[#ECFDF5]', text: 'text-[#047857]', dot: 'bg-emerald-500' };
  if (status === 'Butuh Perhatian') return { bg: 'bg-[#FFFBEB]', text: 'text-[#B45309]', dot: 'bg-amber-500' };
  return { bg: 'bg-[#FFF1F2]', text: 'text-[#BE123C]', dot: 'bg-rose-500' };
}

export function DashboardEksekutif({ userRole, selectedAdminBranch, triggerNotification }: Props) {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedBranchId, setSelectedBranchId] = useState<string>('all');
  const [showRestockModal, setShowRestockModal] = useState(false);
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [restockBranchId, setRestockBranchId] = useState('CBG-002');

  useEffect(() => {
    let cancelled = false;
    async function fetchDashboard() {
      try {
        const res = await fetch('/api/owner/dashboard');
        const json = (await res.json()) as DashboardData;
        if (cancelled) return;
        if (!res.ok || !json.success) { setError('Gagal memuat dashboard.'); return; }
        setData(json);
      } catch {
        if (!cancelled) setError('Tidak dapat terhubung ke server.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchDashboard();
    return () => { cancelled = true; };
  }, []);

  const processedBranches = useMemo(() => {
    if (!data) return [];
    return data.per_cabang.map((b) => ({
      ...b,
      displayStatus: getBranchStatus(b),
      mapCoord: MAP_COORDS[b.id_cabang] ?? { x: 50, y: 50 },
    }));
  }, [data]);

  const selectedBranchData = useMemo(() => {
    if (selectedBranchId === 'all') return null;
    return processedBranches.find((b) => b.id_cabang === selectedBranchId);
  }, [processedBranches, selectedBranchId]);

  const financialSummary = useMemo(() => {
    if (!data) return { totalOmzet: 0, totalPengeluaran: 0, totalPagu: 0, netProfit: 0, efficiencyRate: 0 };
    const totalOmzet = data.per_cabang.reduce((s, b) => s + b.omzet, 0);
    const totalPengeluaran = data.per_cabang.reduce((s, b) => s + b.total_pengeluaran, 0);
    const totalPagu = data.per_cabang.reduce((s, b) => s + b.pagu_anggaran, 0);
    return {
      totalOmzet,
      totalPengeluaran,
      totalPagu,
      netProfit: totalOmzet - totalPengeluaran,
      efficiencyRate: totalOmzet > 0 ? Math.round(((totalOmzet - totalPengeluaran) / totalOmzet) * 100) : 0,
    };
  }, [data]);

  const criticalBranchesCount = useMemo(() => {
    return processedBranches.filter((b) => b.inventory.stocks.some((s) => s.stok_saat_ini < s.safety_threshold)).length;
  }, [processedBranches]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="text-center">
          <svg className="animate-spin h-8 w-8 text-blue-600 mx-auto mb-4" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <p className="text-slate-500 text-sm">Memuat dashboard...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="bg-[#FFF1F2] border border-[#BE123C]/10 rounded-2xl p-6 text-center">
        <p className="text-[#BE123C] text-sm font-medium">{error ?? 'Gagal memuat data.'}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-[1400px]">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#0F172A] tracking-tight">Monitoring Multi-Cabang</h1>
          <p className="text-slate-500 text-sm mt-1.5">Dashboard taktis real-time untuk logistik, stok, dan anggaran keuangan.</p>
        </div>
        {userRole === 'Owner' && (
          <div className="flex items-center gap-3">
            <button
              onClick={() => { setRestockBranchId('CBG-002'); setShowRestockModal(true); }}
              className="bg-white hover:bg-slate-50 text-slate-700 px-5 py-2.5 rounded-xl text-sm font-semibold border border-slate-200 transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-md"
            >
              Kirim Stok
            </button>
            <button
              onClick={() => setShowExpenseModal(true)}
              className="bg-[#0F172A] hover:bg-slate-800 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-md"
            >
              Catat Pengeluaran
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-7 rounded-4xl border border-slate-100 shadow-card hover:shadow-card-hover transition-shadow duration-300">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Konsolidasi Omzet</span>
          <div className="text-3xl font-light text-[#0F172A] mt-3 tracking-tight">{formatIDR(financialSummary.totalOmzet)}</div>
          <span className="text-xs text-[#047857] mt-2 block font-medium">Total pendapatan seluruh cabang</span>
        </div>
        <div className="bg-white p-7 rounded-4xl border border-slate-100 shadow-card hover:shadow-card-hover transition-shadow duration-300">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Pengeluaran</span>
          <div className="text-3xl font-light text-[#0F172A] mt-3 tracking-tight">{formatIDR(financialSummary.totalPengeluaran)}</div>
          <div className="text-xs text-slate-500 mt-2 flex items-center gap-1.5">
            <span>Sisa Pagu:</span>
            <span className="text-[#0F172A] font-semibold">{formatIDR(financialSummary.totalPagu - financialSummary.totalPengeluaran)}</span>
          </div>
        </div>
        <div className="bg-white p-7 rounded-4xl border border-slate-100 shadow-card hover:shadow-card-hover transition-shadow duration-300">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Profit Bersih</span>
          <div className="text-3xl font-light text-[#047857] mt-3 tracking-tight">{formatIDR(financialSummary.netProfit)}</div>
          <span className="text-xs text-slate-500 mt-2 block">Efisiensi: {financialSummary.efficiencyRate}%</span>
        </div>
        <div className="bg-white p-7 rounded-4xl border border-slate-100 shadow-card hover:shadow-card-hover transition-shadow duration-300">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Cabang Kritis</span>
          <div className="text-3xl font-light text-[#BE123C] mt-3 tracking-tight">{criticalBranchesCount} <span className="text-base font-normal text-slate-400">cabang</span></div>
          <span className="text-xs text-slate-500 mt-2 block">Butuh intervensi stok atau dana</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="bg-white rounded-4xl border border-slate-100 shadow-card p-8 lg:col-span-8">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="text-lg font-bold text-[#0F172A] tracking-tight">Peta Sebaran Jabodetabek</h3>
              <p className="text-xs text-slate-400 mt-1">Klik penanda cabang untuk melihat detail.</p>
            </div>
            <div className="flex items-center gap-4 text-xs text-slate-500">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Aman</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> Perhatian</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span> Kritis</span>
            </div>
          </div>

          <div className="my-6 relative bg-slate-50/80 border border-slate-200/60 rounded-[20px] h-[420px] overflow-hidden">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:3rem_3rem] opacity-50"></div>

            <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
              <path d="M 25 30 Q 35 20 50 25 Q 65 22 75 30 Q 82 40 78 55 Q 72 68 60 72 Q 48 78 35 74 Q 22 68 20 55 Q 18 42 25 30 Z" fill="none" stroke="#CBD5E1" strokeWidth="0.3" strokeDasharray="1,1" opacity="0.6" />
            </svg>

            <div className="absolute top-6 left-1/2 -translate-x-1/2 text-slate-300 text-[10px] tracking-[0.2em] uppercase font-semibold">D.K.I Jakarta</div>
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-slate-300 text-[10px] tracking-[0.2em] uppercase font-semibold">Depok / Bogor</div>
            <div className="absolute top-1/2 left-6 -translate-y-1/2 text-slate-300 text-[10px] tracking-[0.2em] uppercase font-semibold" style={{ writingMode: 'vertical-rl' }}>Tangerang</div>
            <div className="absolute top-1/2 right-6 -translate-y-1/2 text-slate-300 text-[10px] tracking-[0.2em] uppercase font-semibold" style={{ writingMode: 'vertical-rl' }}>Bekasi</div>

            {processedBranches.map((b) => {
              const s = statusStyle(b.displayStatus);
              const isDisabled = userRole === 'Admin Cabang' && b.id_cabang !== selectedAdminBranch;
              const isSelected = b.id_cabang === selectedBranchId;

              return (
                <button
                  key={b.id_cabang}
                  onClick={() => {
                    if (isDisabled) {
                      triggerNotification(`Akses Ditolak: Anda tidak memiliki izin untuk melihat ${b.nama_cabang}.`, 'error');
                      return;
                    }
                    setSelectedBranchId(isSelected ? 'all' : b.id_cabang);
                  }}
                  style={{ left: `${b.mapCoord.x}%`, top: `${b.mapCoord.y}%` }}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 group z-10 transition-all duration-300 ${isDisabled ? 'opacity-20 cursor-not-allowed' : 'hover:z-20'}`}
                >
                  <div className={`relative flex items-center justify-center transition-all duration-300 ${isSelected ? 'scale-125' : 'group-hover:scale-110'}`}>
                    {isSelected && (
                      <div className={`absolute w-10 h-10 rounded-full ${s.dot} opacity-20 animate-ping`}></div>
                    )}
                    <div className={`w-7 h-7 rounded-full ${s.dot} flex items-center justify-center text-white font-bold text-[10px] shadow-lg ring-3 ring-white transition-shadow ${isSelected ? 'shadow-xl ring-4' : ''}`}>
                      {b.id_cabang.replace('CBG-00', '')}
                    </div>
                  </div>
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-52 bg-white border border-slate-200 p-3 rounded-xl shadow-elevated opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100 transition-all duration-200 pointer-events-none z-30">
                    <p className="text-xs font-bold text-[#0F172A]">{b.nama_cabang}</p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full ${s.bg} ${s.text}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`}></span>
                        {b.displayStatus}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-500 mt-1.5 font-medium">Omzet: {formatIDR(b.omzet)}</p>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="bg-slate-50 p-3.5 rounded-xl text-xs text-slate-500 border border-slate-100">
            <span className="font-semibold text-slate-700">Tip:</span> Klik titik cabang pada peta untuk drill-down di panel kanan.
          </div>
        </div>

        <div className="bg-white rounded-4xl border border-slate-100 shadow-card p-7 lg:col-span-4 flex flex-col">
          {selectedBranchId === 'all' ? (
            <div className="h-full flex flex-col justify-between">
              <div>
                <h4 className="text-base font-bold text-[#0F172A]">Panel Detail Cabang</h4>
                <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">Pilih salah satu cabang dari peta untuk melihat rincian finansial dan stok.</p>
              </div>
              <div className="my-10 text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                <svg className="w-10 h-10 text-slate-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                </svg>
                <span className="text-xs text-slate-400">Belum ada cabang dipilih</span>
              </div>
              <div className="space-y-3">
                <h5 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Ringkasan Pagu</h5>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-2.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500">Total Pagu</span>
                    <span className="font-semibold text-[#0F172A]">{formatIDR(financialSummary.totalPagu)}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500">Realisasi</span>
                    <span className="font-semibold text-[#0F172A]">{formatIDR(financialSummary.totalPengeluaran)}</span>
                  </div>
                </div>
              </div>
            </div>
          ) : selectedBranchData ? (
            <div className="h-full flex flex-col justify-between space-y-5">
              <div>
                <div className="flex justify-between items-start">
                  <div>
                    <span className={`inline-flex items-center gap-1.5 text-[10px] font-semibold px-2.5 py-1 rounded-full ${statusStyle(selectedBranchData.displayStatus).bg} ${statusStyle(selectedBranchData.displayStatus).text}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${statusStyle(selectedBranchData.displayStatus).dot}`}></span>
                      {selectedBranchData.displayStatus}
                    </span>
                    <h4 className="text-xl font-bold text-[#0F172A] mt-2.5 leading-tight">{selectedBranchData.nama_cabang}</h4>
                    <span className="text-xs text-slate-400 font-medium">{selectedBranchData.wilayah}, Jabodetabek</span>
                  </div>
                  <button
                    onClick={() => setSelectedBranchId('all')}
                    className="text-xs bg-slate-50 hover:bg-slate-100 text-slate-500 hover:text-slate-700 px-3 py-1.5 rounded-lg border border-slate-200 transition-all"
                  >
                    Tutup
                  </button>
                </div>
              </div>

              <div className="space-y-4 bg-slate-50 p-5 rounded-2xl border border-slate-100">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500">Pagu Bulanan</span>
                  <span className="font-semibold text-[#0F172A]">{formatIDR(selectedBranchData.pagu_anggaran)}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500">Realisasi</span>
                  <span className={`font-semibold ${selectedBranchData.total_pengeluaran > selectedBranchData.pagu_anggaran ? 'text-[#BE123C]' : 'text-[#B45309]'}`}>
                    {formatIDR(selectedBranchData.total_pengeluaran)}
                  </span>
                </div>
                <div className="space-y-1.5">
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div
                      style={{ width: `${Math.min((selectedBranchData.total_pengeluaran / selectedBranchData.pagu_anggaran) * 100, 100)}%` }}
                      className={`h-full rounded-full transition-all duration-500 ${selectedBranchData.total_pengeluaran > selectedBranchData.pagu_anggaran ? 'bg-[#BE123C]' : 'bg-blue-500'}`}
                    ></div>
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-400">
                    <span>Sisa anggaran</span>
                    <span className="font-semibold text-slate-600">{formatIDR(selectedBranchData.sisa_pagu)}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h5 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Persediaan Bahan Baku</h5>
                <div className="grid grid-cols-3 gap-2.5">
                  {selectedBranchData.inventory.stocks.map((s) => {
                    const isCritical = s.stok_saat_ini < s.safety_threshold;
                    return (
                      <div key={s.item} className={`p-3 rounded-xl border text-center transition-all ${isCritical ? 'bg-[#FFF1F2] border-[#BE123C]/10' : 'bg-slate-50 border-slate-100'}`}>
                        <span className="text-[10px] text-slate-400 block font-semibold">{s.item}</span>
                        <span className={`text-lg font-light block mt-1.5 tracking-tight ${isCritical ? 'text-[#BE123C]' : 'text-[#0F172A]'}`}>
                          {s.stok_saat_ini}
                        </span>
                        <span className="text-[9px] text-slate-400 block font-medium">{s.satuan}</span>
                        <span className="text-[8px] text-slate-400 block mt-0.5">min {s.safety_threshold}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex gap-2.5 pt-2">
                <button
                  onClick={() => { setRestockBranchId(selectedBranchId); setShowRestockModal(true); }}
                  className="flex-1 bg-white hover:bg-slate-50 text-slate-700 text-xs py-2.5 rounded-xl font-semibold border border-slate-200 transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-md text-center"
                >
                  Kirim Stok
                </button>
                <button
                  onClick={() => setShowExpenseModal(true)}
                  className="flex-1 bg-[#0F172A] hover:bg-slate-800 text-white text-xs py-2.5 rounded-xl font-semibold transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-md text-center"
                >
                  Catat Biaya
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </div>

      <div className="bg-white rounded-4xl border border-slate-100 shadow-card p-8">
        <div className="mb-6">
          <h3 className="text-lg font-bold text-[#0F172A] tracking-tight">Matriks Performa Cabang</h3>
          <p className="text-xs text-slate-400 mt-1">Ikhtisar seluruh cabang, status logistik, dan pagu operasional.</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 text-[11px] uppercase tracking-wider font-semibold">
                <th className="py-4 px-5">Cabang</th>
                <th className="py-4 px-5">Wilayah</th>
                <th className="py-4 px-5 text-right">Omzet</th>
                <th className="py-4 px-5 text-right">Pengeluaran</th>
                <th className="py-4 px-5 text-right">Pagu</th>
                <th className="py-4 px-5 text-center">Stok</th>
                <th className="py-4 px-5 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-sm">
              {processedBranches.map((b) => {
                const isDisabled = userRole === 'Admin Cabang' && b.id_cabang !== selectedAdminBranch;
                if (isDisabled) return null;
                const s = statusStyle(b.displayStatus);
                return (
                  <tr key={b.id_cabang} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 px-5 font-semibold text-[#0F172A] flex items-center gap-2.5">
                      <span className={`w-2 h-2 rounded-full ${s.dot}`}></span>
                      {b.nama_cabang}
                    </td>
                    <td className="py-4 px-5 text-slate-500">{b.wilayah}</td>
                    <td className="py-4 px-5 text-right font-semibold text-[#047857]">{formatIDR(b.omzet)}</td>
                    <td className="py-4 px-5 text-right font-semibold text-[#0F172A]">{formatIDR(b.total_pengeluaran)}</td>
                    <td className="py-4 px-5 text-right text-slate-500">{formatIDR(b.pagu_anggaran)}</td>
                    <td className="py-4 px-5 text-center">
                      <div className="flex justify-center items-center gap-1 text-[11px] font-medium">
                        {b.inventory.stocks.map((st, i) => (
                          <span key={st.item}>
                            <span className={st.stok_saat_ini < st.safety_threshold ? 'text-[#BE123C] font-bold' : 'text-slate-500'}>
                              {st.stok_saat_ini}{st.satuan.charAt(0)}
                            </span>
                            {i < b.inventory.stocks.length - 1 && <span className="text-slate-300 ml-1">/</span>}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-4 px-5 text-center">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold ${s.bg} ${s.text}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`}></span>
                        {b.displayStatus}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {showRestockModal && (
        <RestockModal
          branches={data.per_cabang.map((b) => ({ id: b.id_cabang, nama: b.nama_cabang }))}
          initialBranchId={restockBranchId}
          userRole={userRole}
          selectedAdminBranch={selectedAdminBranch}
          onClose={() => setShowRestockModal(false)}
          onSuccess={(msg) => triggerNotification(msg, 'success')}
        />
      )}
      {showExpenseModal && (
        <ExpenseModal
          branches={data.per_cabang.map((b) => ({ id: b.id_cabang, nama: b.nama_cabang }))}
          userRole={userRole}
          selectedAdminBranch={selectedAdminBranch}
          onClose={() => setShowExpenseModal(false)}
          onSuccess={(msg) => triggerNotification(msg, 'success')}
          onError={(msg) => triggerNotification(msg, 'error')}
        />
      )}
    </div>
  );
}
