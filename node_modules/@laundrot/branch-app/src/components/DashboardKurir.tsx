import { useState, useEffect, useCallback } from 'react';
import {
  isOnline,
  getLogisticsQueue,
  addToLogisticsQueue,
  syncLogisticsQueue,
  type QueuedLogisticsAction,
} from '../utils/offlineQueue.ts';

interface CourierTask {
  id_order: string;
  alamat_penjemputan: string;
  alamat_pengantaran: string;
  koordinat_penjemputan: { latitude: number; longitude: number };
  koordinat_pengantaran: { latitude: number; longitude: number };
  status: string;
  berat_kg?: number;
  google_maps_url: string;
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

type TabKey = 'pelanggan' | 'operasional';

const NEXT_STATUS: Record<string, string> = {
  Pending: 'Diproses',
  Diproses: 'Siap Diantar',
  'Siap Diantar': 'Dalam Pengiriman',
  'Dalam Pengiriman': 'Selesai',
  Selesai: 'Lunas',
};

function statusBadge(status: string): { bg: string; text: string } {
  switch (status) {
    case 'Pending': return { bg: 'bg-[#FFFBEB]', text: 'text-[#B45309]' };
    case 'Diproses': return { bg: 'bg-[#EFF6FF]', text: 'text-[#1E3A8A]' };
    case 'Siap Diantar': return { bg: 'bg-[#ECFDF5]', text: 'text-[#047857]' };
    case 'Dalam Pengiriman': return { bg: 'bg-[#F5F3FF]', text: 'text-[#6D28D9]' };
    case 'Selesai': return { bg: 'bg-[#ECFDF5]', text: 'text-[#047857]' };
    case 'Lunas': return { bg: 'bg-[#ECFDF5]', text: 'text-[#047857]' };
    case 'In-Transit': return { bg: 'bg-[#EFF6FF]', text: 'text-[#1E3A8A]' };
    case 'Driver-En-Route': return { bg: 'bg-[#F5F3FF]', text: 'text-[#6D28D9]' };
    case 'Awaiting-Verification': return { bg: 'bg-[#FFFBEB]', text: 'text-[#B45309]' };
    default: return { bg: 'bg-slate-100', text: 'text-slate-600' };
  }
}

function logisticsStatusLabel(status: string): string {
  switch (status) {
    case 'In-Transit': return 'Menunggu Kurir';
    case 'Driver-En-Route': return 'Kurir Sedang Menuju Lokasi';
    case 'Awaiting-Verification': return 'Menunggu Verifikasi Admin';
    default: return status;
  }
}

export function DashboardKurir({ triggerNotification }: Props) {
  const [activeTab, setActiveTab] = useState<TabKey>('pelanggan');
  const [online, setOnline] = useState(isOnline());
  const [customerTasks, setCustomerTasks] = useState<CourierTask[]>([]);
  const [logisticsTasks, setLogisticsTasks] = useState<LogisticsTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [logisticsQueue, setLogisticsQueue] = useState<QueuedLogisticsAction[]>(getLogisticsQueue());
  const [syncing, setSyncing] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

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
        triggerNotification(`${result.synced} aksi logistik berhasil disinkronkan.`, 'success');
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

  async function fetchCustomerTasks() {
    try {
      const res = await fetch('/api/couriers/KUR-001/tasks');
      const json = await res.json();
      if (res.ok && json.success) setCustomerTasks(json.tugas);
    } catch { /* ignore */ }
  }

  async function fetchLogistics() {
    try {
      const res = await fetch('/api/logistics/active');
      const json = await res.json();
      if (res.ok && json.success) setLogisticsTasks(json.logs);
    } catch { /* ignore */ }
  }

  useEffect(() => {
    let cancelled = false;
    async function load() {
      await Promise.all([fetchCustomerTasks(), fetchLogistics()]);
      if (!cancelled) setLoading(false);
    }
    load();
    return () => { cancelled = true; };
  }, []);

  function handleCustomerStatusChange(id_order: string, new_status: string) {
    if (!isOnline()) {
      triggerNotification('Offline — perubahan status akan disinkronkan saat koneksi pulih.', 'warning');
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
      .catch(() => triggerNotification('Tidak dapat terhubung ke server.', 'error'))
      .finally(() => setActionLoading(null));
  }

  function handleStartRoute(logisticsId: string) {
    const original_timestamp = new Date().toISOString();
    if (!isOnline()) {
      addToLogisticsQueue({ logistics_id: logisticsId, action: 'start-route', original_timestamp });
      refreshLogisticsQueue();
      triggerNotification('Tersimpan di antrean lokal (offline). Akan disinkronkan saat online.', 'warning');
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
          triggerNotification(json.error ?? 'Gagal memulai perjalanan.', 'error');
        }
      })
      .catch(() => triggerNotification('Tidak dapat terhubung ke server.', 'error'))
      .finally(() => setActionLoading(null));
  }

