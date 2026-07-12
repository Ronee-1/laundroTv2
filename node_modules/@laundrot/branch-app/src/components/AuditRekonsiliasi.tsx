import { useState, useEffect, useCallback } from 'react';
import type { UserRole } from '../App.tsx';

const BRANCH_OPTIONS = [
  { id: 'CBG-001', nama: 'Cabang Depok (Pusat)' },
  { id: 'CBG-002', nama: 'Cabang Jakarta Selatan' },
  { id: 'CBG-003', nama: 'Cabang Bekasi Timur' },
  { id: 'CBG-004', nama: 'Cabang Tangerang Kota' },
  { id: 'CBG-005', nama: 'Cabang Bogor Raya' },
];

interface ReconcileResult {
  id_rekonsiliasi: string;
  id_cabang: string;
  nama_cabang: string;
  kas_digital: number;
  kas_fisik: number;
  selisih: number;
  status: string;
  approval_status: string;
  message: string;
}

interface HistoryLog {
  id_rekonsiliasi: string;
  id_cabang?: string;
  nama_cabang?: string;
  tanggal: string;
  kas_digital: number;
  kas_fisik: number;
  selisih: number;
  status: string;
  approval_status: string;
  catatan?: string;
  catatan_owner?: string;
}

interface Props {
  userRole: UserRole;
  selectedAdminBranch: string;
  triggerNotification: (msg: string, type?: 'success' | 'error' | 'warning') => void;
}

function formatIDR(num: number): string {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num);
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

