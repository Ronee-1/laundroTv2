import { useState, useEffect, useMemo } from 'react';
import type { UserRole } from '../App.tsx';
import { RestockModal } from './RestockModal.tsx';
import { ExpenseModal } from './ExpenseModal.tsx';

// ==========================================
// DASHBOARD EKSEKUTIF - FR-OWN-01, FR-OWN-02 Core Implementation
// Dashboard Utama Keuangan Eksekutif untuk Pemilik Bisnis
// FR-OWN-01: Grafik tren arus kas terpadu dan profitabilitas per cabang
// FR-OWN-02: Visualisasi data poin KPI performa seluruh cabang
// Supporting Extension: FR-OWN-03 (Jabodetabek Map), FR-FIN-09 (Audit)
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
  const hasKritisStock = b.inventory.stocks.some((s) => s.status === 'Kritis');
  const hasMenipisStock = b.inventory.stocks.some((s) => s.status === 'Menipis');
  const isOverBudget = b.total_pengeluaran > b.pagu_anggaran;
  const isCloseBudget = b.utilization_percent >= 90;
  if (hasKritisStock || isOverBudget) return 'Kritis';
  if (hasMenipisStock || isCloseBudget) return 'Butuh Perhatian';
  return 'Aman';
}

function getStatusStyle(status: string) {
  if (status === 'Aman') return { bg: 'bg-teal-50 text-teal border-teal-200', dot: 'bg-teal' };
  if (status === 'Menipis' || status === 'Butuh Perhatian') return { bg: 'bg-amber-50 text-amber-600 border-amber-200', dot: 'bg-amber-500' };
  if (status === 'Kritis') return { bg: 'bg-red-50 text-red-600 border-red-200', dot: 'bg-red-500' };
  return { bg: 'bg-slate-100 text-slate-600 border-slate-200', dot: 'bg-slate-500' };
}

interface AuditLogEntry {
  id: string;
  id_cabang: string;
  nama_cabang: string;
  type: 'warning' | 'info';
  message: string;
  timestamp: string;
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

export function DashboardEksekutif({ userRole, selectedAdminBranch, triggerNotification }: Props) {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedBranchId, setSelectedBranchId] = useState<string>('all');
  const [showRestockModal, setShowRestockModal] = useState(false);
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [restockBranchId, setRestockBranchId] = useState('CBG-002');
  const [anomalies, setAnomalies] = useState<AnomalyLog[]>([]);

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

    async function fetchAnomalies() {
      try {
        const res = await fetch('/api/owner/anomalies');
        const json = await res.json();
        if (cancelled) return;
        if (res.ok && json.success) setAnomalies(json.anomalies);
      } catch { /* ignore */ }
    }

