// ==========================================
// DASHBOARD ADMIN CABANG - Material Design 3
// Layout untuk Admin Branch dengan Budget Monitor,
// Inventory Matrix, dan Courier Allocation
// FR-006: Satuan PCS untuk seluruh bahan baku
// FR-007: Indikator Stok Kritis (Detergen<50, Pelembut<50, Plastik<100 pcs)
// FR-012: Separate budget warning banners
// Peringatan 24 jam: Banner jika data stok belum diperbarui
//
// NOTE: Data inventory di bawah ini HARUS SAMA dengan data di
// hub/src/services/inventory.ts - INVENTORY array
// Pastikan kedua file sinkron saat update data stok
// ==========================================

import { useState, useEffect, useRef } from 'react';
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
  is_available: boolean;
  status: 'Available' | 'Busy' | 'Offline';
  active_tasks: number;
  last_assigned?: string;
  current_task?: {
    id_order: string;
    alamat: string;
    status: string;
  } | null;
}

interface UnassignedOrder {
  id_order: string;
  customer_name?: string;
  alamat_penjemputan: string;
  berat_kg?: number;
  status: string;
  google_maps_url?: string;
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

const MOCK_BRANCH_DATA_MAP: Record<string, BranchData> = {
  'CBG-001': {
    id_cabang: 'CBG-001',
    nama_cabang: 'Depok (Pusat)',
    budget: {
      pagu_anggaran: 5000000,
      terpakai: 350000,
      sisa_pagu: 4650000,
      utilization_percent: 7,
      daily_average: 50000,
    },
    inventory: {
      stocks: [
        { item: 'Detergen Cair', satuan: 'PCS', stok_saat_ini: 45, safety_threshold: 50, max_capacity: 100, status: 'Menipis' },
        { item: 'Pelembut', satuan: 'PCS', stok_saat_ini: 30, safety_threshold: 50, max_capacity: 80, status: 'Menipis' },
        { item: 'Plastik Packing', satuan: 'PCS', stok_saat_ini: 120, safety_threshold: 100, max_capacity: 200, status: 'Aman' },
      ],
      overall_status: 'Menipis',
      last_updated: new Date().toISOString(),
    },
  },
  'CBG-002': {
    id_cabang: 'CBG-002',
    nama_cabang: 'Jakarta Selatan',
    budget: {
      pagu_anggaran: 5000000,
      terpakai: 2300000,
      sisa_pagu: 2700000,
      utilization_percent: 46,
      daily_average: 328571,
    },
    inventory: {
      stocks: [
        { item: 'Detergen Cair', satuan: 'PCS', stok_saat_ini: 12, safety_threshold: 50, max_capacity: 100, status: 'Kritis' },
        { item: 'Pelembut', satuan: 'PCS', stok_saat_ini: 25, safety_threshold: 50, max_capacity: 80, status: 'Kritis' },
        { item: 'Plastik Packing', satuan: 'PCS', stok_saat_ini: 18, safety_threshold: 100, max_capacity: 200, status: 'Kritis' },
      ],
      overall_status: 'Kritis',
      last_updated: new Date(Date.now() - 25 * 60 * 60 * 1000).toISOString(),
    },
  },
  'CBG-003': {
    id_cabang: 'CBG-003',
    nama_cabang: 'Bekasi Timur',
    budget: {
      pagu_anggaran: 4000000,
      terpakai: 1200000,
      sisa_pagu: 2800000,
      utilization_percent: 30,
      daily_average: 171429,
    },
    inventory: {
      stocks: [
        { item: 'Detergen Cair', satuan: 'PCS', stok_saat_ini: 22, safety_threshold: 50, max_capacity: 100, status: 'Kritis' },
        { item: 'Pelembut', satuan: 'PCS', stok_saat_ini: 14, safety_threshold: 50, max_capacity: 80, status: 'Kritis' },
        { item: 'Plastik Packing', satuan: 'PCS', stok_saat_ini: 85, safety_threshold: 100, max_capacity: 200, status: 'Kritis' },
      ],
      overall_status: 'Kritis',
      last_updated: new Date().toISOString(),
    },
  },
  'CBG-004': {
    id_cabang: 'CBG-004',
    nama_cabang: 'Tangerang Kota',
    budget: {
      pagu_anggaran: 4500000,
      terpakai: 2800000,
      sisa_pagu: 1700000,
      utilization_percent: 62,
      daily_average: 400000,
    },
    inventory: {
      stocks: [
        { item: 'Detergen Cair', satuan: 'PCS', stok_saat_ini: 40, safety_threshold: 50, max_capacity: 100, status: 'Kritis' },
        { item: 'Pelembut', satuan: 'PCS', stok_saat_ini: 35, safety_threshold: 50, max_capacity: 80, status: 'Kritis' },
        { item: 'Plastik Packing', satuan: 'PCS', stok_saat_ini: 110, safety_threshold: 100, max_capacity: 200, status: 'Aman' },
      ],
      overall_status: 'Kritis',
      last_updated: new Date().toISOString(),
    },
  },
  'CBG-005': {
    id_cabang: 'CBG-005',
    nama_cabang: 'Bogor Raya',
    budget: {
      pagu_anggaran: 4000000,
      terpakai: 3850000,
      sisa_pagu: 150000,
      utilization_percent: 96,
      daily_average: 550000,
    },
    inventory: {
      stocks: [
        { item: 'Detergen Cair', satuan: 'PCS', stok_saat_ini: 8, safety_threshold: 50, max_capacity: 100, status: 'Kritis' },
        { item: 'Pelembut', satuan: 'PCS', stok_saat_ini: 9, safety_threshold: 50, max_capacity: 80, status: 'Kritis' },
        { item: 'Plastik Packing', satuan: 'PCS', stok_saat_ini: 45, safety_threshold: 100, max_capacity: 200, status: 'Kritis' },
      ],
      overall_status: 'Kritis',
      last_updated: new Date(Date.now() - 26 * 60 * 60 * 1000).toISOString(),
    },
  },
};

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
  if (status === 'Available') return 'bg-[#d3e4fe] text-[#0056c6]';
  if (status === 'Busy') return 'bg-[#15157d] text-white';
  return 'bg-[#dce9ff] text-[#464652]';
}

