import { useState, useEffect } from 'react';

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

function TaskCard({ task }: { task: CourierTask }) {
  return (
    <div
      style={{
        border: '1px solid #e5e7eb',
        borderRadius: 8,
        padding: 16,
        marginBottom: 12,
        backgroundColor: '#fff',
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
    </div>
  );
}

export function TugasHarian({ idKurir }: TugasHarianProps) {
  const [data, setData] = useState<TugasHarianResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

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

  return (
    <div>
      <h2 style={{ fontSize: 18, marginBottom: 4 }}>Tugas Harian</h2>
      <p style={{ fontSize: 14, color: '#6b7280', margin: '0 0 16px' }}>
        {data.nama_kurir} &mdash; {data.id_cabang} &mdash; {data.total_tugas} tugas
      </p>

      {data.tugas.length === 0 ? (
        <p style={{ color: '#6b7280', textAlign: 'center', padding: 32 }}>Tidak ada tugas untuk hari ini.</p>
      ) : (
        data.tugas.map((task) => <TaskCard key={task.id_order} task={task} />)
      )}
    </div>
  );
}
