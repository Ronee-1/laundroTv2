import { useState, useEffect } from 'react';

interface BranchFinancial {
  id_cabang: string;
  nama_cabang: string;
  total_pemasukan: number;
  total_pengeluaran: number;
  saldo: number;
  pagu_anggaran: number;
  terpakai: number;
  sisa_pagu: number;
  utilization_percent: number;
  transaction_count: number;
}

interface DashboardData {
  success: boolean;
  summary: {
    total_pemasukan: number;
    total_pengeluaran: number;
    total_saldo: number;
    total_cabang: number;
    active_branches: number;
  };
  per_cabang: BranchFinancial[];
  generated_at: string;
}

function formatRupiah(nominal: number): string {
  return `Rp${nominal.toLocaleString('id-ID')}`;
}

function ProgressBar({ percent, color }: { percent: number; color: string }) {
  return (
    <div style={{ width: '100%', height: 8, backgroundColor: '#e5e7eb', borderRadius: 4, overflow: 'hidden' }}>
      <div
        style={{
          width: `${Math.min(percent, 100)}%`,
          height: '100%',
          backgroundColor: color,
          transition: 'width 0.3s ease',
        }}
      />
    </div>
  );
}

function BranchCard({ branch }: { branch: BranchFinancial }) {
  const profitColor = branch.saldo >= 0 ? '#10b981' : '#ef4444';
  const budgetColor = branch.utilization_percent > 90 ? '#ef4444' : branch.utilization_percent > 70 ? '#f59e0b' : '#10b981';

  return (
    <div
      style={{
        border: '1px solid #e5e7eb',
        borderRadius: 12,
        padding: 20,
        marginBottom: 16,
        backgroundColor: '#fff',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div>
          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600 }}>{branch.nama_cabang}</h3>
          <p style={{ margin: '4px 0 0', fontSize: 12, color: '#6b7280' }}>{branch.id_cabang}</p>
        </div>
        <div
          style={{
            padding: '4px 12px',
            borderRadius: 16,
            backgroundColor: profitColor,
            color: '#fff',
            fontSize: 12,
            fontWeight: 600,
          }}
        >
          {branch.saldo >= 0 ? 'Profit' : 'Loss'}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
        <div>
          <p style={{ margin: 0, fontSize: 12, color: '#6b7280' }}>Pemasukan</p>
          <p style={{ margin: '4px 0 0', fontSize: 16, fontWeight: 600, color: '#10b981' }}>
            {formatRupiah(branch.total_pemasukan)}
          </p>
        </div>
        <div>
          <p style={{ margin: 0, fontSize: 12, color: '#6b7280' }}>Pengeluaran</p>
          <p style={{ margin: '4px 0 0', fontSize: 16, fontWeight: 600, color: '#ef4444' }}>
            {formatRupiah(branch.total_pengeluaran)}
          </p>
        </div>
      </div>

      <div style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
          <p style={{ margin: 0, fontSize: 12, color: '#6b7280' }}>Saldo Bersih</p>
          <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: profitColor }}>
            {formatRupiah(branch.saldo)}
          </p>
        </div>
      </div>

      <div style={{ marginBottom: 12 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
          <p style={{ margin: 0, fontSize: 12, color: '#6b7280' }}>Utilisasi Anggaran</p>
          <p style={{ margin: 0, fontSize: 12, fontWeight: 600, color: budgetColor }}>
            {branch.utilization_percent.toFixed(1)}%
          </p>
        </div>
        <ProgressBar percent={branch.utilization_percent} color={budgetColor} />
        <p style={{ margin: '4px 0 0', fontSize: 11, color: '#9ca3af' }}>
          {formatRupiah(branch.terpakai)} / {formatRupiah(branch.pagu_anggaran)}
        </p>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 12, borderTop: '1px solid #f3f4f6' }}>
        <p style={{ margin: 0, fontSize: 11, color: '#9ca3af' }}>Sisa Pagu</p>
        <p style={{ margin: 0, fontSize: 12, fontWeight: 500, color: '#6b7280' }}>
          {formatRupiah(branch.sisa_pagu)}
        </p>
      </div>
    </div>
  );
}

export function DashboardEksekutif() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function fetchDashboard() {
      try {
        const res = await fetch('/api/owner/dashboard');
        const json = (await res.json()) as DashboardData;

        if (cancelled) return;

        if (!res.ok || !json.success) {
          setError('Gagal memuat dashboard.');
          return;
        }

        setData(json);
      } catch {
        if (!cancelled) setError('Tidak dapat terhubung ke server.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchDashboard();
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) return <p style={{ textAlign: 'center', padding: 32 }}>Memuat dashboard...</p>;
  if (error) return <p style={{ color: '#dc2626', textAlign: 'center', padding: 32 }}>{error}</p>;
  if (!data) return null;

  const totalProfit = data.summary.total_saldo;
  const profitColor = totalProfit >= 0 ? '#10b981' : '#ef4444';

  return (
    <div>
      <h2 style={{ fontSize: 20, marginBottom: 4 }}>Dashboard Keuangan Eksekutif</h2>
      <p style={{ fontSize: 14, color: '#6b7280', margin: '0 0 20px' }}>
        Konsolidasi arus kas terpadu — {data.summary.active_branches} cabang aktif
      </p>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 12,
          marginBottom: 24,
          padding: 20,
          backgroundColor: '#f9fafb',
          borderRadius: 12,
        }}
      >
        <div>
          <p style={{ margin: 0, fontSize: 12, color: '#6b7280' }}>Total Pemasukan</p>
          <p style={{ margin: '8px 0 0', fontSize: 20, fontWeight: 700, color: '#10b981' }}>
            {formatRupiah(data.summary.total_pemasukan)}
          </p>
        </div>
        <div>
          <p style={{ margin: 0, fontSize: 12, color: '#6b7280' }}>Total Pengeluaran</p>
          <p style={{ margin: '8px 0 0', fontSize: 20, fontWeight: 700, color: '#ef4444' }}>
            {formatRupiah(data.summary.total_pengeluaran)}
          </p>
        </div>
        <div>
          <p style={{ margin: 0, fontSize: 12, color: '#6b7280' }}>Saldo Bersih</p>
          <p style={{ margin: '8px 0 0', fontSize: 20, fontWeight: 700, color: profitColor }}>
            {formatRupiah(data.summary.total_saldo)}
          </p>
        </div>
      </div>

      <h3 style={{ fontSize: 16, marginBottom: 12 }}>Performa Per Cabang</h3>
      {data.per_cabang.map((branch) => (
        <BranchCard key={branch.id_cabang} branch={branch} />
      ))}

      <p style={{ fontSize: 11, color: '#9ca3af', textAlign: 'center', marginTop: 24 }}>
        Terakhir diperbarui: {new Date(data.generated_at).toLocaleString('id-ID')}
      </p>
    </div>
  );
}
