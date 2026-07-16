import { useState, useEffect, useCallback } from 'react';
import { isOnline, getLogisticsQueue, addToLogisticsQueue, syncLogisticsQueue, type QueuedLogisticsAction } from '../utils/offlineQueue.ts';
import { useAuth } from '../contexts/AuthContext.tsx';

interface CourierTask {
  id_order: string;
  alamat_penjemputan: string;
  alamat_pengantaran: string;
  latitude: number;
  longitude: number;
  latitude_pengantaran: number;
  longitude_pengantaran: number;
  status: string;
  berat_kg?: number;
  google_maps_url: string;
  gmaps_link?: string; // Link GMaps asli dari customer
  customer_name?: string;
  customer_whatsapp?: string;
  service_name?: string;
}

interface LogisticsTask {
  id: string;
  branchId: string;
  nama_cabang: string;
  sentItems: { detergen: number; pelembut: number; plastik: number };
  status: string;
  timestamp: string;
}

interface Props {
  triggerNotification: (msg: string, type?: 'success' | 'error' | 'warning') => void;
}

interface ProofModalState {
  isOpen: boolean;
  id_order: string;
  type: 'pickup' | 'delivery';
}

interface FailedModalState {
  isOpen: boolean;
  id_order: string;
  reason: string;
}

type TabKey = 'pelanggan' | 'operasional';

// Map status database → next status
const NEXT_STATUS: Record<string, string> = {
  Dialokasikan:   'PickingUp',   // Proses → Jemput
  OnRoute:        'PickingUp',    // Proses → Jemput
  PickingUp:      'Delivering',    // Selesai Jemput → Mulai Antar
  Delivering:     'Selesai',      // Konfirmasi → Selesai
};

// Label tampilan untuk quick action button
const STATUS_ACTION_LABEL: Record<string, string> = {
  Dialokasikan:   'Proses Sekarang',
  OnRoute:        'Proses Sekarang',
  PickingUp:      'Selesai Jemput',
  Delivering:     'Konfirmasi Selesai',
};

function statusBadge(status: string): { bg: string; text: string } {
  const s = status.toLowerCase();
  if (s === 'selesai' || s === 'done') return { bg: 'bg-emerald-50 text-emerald-600 border-emerald-200', text: 'bg-emerald-500' };
  if (s === 'diproses') return { bg: 'bg-amber-50 text-amber-600 border-amber-200', text: 'bg-amber-500' };
  if (s === 'gagal') return { bg: 'bg-red-50 text-red-600 border-red-200', text: 'bg-red-500' };
  switch (status) {
    case 'Pending':       return { bg: 'bg-slate-100 text-slate-600 border-slate-200', text: 'bg-slate-500' };
    case 'Dialokasikan':  return { bg: 'bg-violet-50 text-violet-600 border-violet-200', text: 'bg-violet-500' };
    case 'OnRoute':       return { bg: 'bg-blue-50 text-blue-600 border-blue-200', text: 'bg-blue-500' };
    case 'PickingUp':     return { bg: 'bg-teal-50 text-teal border-teal-200', text: 'bg-teal' };
    case 'Delivering':    return { bg: 'bg-indigo-50 text-indigo-600 border-indigo-200', text: 'bg-indigo-500' };
    case 'In-Transit':    return { bg: 'bg-blue-50 text-blue-600 border-blue-200', text: 'bg-blue-500' };
    case 'Driver-En-Route': return { bg: 'bg-blue-50 text-blue-600 border-blue-200', text: 'bg-blue-500' };
    case 'Awaiting-Verification': return { bg: 'bg-amber-50 text-amber-600 border-amber-200', text: 'bg-amber-500' };
    default: return { bg: 'bg-slate-100 text-slate-600 border-slate-200', text: 'bg-slate-500' };
  }
}

function statusDisplayLabel(status: string): string {
  const labels: Record<string, string> = {
    Pending: 'Belum Diproses',
    Diproses: 'Diproses',
    Dialokasikan: 'Dialokasikan',
    OnRoute: 'Menuju',
    PickingUp: 'Di Pick Up',
    Delivering: 'Mengirim',
    Selesai: 'Selesai',
    Done: 'Selesai',
    Gagal: 'Gagal',
    'In-Transit': 'Menunggu',
    'Driver-En-Route': 'Menuju',
    'Awaiting-Verification': 'Verifikasi',
  };
  return labels[status] ?? status;
}

