import { useState, useEffect, useCallback } from 'react';
import { getQueue, addToQueue, syncQueue, isOnline, type QueuedAction } from '../utils/offlineQueue.ts';

interface CourierTask {
  id_order: string;
  alamat_penjemputan: string;
  koordinat_penjemputan: { latitude: number; longitude: number };
  status: string;
  berat_kg?: number;
  google_maps_url: string;
  urutan?: number; // FR-005: Manual task sequence number
}

interface TugasHarianResponse {
  success: boolean;
  id_kurir: string;
  nama_kurir: string;
  id_cabang: string;
  total_tugas: number;
  urutan_tugas: boolean; // FR-005: Whether custom sequence is applied
  tugas: CourierTask[];
}

interface Props {
  idKurir: string;
}

const STATUS_STYLES: Record<string, string> = {
  Pending: 'bg-amber-50 text-amber-600 border-amber-200',
  'On Route': 'bg-blue-50 text-blue-600 border-blue-200',
  Arrived: 'bg-teal-50 text-teal border-teal-200',
  Done: 'bg-teal-50 text-teal border-teal-200',
};

const NEXT_STATUS: Record<string, string> = {
  // FR-003: Siklus status berjenjang Pending → On Route → Arrived → Done
  Pending: 'On Route',
  'On Route': 'Arrived',
  Arrived: 'Done',
};

// ==========================================
// TUGAS HARIAN - FR-LOG-03, FR-001, FR-002, FR-003
// Kurir melihat koordinat alamat tugas dan pintasan navigasi Google Maps
// NF03: Offline Queue dengan timestamp preservation
// FR-001: Daftar penugasan urutan manual dari Admin Branch
// FR-002: Tautan navigasi luar Google Maps
// FR-003: Siklus status Pending → On Route → Arrived → Done dengan offline queue badge
// ==========================================
function StatusBadge({ status }: { status: string }) {
  const style = STATUS_STYLES[status] ?? 'bg-slate-100 text-slate-600 border-slate-200';
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${style}`}>
      {status}
    </span>
  );
}

function OnlineIndicator({ online }: { online: boolean }) {
  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border ${online ? 'bg-teal-50 text-teal border-teal-200' : 'bg-red-50 text-red-600 border-red-200'}`}>
      <span className={`w-2 h-2 rounded-full ${online ? 'bg-teal' : 'bg-red-600'}`} />
      {online ? 'Online' : 'Offline'}
    </div>
  );
}

function QueueIndicator({ count, syncing }: { count: number; syncing: boolean }) {
  if (count === 0 && !syncing) return null;
  return (
    <div className={`px-4 py-3 rounded-2xl text-sm font-medium ${syncing ? 'bg-blue-50 text-blue-600' : 'bg-amber-50 text-amber-600 border border-amber-200'}`}>
      {syncing ? (
        <span className="flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-blue-300/30 border-t-blue-600 rounded-full animate-spin"></div>
          Menyinkronkan {count} aksi...
        </span>
      ) : (
        <span className="flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          🔄 Tersimpan di Antrean Lokal ({count} aksi) - Sinkron otomatis saat online
        </span>
      )}
    </div>
  );
}

function TaskCard({ task, onStatusChange, queuedActions }: { task: CourierTask; onStatusChange: (id_order: string, new_status: string) => void; queuedActions: QueuedAction[] }) {
  const nextStatus = NEXT_STATUS[task.status];
  const isQueued = queuedActions.some((a) => a.id_order === task.id_order && !a.synced);

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          {/* FR-005: Sequence Number Badge */}
          {task.urutan && (
            <span className="w-8 h-8 rounded-full bg-deep-blue text-white text-sm font-bold flex items-center justify-center">
              {task.urutan}
            </span>
          )}
          <div>
            <h3 className="text-base font-semibold text-navy">{task.id_order}</h3>
          </div>
        </div>
        <StatusBadge status={task.status} />
      </div>

      <div className="space-y-3 mb-4">
        <div>
          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Alamat Penjemputan</p>
          <p className="text-sm text-slate-600">{task.alamat_penjemputan}</p>
        </div>
        {task.berat_kg != null && (
          <div>
            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Berat</p>
            <p className="text-sm text-slate-600">{task.berat_kg} kg</p>
          </div>
        )}
      </div>

      <div className="flex gap-2">
        <button onClick={() => window.open(task.google_maps_url, '_blank')}
          className="flex-1 bg-deep-blue hover:bg-navy text-white rounded-2xl font-medium text-sm py-3 flex items-center justify-center gap-2 transition-all">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          Google Maps
        </button>
        {nextStatus && (
          <button onClick={() => onStatusChange(task.id_order, nextStatus)}
            disabled={isQueued}
            className={`flex-1 rounded-2xl font-medium text-sm py-3 transition-all ${isQueued ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-teal hover:bg-teal-600 text-white'}`}>
            {isQueued ? 'Tersimpan Offline' : `Ubah ke ${nextStatus}`}
          </button>
        )}
      </div>

      {isQueued && (
        <p className="mt-3 text-xs text-amber-600 flex items-center gap-1">
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          Aksi akan disinkronkan saat koneksi pulih.
        </p>
      )}
    </div>
  );
}