  function handleHandover(logisticsId: string) {
    const original_timestamp = new Date().toISOString();
    if (!isOnline()) {
      addToLogisticsQueue({ logistics_id: logisticsId, action: 'handover', original_timestamp });
      refreshLogisticsQueue();
      triggerNotification('Tersimpan di antrean lokal (offline). Akan disinkronkan saat online.', 'warning');
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
          triggerNotification(json.error ?? 'Gagal serah terima.', 'error');
        }
      })
      .catch(() => triggerNotification('Tidak dapat terhubung ke server.', 'error'))
      .finally(() => setActionLoading(null));
  }

  const pendingLogisticsQueue = logisticsQueue.filter((a) => !a.synced).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="text-center">
          <svg className="animate-spin h-8 w-8 text-blue-600 mx-auto mb-4" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <p className="text-slate-500 text-sm">Memuat dashboard kurir...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-[900px]">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#0F172A] tracking-tight">Dashboard Kurir</h1>
          <p className="text-slate-500 text-sm mt-1.5">Pusat kendali tugas pengiriman pelanggan dan logistik operasional.</p>
        </div>
        <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium ${online ? 'bg-[#ECFDF5] text-[#047857]' : 'bg-[#FFF1F2] text-[#BE123C]'}`}>
          <span className={`w-2 h-2 rounded-full ${online ? 'bg-emerald-500' : 'bg-rose-500'}`} />
          {online ? 'Online' : 'Offline'}
        </div>
      </div>

      {pendingLogisticsQueue > 0 && (
        <div className="bg-[#FFFBEB] border border-amber-200/60 rounded-2xl p-4 flex items-center gap-3">
          <span className="text-base">🔄</span>
          <div>
            <p className="text-xs font-bold text-[#B45309]">Tersimpan di Antrean Lokal (Offline)</p>
            <p className="text-[10px] text-amber-700/80 mt-0.5">{pendingLogisticsQueue} aksi menunggu sinkronisasi. Akan otomatis terkirim saat koneksi pulih.</p>
          </div>
          {syncing && (
            <svg className="animate-spin h-4 w-4 text-[#B45309] ml-auto" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          )}
        </div>
      )}

      <div className="flex gap-1 bg-slate-100 p-1 rounded-xl">
        <button
          onClick={() => setActiveTab('pelanggan')}
          className={`flex-1 px-4 py-3 rounded-lg text-sm font-semibold transition-all duration-300 ${activeTab === 'pelanggan' ? 'bg-white text-[#0F172A] shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
        >
          Tugas Pelanggan
          {customerTasks.length > 0 && (
            <span className="ml-2 inline-flex items-center justify-center w-5 h-5 rounded-full bg-[#0F172A] text-white text-[10px] font-bold">{customerTasks.length}</span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('operasional')}
          className={`flex-1 px-4 py-3 rounded-lg text-sm font-semibold transition-all duration-300 ${activeTab === 'operasional' ? 'bg-white text-[#0F172A] shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
        >
          Pengiriman Operasional
          {logisticsTasks.length > 0 && (
            <span className="ml-2 inline-flex items-center justify-center w-5 h-5 rounded-full bg-[#1E3A8A] text-white text-[10px] font-bold">{logisticsTasks.length}</span>
          )}
        </button>
      </div>

      {activeTab === 'pelanggan' && (
        <div className="space-y-4">
          {customerTasks.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-4xl border border-slate-100 shadow-card">
              <svg className="w-12 h-12 text-slate-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <p className="text-sm text-slate-400">Tidak ada tugas pelanggan saat ini.</p>
            </div>
          ) : (
            customerTasks.map((task) => {
              const sb = statusBadge(task.status);
              const nextStatus = NEXT_STATUS[task.status];
              const isLoading = actionLoading === task.id_order;
              return (
                <div key={task.id_order} className="bg-white p-6 rounded-4xl border border-slate-100 shadow-card hover:shadow-card-hover transition-shadow duration-300">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="text-base font-bold text-[#0F172A]">{task.id_order}</h4>
                      <span className={`inline-flex items-center mt-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${sb.bg} ${sb.text}`}>{task.status}</span>
                    </div>
                    {task.berat_kg != null && (
                      <span className="text-xs text-slate-500 font-medium">{task.berat_kg} kg</span>
                    )}
                  </div>
                  <div className="space-y-3 mb-5">
                    <div>
                      <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Alamat Penjemputan</span>
                      <p className="text-sm text-[#0F172A] font-medium mt-0.5">{task.alamat_penjemputan}</p>
                    </div>
                  </div>
                  <div className="flex gap-2.5">
                    <button
                      onClick={() => window.open(task.google_maps_url, '_blank')}
                      className="flex-1 bg-[#0F172A] hover:bg-slate-800 text-white text-xs font-semibold py-2.5 rounded-xl transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-md flex items-center justify-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      Google Maps
                    </button>
                    {nextStatus && (
                      <button
                        onClick={() => handleCustomerStatusChange(task.id_order, nextStatus)}
                        disabled={isLoading}
                        className="flex-1 bg-[#047857] hover:bg-emerald-700 text-white text-xs font-semibold py-2.5 rounded-xl transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-md disabled:opacity-50"
                      >
                        {isLoading ? '...' : `Ubah ke ${nextStatus}`}
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {activeTab === 'operasional' && (
        <div className="space-y-4">
          {logisticsTasks.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-4xl border border-slate-100 shadow-card">
              <svg className="w-12 h-12 text-slate-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
              </svg>
              <p className="text-sm text-slate-400">Tidak ada pengiriman operasional aktif.</p>
            </div>
          ) : (
            logisticsTasks.map((task) => {
              const sb = statusBadge(task.status);
              const isQueued = logisticsQueue.some((q) => q.logistics_id === task.id && !q.synced);
              const isLoading = actionLoading === task.id;
              return (
                <div key={task.id} className="bg-white p-6 rounded-4xl border border-slate-100 shadow-card hover:shadow-card-hover transition-shadow duration-300">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="text-base font-bold text-[#0F172A]">{task.id}</h4>
                      <p className="text-xs text-slate-500 mt-0.5">Tujuan: <span className="font-semibold text-[#0F172A]">{task.nama_cabang}</span></p>
                    </div>
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-semibold ${sb.bg} ${sb.text}`}>
                      {logisticsStatusLabel(task.status)}
                    </span>
                  </div>

                  <div className="bg-slate-50 rounded-xl p-4 mb-5 space-y-2">
                    <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">Rincian Muatan</span>
                    <div className="grid grid-cols-3 gap-3">
                      <div className="text-center">
                        <span className="text-lg font-light text-[#0F172A] block">{task.sentItems.detergen}</span>
                        <span className="text-[10px] text-slate-400 font-medium">kg Detergen</span>
                      </div>
                      <div className="text-center">
                        <span className="text-lg font-light text-[#0F172A] block">{task.sentItems.pelembut}</span>
                        <span className="text-[10px] text-slate-400 font-medium">kg Pelembut</span>
                      </div>
                      <div className="text-center">
                        <span className="text-lg font-light text-[#0F172A] block">{task.sentItems.plastik}</span>
                        <span className="text-[10px] text-slate-400 font-medium">pcs Plastik</span>
                      </div>
                    </div>
                  </div>

                  {isQueued && (
                    <div className="bg-[#FFFBEB] border border-amber-200/40 rounded-lg px-3 py-2 mb-4 flex items-center gap-2">
                      <span className="text-xs">🔄</span>
                      <span className="text-[10px] text-[#B45309] font-medium">Aksi tersimpan offline — menunggu sinkronisasi</span>
                    </div>
                  )}

                  <div className="flex gap-2.5">
                    {task.status === 'In-Transit' && (
                      <button
                        onClick={() => handleStartRoute(task.id)}
                        disabled={isLoading || isQueued}
                        className="flex-1 bg-[#0D9488] hover:bg-[#0F766E] text-white text-xs font-semibold py-3 rounded-xl transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isLoading ? 'Memproses...' : 'Mulai Jalan'}
                      </button>
                    )}
                    {task.status === 'Driver-En-Route' && (
                      <button
                        onClick={() => handleHandover(task.id)}
                        disabled={isLoading || isQueued}
                        className="flex-1 bg-[#1E3A8A] hover:bg-[#1E40AF] text-white text-xs font-semibold py-3 rounded-xl transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isLoading ? 'Memproses...' : 'Serah Terima Barang'}
                      </button>
                    )}
                    {task.status === 'Awaiting-Verification' && (
                      <div className="flex-1 bg-slate-50 border border-slate-200 text-slate-500 text-xs font-semibold py-3 rounded-xl text-center">
                        Menunggu Verifikasi Admin Cabang
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
