import { useState, useEffect, useCallback } from 'react';
import {
  getQueue,
  addToQueue,
  syncQueue,
  isOnline,
  type QueuedAction,
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

interface TugasHarianResponse {
  success: boolean;
  id_kurir: string;
  nama_kurir: string;
  id_cabang: string;
  total_tugas: number;
  tugas: CourierTask[];
}

interface TugasHarianProps {
  idKurir: string;
}

const STATUS_STYLES: Record<string, string> = {
  Pending: 'bg-amber-100 text-amber-800 border-amber-200',
  Diproses: 'bg-blue-100 text-blue-800 border-blue-200',
  'Siap Diantar': 'bg-emerald-100 text-emerald-800 border-emerald-200',
  'Dalam Pengiriman': 'bg-purple-100 text-purple-800 border-purple-200',
  Selesai: 'bg-gray-100 text-gray-800 border-gray-200',
  Lunas: 'bg-green-100 text-green-800 border-green-200',
};

const NEXT_STATUS: Record<string, string> = {
  Pending: 'Diproses',
  Diproses: 'Siap Diantar',
  'Siap Diantar': 'Dalam Pengiriman',
  'Dalam Pengiriman': 'Selesai',
  Selesai: 'Lunas',
};

function StatusBadge({ status }: { status: string }) {
  const style = STATUS_STYLES[status] ?? 'bg-gray-100 text-gray-800 border-gray-200';
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${style}`}>
      {status}
    </span>
  );
}

function OnlineIndicator({ online }: { online: boolean }) {
  return (
    <div
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium ${
        online ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
      }`}
    >
      <span className={`w-2 h-2 rounded-full ${online ? 'bg-emerald-500' : 'bg-red-500'}`} />
      {online ? 'Online' : 'Offline'}
    </div>
  );
}

function QueueIndicator({ count, syncing }: { count: number; syncing: boolean }) {
  if (count === 0 && !syncing) return null;

  return (
    <div
      className={`px-4 py-3 rounded-lg text-sm font-medium mb-4 ${
        syncing ? 'bg-blue-50 text-blue-800' : 'bg-amber-50 text-amber-800'
      }`}
    >
      {syncing ? (
        <span className="flex items-center gap-2">
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          Menyinkronkan {count} aksi...
        </span>
      ) : (
        <span className="flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          {count} aksi menunggu sinkronisasi
        </span>
      )}
    </div>
  );
}

function TaskCard({
  task,
  onStatusChange,
  online,
  queuedActions,
}: {
  task: CourierTask;
  onStatusChange: (id_order: string, new_status: string) => void;
  online: boolean;
  queuedActions: QueuedAction[];
}) {
  const nextStatus = NEXT_STATUS[task.status];
  const isQueued = queuedActions.some((a) => a.id_order === task.id_order && !a.synced);

  return (
    <div
      className={`rounded-xl border-2 p-5 mb-4 transition-all ${
        isQueued ? 'border-amber-300 bg-amber-50' : 'border-gray-200 bg-white hover:shadow-md'
      }`}
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold text-gray-900">{task.id_order}</h3>
          <StatusBadge status={task.status} />
        </div>
      </div>

      <div className="space-y-3 mb-4">
        <div>
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Alamat Penjemputan</p>
          <p className="text-sm text-gray-900 font-medium">{task.alamat_penjemputan}</p>
          <p className="text-xs text-gray-500 mt-1">
            {task.koordinat_penjemputan.latitude}, {task.koordinat_penjemputan.longitude}
          </p>
        </div>

        {task.berat_kg != null && (
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Berat</p>
            <p className="text-sm text-gray-900 font-medium">{task.berat_kg} kg</p>
          </div>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-2">
        <a
          href={task.google_maps_url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold text-sm transition-colors shadow-sm"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          Buka Google Maps
        </a>

        {nextStatus && (
          <button
            onClick={() => onStatusChange(task.id_order, nextStatus)}
            disabled={isQueued}
            className={`flex-1 px-4 py-3 rounded-lg font-semibold text-sm transition-all shadow-sm ${
              isQueued
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white'
            }`}
          >
            {isQueued ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7M5 13l4 4L19 7"
                  />
                </svg>
                Tersimpan Offline
              </span>
            ) : (
              <span>
                Ubah ke {nextStatus}
                {!online && ' (Offline)'}
              </span>
            )}
          </button>
        )}
      </div>

      {isQueued && (
        <p className="mt-3 text-xs text-amber-700 flex items-center gap-1">
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clipRule="evenodd"
            />
          </svg>
          Aksi ini akan disinkronkan saat koneksi pulih.
        </p>
      )}
    </div>
  );
}

export function TugasHarian({ idKurir }: TugasHarianProps) {
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
    const handleOnline = () => {
      setOnline(true);
      handleSync();
    };
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

  const handleStatusChange = useCallback(
    (id_order: string, new_status: string) => {
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
    },
    [refreshQueue],
  );

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
    return () => {
      cancelled = true;
    };
  }, [idKurir]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <svg className="animate-spin h-8 w-8 text-blue-600 mx-auto mb-3" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <p className="text-gray-600 text-sm">Memuat tugas harian...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
        <svg className="w-8 h-8 text-red-500 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <p className="text-red-800 text-sm font-medium">{error}</p>
      </div>
    );
  }

  if (!data) return null;

  const pendingCount = queue.filter((a) => !a.synced).length;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-900">Tugas Harian</h2>
        <OnlineIndicator online={online} />
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-4 mb-4">
        <p className="text-sm text-gray-600">
          <span className="font-semibold text-gray-900">{data.nama_kurir}</span>
          <span className="mx-2">•</span>
          <span className="text-gray-500">{data.id_cabang}</span>
          <span className="mx-2">•</span>
          <span className="font-semibold text-blue-600">{data.total_tugas} tugas</span>
        </p>
      </div>

      <QueueIndicator count={pendingCount} syncing={syncing} />

      {data.tugas.length === 0 ? (
        <div className="bg-white rounded-xl border-2 border-dashed border-gray-300 p-12 text-center">
          <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
          <p className="text-gray-500 text-sm">Tidak ada tugas untuk hari ini.</p>
        </div>
      ) : (
        data.tugas.map((task) => (
          <TaskCard
            key={task.id_order}
            task={task}
            onStatusChange={handleStatusChange}
            online={online}
            queuedActions={queue}
          />
        ))
      )}
    </div>
  );
}
