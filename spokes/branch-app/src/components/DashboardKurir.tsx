import { useState, useEffect, useCallback } from 'react';
import { isOnline, getLogisticsQueue, addToLogisticsQueue, syncLogisticsQueue, type QueuedLogisticsAction } from '../utils/offlineQueue.ts';

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
  Pending: 'On Route',
  'On Route': 'Arrived',
  Arrived: 'Done',
};

function statusBadge(status: string): { bg: string; text: string } {
  switch (status) {
    case 'Pending': return { bg: 'bg-amber-50 text-amber-600 border-amber-200', text: 'bg-amber-500' };
    case 'On Route': return { bg: 'bg-blue-50 text-blue-600 border-blue-200', text: 'bg-blue-500' };
    case 'Arrived': return { bg: 'bg-teal-50 text-teal border-teal-200', text: 'bg-teal' };
    case 'Done': return { bg: 'bg-teal-50 text-teal border-teal-200', text: 'bg-teal' };
    case 'In-Transit': return { bg: 'bg-blue-50 text-blue-600 border-blue-200', text: 'bg-blue-500' };
    case 'Driver-En-Route': return { bg: 'bg-blue-50 text-blue-600 border-blue-200', text: 'bg-blue-500' };
    case 'Awaiting-Verification': return { bg: 'bg-amber-50 text-amber-600 border-amber-200', text: 'bg-amber-500' };
    default: return { bg: 'bg-slate-100 text-slate-600 border-slate-200', text: 'bg-slate-500' };
  }
}

function logisticsStatusLabel(status: string): string {
  switch (status) {
    case 'In-Transit': return 'Menunggu';
    case 'Driver-En-Route': return 'Menuju';
    case 'Awaiting-Verification': return 'Verifikasi';
    default: return status;
  }
}

// ==========================================
// DASHBOARD KURIR - Premium Flat Design
// ==========================================
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
            customerTasks.map((task) => {
              const sb = statusBadge(task.status);
              const nextStatus = NEXT_STATUS[task.status];
              const isLoading = actionLoading === task.id_order;
              return (
                <div key={task.id_order} className="bg-white border border-slate-200 rounded-2xl p-5">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="text-base font-semibold text-navy">{task.id_order}</h4>
                      <span className={`inline-flex mt-1 px-2.5 py-1 rounded-full text-xs font-medium border ${sb.bg}`}>{task.status}</span>
                    </div>
                    {task.berat_kg != null && (
                      <span className="text-xs text-slate-500 font-medium">{task.berat_kg} kg</span>
                    )}
                  </div>
                  <div className="mb-4">
                    <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Alamat</p>
                    <p className="text-sm text-slate-600">{task.alamat_penjemputan}</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => window.open(task.google_maps_url, '_blank')}
                      className="flex-1 bg-deep-blue hover:bg-navy text-white text-sm font-medium py-3 rounded-2xl transition-all flex items-center justify-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      Google Maps
                    </button>
                    {nextStatus && (
                      <button onClick={() => handleCustomerStatusChange(task.id_order, nextStatus)}
                        disabled={isLoading}
                        className="flex-1 bg-teal hover:bg-teal-600 text-white text-sm font-medium py-3 rounded-2xl transition-all disabled:opacity-50">
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
            logisticsTasks.map((task) => {
              const sb = statusBadge(task.status);
              const isQueued = logisticsQueue.some((q) => q.logistics_id === task.id && !q.synced);
              const isLoading = actionLoading === task.id;
              return (
                <div key={task.id} className="bg-white border border-slate-200 rounded-2xl p-5">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="text-base font-semibold text-navy">{task.id}</h4>
                      <p className="text-xs text-slate-500 mt-0.5">Tujuan: <span className="font-medium text-navy">{task.nama_cabang}</span></p>
                    </div>
                    <span className={`inline-flex px-2.5 py-1 rounded-full text-[10px] font-semibold border ${sb.bg}`}>
                      {logisticsStatusLabel(task.status)}
                    </span>
                  </div>
                  <div className="bg-base-bg rounded-2xl p-3 mb-4">
                    <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">Muatan</span>
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div><span className="text-base font-semibold text-navy">{task.sentItems.detergen}</span><br /><span className="text-[10px] text-slate-400">Detergen</span></div>
                      <div><span className="text-base font-semibold text-navy">{task.sentItems.pelembut}</span><br /><span className="text-[10px] text-slate-400">Pelembut</span></div>
                      <div><span className="text-base font-semibold text-navy">{task.sentItems.plastik}</span><br /><span className="text-[10px] text-slate-400">Plastik</span></div>
                    </div>
                  </div>
                  {isQueued && (
                    <div className="bg-amber-50 border border-amber-200 rounded-xl px-3 py-2 mb-4 flex items-center gap-2">
                      <span className="text-xs">🔄</span>
                      <span className="text-[10px] text-amber-600 font-medium">Tersimpan offline</span>
                    </div>
                  )}
                  <div className="flex gap-2">
                    {task.status === 'In-Transit' && (
                      <button onClick={() => handleStartRoute(task.id)}
                        disabled={isLoading || isQueued}
                        className="flex-1 bg-deep-blue hover:bg-navy text-white text-sm font-medium py-3 rounded-2xl transition-all disabled:opacity-50">
                        {isLoading ? 'Memproses...' : 'Mulai Jalan'}
                      </button>
                    )}
                    {task.status === 'Driver-En-Route' && (
                      <button onClick={() => handleHandover(task.id)}
                        disabled={isLoading || isQueued}
                        className="flex-1 bg-teal hover:bg-teal-600 text-white text-sm font-medium py-3 rounded-2xl transition-all disabled:opacity-50">
                        {isLoading ? 'Memproses...' : 'Serah Terima'}
                      </button>
                    )}
                    {task.status === 'Awaiting-Verification' && (
                      <div className="flex-1 bg-slate-100 text-slate-500 text-sm font-medium py-3 rounded-2xl text-center">
                        Menunggu Verifikasi
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
