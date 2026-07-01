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

const STATUS_COLORS: Record<string, string> = {
  Pending: '#f59e0b',
  Diproses: '#3b82f6',
  'Siap Diantar': '#10b981',
  'Dalam Pengiriman': '#8b5cf6',
  Selesai: '#6b7280',
  Lunas: '#059669',
};

const NEXT_STATUS: Record<string, string> = {
  Pending: 'Diproses',
  Diproses: 'Siap Diantar',
  'Siap Diantar': 'Dalam Pengiriman',
  'Dalam Pengiriman': 'Selesai',
  Selesai: 'Lunas',
};

function StatusBadge({ status }: { status: string }) {
  const color = STATUS_COLORS[status] ?? '#6b7280';
  return (
    <span
      style={{
        display: 'inline-block',
        padding: '2px 8px',
        borderRadius: 12,
        fontSize: 12,
        fontWeight: 600,
        color: '#fff',
        backgroundColor: color,
      }}
    >
      {status}
    </span>
  );
}

function OnlineIndicator({ online }: { online: boolean }) {
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        padding: '4px 12px',
        borderRadius: 16,
        fontSize: 12,
        fontWeight: 500,
        backgroundColor: online ? '#d1fae5' : '#fee2e2',
        color: online ? '#065f46' : '#991b1b',
        marginBottom: 12,
      }}
    >
      <span
        style={{
          width: 8,
          height: 8,
          borderRadius: '50%',
          backgroundColor: online ? '#10b981' : '#ef4444',
        }}
      />
      {online ? 'Online' : 'Offline'}
    </div>
  );
}

function QueueIndicator({ count, syncing }: { count: number; syncing: boolean }) {
  if (count === 0 && !syncing) return null;

  return (
    <div
      style={{
        padding: '8px 12px',
        borderRadius: 8,
        backgroundColor: syncing ? '#dbeafe' : '#fef3c7',
        color: syncing ? '#1e40af' : '#92400e',
        fontSize: 12,
        fontWeight: 500,
        marginBottom: 12,
      }}
    >
      {syncing ? `Menyinkronkan ${count} aksi...` : `${count} aksi menunggu sinkronisasi`}
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
      style={{
        border: isQueued ? '2px solid #f59e0b' : '1px solid #e5e7eb',
        borderRadius: 8,
        padding: 16,
        marginBottom: 12,
        backgroundColor: isQueued ? '#fffbeb' : '#fff',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <strong>{task.id_order}</strong>
        <StatusBadge status={task.status} />
      </div>

      <div style={{ fontSize: 14, color: '#374151', marginBottom: 8 }}>
        <p style={{ margin: '4px 0' }}>
          <strong>Jemput:</strong> {task.alamat_penjemputan}
        </p>
        <p style={{ margin: '4px 0', color: '#6b7280', fontSize: 12 }}>
          ({task.koordinat_penjemputan.latitude}, {task.koordinat_penjemputan.longitude})
        </p>
        {task.berat_kg != null && (
          <p style={{ margin: '4px 0' }}>
            <strong>Berat:</strong> {task.berat_kg} kg
          </p>
        )}
      </div>

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <a
          href={task.google_maps_url}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-block',
            padding: '8px 16px',
            backgroundColor: '#1a73e8',
            color: '#fff',
            borderRadius: 6,
            textDecoration: 'none',
            fontSize: 14,
            fontWeight: 500,
          }}
        >
          Buka Google Maps
        </a>

        {nextStatus && (
          <button
            onClick={() => onStatusChange(task.id_order, nextStatus)}
            disabled={isQueued}
            style={{
              padding: '8px 16px',
              backgroundColor: isQueued ? '#9ca3af' : '#10b981',
              color: '#fff',
              border: 'none',
              borderRadius: 6,
              fontSize: 14,
              fontWeight: 500,
              cursor: isQueued ? 'not-allowed' : 'pointer',
            }}
          >
            {isQueued ? 'Tersimpan Offline' : `Ubah ke ${nextStatus}`}
            {!online && !isQueued && ' (Offline)'}
          </button>
        )}
      </div>

      {isQueued && (
        <p style={{ margin: '8px 0 0', fontSize: 11, color: '#92400e' }}>
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

  if (loading) return <p>Memuat tugas harian...</p>;
  if (error) return <p style={{ color: '#dc2626' }}>{error}</p>;
  if (!data) return null;

  const pendingCount = queue.filter((a) => !a.synced).length;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <h2 style={{ fontSize: 18, margin: 0 }}>Tugas Harian</h2>
        <OnlineIndicator online={online} />
      </div>

      <p style={{ fontSize: 14, color: '#6b7280', margin: '0 0 12px' }}>
        {data.nama_kurir} &mdash; {data.id_cabang} &mdash; {data.total_tugas} tugas
      </p>

      <QueueIndicator count={pendingCount} syncing={syncing} />

      {data.tugas.length === 0 ? (
        <p style={{ color: '#6b7280', textAlign: 'center', padding: 32 }}>Tidak ada tugas untuk hari ini.</p>
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