// Helper function to get initials from name
function getInitials(nama: string): string {
  const parts = nama.trim().split(/\s+/);
  if (parts.length >= 2 && parts[0] && parts[1]) {
    const first = parts[0].charAt(0);
    const second = parts[1].charAt(0);
    return (first + second).toUpperCase();
  }
  return nama.substring(0, 2).toUpperCase();
}

// Helper function to calculate capacity percentage (max 5 tasks)
function calculateCapacityPercent(activeTasks: number): number {
  const maxCapacity = 5;
  return Math.min(Math.round((activeTasks / maxCapacity) * 100), 100);
}

// ==========================================
// COURIER ACTION MENU COMPONENT
// Dropdown menu for courier actions
// ==========================================
interface CourierActionMenuProps {
  courier: Courier;
  onAssignTask: (courier: Courier) => void;
  onViewDetail: (courier: Courier) => void;
  onChangeStatus: (courier: Courier) => void;
  triggerNotification: (msg: string, type?: 'success' | 'error' | 'warning') => void;
}

function CourierActionMenu({ courier, onAssignTask, onViewDetail, onChangeStatus, triggerNotification }: CourierActionMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close menu on escape key
  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen]);

  const handleAssignTask = () => {
    setIsOpen(false);
    if (courier.status === 'Available' && courier.active_tasks < 5) {
      onAssignTask(courier);
    } else if (courier.status !== 'Available') {
      triggerNotification(`Kurir ${courier.nama_kurir} sedang tidak tersedia untuk ditugaskan.`, 'warning');
    } else {
      triggerNotification(`Kapasitas kurir ${courier.nama_kurir} sudah penuh (${courier.active_tasks}/5).`, 'warning');
    }
  };

  const handleViewDetail = () => {
    setIsOpen(false);
    onViewDetail(courier);
  };

  const handleChangeStatus = () => {
    setIsOpen(false);
    onChangeStatus(courier);
  };

  return (
    <div className="relative inline-block" ref={menuRef}>
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-full hover:bg-[#e5eeff] transition-colors"
        style={{ color: '#464652' }}
        aria-label="Menu aksi"
        aria-expanded={isOpen}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 12a1 1 0 110-2 1 1 0 010 2zm0 0a1 1 0 100-2 1 1 0 000 2z" />
        </svg>
      </button>

      {isOpen && (
        <div
          className="fixed bg-white rounded-lg shadow-xl border border-slate-200 py-1 z-[9999]"
          style={{
            minWidth: '180px',
            right: '16px',
            top: buttonRef.current ? `${buttonRef.current.getBoundingClientRect().bottom + 8}px` : '50%',
          }}
        >
          <div className="px-3 py-2 border-b border-slate-100">
            <p className="text-xs font-medium text-slate-500">Aksi untuk kurir</p>
            <p className="text-sm font-semibold" style={{ color: '#15157d' }}>{courier.nama_kurir}</p>
          </div>

          <div className="py-1">
            <button
              onClick={handleAssignTask}
              className={`w-full px-3 py-2 text-left text-sm hover:bg-slate-50 flex items-center gap-3 transition-colors ${
                courier.status !== 'Available' || courier.active_tasks >= 5 ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              disabled={courier.status !== 'Available' || courier.active_tasks >= 5}
            >
              <span className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </span>
              <div className="flex-1">
                <p className="font-medium text-slate-700">Tugaskan Kurir</p>
                <p className="text-xs text-slate-400">
                  {courier.status !== 'Available' ? 'Kurir tidak tersedia' : courier.active_tasks >= 5 ? 'Kapasitas penuh' : 'Plot pesanan baru'}
                </p>
              </div>
            </button>

            <button
              onClick={handleViewDetail}
              className="w-full px-3 py-2 text-left text-sm hover:bg-slate-50 flex items-center gap-3 transition-colors"
            >
              <span className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </span>
              <div className="flex-1">
                <p className="font-medium text-slate-700">Lihat Detail</p>
                <p className="text-xs text-slate-400">Profil & riwayat perjalanan</p>
              </div>
            </button>

            <div className="border-t border-slate-100 my-1"></div>

            <button
              onClick={handleChangeStatus}
              className="w-full px-3 py-2 text-left text-sm hover:bg-slate-50 flex items-center gap-3 transition-colors"
            >
              <span className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center">
                <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </span>
              <div className="flex-1">
                <p className="font-medium text-amber-700">Ubah Status</p>
                <p className="text-xs text-amber-500">Ganti status kurir</p>
              </div>
            </button>
          </div>
        </div>
      )}

      {/* Backdrop to close menu */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[9998]"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}

// ==========================================
// ASSIGN COURIER MODAL
// Modal for assigning orders to courier
// ==========================================
interface AssignCourierModalProps {
  courier: Courier | null;
  branchId: string;
  onClose: () => void;
  onSuccess: (msg: string) => void;
  onError: (msg: string) => void;
}

function AssignCourierModal({ courier, branchId, onClose, onSuccess, onError }: AssignCourierModalProps) {
  const [orders, setOrders] = useState<UnassignedOrder[]>([]);
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [assigning, setAssigning] = useState(false);

  useEffect(() => {
    async function fetchOrders() {
      setLoading(true);
      try {
        const res = await fetch(`/api/orders/branch/${branchId}/incoming`);
        if (res.ok) {
          const data = await res.json();
          setOrders(data.orders || []);
        } else {
          setOrders([]);
        }
      } catch {
        setOrders([]);
      }
      setLoading(false);
    }
    fetchOrders();
  }, [branchId]);

  const handleToggleOrder = (orderId: string) => {
    setSelectedOrders(prev =>
      prev.includes(orderId)
        ? prev.filter(id => id !== orderId)
        : [...prev, orderId]
    );
  };

  const handleAssign = async () => {
    if (!courier || selectedOrders.length === 0) return;

    setAssigning(true);
    try {
      for (const orderId of selectedOrders) {
        const res = await fetch(`/api/orders/${orderId}/assign`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id_kurir: courier.id_kurir }),
        });

        if (!res.ok) {
          const error = await res.json();
          throw new Error(error.message || 'GagalMenugaskan');
        }
      }
      onSuccess(`${selectedOrders.length} pesanan berhasil ditugaskan ke ${courier.nama_kurir}`);
      onClose();
    } catch {
      onError('Gagal menugaskan pesanan. Silakan coba lagi.');
    }
    setAssigning(false);
  };

  if (!courier) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-full max-w-lg mx-4 shadow-2xl">
        <div className="p-4 border-b border-slate-200 flex justify-between items-center">
          <div>
            <h3 className="text-lg font-bold" style={{ color: '#15157d' }}>Tugaskan Pesanan</h3>
            <p className="text-sm text-slate-500">Ke kurir: {courier.nama_kurir}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-4 max-h-96 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="w-8 h-8 border-2 border-slate-200 border-t-[#0056c6] rounded-full animate-spin"></div>
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-8 text-slate-400">
              <svg className="w-12 h-12 mx-auto mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <p>Tidak ada pesanan yang menunggu</p>
            </div>
          ) : (
            <div className="space-y-2">
              {orders.map(order => (
                <label
                  key={order.id_order}
                  className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                    selectedOrders.includes(order.id_order)
                      ? 'border-[#0056c6] bg-[#eff4ff]'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedOrders.includes(order.id_order)}
                    onChange={() => handleToggleOrder(order.id_order)}
                    className="w-4 h-4 text-[#0056c6] rounded"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{order.customer_name || order.id_order}</p>
                    <p className="text-xs text-slate-500 truncate">{order.alamat_penjemputan}</p>
                  </div>
                  {order.berat_kg && (
                    <span className="text-xs bg-slate-100 px-2 py-1 rounded">{order.berat_kg} kg</span>
                  )}
                </label>
              ))}
            </div>
          )}
        </div>

        <div className="p-4 border-t border-slate-200 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
          >
            Batal
          </button>
          <button
            onClick={handleAssign}
            disabled={selectedOrders.length === 0 || assigning}
            className={`px-4 py-2 text-sm font-medium text-white rounded-lg flex items-center gap-2 ${
              selectedOrders.length === 0 || assigning
                ? 'bg-slate-300 cursor-not-allowed'
                : 'bg-[#0056c6] hover:bg-[#004a9f]'
            }`}
          >
            {assigning && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>}
            Tugaskan ({selectedOrders.length})
          </button>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// CHANGE COURIER STATUS MODAL
// Modal for changing courier status manually
// ==========================================
interface ChangeCourierStatusModalProps {
  courier: Courier | null;
  branchId: string;
  onClose: () => void;
  onSuccess: (msg: string) => void;
  onError: (msg: string) => void;
}

function ChangeCourierStatusModal({ courier, branchId: _branchId, onClose, onSuccess, onError }: ChangeCourierStatusModalProps) {
  const [newStatus, setNewStatus] = useState<'Available' | 'Offline'>('Available');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!courier) return;

    setSaving(true);
    try {
      const res = await fetch(`/api/couriers/${courier.id_kurir}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_available: newStatus === 'Available' }),
      });

      if (res.ok) {
        onSuccess(`Status ${courier.nama_kurir} berhasil diubah menjadi ${newStatus === 'Available' ? 'Tersedia' : 'Offline'}`);
        onClose();
      } else {
        const error = await res.json();
        throw new Error(error.message || 'Gagal');
      }
    } catch {
      onError('Gagal mengubah status kurir. Silakan coba lagi.');
    }
    setSaving(false);
  };

  if (!courier) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-full max-w-md mx-4 shadow-2xl">
        <div className="p-4 border-b border-slate-200 flex justify-between items-center">
          <div>
            <h3 className="text-lg font-bold" style={{ color: '#15157d' }}>Ubah Status Kurir</h3>
            <p className="text-sm text-slate-500">{courier.nama_kurir}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-4">
          <p className="text-sm text-slate-600 mb-4">
            Ubah status operasional kurir secara manual. Ini berguna untuk menangani situasi darurat.
          </p>
          <div className="space-y-3">
            <label className={`flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition-colors ${
              newStatus === 'Available'
                ? 'border-emerald-500 bg-emerald-50'
                : 'border-slate-200 hover:border-slate-300'
            }`}>
              <input
                type="radio"
                name="status"
                value="Available"
                checked={newStatus === 'Available'}
                onChange={() => setNewStatus('Available')}
                className="w-4 h-4 text-emerald-600"
              />
              <div>
                <p className="font-medium text-emerald-700">Tersedia</p>
                <p className="text-xs text-emerald-600">Kurir siap menerima pesanan baru</p>
              </div>
            </label>
            <label className={`flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition-colors ${
              newStatus === 'Offline'
                ? 'border-slate-500 bg-slate-100'
                : 'border-slate-200 hover:border-slate-300'
            }`}>
              <input
                type="radio"
                name="status"
                value="Offline"
                checked={newStatus === 'Offline'}
                onChange={() => setNewStatus('Offline')}
                className="w-4 h-4 text-slate-600"
              />
              <div>
                <p className="font-medium text-slate-700">Offline</p>
                <p className="text-xs text-slate-500">Kurir tidak dapat menerima pesanan</p>
              </div>
            </label>
          </div>
        </div>

        <div className="p-4 border-t border-slate-200 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
          >
            Batal
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className={`px-4 py-2 text-sm font-medium text-white rounded-lg flex items-center gap-2 ${
              saving ? 'bg-slate-300 cursor-not-allowed' : 'bg-amber-500 hover:bg-amber-600'
            }`}
          >
            {saving && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>}
            Simpan Perubahan
          </button>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// COURIER DETAIL MODAL