    fetchDashboard();
    if (userRole === 'Owner') fetchAnomalies();
    return () => { cancelled = true; };
  }, [userRole]);

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

  const criticalBranchesCount = useMemo(() => {
    return processedBranches.filter((b) => b.displayStatus === 'Kritis' || b.displayStatus === 'Butuh Perhatian').length;
  }, [processedBranches]);

  const isAnyStockCritical = useMemo(() => {
    return processedBranches.some((branch) =>
      branch.inventory.stocks.some((stock) => {
        if (stock.item === 'Detergen' && stock.stok_saat_ini < 50) return true;
        if (stock.item === 'Pelembut' && stock.stok_saat_ini < 50) return true;
        if (stock.item === 'Plastik' && stock.stok_saat_ini < 100) return true;
        return false;
      })
    );
  }, [processedBranches]);

  const mockAuditLogs: AuditLogEntry[] = [
    {
      id: 'AUD-001',
      id_cabang: 'CBG-005',
      nama_cabang: 'Cabang Bogor Raya',
      type: 'warning',
      message: 'Selisih Kas Rp. -5.000',
      timestamp: new Date().toISOString(),
    },
  ];

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
        <p className="text-red-600 text-sm font-medium">{error ?? 'Gagal memuat data.'}</p>
      </div>
    );
  }

  const branchOptions = data.per_cabang.map((b) => ({ id: b.id_cabang, nama: b.nama_cabang }));

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-navy tracking-tight">Monitoring Multi-Cabang</h1>
          <p className="text-sm text-slate-500 mt-1">Dashboard real-time untuk logistik, stok &amp; keuangan</p>
        </div>
        {userRole === 'Owner' && (
          <div className="flex items-center gap-3">
            <button
              onClick={() => { setRestockBranchId('CBG-002'); setShowRestockModal(true); }}
              className="bg-white border border-slate-200 text-navy px-4 py-2 rounded-2xl text-sm font-medium hover:border-deep-blue transition-all"
            >
              Kirim Stok
            </button>
            <button
              onClick={() => setShowExpenseModal(true)}
              className="bg-deep-blue text-white px-4 py-2 rounded-2xl text-sm font-medium hover:bg-navy transition-all"
            >
              + Catat Pengeluaran
            </button>
          </div>
        )}
      </div>

      {/* Critical Stock Alert */}
      {isAnyStockCritical && (
        <div className="bg-red-50 border border-red-200 px-4 py-3 rounded-2xl flex items-center gap-3">
          <span className="flex h-2.5 w-2.5 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-600"></span>
          </span>
          <div>
            <h4 className="text-sm font-bold text-red-600 uppercase tracking-wide">Stok Kritis / Menipis</h4>
            <p className="text-xs text-slate-500 mt-0.5">Beberapa persediaan bahan baku berada di bawah batas pengaman minimum!</p>
          </div>
        </div>
      )}

      {/* 3-KOLOM LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* KOLOM KIRI: KPI */}
        <div className="space-y-4">
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Ringkasan KPI</h3>
          <div className="bg-white border border-slate-200 rounded-2xl p-6">
            <span className="text-xs font-medium text-slate-500">Total Konsolidasi Omzet</span>
            <div className="text-3xl font-bold text-navy mt-2">Rp91.200.000</div>
            <span className="text-xs text-teal font-medium mt-2 block">Pendapatan seluruh cabang bulan ini</span>
          </div>
          <div className="bg-white border border-slate-200 rounded-2xl p-6">
            <span className="text-xs font-medium text-slate-500">Batas Anggaran Operasional</span>
            <div className="text-3xl font-bold text-navy mt-2">Rp22.500.000</div>
            <div className="mt-4 w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
              <div className="h-full bg-deep-blue rounded-full" style={{ width: '45%' }}></div>
            </div>
            <div className="flex justify-between text-xs text-slate-400 mt-3">
              <span>Terpakai: Rp10.150.000</span>
              <span className="text-teal font-medium">Sisa: Rp12.350.000</span>
            </div>
          </div>
          <div className="bg-white border border-slate-200 rounded-2xl p-6">
            <span className="text-xs font-medium text-slate-500">Profit Bersih</span>
            <div className="text-3xl font-bold text-teal mt-2">Rp69.050.000</div>
            <span className="text-xs text-slate-500 mt-2 block">Efisiensi: 75.8%</span>
          </div>
          <div className="bg-white border border-slate-200 rounded-2xl p-6">
            <span className="text-xs font-medium text-slate-500">Cabang Butuh Perhatian</span>
            <div className="text-3xl font-bold text-amber-600 mt-2">{criticalBranchesCount}</div>
            <span className="text-xs text-slate-500 mt-2 block">Butuh intervensi stok/dana</span>
          </div>
        </div>

        {/* KOLOM TENGAH: Peta */}
        <div className="space-y-4">
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Peta Sebaran</h3>
          <div className="bg-white border border-slate-200 rounded-2xl p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-base font-bold text-navy">Peta Sebaran</h3>
                <p className="text-xs text-slate-400 mt-0.5">Klik penanda cabang</p>
              </div>
              <div className="flex items-center gap-4 text-xs">
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-teal"></span> Aman</span>
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-500"></span> Perhatian</span>
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-red-500"></span> Kritis</span>
              </div>
            </div>
            <div className="relative bg-base-bg border border-slate-200 rounded-2xl h-64 overflow-hidden">
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:2rem_2rem] opacity-30"></div>
              {processedBranches.map((b) => {
                const s = getStatusStyle(b.displayStatus);
                const isDisabled = userRole === 'Admin Cabang' && b.id_cabang !== selectedAdminBranch;
                const isSelected = b.id_cabang === selectedBranchId;
                return (
                  <button
                    key={b.id_cabang}
                    onClick={() => {
                      if (isDisabled) {
                        triggerNotification('Akses Ditolak: ' + b.nama_cabang + '.', 'error');
                        return;
                      }
                      setSelectedBranchId(isSelected ? 'all' : b.id_cabang);
                    }}
                    style={{ left: b.mapCoord.x + '%', top: b.mapCoord.y + '%' }}
                    className={'absolute -translate-x-1/2 -translate-y-1/2 group z-10 transition-all duration-200' + (isDisabled ? ' opacity-30 cursor-not-allowed' : ' hover:z-20')}
                  >
                    <div className={'relative flex items-center justify-center transition-all' + (isSelected ? ' scale-125' : ' group-hover:scale-110')}>
                      {isSelected && (
                        <div className={'absolute w-10 h-10 rounded-full ' + s.dot + ' opacity-20 animate-ping'}></div>
                      )}
                      <div className={'w-8 h-8 rounded-full ' + s.dot + ' flex items-center justify-center text-white font-bold text-xs border-2 border-white'}>
                        {b.id_cabang.replace('CBG-00', '')}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
          {selectedBranchData?.id_cabang === 'CBG-002' && (
            <div className="bg-white border-2 border-deep-blue rounded-2xl p-5">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-deep-blue rounded-2xl flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673c.55 0 .993.435 1.258 1.258l3.976-5.996m2.105-2.718a3.035 3.035 0 014.718 0l3.976 5.996m0 0a9.912 9.912 0 01-3.035 3.035m1.965-2.718l3.976-5.996m-3.967-2.718c.55 0 .993-.436 1.258-1.258m1.258-2.718A9.912 9.912 0 012.258 9.912" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-deep-blue">LaundroT AI Recommendation</h4>
                  <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                    &quot;Stok Detergen dan Plastik Packing berada di bawah batas pengaman (Detergen: 12/50 pcs, Plastik: 18/100 pcs)...&quot;
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* KOLOM KANAN: Audit Log */}
        <div className="space-y-4">
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Audit &amp; Log</h3>
          <div className="bg-white border border-slate-200 rounded-2xl p-6">
            <h4 className="text-sm font-semibold text-navy">Log Perbandingan Dana</h4>
            <p className="text-xs text-slate-400 mt-0.5">Peringatan real-time selisih dana cabang</p>
            <div className="mt-4 space-y-2">
              {mockAuditLogs.map((log) => (
                <div key={log.id} className="bg-red-50 border border-red-200 rounded-2xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-semibold text-red-600 bg-red-100 px-2 py-0.5 rounded-full">UNAUDITED / Selisih Dana</span>
                    <span className="text-xs text-slate-500">{log.nama_cabang}</span>
                  </div>
                  <p className="text-xs text-navy font-medium">{log.message}</p>
                  <p className="text-[10px] text-slate-400 mt-1">Void log pembatalan transaksi: #TX-2026-0705-001</p>
                </div>
              ))}
              {mockAuditLogs.length === 0 && (
                <p className="text-xs text-slate-400 text-center py-4">Tidak ada log audit aktif</p>
              )}
            </div>
          </div>
          {anomalies.length > 0 && (
            <div className="bg-white border border-slate-200 rounded-2xl p-6">
              <h4 className="text-sm font-semibold text-navy">Log Anomali Operasional</h4>
              <p className="text-xs text-slate-400 mt-0.5">Stock adjustment cabang</p>
              <div className="mt-4 space-y-2">
                {anomalies.map((anm) => (
                  <div key={anm.id} className="bg-amber-50 border border-amber-200 rounded-2xl p-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-amber-600 bg-amber-100 px-2 py-0.5 rounded-full">{anm.id}</span>
                      <span className="text-xs text-slate-500">{anm.nama_cabang}</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      Penyesuaian <strong>{anm.item}</strong>: {anm.stok_lama} pcs → <strong className="text-red-600">{anm.stok_baru} pcs</strong>
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Full Width Table */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6">
        <h3 className="text-base font-bold text-navy mb-4">Matriks Performa Cabang</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-200 text-xs text-slate-400 uppercase tracking-wider font-medium">
                <th className="py-3 px-3">Cabang</th>
                <th className="py-3 px-3">Wilayah</th>
                <th className="py-3 px-3 text-right">Omzet</th>
                <th className="py-3 px-3 text-right">Pengeluaran</th>
                <th className="py-3 px-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {processedBranches.map((b) => {
                const s = getStatusStyle(b.displayStatus);
                return (
                  <tr key={b.id_cabang} className="hover:bg-base-bg transition-all">
                    <td className="py-3 px-3 font-medium text-navy">{b.nama_cabang}</td>
                    <td className="py-3 px-3 text-slate-500">{b.wilayah}</td>
                    <td className="py-3 px-3 text-right font-medium text-teal">{formatIDR(b.omzet)}</td>
                    <td className="py-3 px-3 text-right font-medium text-navy">{formatIDR(b.total_pengeluaran)}</td>
                    <td className="py-3 px-3 text-center">
                      <span className={'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ' + s.bg}>
                        <span className={'w-1.5 h-1.5 rounded-full ' + s.dot}></span>
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

      {/* Modals */}
      {showRestockModal && (
        <RestockModal
          branches={branchOptions}
          initialBranchId={restockBranchId}
          userRole={userRole}
          selectedAdminBranch={selectedAdminBranch}
          onClose={() => setShowRestockModal(false)}
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