function discrepancyStyle(selisih: number): { bg: string; text: string; border: string } {
  if (selisih === 0) return { bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-200' };
  if (selisih > 0) return { bg: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-200' };
  return { bg: 'bg-red-50', text: 'text-red-600', border: 'border-red-200' };
}

function approvalStyle(status: string): { bg: string; text: string; border: string; label: string } {
  if (status === 'Disetujui') return { bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-200', label: 'Disetujui' };
  if (status === 'Ditolak') return { bg: 'bg-red-50', text: 'text-red-600', border: 'border-red-200', label: 'Ditolak' };
  return { bg: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-200', label: 'Pending' };
}

// ==========================================
// AUDIT REKONSILIASI KAS - FR-FIN-09, ROLE-BASED UI
// Admin melihat input form saja (tanpa approve/reject)
// Owner melihat approve/reject saja (tanpa input form)
// ==========================================
export function AuditRekonsiliasi({ userRole, selectedAdminBranch, triggerNotification }: Props) {
  const [selectedBranchId] = useState('CBG-001');
  const [kasFisik, setKasFisik] = useState('');
  const [catatan, setCatatan] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<ReconcileResult | null>(null);
  const [isLocked, setIsLocked] = useState(false);
  const [historyLogs, setHistoryLogs] = useState<HistoryLog[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [filterBranch, setFilterBranch] = useState('all');
  const [filterDate, setFilterDate] = useState('');
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // FR-012: Financial summary data
  const [financialSummary, setFinancialSummary] = useState({
    totalPemasukanHariIni: 0,
    totalPengeluaranHariIni: 0,
    sisaKasAkhirLaci: 0,
  });

  const isAdmin = userRole === 'Admin';
 const isOwner = userRole === 'Owner';

  const fetchHistory = useCallback(async () => {
    setHistoryLoading(true);
    try {
      if (isAdmin) {
        const res = await fetch(`/api/branches/${selectedAdminBranch}/reconcile/history`);
        const json = await res.json();
        if (res.ok && json.success) setHistoryLogs(json.logs);
      } else {
        const res = await fetch('/api/branches/reconcile/all');
        const json = await res.json();
        if (res.ok && json.success) setHistoryLogs(json.logs);
      }
    } catch { /* ignore */ } finally { setHistoryLoading(false); }
  }, [isAdmin, selectedAdminBranch]);

  // Fetch financial summary for Admin
  const fetchFinancialSummary = useCallback(async () => {
    if (!isAdmin) return;
    try {
      const res = await fetch(`/api/branches/${selectedAdminBranch}/daily-summary`);
      if (res.ok) {
        const json = await res.json();
        setFinancialSummary({
          totalPemasukanHariIni: json.total_pemasukan ?? 0,
          totalPengeluaranHariIni: json.total_pengeluaran ?? 0,
          sisaKasAkhirLaci: json.sisa_kas ?? 0,
        });
      } else {
        // Mock data if endpoint not available
        setFinancialSummary({
          totalPemasukanHariIni: 850000,
          totalPengeluaranHariIni: 320000,
          sisaKasAkhirLaci: 530000,
        });
      }
    } catch {
      // Mock data
      setFinancialSummary({
        totalPemasukanHariIni: 850000,
        totalPengeluaranHariIni: 320000,
        sisaKasAkhirLaci: 530000,
      });
    }
  }, [isAdmin, selectedAdminBranch]);

  useEffect(() => { fetchHistory(); }, [fetchHistory]);
  useEffect(() => { fetchFinancialSummary(); }, [fetchFinancialSummary]);

  // FR-012: Validation logic - only "Sesuai" if kas_fisik === sisaKasAkhirLaci
  const validationStatus = useCallback(() => {
    const fisik = parseFloat(kasFisik);
    if (isNaN(fisik) || fisik < 0) return null;
    if (fisik === financialSummary.sisaKasAkhirLaci) return 'Sesuai';
    if (fisik !== financialSummary.sisaKasAkhirLaci) return 'Selisih';
    return null;
  }, [kasFisik, financialSummary.sisaKasAkhirLaci]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const targetBranchId = isAdmin ? selectedAdminBranch : selectedBranchId;
    const kas_fisik_val = parseFloat(kasFisik);
    if (isNaN(kas_fisik_val) || kas_fisik_val < 0) {
      triggerNotification('Nominal kas fisik tidak valid!', 'error');
      return;
    }

    setSubmitting(true);
    setResult(null);
    try {
      const res = await fetch(`/api/branches/${targetBranchId}/reconcile`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ kas_fisik: kas_fisik_val, catatan: catatan || undefined }),
      });
      const json = (await res.json()) as ReconcileResult & { error?: string };
      if (!res.ok) {
        triggerNotification(json.error ?? 'Terjadi kesalahan.', 'error');
        return;
      }
      setResult(json);
      if (isAdmin) {
        setIsLocked(true);
        triggerNotification('Data audit berhasil dikirim dan dikunci.', 'success');
      } else {
        if (json.status === 'Cocok') triggerNotification(json.message ?? 'Audit berhasil.', 'success');
        else triggerNotification(json.message ?? 'Selisih terdeteksi!', 'warning');
      }
      setKasFisik('');
      setCatatan('');
      fetchHistory();
    } catch {
      triggerNotification('Tidak dapat terhubung ke server.', 'error');
    } finally { setSubmitting(false); }
  }

  async function handleApprove(id: string) {
    if (!isOwner) return;
    setActionLoading(id);
    try {
      const res = await fetch(`/api/branches/reconcile/${id}/approve`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });
      const json = await res.json();
      if (res.ok && json.success) {
        triggerNotification(json.message, 'success');
        fetchHistory();
      } else {
        triggerNotification(json.error ?? 'Gagal memproses.', 'error');
      }
    } catch { triggerNotification('Tidak dapat terhubung ke server.', 'error'); } finally { setActionLoading(null); }
  }

  async function handleReject(id: string) {
    if (!isOwner) return;
    setActionLoading(id);
    try {
      const res = await fetch(`/api/branches/reconcile/${id}/reject`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });
      const json = await res.json();
      if (res.ok && json.success) {
        triggerNotification(json.message, 'warning');
        fetchHistory();
      } else {
        triggerNotification(json.error ?? 'Gagal memproses.', 'error');
      }
    } catch { triggerNotification('Tidak dapat terhubung ke server.', 'error'); } finally { setActionLoading(null); }
  }

  const filteredLogs = historyLogs.filter((log) => {
    if (!isAdmin && filterBranch !== 'all' && log.id_cabang !== filterBranch) return false;
    if (filterDate) {
      const logDate = new Date(log.tanggal).toISOString().split('T')[0];
      if (logDate !== filterDate) return false;
    }
    return true;
  });

  const currentValidationStatus = validationStatus();

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-navy tracking-tight">Audit Rekonsiliasi Kas</h1>
        <p className="text-sm text-slate-500 mt-1">
          {isAdmin ? 'Input blind closing shift — kas fisik bersifat final setelah dikirim.' : 'Pemantauan komparasi saldo kas riil vs digital.'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* LEFT: Input Form (Admin only) / Result Panel (Owner) */}
        {isAdmin ? (
          // ADMIN: Input Form
          <div className="bg-white border border-slate-200 rounded-2xl p-6">
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-base font-bold text-navy">Input Audit Kas</h3>
              {isLocked && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-red-50 text-red-600 border border-red-200">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                  Terkunci
                </span>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Financial Summary - FR-012 */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <p className="text-xs font-semibold text-blue-800 uppercase tracking-wider mb-3">Ringkasan Keuangan Hari Ini</p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-blue-700">Total Pendapatan Tunai</span>
                    <span className="font-bold text-emerald-600">{formatIDR(financialSummary.totalPemasukanHariIni)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-700">Total Pengeluaran</span>
                    <span className="font-bold text-red-600">{formatIDR(financialSummary.totalPengeluaranHariIni)}</span>
                  </div>
                  <div className="border-t border-blue-200 pt-2 flex justify-between">
                    <span className="font-semibold text-blue-800">Sisa Kas Akhir Laci</span>
                    <span className="font-bold text-deep-blue text-lg">{formatIDR(financialSummary.sisaKasAkhirLaci)}</span>
                  </div>
                </div>
              </div>

              {/* Kas Fisik Input */}
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-2">
                  Uang Kas Fisik (IDR)
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400 text-sm">Rp</span>
                  <input type="number" placeholder="530.000" value={kasFisik} onChange={(e) => { setKasFisik(e.target.value); }}
                    disabled={isLocked}
                    className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-sm text-navy placeholder:text-slate-400 focus:outline-none focus:border-deep-blue transition-all disabled:opacity-50"
                    required />
                </div>
                {currentValidationStatus && (
                  <div className={`mt-2 flex items-center gap-2 text-xs font-medium px-3 py-2 rounded-lg ${currentValidationStatus === 'Sesuai' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                    {currentValidationStatus === 'Sesuai' ? '✓' : '⚠️'} {currentValidationStatus}
                    {currentValidationStatus === 'Selisih' && (
                      <span className="ml-1">(Selisih: {formatIDR(parseFloat(kasFisik) - financialSummary.sisaKasAkhirLaci)})</span>
                    )}
                  </div>
                )}
              </div>

              {/* Catatan */}
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-2">Catatan</label>
                <textarea rows={2} placeholder="Alasan jika terdapat selisih..." value={catatan} onChange={(e) => setCatatan(e.target.value)}
                  disabled={isLocked}
                  className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm text-navy placeholder:text-slate-400 focus:outline-none focus:border-deep-blue transition-all resize-none disabled:opacity-50" />
              </div>

              {/* Submit Button */}
              <button type="submit" disabled={submitting || isLocked}
                className="w-full bg-deep-blue hover:bg-navy text-white font-medium text-sm py-3 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                {submitting ? 'Memproses...' : isLocked ? 'Terkunci — Data Final' : 'Kirim & Validasi Ke Pusat'}
              </button>
            </form>
          </div>
        ) : (
          // OWNER: Result Panel
          <div className="bg-white border border-slate-200 rounded-2xl p-6">
            <h3 className="text-base font-bold text-navy mb-4">Komparasi Saldo</h3>
            {result ? (
              <div className={`p-4 rounded-xl border ${discrepancyStyle(result.selisih).bg} ${discrepancyStyle(result.selisih).border}`}>
                <div className="flex justify-between items-center mb-3">
                  <h4 className={`text-sm font-semibold ${discrepancyStyle(result.selisih).text}`}>Hasil: {result.nama_cabang}</h4>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${discrepancyStyle(result.selisih).bg} ${discrepancyStyle(result.selisih).border}`}>{result.status}</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="bg-white rounded-xl p-3 text-center">
                    <span className="text-[10px] text-slate-400 block">Kas Digital</span>
                    <span className="text-sm font-semibold text-navy">{formatIDR(result.kas_digital)}</span>
                  </div>
                  <div className="bg-white rounded-xl p-3 text-center">
                    <span className="text-[10px] text-slate-400 block">Kas Fisik</span>
                    <span className="text-sm font-semibold text-navy">{formatIDR(result.kas_fisik)}</span>
                  </div>
                  <div className="bg-white rounded-xl p-3 text-center">
                    <span className="text-[10px] text-slate-400 block">Selisih</span>
                    <span className={`text-sm font-bold ${discrepancyStyle(result.selisih).text}`}>{result.selisih > 0 ? '+' : ''}{formatIDR(result.selisih)}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 bg-base-bg rounded-xl">
                <svg className="w-8 h-8 text-slate-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <span className="text-xs text-slate-400">Pilih cabang & kirim audit</span>
              </div>
            )}
          </div>
        )}

        {/* RIGHT: Blind Input Procedure / History */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6">
          <h3 className="text-base font-bold text-navy mb-4">
            {isAdmin ? 'Prosedur Anti-Kebocoran' : 'Riwayat Audit'}
          </h3>

          {isAdmin ? (
            // Admin: Blind procedure guide
            <div className="space-y-4">
              <div className="bg-base-bg rounded-xl p-4">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">Prosedur Anti-Kebocoran</p>
                <div className="space-y-4">
                  {[
                    { step: '1', title: 'Kunci Pembukuan', desc: 'Admin menghentikan input order pukul 21:00.' },
                    { step: '2', title: 'Hitung Kas Fisik', desc: 'Uang kas di laci dihitung manual.' },
                    { step: '3', title: 'Rekonsiliasi Digital', desc: 'Input kas fisik, data terkunci otomatis.' }
                  ].map((item) => (
                    <div key={item.step} className="flex gap-3">
                      <div className="w-8 h-8 bg-deep-blue rounded-xl flex items-center justify-center text-xs font-bold text-white flex-shrink-0">{item.step}</div>
                      <div>
                        <h4 className="text-sm font-semibold text-navy">{item.title}</h4>
                        <p className="text-xs text-slate-500">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                <p className="text-xs font-semibold text-emerald-800 uppercase tracking-wider mb-2">Langkah Terakhir</p>
                <p className="text-sm font-bold text-navy">Hitung Jumlah Uang Fisik Di Laci Kas</p>
                <p className="text-xs text-slate-600 mt-2">
                  Masukkan nominal kas fisik Anda ke kolom "Uang Kas Fisik". Sistem akan otomatis membandingkan dengan Sisa Kas Akhir Laci.
                </p>
              </div>
            </div>
          ) : (
            // Owner: Filter and history
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <select value={filterBranch} onChange={(e) => setFilterBranch(e.target.value)}
                  className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-navy focus:outline-none focus:border-deep-blue">
                  <option value="all">Semua Branch</option>
                  {BRANCH_OPTIONS.map((b) => (<option key={b.id} value={b.id}>{b.nama}</option>))}
                </select>
                <input type="date" value={filterDate} onChange={(e) => setFilterDate(e.target.value)}
                  className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-navy focus:outline-none focus:border-deep-blue" />
              </div>

              {historyLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="w-6 h-6 border-2 border-slate-200 border-t-deep-blue rounded-full animate-spin"></div>
                </div>
              ) : filteredLogs.length === 0 ? (
                <div className="text-center py-8 bg-base-bg rounded-xl">
                  <span className="text-xs text-slate-400">Belum ada riwayat audit</span>
                </div>
              ) : (
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {filteredLogs.map((log) => {
                    const ds = discrepancyStyle(log.selisih);
                    const ap = approvalStyle(log.approval_status);
                    return (
                      <div key={log.id_rekonsiliasi} className={`p-3 rounded-xl border ${ds.border} ${ds.bg}`}>
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="text-xs font-medium text-navy">{log.nama_cabang ?? log.id_cabang}</p>
                            <p className="text-[10px] text-slate-400">{formatDate(log.tanggal)}</p>
                          </div>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium border ${ap.bg} ${ap.text}`}>{ap.label}</span>
                        </div>
                        <div className="grid grid-cols-3 gap-2 text-[10px]">
                          <div className="text-center">
                            <span className="text-slate-400 block">Digital</span>
                            <span className="font-medium text-navy">{formatIDR(log.kas_digital)}</span>
                          </div>
                          <div className="text-center">
                            <span className="text-slate-400 block">Fisik</span>
                            <span className="font-medium text-navy">{formatIDR(log.kas_fisik)}</span>
                          </div>
                          <div className="text-center">
                            <span className="text-slate-400 block">Selisih</span>
                            <span className={`font-bold ${ds.text}`}>{log.selisih > 0 ? '+' : ''}{formatIDR(log.selisih)}</span>
                          </div>
                        </div>
                        {isOwner && log.approval_status === 'Pending' && (
                          <div className="flex gap-2 mt-2 pt-2 border-t border-slate-200">
                            <button onClick={() => handleApprove(log.id_rekonsiliasi)} disabled={actionLoading === log.id_rekonsiliasi}
                              className="flex-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 text-[10px] font-medium px-2 py-1.5 rounded-lg transition-all disabled:opacity-50">Setujui</button>
                            <button onClick={() => handleReject(log.id_rekonsiliasi)} disabled={actionLoading === log.id_rekonsiliasi}
                              className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 text-[10px] font-medium px-2 py-1.5 rounded-lg transition-all disabled:opacity-50">Tolak</button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