// Modal for viewing courier details and history
// ==========================================
interface CourierDetailModalProps {
  courier: Courier | null;
  branchId: string;
  onClose: () => void;
  onAssignNew: (courier: Courier) => void;
  onChangeStatus: (courier: Courier) => void;
}

function CourierDetailModal({ courier, branchId: _branchId, onClose, onAssignNew, onChangeStatus }: CourierDetailModalProps) {
  const [activeTasks, setActiveTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTasks() {
      if (!courier) return;
      setLoading(true);
      try {
        const res = await fetch(`/api/couriers/${courier.id_kurir}/tasks`);
        if (res.ok) {
          const data = await res.json();
          setActiveTasks(data.tugas || []);
        }
      } catch { /* ignore */ }
      setLoading(false);
    }
    fetchTasks();
  }, [courier]);

  if (!courier) return null;

  const statusColors: Record<string, string> = {
    Available: 'bg-emerald-100 text-emerald-700',
    Busy: 'bg-blue-100 text-blue-700',
    Offline: 'bg-slate-100 text-slate-600',
  };

  const statusLabels: Record<string, string> = {
    Available: 'Tersedia',
    Busy: 'Sibuk',
    Offline: 'Offline',
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-full max-w-2xl mx-4 shadow-2xl max-h-[90vh] flex flex-col">
        <div className="p-4 border-b border-slate-200 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg" style={{ backgroundColor: '#e1e0ff', color: '#15157d' }}>
              {getInitials(courier.nama_kurir)}
            </div>
            <div>
              <h3 className="text-lg font-bold" style={{ color: '#15157d' }}>{courier.nama_kurir}</h3>
              <p className="text-sm text-slate-500">#{courier.id_kurir}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-4 overflow-y-auto flex-1">
          {/* Status Info */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-slate-50 rounded-lg p-3 text-center">
              <p className="text-xs text-slate-500 mb-1">Status</p>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[courier.status]}`}>
                {statusLabels[courier.status]}
              </span>
            </div>
            <div className="bg-slate-50 rounded-lg p-3 text-center">
              <p className="text-xs text-slate-500 mb-1">Tugas Aktif</p>
              <p className="text-xl font-bold" style={{ color: '#15157d' }}>{courier.active_tasks}/5</p>
            </div>
            <div className="bg-slate-50 rounded-lg p-3 text-center">
              <p className="text-xs text-slate-500 mb-1">Kapasitas</p>
              <p className="text-xl font-bold" style={{ color: '#15157d' }}>{calculateCapacityPercent(courier.active_tasks)}%</p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => { onClose(); onAssignNew(courier); }}
              disabled={courier.status !== 'Available' || courier.active_tasks >= 5}
              className={`flex-1 px-4 py-2 text-sm font-medium rounded-lg flex items-center justify-center gap-2 ${
                courier.status !== 'Available' || courier.active_tasks >= 5
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  : 'bg-emerald-500 text-white hover:bg-emerald-600'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Tugaskan Pesanan
            </button>
            <button
              onClick={() => { onClose(); onChangeStatus(courier); }}
              className="px-4 py-2 text-sm font-medium bg-amber-100 text-amber-700 rounded-lg hover:bg-amber-200 flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Ubah Status
            </button>
          </div>

          {/* Active Tasks */}
          <div>
            <h4 className="text-sm font-semibold mb-3" style={{ color: '#15157d' }}>Riwayat Tugas Terakhir</h4>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="w-8 h-8 border-2 border-slate-200 border-t-[#0056c6] rounded-full animate-spin"></div>
              </div>
            ) : activeTasks.length === 0 ? (
              <p className="text-sm text-slate-400 text-center py-4">Belum ada tugas yang aktif</p>
            ) : (
              <div className="space-y-2">
                {activeTasks.slice(0, 5).map((task, idx) => (
                  <div key={task.id_order} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                    <span className="w-6 h-6 rounded-full bg-[#0056c6] text-white text-xs flex items-center justify-center font-medium">
                      {idx + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{task.alamat_penjemputan}</p>
                      <p className="text-xs text-slate-500">#{task.id_order}</p>
                    </div>
                    <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded">
                      {task.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export function DashboardAdmin({ userRole, selectedAdminBranch, triggerNotification }: Props) {
  // Fetch real inventory from API
  const [inventoryState, setInventoryState] = useState<StockItem[] | null>(null);
  const [_loadingInventory, setLoadingInventory] = useState(true);

  // Fetch real courier data from API
  const [couriersState, setCouriersState] = useState<Courier[]>([]);
  const [loadingCouriers, setLoadingCouriers] = useState(true);

  // Modal states for courier actions
  const [assignCourierModal, setAssignCourierModal] = useState<Courier | null>(null);
  const [changeStatusModal, setChangeStatusModal] = useState<Courier | null>(null);
  const [detailModal, setDetailModal] = useState<Courier | null>(null);

  // Handler functions for courier actions
  const handleAssignTask = (courier: Courier) => {
    setAssignCourierModal(courier);
  };

  const handleViewDetail = (courier: Courier) => {
    setDetailModal(courier);
  };

  const handleChangeStatus = (courier: Courier) => {
    setChangeStatusModal(courier);
  };

  const handleAssignSuccess = (msg: string) => {
    triggerNotification(msg, 'success');
    setAssignCourierModal(null);
    refreshCouriers();
  };

  const handleStatusChangeSuccess = (msg: string) => {
    triggerNotification(msg, 'success');
    setChangeStatusModal(null);
    refreshCouriers();
  };

  // Refresh couriers after action
  const refreshCouriers = async () => {
    try {
      const res = await fetch(`/api/couriers/branch/${selectedAdminBranch}`);
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.couriers) {
          setCouriersState(json.couriers);
        }
      }
    } catch { /* ignore */ }
  };

  useEffect(() => {
    let cancelled = false;
    async function fetchInventory() {
      try {
        const res = await fetch(`/api/branches/${selectedAdminBranch}/inventory`);
        if (res.ok) {
          const json = await res.json();
          if (json.success) {
            setInventoryState(json.stocks);
          }
        }
      } catch { /* ignore */ }
      if (!cancelled) setLoadingInventory(false);
    }
    fetchInventory();
    const interval = setInterval(fetchInventory, 30000);
    return () => { cancelled = true; clearInterval(interval); };
  }, [selectedAdminBranch]);

  // Fetch couriers from API
  useEffect(() => {
    let cancelled = false;
    async function fetchCouriers() {
      try {
        const res = await fetch(`/api/couriers/branch/${selectedAdminBranch}`);
        if (res.ok) {
          const json = await res.json();
          if (json.success && json.couriers) {
            if (!cancelled) setCouriersState(json.couriers);
          }
        }
      } catch { /* ignore */ }
      if (!cancelled) setLoadingCouriers(false);
    }
    fetchCouriers();
    const interval = setInterval(fetchCouriers, 30000);
    return () => { cancelled = true; clearInterval(interval); };
  }, [selectedAdminBranch]);

  // Use real inventory from API
  const inventoryStocks: StockItem[] = inventoryState ? inventoryState.map((s) => ({
    item: s.item,
    satuan: s.satuan,
    stok_saat_ini: s.stok_saat_ini,
    safety_threshold: s.safety_threshold,
    max_capacity: s.max_capacity,
    status: (s.status === 'Kritis' ? 'Kritis' : s.status === 'Menipis' ? 'Menipis' : 'Aman') as 'Aman' | 'Menipis' | 'Kritis'
  })) : [];

  const overallInventoryStatus = inventoryStocks.some(s => s.status === 'Kritis') ? 'Kritis' : inventoryStocks.some(s => s.status === 'Menipis') ? 'Menipis' : 'Aman';

  // Branch data with real inventory
  const defaultBranch = MOCK_BRANCH_DATA_MAP['CBG-002']!;
  const selectedBranch = MOCK_BRANCH_DATA_MAP[selectedAdminBranch] ?? defaultBranch;
  const branchData = {
    ...selectedBranch,
    inventory: {
      stocks: inventoryStocks.length > 0 ? inventoryStocks : selectedBranch?.inventory.stocks ?? [],
      overall_status: overallInventoryStatus,
      last_updated: new Date().toISOString()
    }
  };

  // Use couriers from API state
  const couriers = couriersState;
  const [showRestockModal, setShowRestockModal] = useState(false);

  // Calculate active and idle couriers based on real status
  const activeCouriers = couriers.filter(c => c.status === 'Busy' || c.status === 'Available').length;
  const idleCouriers = couriers.filter(c => c.status === 'Offline' || !c.is_available).length;
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
              <h3 className="text-xl font-semibold" style={{ color: '#0b1c30' }}>Kontrol Anggaran</h3>
              <p className="text-xs" style={{ color: '#464652' }}>Batas Operasional Bulanan</p>
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
              <p className="text-xs" style={{ color: '#464652' }}>Rata-rata Harian</p>
              <p className="text-xl font-semibold" style={{ color: '#0b1c30' }}>{formatIDR(branchData.budget.daily_average)}</p>
            </div>
            <div className="p-2 rounded-lg" style={{ backgroundColor: isBudgetExceeded ? '#ffdad6' : '#eff4ff' }}>
              <p className="text-xs" style={{ color: isBudgetExceeded ? '#ba1a1a' : '#464652' }}>Sisa Anggaran</p>
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
            {branchData.inventory.stocks.map((stock: StockItem) => {
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
            <h3 className="text-xl font-semibold" style={{ color: '#0b1c30' }}>Alokasi Kurir</h3>
            <div className="flex gap-4 text-xs" style={{ color: '#464652' }}>
              <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full" style={{ backgroundColor: '#0056c6' }}></span>{activeCouriers} Aktif</div>
              <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full" style={{ backgroundColor: '#777683' }}></span>{idleCouriers} Tersedia</div>
            </div>
          </div>
          <table className="w-full text-left">
            <thead className="text-sm uppercase tracking-wider" style={{ backgroundColor: '#e5eeff', color: '#464652' }}>
              <tr><th className="px-4 py-3">Nama Kurir</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Tugas Saat Ini</th><th className="px-4 py-3">Kapasitas</th><th className="px-4 py-3 text-right">Aksi</th></tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: '#c7c5d4' }}>
              {loadingCouriers ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-slate-400">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-slate-200 border-t-[#0056c6] rounded-full animate-spin"></div>
                      Memuat data kurir...
                    </div>
                  </td>
                </tr>
              ) : couriers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-slate-400">
                    Tidak ada data kurir untuk cabang ini
                  </td>
                </tr>
              ) : (
                couriers.map((courier) => {
                  const statusLabel = courier.status === 'Available' ? 'Tersedia' : courier.status === 'Busy' ? 'Sibuk' : 'Offline';
                  const isOffline = courier.status === 'Offline' || !courier.is_available;
                  const capacityPercent = calculateCapacityPercent(courier.active_tasks);
                  const initials = getInitials(courier.nama_kurir);
                  return (
                  <tr key={courier.id_kurir} className="hover:bg-[#f8f9ff] transition-colors" style={{ backgroundColor: isOffline ? 'rgba(239, 244, 255, 0.5)' : 'white' }}>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-9 h-9 rounded-full flex items-center justify-center font-bold" style={{ backgroundColor: isOffline ? '#dce9ff' : '#e1e0ff', color: '#15157d' }}>{initials}</div>
                        <div><p className="text-sm font-semibold" style={{ color: '#0b1c30' }}>{courier.nama_kurir}</p><p className="text-xs" style={{ color: '#464652' }}>#{courier.id_kurir}</p></div>
                      </div>
                    </td>
                    <td className="px-4 py-4"><span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeStyle(courier.status)}`}>{statusLabel}</span></td>
                    <td className="px-4 py-4 text-base" style={{ color: '#0b1c30' }}>{courier.current_task?.alamat || <span className="italic" style={{ color: '#777683' }}>Siap Ditugaskan</span>}</td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-2 rounded-full" style={{ backgroundColor: '#e5eeff' }}>
                          <div className="h-full rounded-full transition-all" style={{ width: `${capacityPercent}%`, backgroundColor: capacityPercent >= 80 ? '#ba1a1a' : capacityPercent >= 50 ? '#d97706' : '#0056c6' }}></div>
                        </div>
                        <span className="text-xs text-slate-500">{courier.active_tasks}/5</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <CourierActionMenu
                        courier={courier}
                        onAssignTask={handleAssignTask}
                        onViewDetail={handleViewDetail}
                        onChangeStatus={handleChangeStatus}
                        triggerNotification={triggerNotification}
                      />
                    </td>
                  </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="fixed -bottom-10 -right-10 w-64 h-64 rounded-full -z-10 pointer-events-none opacity-10" style={{ backgroundColor: '#0056c6', filter: 'blur(100px)' }}></div>

      {showRestockModal && (
        <RestockModal
          branches={[{ id: branchData.id_cabang ?? selectedAdminBranch, nama: branchData.nama_cabang ?? selectedAdminBranch }]}
          initialBranchId={branchData.id_cabang ?? selectedAdminBranch}
          userRole={userRole}
          selectedAdminBranch={selectedAdminBranch}
          onClose={() => setShowRestockModal(false)}
          onSuccess={(msg) => triggerNotification(msg, 'success')}
        />
      )}

      {/* Assign Courier Modal */}
      {assignCourierModal && (
        <AssignCourierModal
          courier={assignCourierModal}
          branchId={selectedAdminBranch}
          onClose={() => setAssignCourierModal(null)}
          onSuccess={handleAssignSuccess}
          onError={(msg) => triggerNotification(msg, 'error')}
        />
      )}

      {/* Change Courier Status Modal */}
      {changeStatusModal && (
        <ChangeCourierStatusModal
          courier={changeStatusModal}
          branchId={selectedAdminBranch}
          onClose={() => setChangeStatusModal(null)}
          onSuccess={handleStatusChangeSuccess}
          onError={(msg) => triggerNotification(msg, 'error')}
        />
      )}

      {/* Courier Detail Modal */}
      {detailModal && (
        <CourierDetailModal
          courier={detailModal}
          branchId={selectedAdminBranch}
          onClose={() => setDetailModal(null)}
          onAssignNew={handleAssignTask}
          onChangeStatus={handleChangeStatus}
        />
      )}
    </div>
  );
}