export function TugasHarian({ idKurir }: Props) {
  const [data, setData] = useState<TugasHarianResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [online, setOnline] = useState(isOnline());
  const [queue, setQueue] = useState<QueuedAction[]>(getQueue());
  const [syncing, setSyncing] = useState(false);

  const refreshQueue = useCallback(() => {
    setQueue(getQueue());
  }, []);

  const handleSync = useCallback(async () => {
    if (!isOnline() || syncing) return;
    const pendingCount = queue.filter((a) => !a.synced).length;
    if (pendingCount === 0) return;
    setSyncing(true);
    try {
      await syncQueue();
      refreshQueue();
    } finally {
      setSyncing(false);
    }
  }, [queue, syncing, refreshQueue]);

  useEffect(() => {
    const handleOnline = () => { setOnline(true); handleSync(); };
    const handleOffline = () => setOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [handleSync]);

  useEffect(() => {
    if (online && queue.some((a) => !a.synced)) {
      handleSync();
    }
  }, [online, queue, handleSync]);

  const handleStatusChange = useCallback((id_order: string, new_status: string) => {
    const original_timestamp = new Date().toISOString();
    if (!isOnline()) {
      addToQueue({ id_order, new_status, original_timestamp });
      refreshQueue();
      return;
    }
    fetch(`/api/orders/${id_order}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: new_status }),
    })
      .then((res) => {
        if (!res.ok) {
          addToQueue({ id_order, new_status, original_timestamp });
          refreshQueue();
        }
      })
      .catch(() => {
        addToQueue({ id_order, new_status, original_timestamp });
        refreshQueue();
      });
  }, [refreshQueue]);

  useEffect(() => {
    let cancelled = false;
    async function fetchTasks() {
      try {
        const res = await fetch(`/api/couriers/${idKurir}/tasks`);
        const json = (await res.json()) as TugasHarianResponse | { success: false; error: string };
        if (cancelled) return;
        if (!res.ok || !('tugas' in json)) {
          setError('error' in json ? json.error : 'Gagal memuat tugas.');
          return;
        }
        setData(json);
      } catch {
        if (!cancelled) setError('Tidak dapat terhubung ke server.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchTasks();
    return () => { cancelled = true; };
  }, [idKurir]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-10 h-10 border-2 border-slate-200 border-t-deep-blue rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-center">
        <p className="text-red-600 text-sm font-medium">{error}</p>
      </div>
    );
  }

  if (!data) return null;

  const pendingCount = queue.filter((a) => !a.synced).length;

  return (
    <div>
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold text-navy">Tugas Harian</h2>
            {data.urutan_tugas && (
              <span className="px-2 py-1 bg-amber-50 text-amber-600 border border-amber-200 rounded-full text-xs font-medium">
                📋 Urutan Plot Manual
              </span>
            )}
          </div>
          <OnlineIndicator online={online} />
        </div>
        <p className="text-sm text-slate-500">
          {data.nama_kurir} • {data.id_cabang} • {data.total_tugas} tugas
        </p>
      </div>

      <QueueIndicator count={pendingCount} syncing={syncing} />

      {data.tugas.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center">
          <svg className="w-16 h-16 text-slate-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <p className="text-sm text-slate-400">Tidak ada tugas untuk hari ini</p>
        </div>
      ) : (
        data.tugas.map((task) => (
          <TaskCard key={task.id_order} task={task} onStatusChange={handleStatusChange} queuedActions={queue} />
        ))
      )}
    </div>
  );
}
