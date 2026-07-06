// ==========================================
// DASHBOARD ADMIN CABANG - Material Design 3
// Layout untuk Admin Branch dengan Budget Monitor,
// Inventory Matrix, dan Courier Allocation
// FR-006: Satuan PCS untuk seluruh bahan baku
// FR-007: Indikator Stok Kritis (Detergen<50, Pelembut<50, Plastik<100 pcs)
// FR-012: Separate budget warning banners
// Peringatan 24 jam: Banner jika data stok belum diperbarui
// ==========================================

import { useState } from 'react';
import type { UserRole } from '../App.tsx';
import { RestockModal } from './RestockModal.tsx';

interface StockItem {
  item: string;
  satuan: string;
  stok_saat_ini: number;
  safety_threshold: number;
  max_capacity: number;
  status: 'Aman' | 'Menipis' | 'Kritis';
}

interface BranchData {
  id_cabang: string;
  nama_cabang: string;
  budget: {
    pagu_anggaran: number;
    terpakai: number;
    sisa_pagu: number;
    utilization_percent: number;
    daily_average: number;
  };
  inventory: {
    stocks: StockItem[];
    overall_status: 'Aman' | 'Menipis' | 'Kritis';
    last_updated?: string;
  };
}

interface Courier {
  id_kurir: string;
  nama_kurir: string;
  initials: string;
  status: 'Pickup' | 'Delivery' | 'Idle';
  current_task?: string;
  capacity_percent: number;
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
    maximumFractionDigits: 0,
  }).format(num);
}

const MOCK_BRANCH_DATA: BranchData = {
  id_cabang: 'CBG-002',
  nama_cabang: 'Jakarta Selatan',
  budget: {
    pagu_anggaran: 22500000,
    terpakai: 16200000,
    sisa_pagu: 6300000,
    utilization_percent: 72,
    daily_average: 540000,
  },
  inventory: {
    stocks: [
      { item: 'Detergen Cair', satuan: 'PCS', stok_saat_ini: 12, safety_threshold: 50, max_capacity: 100, status: 'Kritis' },
      { item: 'Pelembut', satuan: 'PCS', stok_saat_ini: 4, safety_threshold: 50, max_capacity: 80, status: 'Kritis' },
      { item: 'Plastik Packing', satuan: 'PCS', stok_saat_ini: 450, safety_threshold: 100, max_capacity: 500, status: 'Aman' },
    ],
    overall_status: 'Kritis',
    last_updated: new Date(Date.now() - 25 * 60 * 60 * 1000).toISOString(),
  },
};

const MOCK_COURIERS: Courier[] = [
  { id_kurir: 'CR-9921', nama_kurir: 'Agus Maulana', initials: 'AM', status: 'Pickup', current_task: 'Sudirman Residence (B3)', capacity_percent: 80 },
  { id_kurir: 'CR-9925', nama_kurir: 'Siti Putri', initials: 'SP', status: 'Idle', current_task: undefined, capacity_percent: 0 },
  { id_kurir: 'CR-9928', nama_kurir: 'Rizky H.', initials: 'RH', status: 'Delivery', current_task: 'Thamrin Office Park (Unit 4)', capacity_percent: 45 },
  { id_kurir: 'CR-9930', nama_kurir: 'Budi Santoso', initials: 'BS', status: 'Pickup', current_task: 'Kemang Village (A1)', capacity_percent: 65 },
  { id_kurir: 'CR-9931', nama_kurir: 'Dewi Lestari', initials: 'DL', status: 'Idle', current_task: undefined, capacity_percent: 0 },
];

function getStockStatusStyle(status: string) {
  if (status === 'Kritis') {
    return { container: 'bg-[#ffdad6]/20 border-[#ba1a1a]', icon: 'bg-[#ba1a1a] text-white', text: 'text-[#ba1a1a]', bar: 'bg-[#ba1a1a]', badge: 'bg-[#ffdad6] text-[#93000a]' };
  }
  if (status === 'Menipis') {
    return { container: 'bg-[#fef3c7]/20 border-[#d97706]', icon: 'bg-[#d97706] text-white', text: 'text-[#d97706]', bar: 'bg-[#d97706]', badge: 'bg-[#fef3c7] text-[#92400e]' };
  }
  return { container: 'border-[#c7c5d4] hover:border-[#0056c6]', icon: 'bg-[#d3e4fe] text-[#15157d]', text: 'text-[#0b1c30]', bar: 'bg-[#0056c6]', badge: 'bg-[#d3e4fe] text-[#15157d]' };
}

function getStatusBadgeStyle(status: string) {
  if (status === 'Pickup') return 'bg-[#d3e4fe] text-[#0056c6]';
  if (status === 'Delivery') return 'bg-[#15157d] text-white';
  return 'bg-[#dce9ff] text-[#464652]';
}

