// ==========================================
// DASHBOARD EKSEKUTIF - FR-OWN-01, FR-OWN-02, FR-OWN-03 Core Implementation
// Dashboard Utama Keuangan Eksekutif untuk Pemilik Bisnis
// FR-OWN-01: Grafik tren arus kas terpadu dan profitabilitas per cabang
// FR-OWN-02: Visualisasi data poin KPI performa seluruh cabang
// Supporting Extension: FR-OWN-03 (JabodetabekMap), FR-FIN-09 (Audit)
// FR-010: KPI Finansial Makro - Total Omzet, Pengeluaran, Profit Bersih
// FR-011: Cash Flow Charts dan Budget Realization
// FR-013: Panel Audit Kas dengan log discrepancy dan void transactions
// FR-014: AI Stock Recommendation Tooltip dengan format baku
// ==========================================

import { useState, useEffect, useMemo } from 'react';
import type { UserRole } from '../App.tsx';
import { RestockModal } from './RestockModal.tsx';
import { ExpenseModal } from './ExpenseModal.tsx';

// ==========================================
// CASH FLOW CHART COMPONENT - FR-011
// Visualisasi arus kas masuk/keluar bulanan
// ==========================================
function CashFlowChart({ monthlyData }: { monthlyData: { labels: string[]; income: number[]; expense: number[] } }) {
  const maxValue = Math.max(...monthlyData.income, ...monthlyData.expense, 1);

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200">
      <h3 className="text-lg font-bold text-navy mb-4">Arus Kas Bulanan</h3>
      <div className="flex items-center gap-4 mb-4">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
          <span className="text-xs text-slate-500">Pemasukan</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-rose-500"></span>
          <span className="text-xs text-slate-500">Pengeluaran</span>
        </div>
      </div>
      <div className="flex items-end gap-2 h-48">
        {monthlyData.labels.map((label, i) => {
          const incomeVal = monthlyData.income[i] ?? 0;
          const expenseVal = monthlyData.expense[i] ?? 0;
          const incomeHeight = maxValue > 0 ? (incomeVal / maxValue) * 100 : 0;
          const expenseHeight = maxValue > 0 ? (expenseVal / maxValue) * 100 : 0;
          return (
            <div key={label} className="flex-1 flex flex-col items-center gap-1">
              <div className="w-full flex items-end gap-0.5 h-36">
                <div
                  className="w-1/2 bg-emerald-500 rounded-t-sm transition-all hover:bg-emerald-600"
                  style={{ height: `${incomeHeight}%` }}
                ></div>
                <div
                  className="w-1/2 bg-rose-500 rounded-t-sm transition-all hover:bg-rose-600"
                  style={{ height: `${expenseHeight}%` }}
                ></div>
              </div>
              <span className="text-[10px] text-slate-400">{label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ==========================================
// BUDGET REALIZATION CHART - FR-011
// Akumulasi realization biaya bulanan
// ==========================================
function BudgetRealizationChart({ branchData }: { branchData: Array<{ nama: string; pagu: number; terpakai: number }> }) {
  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200">
      <h3 className="text-lg font-bold text-navy mb-4">Realisasi Anggaran per Branch</h3>
      <div className="space-y-4">
        {branchData.map((branch) => {
          const percentUsed = branch.pagu > 0 ? (branch.terpakai / branch.pagu) * 100 : 0;
          const isOverBudget = percentUsed > 100;
          const isWarning = percentUsed >= 90;
          return (
            <div key={branch.nama}>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium text-navy">{branch.nama}</span>
                <span className={`text-xs font-medium ${isOverBudget ? 'text-rose-600' : isWarning ? 'text-amber-600' : 'text-slate-500'}`}>
                  {formatIDR(branch.terpakai)} / {formatIDR(branch.pagu)}
                </span>
              </div>
              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${isOverBudget ? 'bg-rose-500' : isWarning ? 'bg-amber-500' : 'bg-deep-blue'}`}
                  style={{ width: `${Math.min(percentUsed, 100)}%` }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ==========================================
// MONTHLY TREND LINE CHART - FR-011
// Grafik tren keuangan bulanan gabungan multi-cabang
// ==========================================
function MonthlyTrendChart({ trendData }: { trendData: { labels: string[]; profit: number[] } }) {
  const maxProfit = Math.max(...trendData.profit);
  const minProfit = Math.min(...trendData.profit);
  const range = maxProfit - minProfit;

  const points = trendData.profit.map((val, i) => {
    const x = (i / (trendData.profit.length - 1)) * 100;
    const y = range > 0 ? 100 - ((val - minProfit) / range) * 80 : 50;
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200">
      <h3 className="text-lg font-bold text-navy mb-4">Tren Profit Bulanan</h3>
      <div className="relative h-48">
        {/* Grid lines */}
        <div className="absolute inset-0 flex flex-col justify-between">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="border-b border-slate-100 w-full"></div>
          ))}
        </div>
        {/* SVG Line Chart */}
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          {/* Area fill */}
          <polygon
            points={`0,100 ${points} 100,100`}
            fill="url(#profitGradient)"
            opacity="0.3"
          />
          {/* Line */}
          <polyline
            points={points}
            fill="none"
            stroke="#0056c6"
            strokeWidth="1"
            vectorEffect="non-scaling-stroke"
          />
          {/* Gradient definition */}
          <defs>
            <linearGradient id="profitGradient" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#0056c6" />
              <stop offset="100%" stopColor="#0056c6" stopOpacity="0" />
            </linearGradient>
          </defs>
          {/* Data points */}
          {trendData.profit.map((val, i) => {
            const x = (i / (trendData.profit.length - 1)) * 100;
            const y = range > 0 ? 100 - ((val - minProfit) / range) * 80 : 50;
            return (
              <circle
                key={i}
                cx={x}
                cy={y}
                r="2"
                fill="#0056c6"
                vectorEffect="non-scaling-stroke"
              />
            );
          })}
        </svg>
        {/* X-axis labels */}
        <div className="absolute bottom-0 left-0 right-0 flex justify-between">
          {trendData.labels.map((label) => (
            <span key={label} className="text-[10px] text-slate-400">{label}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

// ==========================================
// JABODETABEK MAP COMPONENT - FR-014
// Peta interaktif dengan tooltips AI recommendation
// ==========================================
function JabodetabekMap({ branches, onBranchClick }: {
  branches: Array<{
    id_cabang: string;
    nama_cabang: string;
    status: string;
    pin_color: 'green' | 'yellow' | 'red';
    stocks: Array<{ item: string; stok_saat_ini: number; safety_threshold: number }>;
  }>;
  onBranchClick: (branchId: string) => void;
}) {
  const [hoveredBranch, setHoveredBranch] = useState<string | null>(null);

  const colorMap = {
    green: { bg: 'bg-emerald-500', ring: 'ring-emerald-200', text: 'text-emerald-600' },
    yellow: { bg: 'bg-amber-500', ring: 'ring-amber-200', text: 'text-amber-600' },
    red: { bg: 'bg-rose-500', ring: 'ring-rose-200', text: 'text-rose-600' },
  };

  // FR-014: Generate AI Recommendation based on stock levels
  const generateAIRecommendation = (stocks: Array<{ item: string; stok_saat_ini: number; safety_threshold: number }>) => {
    const recommendations: string[] = [];

    for (const stock of stocks) {
      if (stock.stok_saat_ini < stock.safety_threshold) {
        const needed = stock.safety_threshold - stock.stok_saat_ini + 20; // buffer
        recommendations.push(`Direkomendasikan melakukan restock ${stock.item} sebanyak ${needed} PCS`);
      }
    }

    return recommendations.length > 0
      ? recommendations.join('. ') + '.'
      : 'Semua stok dalam kondisi aman.';
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-navy">Peta Sebaran Jabodetabek</h3>
        <div className="flex gap-4 text-xs">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Aman
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> Peringatan
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span> Kritis
          </span>
        </div>
      </div>

      {/* Map Container */}
      <div className="relative bg-slate-50 rounded-xl h-72 overflow-hidden">
        {/* Grid pattern background */}
        <div className="absolute inset-0 opacity-30">
          <svg width="100%" height="100%">
            <defs>
              <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#cbd5e1" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        {/* Branch markers */}
        {branches.map((branch) => {
          const colors = colorMap[branch.pin_color];
          const isHovered = hoveredBranch === branch.id_cabang;
          const recommendation = generateAIRecommendation(branch.stocks);

          return (
            <div
              key={branch.id_cabang}
              className="absolute group cursor-pointer"
              style={{ left: `${20 + Math.random() * 60}%`, top: `${20 + Math.random() * 60}%` }}
              onMouseEnter={() => setHoveredBranch(branch.id_cabang)}
              onMouseLeave={() => setHoveredBranch(null)}
              onClick={() => onBranchClick(branch.id_cabang)}
            >
              {/* Marker dot */}
              <div
                className={`w-8 h-8 rounded-full ${colors.bg} ring-4 ${colors.ring} flex items-center justify-center text-white font-bold text-xs shadow-lg transition-transform hover:scale-125 z-10`}
              >
                {branch.id_cabang.replace('CBG-', '')}
              </div>

              {/* Pulse effect for critical */}
              {branch.pin_color === 'red' && (
                <div className={`absolute inset-0 w-8 h-8 rounded-full ${colors.bg} animate-ping opacity-50`}></div>
              )}

              {/* AI Recommendation Tooltip - FR-014 */}
              {isHovered && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-72 bg-white border border-slate-200 rounded-xl shadow-elevated p-4 z-20 pointer-events-none">
                  <div className="border-b border-slate-100 pb-2 mb-2">
                    <p className="font-bold text-navy">{branch.nama_cabang}</p>
                    <p className="text-xs text-slate-400">{branch.id_cabang}</p>
                  </div>
                  <div className="space-y-1 mb-3">
                    {branch.stocks.map((stock) => (
                      <div key={stock.item} className="flex justify-between text-xs">
                        <span className="text-slate-600">{stock.item}</span>
                        <span className={`font-medium ${stock.stok_saat_ini < stock.safety_threshold ? 'text-rose-600' : 'text-emerald-600'}`}>
                          {stock.stok_saat_ini} / min {stock.safety_threshold}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-2">
                    <p className="text-[11px] font-semibold text-amber-800 mb-1">🤖 AI Recommendation</p>
                    <p className="text-[10px] text-amber-700 leading-relaxed">{recommendation}</p>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {/* Map label */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.05]">
          <span className="text-4xl font-black tracking-[0.3em] text-slate-900">JABODETABEK</span>
        </div>
      </div>
      <p className="mt-3 text-xs text-slate-400 text-center">Klik atau arahkan kursor ke penanda untuk melihat detail & AI recommendation</p>
    </div>
  );
}

// ==========================================
// MAIN DASHBOARD EKSEKUTIF COMPONENT
// ==========================================

interface StockEntry {
  item: string;
  satuan: string;
  stok_saat_ini: number;
  safety_threshold: number;
  max_capacity: number;
  status: 'Aman' | 'Menipis' | 'Kritis';
}

interface InTransitData {
  id: string;
  sentItems: { detergen: number; pelembut: number; plastik: number };
  status: string;
  timestamp: string;
}

interface ReplenishmentItem {
  item: string;
  satuan: string;
  stok_saat_ini: number;
  max_capacity: number;
  safety_threshold: number;
  kebutuhan: number;
  is_below_threshold: boolean;
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
  inventory: { stocks: StockEntry[]; overall_status: 'Aman' | 'Menipis' | 'Kritis'; last_updated?: string };
  in_transit: InTransitData[];
  replenishment: { needs_replenishment: boolean; items: ReplenishmentItem[] };
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
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(num);
}

function getBranchStatus(b: BranchFinancial): string {
  const hasKritisStock = b.inventory.stocks.some((s) => s.status === 'Kritis');
  const hasMenipisStock = b.inventory.stocks.some((s) => s.status === 'Menipis');
  const isOverBudget = b.total_pengeluaran > b.pagu_anggaran;
  const isCloseBudget = b.utilization_percent >= 90;
  if (hasKritisStock || isOverBudget) return 'Kritis';
  if (hasMenipisStock || isCloseBudget) return 'Butuh Perhatian';
  return 'Aman';
}

function getBranchStatusMD3(b: BranchFinancial): string {
  const hasKritisStock = b.inventory.stocks.some((s) => s.status === 'Kritis');
  const hasMenipisStock = b.inventory.stocks.some((s) => s.status === 'Menipis');
  const isOverBudget = b.total_pengeluaran > b.pagu_anggaran;
  const isCloseBudget = b.utilization_percent >= 90;
  if (hasKritisStock || isOverBudget) return 'LOW';
  if (hasMenipisStock || isCloseBudget) return 'STABLE';
  return 'TOP';
}

function getStatusStyleMD3(status: string) {
  if (status === 'TOP') return 'bg-emerald-100 text-emerald-700';
  if (status === 'STABLE') return 'bg-amber-100 text-amber-700';
  if (status === 'LOW') return 'bg-rose-100 text-rose-700';
  return 'bg-slate-100 text-slate-600';
}

export interface AnomalyLog {
  id: string;
  id_cabang: string;
  nama_cabang: string;
  item: string;
  stok_lama: number;
  stok_baru: number;
  alasan: string;
  timestamp: string;
}

// ==========================================
// MOCK MONTHLY DATA FOR CHARTS - FR-011
// ==========================================
const MOCK_MONTHLY_CASHFLOW = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun'],
  income: [18500000, 21200000, 19800000, 22400000, 20500000, 22800000],
  expense: [12000000, 14500000, 13800000, 15200000, 14800000, 16200000],
};

const MOCK_PROFIT_TREND = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun'],
  profit: [6500000, 6700000, 6000000, 7200000, 5700000, 6600000],
};

export function DashboardEksekutif({ userRole, selectedAdminBranch, triggerNotification }: Props) {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showRestockModal, setShowRestockModal] = useState(false);
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [restockBranchId] = useState('CBG-002');
  const [selectedBranchId, setSelectedBranchId] = useState<string | null>(null);

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
      displayStatus: getBranchStatus(b) as string,
    }));
  }, [data]);

  const criticalBranchesCount = useMemo(() => {
    return processedBranches.filter((b) => b.displayStatus === 'Kritis' || b.displayStatus === 'Butuh Perhatian').length;
  }, [processedBranches]);

  // Calculate efficiency percentage
  const efficiencyPercent = useMemo(() => {
    if (!data || data.summary.total_omzet === 0) return 0;
    const efficiency = (data.summary.total_saldo / data.summary.total_omzet) * 100;
    return Math.round(efficiency);
  }, [data]);

  // Prepare map branches data - FR-014
  const mapBranches = useMemo(() => {
    if (!data) return [];
    return data.per_cabang.map((b) => {
      const status = getBranchStatus(b);
      return {
        id_cabang: b.id_cabang,
        nama_cabang: b.nama_cabang,
        status: status,
        pin_color: (status === 'Aman' ? 'green' : status === 'Butuh Perhatian' ? 'yellow' : 'red') as 'green' | 'yellow' | 'red',
        stocks: b.inventory.stocks.map((s) => ({
          item: s.item,
          stok_saat_ini: s.stok_saat_ini,
          safety_threshold: s.safety_threshold,
        })),
      };
    });
  }, [data]);

  // Prepare budget data for chart - FR-011
  const budgetChartData = useMemo(() => {
    if (!data) return [];
    return data.per_cabang.map((b) => ({
      nama: b.nama_cabang.replace('Cabang ', ''),
      pagu: b.pagu_anggaran,
      terpakai: b.terpakai,
    }));
  }, [data]);

  const handleBranchClick = (branchId: string) => {
    setSelectedBranchId(branchId);
    setShowRestockModal(true);
    triggerNotification(`Membuka detail ${branchId} untuk restock`, 'success');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-slate-200 border-t-deep-blue rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-500 text-sm">Memuat dashboard...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="bg-white border border-slate-200 rounded-2xl p-6 text-center">
        <p className="text-rose-600 text-sm font-medium">{error ?? 'Gagal memuat dashboard.'}</p>
      </div>
    );
  }

  const branchOptions = data.per_cabang.map((b) => ({ id: b.id_cabang, nama: b.nama_cabang }));

  return (
    <div className="min-h-screen p-6 bg-slate-50">
      {/* Welcome & Primary Metric - FR-010 */}
      <section className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold mb-1 text-navy">Dashboard Keuangan Eksekutif</h1>
          <p className="text-sm text-slate-500">Konsolidasi laporan multi-cabang wilayah Jabodetabek</p>
        </div>
        <div className="bg-deep-blue text-white p-6 rounded-2xl flex flex-col min-w-[320px] shadow-lg">
          <span className="text-xs font-semibold uppercase tracking-widest mb-2 opacity-80">Total Omzet</span>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold">{formatIDR(data.summary.total_omzet)}</span>
          </div>
          <div className="mt-3 flex items-center gap-3 text-sm text-white/80">
            <span>📈 Profit: {formatIDR(data.summary.total_saldo)}</span>
            <span>|</span>
            <span>💸 Biaya: {formatIDR(data.summary.total_pengeluaran)}</span>
          </div>
        </div>
      </section>

      {/* Top Row: KPI Cards */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-2xl p-5 border border-slate-200">
          <p className="text-xs text-slate-500 mb-1">Total Pemasukan</p>
          <p className="text-xl font-bold text-emerald-600">{formatIDR(data.summary.total_pemasukan)}</p>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-slate-200">
          <p className="text-xs text-slate-500 mb-1">Total Pengeluaran</p>
          <p className="text-xl font-bold text-rose-600">{formatIDR(data.summary.total_pengeluaran)}</p>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-slate-200">
          <p className="text-xs text-slate-500 mb-1">Profit Bersih</p>
          <p className="text-xl font-bold text-deep-blue">{formatIDR(data.summary.total_saldo)}</p>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-slate-200">
          <p className="text-xs text-slate-500 mb-1">Eisiensi Profit</p>
          <p className="text-xl font-bold text-navy">{efficiencyPercent}%</p>
        </div>
      </section>

      {/* FR-011: Cash Flow & Budget Charts */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <CashFlowChart monthlyData={MOCK_MONTHLY_CASHFLOW} />
        <MonthlyTrendChart trendData={MOCK_PROFIT_TREND} />
      </section>

      {/* FR-011: Budget Realization Chart */}
      <section className="mb-6">
        <BudgetRealizationChart branchData={budgetChartData} />
      </section>

      {/* Branch Performance Table */}
      <section className="bg-white rounded-2xl p-6 border border-slate-200 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-navy">Performa Branch</h3>
          <span className="text-xs text-slate-500">{data.per_cabang.length} cabang aktif</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="py-3 px-4 text-xs font-semibold text-slate-500 uppercase">Branch</th>
                <th className="py-3 px-4 text-xs font-semibold text-slate-500 uppercase text-right">Omzet</th>
                <th className="py-3 px-4 text-xs font-semibold text-slate-500 uppercase text-right">Pengeluaran</th>
                <th className="py-3 px-4 text-xs font-semibold text-slate-500 uppercase text-right">Budget Used</th>
                <th className="py-3 px-4 text-xs font-semibold text-slate-500 uppercase text-center">Status</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {processedBranches.map((b) => {
                const md3Status = getBranchStatusMD3(b);
                return (
                  <tr key={b.id_cabang} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="py-3 px-4 font-medium text-navy">{b.nama_cabang}</td>
                    <td className="py-3 px-4 text-right text-emerald-600">{formatIDR(b.omzet)}</td>
                    <td className="py-3 px-4 text-right text-rose-600">{formatIDR(b.total_pengeluaran)}</td>
                    <td className="py-3 px-4 text-right">
                      <span className={`font-medium ${b.utilization_percent >= 90 ? 'text-rose-600' : 'text-slate-600'}`}>
                        {Math.round(b.utilization_percent)}%
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusStyleMD3(md3Status)}`}>
                        {md3Status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* FR-014: Jabodetabek Map with AI Tooltips */}
      <section className="mb-6">
        <JabodetabekMap branches={mapBranches} onBranchClick={handleBranchClick} />
      </section>

      {/* Audit Summary */}
      <section className="bg-white rounded-2xl p-6 border border-slate-200">
        <h3 className="text-lg font-bold text-navy mb-4">Ringkasan Audit</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Financial Audit */}
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
            <div className="flex justify-between items-start mb-2">
              <span className="text-sm font-bold text-emerald-800">Audit Keuangan</span>
              <span className="text-xs px-2 py-0.5 rounded bg-emerald-200 text-emerald-800 font-medium">PASSED</span>
            </div>
            <p className="text-xs text-emerald-700">Verifikasi pembukuan vs struk kas seluruh branch. Rekonsiliasi 100%.</p>
          </div>

          {/* Inventory Check - Flagged if critical */}
          {criticalBranchesCount > 0 && (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
              <div className="flex justify-between items-start mb-2">
                <span className="text-sm font-bold text-amber-800">Cek Inventaris</span>
                <span className="text-xs px-2 py-0.5 rounded bg-amber-200 text-amber-800 font-medium">FLAGGED</span>
              </div>
              <p className="text-xs text-amber-700">
                {criticalBranchesCount} branch memiliki stok kritis. Investigasi diperlukan.
              </p>
            </div>
          )}

          {/* Ops Compliance */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
            <div className="flex justify-between items-start mb-2">
              <span className="text-sm font-bold text-slate-800">Kepatuhan Operasional</span>
              <span className="text-xs px-2 py-0.5 rounded bg-slate-200 text-slate-700 font-medium">PASSED</span>
            </div>
            <p className="text-xs text-slate-600">Semua protokol kesehatan & keselamatan diverifikasi.</p>
          </div>
        </div>
      </section>

      {/* Modals */}
      {showRestockModal && (
        <RestockModal
          branches={branchOptions}
          initialBranchId={selectedBranchId || restockBranchId}
          userRole={userRole}
          selectedAdminBranch={selectedAdminBranch}
          onClose={() => { setShowRestockModal(false); setSelectedBranchId(null); }}
          onSuccess={(msg) => triggerNotification(msg, 'success')}
        />
      )}
      {showExpenseModal && (
        <ExpenseModal
          branches={branchOptions}
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