function logisticsStatusLabel(status: string): string {
  return statusDisplayLabel(status);
}

// ==========================================
// DASHBOARD KURIR - Premium Flat Design
// ==========================================
export function DashboardKurir({ triggerNotification }: Props) {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<TabKey>('pelanggan');
  const [online, setOnline] = useState(isOnline());
  const [customerTasks, setCustomerTasks] = useState<CourierTask[]>([]);
  const [logisticsTasks, setLogisticsTasks] = useState<LogisticsTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [logisticsQueue, setLogisticsQueue] = useState<QueuedLogisticsAction[]>(getLogisticsQueue());
  const [syncing, setSyncing] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [proofModal, setProofModal] = useState<ProofModalState>({ isOpen: false, id_order: '', type: 'pickup' });
  const [failedModal, setFailedModal] = useState<FailedModalState>({ isOpen: false, id_order: '', reason: '' });
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const refreshLogisticsQueue = useCallback(() => {
    setLogisticsQueue(getLogisticsQueue());
  }, []);

  const handleSyncLogistics = useCallback(async () => {
    if (!isOnline() || syncing) return;
    const pending = logisticsQueue.filter((a) => !a.synced);
    if (pending.length === 0) return;
    setSyncing(true);
    try {
      const result = await syncLogisticsQueue();
      refreshLogisticsQueue();
      if (result.synced > 0) {
        triggerNotification(`${result.synced} aksi berhasil disinkronkan.`, 'success');
        fetchLogistics();
      }
    } finally { setSyncing(false); }
  }, [logisticsQueue, syncing, refreshLogisticsQueue, triggerNotification]);

  useEffect(() => {
    const handleOnline = () => { setOnline(true); handleSyncLogistics(); };
    const handleOffline = () => setOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [handleSyncLogistics]);

  useEffect(() => {
    if (online && logisticsQueue.some((a) => !a.synced)) handleSyncLogistics();
  }, [online, logisticsQueue, handleSyncLogistics]);

  // BUG FIX: useCallback to properly track user dependency
  const fetchCustomerTasks = useCallback(async () => {
    // Get courier_id from user object, if not available skip fetch
    const courierId = user?.courier_id;
    if (!courierId) {
      console.log('[DashboardKurir] courier_id not available yet, skipping fetch');
      return;
    }
    console.log(`[DashboardKurir] Fetching tasks for courier: ${courierId}`);
    try {
      const res = await fetch(`/api/couriers/${courierId}/tasks`);
      const json = await res.json();
      console.log(`[DashboardKurir] API response:`, json);
      if (res.ok && json.success) {
        setCustomerTasks(json.tugas || []);
      } else {
        console.error('[DashboardKurir] API error:', json.error);
      }
    } catch (err) {
      console.error('[DashboardKurir] Fetch error:', err);
    }
  }, [user?.courier_id]); // ← Dependency pada courier_id

  // BUG FIX: Wrap in useCallback to prevent infinite loop
  // fetchLogistics doesn't depend on any props/state, so deps array is empty
  const fetchLogistics = useCallback(async () => {
    try {
      const res = await fetch('/api/logistics/active');
      const json = await res.json();
      if (res.ok && json.success) setLogisticsTasks(json.logs);
    } catch (err) {
      console.error('[DashboardKurir] fetchLogistics error:', err);
    }
  }, []); // ← Empty deps - function is stable

  // BUG FIX: Initial load effect - runs once on mount
  // DO NOT add state setters (setLoading, setCustomerTasks, etc.) to deps
  useEffect(() => {
    let cancelled = false;
    async function load() {
      // Only set loading=false AFTER all fetches complete
      await Promise.all([fetchCustomerTasks(), fetchLogistics()]);
      if (!cancelled) setLoading(false);
    }
    load();
    // Cleanup function prevents state update if component unmounts
    return () => { cancelled = true; };
  }, []); // ← Empty deps - runs ONCE on mount only!

  // BUG FIX: Auto-refresh using setInterval (separate from initial load)
  // This runs every 30 seconds to refresh data without affecting loading state
  useEffect(() => {
    const intervalId = setInterval(() => {
      console.log('[DashboardKurir] Auto-refreshing data...');
      fetchCustomerTasks();
      fetchLogistics();
    }, 30000); // Refresh every 30 seconds

    return () => clearInterval(intervalId);
  }, [fetchCustomerTasks, fetchLogistics]); // Safe - only refreshes data

  function handleCustomerStatusChange(id_order: string, new_status: string) {
    if (!isOnline()) {
      triggerNotification('Offline — perubahan akan disinkronkan saat pulih.', 'warning');
      return;
    }
    setActionLoading(id_order);
    fetch(`/api/orders/${id_order}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: new_status }),
    })
      .then(async (res) => {
        const json = await res.json();
        if (res.ok && json.success) {
          triggerNotification(`Status ${id_order} diubah ke ${new_status}.`, 'success');
          fetchCustomerTasks();
        } else {
          triggerNotification(json.error ?? 'Gagal mengubah status.', 'error');
        }
      })
      .catch(() => triggerNotification('Tidak dapat terhubung.', 'error'))
      .finally(() => setActionLoading(null));
  }

  function handleStartRoute(logisticsId: string) {
    const original_timestamp = new Date().toISOString();
    if (!isOnline()) {
      addToLogisticsQueue({ logistics_id: logisticsId, action: 'start-route', original_timestamp });
      refreshLogisticsQueue();
      triggerNotification('Tersimpan offline. Akan disinkronkan saat online.', 'warning');
      return;
    }
    setActionLoading(logisticsId);
    fetch(`/api/logistics/${logisticsId}/start-route`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({}) })
      .then(async (res) => {
        const json = await res.json();
        if (res.ok && json.success) {
          triggerNotification(json.message, 'success');
          fetchLogistics();
        } else {
          triggerNotification(json.error ?? 'Gagal.', 'error');
        }
      })
      .catch(() => triggerNotification('Tidak dapat terhubung.', 'error'))
      .finally(() => setActionLoading(null));
  }

  function handleHandover(logisticsId: string) {
    const original_timestamp = new Date().toISOString();
    if (!isOnline()) {
      addToLogisticsQueue({ logistics_id: logisticsId, action: 'handover', original_timestamp });
      refreshLogisticsQueue();
      triggerNotification('Tersimpan offline. Akan disinkronkan saat online.', 'warning');
      return;
    }
    setActionLoading(logisticsId);
    fetch(`/api/logistics/${logisticsId}/handover`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({}) })
      .then(async (res) => {
        const json = await res.json();
        if (res.ok && json.success) {
          triggerNotification(json.message, 'success');
          fetchLogistics();
        } else {
          triggerNotification(json.error ?? 'Gagal.', 'error');
        }
      })
      .catch(() => triggerNotification('Tidak dapat terhubung.', 'error'))
      .finally(() => setActionLoading(null));
  }

  function handleOpenProofModal(id_order: string, type: 'pickup' | 'delivery') {
    setProofModal({ isOpen: true, id_order, type });
    setPhotoFile(null);
    setPhotoPreview(null);
  }

  function handleCloseProofModal() {
    setProofModal({ isOpen: false, id_order: '', type: 'pickup' });
    setPhotoFile(null);
    setPhotoPreview(null);
  }

  function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setPhotoPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  }

  async function handleUploadProof() {
    if (!photoFile) {
      triggerNotification('Silakan pilih foto terlebih dahulu.', 'warning');
      return;
    }

    if (!isOnline()) {
      triggerNotification('Offline — bukti tidak bisa diunggah. Pastikan koneksi tersambung.', 'error');
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('photo', photoFile);
    formData.append('id_order', proofModal.id_order);
    formData.append('type', proofModal.type);

    try {
      const res = await fetch(`/api/orders/${proofModal.id_order}/proof`, {
        method: 'POST',
        body: formData,
      });
      const json = await res.json();
      if (res.ok && json.success) {
        triggerNotification('Bukti berhasil diunggah!', 'success');
        handleCloseProofModal();
        fetchCustomerTasks();
      } else {
        triggerNotification(json.error ?? 'Gagal mengunggah bukti.', 'error');
      }
    } catch {
      triggerNotification('Tidak dapat terhubung.', 'error');
    } finally {
      setUploading(false);
    }
  }

  function handleOpenFailedModal(id_order: string) {
    setFailedModal({ isOpen: true, id_order, reason: '' });
  }

  function handleCloseFailedModal() {
    setFailedModal({ isOpen: false, id_order: '', reason: '' });
  }

  function handleSubmitFailed() {
    if (!failedModal.reason.trim()) {
      triggerNotification('Silakan isi alasan kegagalan.', 'warning');
      return;
    }

    if (!isOnline()) {
      triggerNotification('Offline — perubahan akan disinkronkan saat pulih.', 'warning');
      handleCloseFailedModal();
      return;
    }

    setActionLoading(failedModal.id_order);
    fetch(`/api/orders/${failedModal.id_order}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'Gagal', catatan: failedModal.reason }),
    })
      .then(async (res) => {
        const json = await res.json();
        if (res.ok && json.success) {
          triggerNotification('Status ditandai Gagal.', 'success');
          fetchCustomerTasks();
        } else {
          triggerNotification(json.error ?? 'Gagal mengirim.', 'error');
        }
      })
      .catch(() => triggerNotification('Tidak dapat terhubung.', 'error'))
      .finally(() => {
        setActionLoading(null);
        handleCloseFailedModal();
      });
  }

  function handleContactWhatsApp(whatsapp?: string) {
    if (!whatsapp) {
      triggerNotification('Nomor WhatsApp tidak tersedia.', 'warning');
      return;
    }
    const cleanNumber = whatsapp.replace(/[^0-9]/g, '');
    const url = `https://wa.me/${cleanNumber}`;
    window.open(url, '_blank');
  }

  function handleCallPhone(phone?: string) {
    if (!phone) {
      triggerNotification('Nomor telepon tidak tersedia.', 'warning');
      return;
    }
    const cleanNumber = phone.replace(/[^0-9]/g, '');
    window.location.href = `tel:${cleanNumber}`;
  }

  const pendingLogisticsQueue = logisticsQueue.filter((a) => !a.synced).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="w-10 h-10 border-2 border-slate-200 border-t-deep-blue rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-navy tracking-tight">Dashboard Kurir</h1>
          <p className="text-sm text-slate-500 mt-1">Pusat kendali tugas pelanggan & logistik</p>
        </div>
        <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium ${online ? 'bg-teal-50 text-teal border border-teal-200' : 'bg-red-50 text-red-600 border border-red-200'}`}>
          <span className={`w-2 h-2 rounded-full ${online ? 'bg-teal' : 'bg-red-600'}`} />
          {online ? 'Online' : 'Offline'}
        </div>
      </div>

      {/* Offline Queue Alert */}
      {pendingLogisticsQueue > 0 && (
        <div className="bg-amber-50 border border-amber-200 px-4 py-3 rounded-2xl flex items-center gap-3">
          <span className="text-base">🔄</span>
          <div className="flex-1">
            <p className="text-sm font-bold text-amber-600">{pendingLogisticsQueue} aksi menunggu sinkronisasi</p>
            <p className="text-xs text-slate-500">Akan otomatis terkirim saat koneksi pulih</p>
          </div>
          {syncing && <div className="w-4 h-4 border-2 border-amber-400/30 border-t-amber-500 rounded-full animate-spin"></div>}
        </div>
      )}

      {/* Tab Buttons - Premium Design */}
      <div className="flex gap-1 bg-slate-100 p-1 rounded-2xl">
        <button onClick={() => setActiveTab('pelanggan')}
          className={`flex-1 px-4 py-3 rounded-2xl text-sm font-medium transition-all ${activeTab === 'pelanggan' ? 'bg-white text-navy shadow-sm' : 'text-slate-500 hover:text-navy'}`}>
          Tugas Pelanggan
          {customerTasks.length > 0 && (
            <span className="ml-2 inline-flex items-center justify-center w-5 h-5 rounded-full bg-deep-blue text-white text-[10px] font-bold">{customerTasks.length}</span>
          )}
        </button>
        <button onClick={() => setActiveTab('operasional')}
          className={`flex-1 px-4 py-3 rounded-2xl text-sm font-medium transition-all ${activeTab === 'operasional' ? 'bg-white text-navy shadow-sm' : 'text-slate-500 hover:text-navy'}`}>
          Operasional
          {logisticsTasks.length > 0 && (
            <span className="ml-2 inline-flex items-center justify-center w-5 h-5 rounded-full bg-deep-blue text-white text-[10px] font-bold">{logisticsTasks.length}</span>
          )}
        </button>
      </div>

      {/* Summary Stats Bar */}
      {activeTab === 'pelanggan' && customerTasks.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {/* Total Tugas */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <span className="text-base">📦</span>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Tugas</span>
            </div>
            <p className="text-2xl font-bold text-navy leading-none">{customerTasks.length}</p>
          </div>
          {/* Sedang Aktif (Menunggu + Dalam Perjalanan) */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <span className="text-base">🚴</span>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Sedang Aktif</span>
            </div>
            <p className="text-2xl font-bold text-blue-500 leading-none">
              {customerTasks.filter(t => ['Dialokasikan', 'OnRoute', 'PickingUp', 'Delivering'].includes(t.status)).length}
            </p>
          </div>
          {/* Selesai */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <span className="text-base">✅</span>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Selesai</span>
            </div>
            <p className="text-2xl font-bold text-teal leading-none">
              {customerTasks.filter(t => t.status === 'Selesai' || t.status === 'Done').length}
            </p>
          </div>
          {/* Total Berat */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <span className="text-base">⚖️</span>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Berat</span>
            </div>
            <p className="text-2xl font-bold text-navy leading-none">
              {customerTasks.reduce((sum, t) => sum + (t.berat_kg ?? 0), 0).toFixed(1)} kg
            </p>
          </div>
        </div>
      )}

      {/* Tasks - Customer Tab */}
      {activeTab === 'pelanggan' && (
        <div className="space-y-4">
          {customerTasks.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center">
              <svg className="w-12 h-12 text-slate-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <p className="text-sm text-slate-400">Tidak ada tugas pelanggan</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {customerTasks.map((task) => {
                const sb = statusBadge(task.status);
                const nextStatus = NEXT_STATUS[task.status];
                const actionLabel = STATUS_ACTION_LABEL[task.status];
                const isLoading = actionLoading === task.id_order;
                // Cek apakah customer punya link GMaps
                const hasGmapsLink = !!(task.gmaps_link && task.gmaps_link.trim() !== '');
                // Cek apakah ada teks alamat
                const hasAddressText = !!(task.alamat_penjemputan && task.alamat_penjemputan.trim() !== '');
                // Cek apakah koordinat valid
                const hasValidCoordinates = task.latitude !== 0 && task.longitude !== 0;
                // Bisa buka GMaps jika ada link atau koordinat valid
                const canOpenGmaps = hasGmapsLink || hasValidCoordinates;
                // URL GMaps untuk navigasi (prioritas: google_maps_url > gmaps_link)
                const mapsUrl = task.google_maps_url || task.gmaps_link || '';
                const isDone = task.status === 'Selesai' || task.status === 'Done';
                const isFailed = task.status === 'Gagal';

                return (
                  <div key={task.id_order} className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col gap-4">
                    {/* Header */}
                    <div className="flex justify-between items-start">
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] font-mono text-slate-400">{task.id_order}</p>
                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                          <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium border ${sb.bg}`}>{statusDisplayLabel(task.status)}</span>
                          {task.berat_kg != null && task.berat_kg > 0 && (
                            <span className="text-xs text-slate-500 font-medium bg-base-bg px-2 py-0.5 rounded-lg">{task.berat_kg} kg</span>
                          )}
                          {task.service_name && (
                            <span className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded-lg">{task.service_name}</span>
                          )}
                        </div>
                        {task.customer_name && (
                          <p className="text-xs text-slate-500 mt-1">👤 {task.customer_name}</p>
                        )}
                      </div>
                      {/* Tombol Hubungi Pelanggan */}
                      {task.customer_whatsapp && !isDone && !isFailed && (
                        <div className="flex gap-1">
                          <button
                            onClick={() => handleCallPhone(task.customer_whatsapp)}
                            className="p-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-600 transition-colors"
                            title="Telepon">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleContactWhatsApp(task.customer_whatsapp)}
                            className="p-2 rounded-xl bg-green-50 hover:bg-green-100 text-green-600 transition-colors"
                            title="WhatsApp">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                            </svg>
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Alamat Penjemputan */}
                    <div>
                      <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Alamat Penjemputan</p>
                      {hasAddressText ? (
                        <p className="text-sm text-slate-600 leading-relaxed">{task.alamat_penjemputan}</p>
                      ) : canOpenGmaps ? (
                        <p className="text-sm text-blue-600 italic flex items-center gap-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          Koordinat tersedia - buka Google Maps
                        </p>
                      ) : (
                        <p className="text-sm text-red-500 italic">⚠️ Alamat tidak tersedia</p>
                      )}
                    </div>

                    {/* Action Buttons - Workflow Based */}
                    <div className="flex flex-col gap-2 mt-auto">
                      {/* === SELESAI === */}
                      {isDone && (
                        <div className="flex items-center justify-center gap-2 bg-emerald-50 text-emerald-600 border border-emerald-200 text-sm font-medium py-4 rounded-2xl">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span>Pengiriman Selesai ✅</span>
                        </div>
                      )}

                      {/* === GAGAL === */}
                      {isFailed && (
                        <div className="flex items-center justify-center gap-2 bg-red-50 text-red-600 border border-red-200 text-sm font-medium py-4 rounded-2xl">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span>Gagal ❌</span>
                        </div>
                      )}

                      {/* === STATUS: DIALOKASIKAN / ONROUTE (PROSES SEKARANG) === */}
                      {(task.status === 'Dialokasikan' || task.status === 'OnRoute') && (
                        <div className="space-y-2">
                          {/* Baris 1: Tombol Proses Sekarang */}
                          <button
                            onClick={() => handleCustomerStatusChange(task.id_order, 'PickingUp')}
                            disabled={isLoading}
                            className="w-full bg-teal hover:bg-teal-600 text-white text-sm font-medium py-4 rounded-2xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                            {isLoading ? (
                              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                              <>
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span>PROSES SEKARANG</span>
                              </>
                            )}
                          </button>
                          {/* Baris 2: Buka Maps */}
                          {canOpenGmaps ? (
                            <button
                              onClick={() => window.open(mapsUrl, '_blank')}
                              className="w-full bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium py-3 rounded-2xl transition-all flex items-center justify-center gap-2">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                              📍 Buka Google Maps
                            </button>
                          ) : (
                            <div className="w-full bg-slate-100 text-slate-400 text-sm font-medium py-3 rounded-2xl flex items-center justify-center gap-2 cursor-not-allowed">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                              Link tidak tersedia
                            </div>
                          )}
                        </div>
                      )}

                      {/* === STATUS: PICKINGUP (SELESAI JEMPUT) === */}
                      {task.status === 'PickingUp' && (
                        <div className="space-y-2">
                          {/* Baris 1: Selesai Jemput */}
                          <button
                            onClick={() => handleCustomerStatusChange(task.id_order, 'Delivering')}
                            disabled={isLoading}
                            className="w-full bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium py-4 rounded-2xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                            {isLoading ? (
                              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                              <>
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                <span>SELESAI JEMPUT → MULAI ANTAR</span>
                              </>
                            )}
                          </button>
                          {/* Baris 2: Maps + Bukti Foto */}
                          <div className="flex gap-2">
                            {canOpenGmaps ? (
                              <button
                                onClick={() => window.open(mapsUrl, '_blank')}
                                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium py-3 rounded-2xl transition-all flex items-center justify-center gap-2">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                📍 Maps
                              </button>
                            ) : (
                              <div className="flex-1 bg-slate-100 text-slate-400 text-sm font-medium py-3 rounded-2xl flex items-center justify-center gap-2 cursor-not-allowed">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                -
                              </div>
                            )}
                            <button
                              onClick={() => handleOpenProofModal(task.id_order, 'pickup')}
                              className="flex-1 bg-amber-50 hover:bg-amber-100 text-amber-600 border border-amber-200 text-sm font-medium py-3 rounded-2xl transition-all flex items-center justify-center gap-2">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                              Bukti
                            </button>
                          </div>
                          {/* Baris 3: Gagal */}
                          <button
                            onClick={() => handleOpenFailedModal(task.id_order)}
                            className="w-full bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 text-sm font-medium py-2.5 rounded-2xl transition-all flex items-center justify-center gap-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Tandai Gagal
                          </button>
                        </div>
                      )}

                      {/* === STATUS: DELIVERING (KONFIRMASI SELESAI) === */}
                      {task.status === 'Delivering' && (
                        <div className="space-y-2">
                          {/* Baris 1: Konfirmasi Selesai */}
                          <button
                            onClick={() => handleCustomerStatusChange(task.id_order, 'Selesai')}
                            disabled={isLoading}
                            className="w-full bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium py-4 rounded-2xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                            {isLoading ? (
                              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                              <>
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span>KONFIRMASI SELESAI ✅</span>
                              </>
                            )}
                          </button>
                          {/* Baris 2: Maps + Bukti */}
                          <div className="flex gap-2">
                            {canOpenGmaps ? (
                              <button
                                onClick={() => window.open(mapsUrl, '_blank')}
                                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium py-3 rounded-2xl transition-all flex items-center justify-center gap-2">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                📍 Maps
                              </button>
                            ) : (
                              <div className="flex-1 bg-slate-100 text-slate-400 text-sm font-medium py-3 rounded-2xl flex items-center justify-center gap-2 cursor-not-allowed">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                -
                              </div>
                            )}
                            <button
                              onClick={() => handleOpenProofModal(task.id_order, 'delivery')}
                              className="flex-1 bg-amber-50 hover:bg-amber-100 text-amber-600 border border-amber-200 text-sm font-medium py-3 rounded-2xl transition-all flex items-center justify-center gap-2">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                              Bukti
                            </button>
                          </div>
                          {/* Baris 3: Gagal */}
                          <button
                            onClick={() => handleOpenFailedModal(task.id_order)}
                            className="w-full bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 text-sm font-medium py-2.5 rounded-2xl transition-all flex items-center justify-center gap-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Tandai Gagal
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Tasks - Operasional Tab */}
      {activeTab === 'operasional' && (
        <div className="space-y-4">
          {logisticsTasks.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center">
              <svg className="w-12 h-12 text-slate-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
              </svg>
              <p className="text-sm text-slate-400">Tidak ada pengiriman aktif</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {logisticsTasks.map((task) => {
                const sb = statusBadge(task.status);
                const isQueued = logisticsQueue.some((q) => q.logistics_id === task.id && !q.synced);
                const isLoading = actionLoading === task.id;
                return (
                  <div key={task.id} className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col gap-4">
                    {/* Header */}
                    <div className="flex justify-between items-start">
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] font-mono text-slate-400">{task.id}</p>
                        <p className="text-xs text-slate-500 mt-0.5">Tujuan: <span className="font-medium text-navy">{task.nama_cabang}</span></p>
                      </div>
                      <span className={`inline-flex px-2.5 py-1 rounded-full text-[10px] font-semibold border ${sb.bg}`}>
                        {logisticsStatusLabel(task.status)}
                      </span>
                    </div>

                    {/* Muatan */}
                    <div className="bg-base-bg rounded-2xl p-3">
                      <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">Muatan</span>
                      <div className="grid grid-cols-3 gap-2 text-center">
                        <div><span className="text-base font-semibold text-navy">{task.sentItems.detergen}</span><br /><span className="text-[10px] text-slate-400">Detergen</span></div>
                        <div><span className="text-base font-semibold text-navy">{task.sentItems.pelembut}</span><br /><span className="text-[10px] text-slate-400">Pelembut</span></div>
                        <div><span className="text-base font-semibold text-navy">{task.sentItems.plastik}</span><br /><span className="text-[10px] text-slate-400">Plastik</span></div>
                      </div>
                    </div>

                    {isQueued && (
                      <div className="bg-amber-50 border border-amber-200 rounded-xl px-3 py-2 flex items-center gap-2">
                        <span className="text-xs">🔄</span>
                        <span className="text-[10px] text-amber-600 font-medium">Tersimpan offline</span>
                      </div>
                    )}

                    {/* Action */}
                    <div className="mt-auto">
                      {task.status === 'In-Transit' && (
                        <button onClick={() => handleStartRoute(task.id)}
                          disabled={isLoading || isQueued}
                          className="w-full bg-deep-blue hover:bg-navy text-white text-sm font-medium py-3 rounded-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                          {isLoading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : (
                            <>
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                              </svg>
                              Mulai Jalan
                            </>
                          )}
                        </button>
                      )}
                      {task.status === 'Driver-En-Route' && (
                        <button onClick={() => handleHandover(task.id)}
                          disabled={isLoading || isQueued}
                          className="w-full bg-teal hover:bg-teal-600 text-white text-sm font-medium py-3 rounded-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                          {isLoading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : (
                            <>
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              Serah Terima
                            </>
                          )}
                        </button>
                      )}
                      {task.status === 'Awaiting-Verification' && (
                        <div className="w-full bg-slate-100 text-slate-500 text-sm font-medium py-3 rounded-2xl text-center flex items-center justify-center gap-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Menunggu Verifikasi
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ==============================
      MODAL: BUKTI FOTO (PROOF OF DELIVERY)
      ============================== */}
      {proofModal.isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden">
            <div className="p-6 border-b border-slate-100">
              <h2 className="text-lg font-bold text-navy">
                📸 Bukti {proofModal.type === 'pickup' ? 'Penjemputan' : 'Pengantaran'}
              </h2>
              <p className="text-sm text-slate-500 mt-1">Order: {proofModal.id_order}</p>
            </div>

            <div className="p-6 space-y-4">
              {/* Preview Foto */}
              <div className={`border-2 border-dashed rounded-2xl overflow-hidden ${photoPreview ? 'border-teal-300' : 'border-slate-200'} bg-slate-50`}>
                {photoPreview ? (
                  <div className="relative">
                    <img src={photoPreview} alt="Preview" className="w-full h-64 object-cover" />
                    <button
                      onClick={() => {
                        setPhotoFile(null);
                        setPhotoPreview(null);
                      }}
                      className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ) : (
                  <label htmlFor="photo-upload-input" className="flex flex-col items-center justify-center h-64 cursor-pointer">
                    <svg className="w-12 h-12 text-slate-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="text-sm text-slate-500 font-medium">Klik untuk pilih foto</p>
                    <p className="text-xs text-slate-400 mt-1">JPG, PNG, max 5MB</p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoChange}
                      className="hidden"
                      id="photo-upload-input"
                    />
                  </label>
                )}
              </div>

              {/* Tombol Ganti Foto */}
              {photoPreview && (
                <label htmlFor="photo-upload-input" className="w-full block py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 text-sm font-medium rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Ganti Foto
                </label>
              )}
            </div>

            {/* Actions */}
            <div className="p-6 bg-slate-50 flex gap-3">
              <button
                onClick={handleCloseProofModal}
                disabled={uploading}
                className="flex-1 bg-white border border-slate-200 text-slate-600 text-sm font-medium py-3 rounded-2xl hover:bg-slate-100 transition-colors disabled:opacity-50">
                Batal
              </button>
              <button
                onClick={handleUploadProof}
                disabled={!photoFile || uploading}
                className="flex-1 bg-teal hover:bg-teal-600 text-white text-sm font-medium py-3 rounded-2xl transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
                {uploading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Mengunggah...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    Unggah Bukti
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==============================
      MODAL: GAGAL / PENDING
      ============================== */}
      {failedModal.isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden">
            <div className="p-6 border-b border-slate-100">
              <h2 className="text-lg font-bold text-red-600 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Tandai Gagal
              </h2>
              <p className="text-sm text-slate-500 mt-1">Order: {failedModal.id_order}</p>
            </div>

            <div className="p-6 space-y-4">
              <p className="text-sm text-slate-600 font-medium">Pilih alasan kegagalan:</p>

              {/* Quick select buttons */}
              <div className="flex flex-wrap gap-2">
                {[
                  'Pagar terkunci, tidak bisa masuk',
                  'Alamat tidak ditemukan',
                  'Pelanggan tidak ada di rumah',
                  'Kendaraan rusak / bermasalah',
                  'Cuaca buruk',
                  'Pelanggan membatalkan',
                ].map((opt) => (
                  <button
                    key={opt}
                    onClick={() => setFailedModal(prev => ({ ...prev, reason: opt }))}
                    className={`px-3 py-1.5 text-xs rounded-full border transition-colors ${
                      failedModal.reason === opt
                        ? 'bg-red-50 border-red-200 text-red-600'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}>
                    {opt}
                  </button>
                ))}
              </div>

              {/* Custom reason input */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                  Atau ketik alasan lain:
                </label>
                <textarea
                  value={failedModal.reason}
                  onChange={(e) => setFailedModal(prev => ({ ...prev, reason: e.target.value }))}
                  placeholder="Jelaskan alasan..."
                  rows={3}
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-300 focus:border-red-300 resize-none"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="p-6 bg-slate-50 flex gap-3">
              <button
                onClick={handleCloseFailedModal}
                disabled={actionLoading === failedModal.id_order}
                className="flex-1 bg-white border border-slate-200 text-slate-600 text-sm font-medium py-3 rounded-2xl hover:bg-slate-100 transition-colors disabled:opacity-50">
                Batal
              </button>
              <button
                onClick={handleSubmitFailed}
                disabled={actionLoading === failedModal.id_order || !failedModal.reason.trim()}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white text-sm font-medium py-3 rounded-2xl transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
                {actionLoading === failedModal.id_order ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Konfirmasi Gagal
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