export function DashboardAdmin({ userRole, selectedAdminBranch, triggerNotification }: Props) {
  const [branchData] = useState<BranchData>(MOCK_BRANCH_DATA);
  const [couriers] = useState<Courier[]>(MOCK_COURIERS);
  const [showRestockModal, setShowRestockModal] = useState(false);

  const activeCouriers = couriers.filter(c => c.status !== 'Idle').length;
  const idleCouriers = couriers.filter(c => c.status === 'Idle').length;
  const criticalStockCount = branchData.inventory.stocks.filter(s => s.status === 'Kritis').length;

  const lastUpdated = branchData.inventory.last_updated ? new Date(branchData.inventory.last_updated) : null;
  const showInactivityWarning = lastUpdated ? (Date.now() - lastUpdated.getTime()) >= 24 * 60 * 60 * 1000 : false;
  const isBudgetExceeded = branchData.budget.sisa_pagu <= 0;
  const isBudgetWarning = branchData.budget.utilization_percent >= 90 && branchData.budget.sisa_pagu > 0;

  return (
    <div className="min-h-screen p-6" style={{ backgroundColor: '#f8f9ff' }}>
      {/* FR-012: Budget Exceeded Banner */}
      {isBudgetExceeded && (
        <div className="mb-4 p-4 rounded-xl flex items-center gap-3 animate-pulse" style={{ backgroundColor: '#ffdad6', border: '1px solid #ba1a1a' }}>
        <svg className="w-5 h-5 flex-shrink-0" style={{ color: '#ba1a1a' }} fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1.414 0L3 10.586l-1.293-1.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4a1 1 0 000-1.414z" clipRule="evenodd" /></svg>
        <div>
          <p className="text-sm font-bold" style={{ color: '#ba1a1a' }}>⚠️ BATAS ANGGARAN TERLAMPAUI</p>
          <p className="text-xs" style={{ color: '#93000a' }}>Sisa anggaran cabang telah menyentuh Rp0 atau minus. Pengeluaran baru akan ditolak sistem.</p>
        </div>
      </div>
      )}

      {/* FR-012: Budget Warning (90%+ but not exceeded) */}
      {isBudgetWarning && !isBudgetExceeded && (
        <div className="mb-4 p-4 rounded-xl flex items-center gap-3" style={{ backgroundColor: '#fef3c7', border: '1px solid #d97706' }}>
        <svg className="w-5 h-5 flex-shrink-0" style={{ color: '#d97706' }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77 1.333-2.694 1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
        <div>
          <p className="text-sm font-semibold" style={{ color: '#92400e' }}>⚠️ Peringatan Anggaran Mendekati Batas</p>
          <p className="text-xs" style={{ color: '#a16207' }}>Anggaran operasional telah terpakai {branchData.budget.utilization_percent}%. Sisa: {formatIDR(branchData.budget.sisa_pagu)}.</p>
        </div>
      </div>
      )}

      {/* FR-007: 24-hour Inactivity Warning Banner */}
      {showInactivityWarning && (
        <div className="mb-4 p-4 rounded-xl flex items-center gap-3" style={{ backgroundColor: '#fef3c7', border: '1px solid #d97706' }}>
        <svg className="w-5 h-5 flex-shrink-0" style={{ color: '#d97706' }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77 1.333-2.694 1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
        <div>
          <p className="text-sm font-semibold" style={{ color: '#92400e' }}>Peringatan: Data Stok Belum Berhasil Diperbarui</p>
          <p className="text-xs" style={{ color: '#a16207' }}>Data stok fisik gudang belum diperbarui lebih dari 24 jam. Segera update data untuk akurasi laporan.</p>
        </div>
      </div>
      )}

      {/* FR-007: Stock Critical Banner - SEPARATE from budget warning */}
      {criticalStockCount > 0 && (
        <div className="mb-4 p-4 rounded-xl flex items-center gap-3 animate-pulse" style={{ backgroundColor: '#ffdad6', border: '1px solid #ba1a1a' }}>
        <svg className="w-5 h-5 flex-shrink-0" style={{ color: '#ba1a1a' }} fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M8.257 3.064c1.153-1.144 3.026-.948 4.253 0a7.5 7.5 0 00-4.486 6.617l-.433 2.488a.5.5 0 01-.865.5l2.496-4.983A7.5 7.5 0 008.257 3.064zM11.743 3.066a7.5 7.5 0 014.486 6.617l.433 2.488a.5.5 0 01-.865.5l-2.496-4.983a7.5 7.5 0 00-4.486-6.617l.433-2.488a.5.5 0 01.865-.5l-2.496 4.983A7.5 7.5 0 0011.743 3.066z" clipRule="evenodd" /></svg>
        <div>
          <p className="text-sm font-bold" style={{ color: '#ba1a1a' }}>⚠️ STOK KRITIS</p>
          <p className="text-xs" style={{ color: '#93000a' }}>{criticalStockCount} item bahan baku di bawah batas pengaman minimum! Segera lakukan restock.</p>
        </div>
      </div>
      )}

      {/* Header with Action Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold" style={{ color: '#15157d' }}>Branch Overview</h1>
          <p className="text-base" style={{ color: '#464652' }}>Real-time status of {branchData.nama_cabang} Branch operations.</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-6 py-3 rounded-lg font-semibold shadow-md hover:opacity-90 active:scale-95 transition-all" style={{ backgroundColor: '#0056c6', color: 'white' }}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM12 9v3m0 0v3m0-3h3m-3 0h-3M5 21a4 4 0 01-4-4V9a4 4 0 014-4h4a4 4 0 014 4v8a4 4 0 01-4 4H5z" /></svg>
            Input Pelanggan Baru
          </button>
        </div>
      </div>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* 1. Budget Monitor Card */}
        <div className="md:col-span-4 rounded-xl p-6 flex flex-col justify-between overflow-hidden" style={{ backgroundColor: 'white', border: '1px solid #c7c5d4' }}>
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-xl font-semibold" style={{ color: '#0b1c30' }}>Budget Monitor</h3>
              <p className="text-xs" style={{ color: '#464652' }}>Monthly Operational Limit</p>
            </div>
            <div className="p-2 rounded-lg" style={{ backgroundColor: '#e5eeff' }}>
              <svg className="w-5 h-5" style={{ color: '#0056c6' }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 2h1m-5 6h1m-4-8h1m-4 4H8m4 4h1m-5 6h1m-4-8h1" /></svg>
            </div>
          </div>
          <div className="mb-4">
            <div className="flex justify-between items-end mb-1">
              <span className="text-5xl font-bold" style={{ color: '#15157d' }}>{branchData.budget.utilization_percent}%</span>
              <span className="text-sm" style={{ color: '#464652' }}>{formatIDR(branchData.budget.terpakai)} / {formatIDR(branchData.budget.pagu_anggaran)}</span>
            </div>
            <div className="w-full h-3 rounded-full overflow-hidden" style={{ backgroundColor: '#e5eeff' }}>
              <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${branchData.budget.utilization_percent}%`, backgroundColor: isBudgetExceeded ? '#ba1a1a' : isBudgetWarning ? '#d97706' : '#0056c6' }}></div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="p-2 rounded-lg" style={{ backgroundColor: '#eff4ff' }}>
              <p className="text-xs" style={{ color: '#464652' }}>Daily Average</p>
              <p className="text-xl font-semibold" style={{ color: '#0b1c30' }}>{formatIDR(branchData.budget.daily_average)}</p>
            </div>
            <div className="p-2 rounded-lg" style={{ backgroundColor: isBudgetExceeded ? '#ffdad6' : '#eff4ff' }}>
              <p className="text-xs" style={{ color: isBudgetExceeded ? '#ba1a1a' : '#464652' }}>Remaining</p>
              <p className="text-xl font-semibold" style={{ color: isBudgetExceeded ? '#ba1a1a' : isBudgetWarning ? '#d97706' : '#0056c6' }}>{formatIDR(branchData.budget.sisa_pagu)}</p>
            </div>
          </div>
        </div>

        {/* 2. Inventory Matrix Card */}
        <div className="md:col-span-8 rounded-xl p-6" style={{ backgroundColor: 'white', border: '1px solid #c7c5d4' }}>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold" style={{ color: '#0b1c30' }}>Inventory Matrix</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {branchData.inventory.stocks.map((stock) => {
              const style = getStockStatusStyle(stock.status);
              const percent = Math.round((stock.stok_saat_ini / stock.max_capacity) * 100);
              const belowPercent = stock.safety_threshold > 0 ? Math.round(((stock.safety_threshold - stock.stok_saat_ini) / stock.safety_threshold) * 100) : 0;
              return (
                <div key={stock.item} className={`p-4 rounded-xl border transition-colors ${style.container}`} style={{ backgroundColor: stock.status === 'Kritis' ? 'rgba(255, 218, 214, 0.2)' : 'white' }}>
                  <div className="flex items-center gap-2 mb-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${style.icon}`}>
                      {stock.item === 'Detergen Cair' && <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-1.172a2 2 0 01-1.414-.586l-.828-.828A2 2 0 0016.172 8H8a2 2 0 00-2 2v4a2 2 0 002 2h1z" /></svg>}
                      {stock.item === 'Pelembut' && <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>}
                      {stock.item === 'Plastik Packing' && <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4H6zM3 6h18M16 10a4 4 0 01-8 0" /></svg>}
                    </div>
                    <span className="text-sm font-semibold">{stock.item}</span>
                  </div>
                  <div className="flex justify-between items-end">
                    <span className="text-3xl font-bold" style={{ color: stock.status === 'Kritis' ? '#ba1a1a' : '#0b1c30' }}>{stock.stok_saat_ini} <small className="text-base font-normal" style={{ color: '#464652' }}>{stock.satuan}</small></span>
                    <div className="flex flex-col items-end">
                      <span className="text-xs" style={{ color: '#464652' }}>Safety: {stock.safety_threshold}{stock.satuan}</span>
                      {stock.status === 'Kritis' ? <span className="text-xs font-bold" style={{ color: '#ba1a1a' }}>{belowPercent}% Below</span> : <span className="text-xs font-bold" style={{ color: '#0056c6' }}>Optimal</span>}
                    </div>
                  </div>
                  <div className="mt-3 w-full h-1 rounded-full" style={{ backgroundColor: '#e5eeff' }}>
                    <div className={`h-full rounded-full ${stock.status === 'Kritis' ? 'animate-pulse' : ''}`} style={{ width: `${percent}%`, backgroundColor: stock.status === 'Kritis' ? '#ba1a1a' : '#0056c6' }}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 3. Courier Allocation Card - Full Width */}
        <div className="md:col-span-12 rounded-xl overflow-hidden" style={{ backgroundColor: 'white', border: '1px solid #c7c5d4' }}>
          <div className="p-4 border-b flex justify-between items-center" style={{ backgroundColor: '#eff4ff', borderColor: '#c7c5d4' }}>
            <h3 className="text-xl font-semibold" style={{ color: '#0b1c30' }}>Courier Allocation</h3>
            <div className="flex gap-4 text-xs" style={{ color: '#464652' }}>
              <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full" style={{ backgroundColor: '#0056c6' }}></span>{activeCouriers} Active</div>
              <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full" style={{ backgroundColor: '#777683' }}></span>{idleCouriers} Idle</div>
            </div>
          </div>
          <table className="w-full text-left">
            <thead className="text-sm uppercase tracking-wider" style={{ backgroundColor: '#e5eeff', color: '#464652' }}>
              <tr><th className="px-4 py-3">Courier Name</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Current Task</th><th className="px-4 py-3">Capacity</th><th className="px-4 py-3 text-right">Action</th></tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: '#c7c5d4' }}>
              {couriers.map((courier) => (
                <tr key={courier.id_kurir} className="hover:bg-[#f8f9ff] transition-colors" style={{ backgroundColor: courier.status === 'Idle' ? 'rgba(239, 244, 255, 0.5)' : 'white' }}>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-9 h-9 rounded-full flex items-center justify-center font-bold" style={{ backgroundColor: courier.status === 'Idle' ? '#dce9ff' : '#e1e0ff', color: '#15157d' }}>{courier.initials}</div>
                      <div><p className="text-sm font-semibold" style={{ color: '#0b1c30' }}>{courier.nama_kurir}</p><p className="text-xs" style={{ color: '#464652' }}>#{courier.id_kurir}</p></div>
                    </div>
                  </td>
                  <td className="px-4 py-4"><span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeStyle(courier.status)}`}>{courier.status}</span></td>
                  <td className="px-4 py-4 text-base" style={{ color: '#0b1c30' }}>{courier.current_task || <span className="italic" style={{ color: '#777683' }}>Available for dispatch</span>}</td>
                  <td className="px-4 py-4"><div className="w-24 h-2 rounded-full" style={{ backgroundColor: '#e5eeff' }}><div className="h-full rounded-full" style={{ width: `${courier.capacity_percent}%`, backgroundColor: '#0056c6' }}></div></div></td>
                  <td className="px-4 py-4 text-right"><button className="p-2 rounded-full hover:bg-[#e5eeff] transition-colors" style={{ color: '#464652' }}><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 12a1 1 0 110-2 1 1 0 010 2zm0 0a1 1 0 100-2 1 1 0 000 2z" /></svg></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="fixed -bottom-10 -right-10 w-64 h-64 rounded-full -z-10 pointer-events-none opacity-10" style={{ backgroundColor: '#0056c6', filter: 'blur(100px)' }}></div>

      {showRestockModal && (
        <RestockModal
          branches={[{ id: branchData.id_cabang, nama: branchData.nama_cabang }]}
          initialBranchId={branchData.id_cabang}
          userRole={userRole}
          selectedAdminBranch={selectedAdminBranch}
          onClose={() => setShowRestockModal(false)}
          onSuccess={(msg) => triggerNotification(msg, 'success')}
        />
      )}
    </div>
  );
}
