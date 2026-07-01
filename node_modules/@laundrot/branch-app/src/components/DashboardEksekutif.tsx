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

function SummaryCard({
  label,
  value,
  icon,
  color,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
  color: string;
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <p className="text-sm font-medium text-gray-600">{label}</p>
        <div className={`p-2 rounded-lg ${color}`}>{icon}</div>
      </div>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
    </div>
  );
}

function BranchRow({ branch, index }: { branch: BranchFinancial; index: number }) {
  const profitColor = branch.saldo >= 0 ? 'text-emerald-600' : 'text-red-600';
  const budgetColor =
    branch.utilization_percent > 90
      ? 'bg-red-500'
      : branch.utilization_percent > 70
        ? 'bg-amber-500'
        : 'bg-emerald-500';

  const budgetTextColor =
    branch.utilization_percent > 90
      ? 'text-red-600'
      : branch.utilization_percent > 70
        ? 'text-amber-600'
        : 'text-emerald-600';

  return (
    <tr className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
      <td className="px-6 py-4 whitespace-nowrap">
        <div>
          <p className="text-sm font-semibold text-gray-900">{branch.nama_cabang}</p>
          <p className="text-xs text-gray-500">{branch.id_cabang}</p>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right">
        <p className="text-sm font-semibold text-emerald-600">{formatRupiah(branch.total_pemasukan)}</p>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right">
        <p className="text-sm font-semibold text-red-600">{formatRupiah(branch.total_pengeluaran)}</p>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right">
        <p className={`text-sm font-bold ${profitColor}`}>{formatRupiah(branch.saldo)}</p>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center gap-3">
          <div className="flex-1 min-w-[100px]">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all ${budgetColor}`}
                style={{ width: `${Math.min(branch.utilization_percent, 100)}%` }}
              />
            </div>
          </div>
          <span className={`text-xs font-semibold ${budgetTextColor} min-w-[45px] text-right`}>
            {branch.utilization_percent.toFixed(1)}%
          </span>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right">
        <div>
          <p className="text-sm font-semibold text-gray-900">{formatRupiah(branch.sisa_pagu)}</p>
          <p className="text-xs text-gray-500">
            dari {formatRupiah(branch.pagu_anggaran)}
          </p>
        </div>
      </td>
    </tr>
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
          <p className="text-gray-600 text-sm">Memuat dashboard...</p>
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

  const totalProfit = data.summary.total_saldo;

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-1">Dashboard Keuangan Eksekutif</h2>
        <p className="text-sm text-gray-600">
          Konsolidasi arus kas terpadu — {data.summary.active_branches} cabang aktif
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <SummaryCard
          label="Total Pemasukan"
          value={formatRupiah(data.summary.total_pemasukan)}
          color="bg-emerald-100"
          icon={
            <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 11l5-5m0 0l5 5m-5-5v12"
              />
            </svg>
          }
        />
        <SummaryCard
          label="Total Pengeluaran"
          value={formatRupiah(data.summary.total_pengeluaran)}
          color="bg-red-100"
          icon={
            <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 13l-5 5m0 0l-5-5m5 5V6"
              />
            </svg>
          }
        />
        <SummaryCard
          label="Saldo Bersih"
          value={formatRupiah(data.summary.total_saldo)}
          color={totalProfit >= 0 ? 'bg-blue-100' : 'bg-red-100'}
          icon={
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          }
        />
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h3 className="text-lg font-bold text-gray-900">Performa Per Cabang</h3>
          <p className="text-xs text-gray-600 mt-1">Rincian finansial dan utilisasi anggaran</p>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Cabang
                </th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Pemasukan
                </th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Pengeluaran
                </th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Saldo
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Utilisasi Budget
                </th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Sisa Pagu
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {data.per_cabang.map((branch, index) => (
                <BranchRow key={branch.id_cabang} branch={branch} index={index} />
              ))}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center">
            Terakhir diperbarui: {new Date(data.generated_at).toLocaleString('id-ID')}
          </p>
        </div>
      </div>
    </div>
  );
}
