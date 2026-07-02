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

function discrepancyColor(selisih: number): { bg: string; text: string } {
  if (selisih === 0) return { bg: 'bg-[#ECFDF5]', text: 'text-[#047857]' };
  if (selisih > 0) return { bg: 'bg-[#FFFBEB]', text: 'text-[#B45309]' };
  return { bg: 'bg-[#FFF1F2]', text: 'text-[#BE123C]' };
}

function approvalBadge(status: string): { bg: string; text: string; label: string } {
  if (status === 'Disetujui') return { bg: 'bg-[#ECFDF5]', text: 'text-[#047857]', label: 'Disetujui' };
  if (status === 'Ditolak') return { bg: 'bg-[#FFF1F2]', text: 'text-[#BE123C]', label: 'Ditolak' };
  return { bg: 'bg-[#FFFBEB]', text: 'text-[#B45309]', label: 'Pending' };
}

export function AuditRekonsiliasi({ userRole, selectedAdminBranch, triggerNotification }: Props) {
  const [selectedBranchId, setSelectedBranchId] = useState('CBG-001');
  const [kasFisik, setKasFisik] = useState('');
  const [catatan, setCatatan] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<ReconcileResult | null>(null);
  const [isLocked, setIsLocked] = useState(false);
  const [ownerOverride, setOwnerOverride] = useState(false);
  const [overrideKasFisik, setOverrideKasFisik] = useState('');
  const [overrideCatatan, setOverrideCatatan] = useState('');
  const [overrideSubmitting, setOverrideSubmitting] = useState(false);
  const [historyLogs, setHistoryLogs] = useState<HistoryLog[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [filterBranch, setFilterBranch] = useState('all');
  const [filterDate, setFilterDate] = useState('');
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const isAdmin = userRole === 'Admin Cabang';
  const activeBranchId = isAdmin ? selectedAdminBranch : selectedBranchId;

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

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const targetBranchId = isAdmin ? selectedAdminBranch : selectedBranchId;
    const kas_fisik = parseFloat(kasFisik);
    if (isNaN(kas_fisik) || kas_fisik < 0) {
      triggerNotification('Nominal kas fisik tidak valid!', 'error');
      return;
    }
    setSubmitting(true);
    setResult(null);
    try {
      const res = await fetch(`/api/branches/${targetBranchId}/reconcile`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ kas_fisik, catatan: catatan || undefined }),
      });
      const json = (await res.json()) as ReconcileResult & { error?: string };
      if (!res.ok) {
        triggerNotification(json.error ?? 'Terjadi kesalahan.', 'error');
        return;
      }
      setResult(json);
      if (isAdmin) {
        setIsLocked(true);
        triggerNotification('Data audit berhasil dikirim dan dikunci. Menunggu persetujuan Owner.', 'success');
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

  async function handleOverride(id: string) {
    const kas_fisik = parseFloat(overrideKasFisik);
    if (isNaN(kas_fisik) || kas_fisik < 0) {
      triggerNotification('Nominal override tidak valid!', 'error');
      return;
    }
    setOverrideSubmitting(true);
    try {
      const res = await fetch(`/api/branches/reconcile/${id}/override`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ kas_fisik, catatan_owner: overrideCatatan || undefined }),
      });
      const json = await res.json();
      if (res.ok && json.success) {
        triggerNotification(json.message, 'success');
        setOwnerOverride(false);
        setOverrideKasFisik('');
        setOverrideCatatan('');
        setResult(null);
        fetchHistory();
      } else {
        triggerNotification(json.error ?? 'Gagal override.', 'error');
      }
    } catch { triggerNotification('Tidak dapat terhubung ke server.', 'error'); } finally { setOverrideSubmitting(false); }
  }

  const filteredLogs = historyLogs.filter((log) => {
    if (!isAdmin && filterBranch !== 'all' && log.id_cabang !== filterBranch) return false;
    if (filterDate) {
      const logDate = new Date(log.tanggal).toISOString().split('T')[0];
      if (logDate !== filterDate) return false;
    }
    return true;
  });

  return (
    <div className="space-y-8 max-w-[1400px]">
      <div>
        <h1 className="text-3xl font-bold text-[#0F172A] tracking-tight">Audit Rekonsiliasi Kas</h1>
        <p className="text-slate-500 text-sm mt-1.5">
          {isAdmin
            ? 'Input blind closing shift — angka kas fisik Anda bersifat final setelah dikirim.'
            : 'Pemantauan komparasi saldo kas riil versus buku digital seluruh cabang.'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="bg-white p-8 rounded-4xl border border-slate-100 shadow-card lg:col-span-5 h-fit">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-[#0F172A]">
              {isAdmin ? 'Input Audit Kas' : 'Form Audit (Read-Only)'}
            </h3>
            {isAdmin && isLocked && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-semibold bg-[#FFF1F2] text-[#BE123C]">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                Terkunci
              </span>
            )}
            {!isAdmin && !ownerOverride && result && (
              <button
                onClick={() => { setOwnerOverride(true); setOverrideKasFisik(String(result.kas_fisik)); }}
                className="text-[10px] font-semibold text-slate-400 hover:text-[#BE123C] bg-slate-50 hover:bg-[#FFF1F2] px-3 py-1.5 rounded-lg border border-slate-200 hover:border-[#BE123C]/20 transition-all"
              >
                Override Data
              </button>
            )}
          </div>

          {!ownerOverride ? (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="text-xs font-semibold text-slate-500 block mb-2">Cabang Audit</label>
                {!isAdmin ? (
                  <select
                    value={selectedBranchId}
                    onChange={(e) => setSelectedBranchId(e.target.value)}
                    disabled={isLocked}
                    className="w-full bg-slate-50 border border-transparent rounded-xl px-4 py-3 text-sm text-[#0F172A] focus:outline-none focus:bg-white focus:border-blue-600/30 transition-all disabled:opacity-50"
                  >
                    {BRANCH_OPTIONS.map((b) => (<option key={b.id} value={b.id}>{b.nama}</option>))}
                  </select>
                ) : (
                  <div className="w-full bg-slate-50 border border-transparent rounded-xl px-4 py-3 text-sm text-[#B45309] font-semibold">
                    {BRANCH_OPTIONS.find((b) => b.id === selectedAdminBranch)?.nama}
                  </div>
                )}
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-500 block mb-2">Uang Kas Fisik di Laci (IDR)</label>
                {isAdmin || !result ? (
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 text-sm font-medium">Rp</span>
                    <input
                      type="number"
                      placeholder="15.200.000"
                      value={kasFisik}
                      onChange={(e) => setKasFisik(e.target.value)}
                      disabled={isLocked}
                      className="w-full bg-slate-50 border border-transparent pl-12 pr-4 py-3 rounded-xl text-sm text-[#0F172A] placeholder-slate-400 focus:outline-none focus:bg-white focus:border-blue-600/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      required
                    />
                  </div>
                ) : (
                  <div className="w-full bg-slate-50 border border-transparent rounded-xl px-4 py-3 text-sm text-[#0F172A] font-semibold">
                    {formatIDR(result.kas_fisik)}
                  </div>
                )}
                <span className="text-[10px] text-slate-400 mt-1.5 block">
                  {isAdmin ? 'Nominal rupiah yang dihitung secara manual di outlet.' : 'Data kas fisik yang diinput Admin Cabang.'}
                </span>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-500 block mb-2">Catatan / Justifikasi</label>
                {isAdmin || !result ? (
                  <textarea
                    rows={3}
                    placeholder="Tulis alasan jika terdapat selisih..."
                    value={catatan}
                    onChange={(e) => setCatatan(e.target.value)}
                    disabled={isLocked}
                    className="w-full bg-slate-50 border border-transparent rounded-xl px-4 py-3 text-sm text-[#0F172A] placeholder-slate-400 focus:outline-none focus:bg-white focus:border-blue-600/30 transition-all resize-none disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                ) : (
                  <div className="w-full bg-slate-50 border border-transparent rounded-xl px-4 py-3 text-sm text-slate-600 min-h-[60px]">
                    {result.message || '—'}
                  </div>
                )}
              </div>

              {isAdmin && (
                <button
                  type="submit"
                  disabled={submitting || isLocked}
                  className="w-full bg-[#047857] hover:bg-emerald-700 text-white font-semibold text-sm py-3.5 rounded-xl transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none"
                >
                  {submitting ? 'Memproses...' : isLocked ? 'Terkunci — Data Final' : 'Kirim & Rekonsiliasi'}
                </button>
              )}
            </form>
          ) : (
            <div className="space-y-5">
              <div className="bg-[#FFF1F2] border border-[#BE123C]/10 rounded-xl p-4">
                <p className="text-xs text-[#BE123C] font-semibold">Mode Override Owner</p>
                <p className="text-[10px] text-[#BE123C]/70 mt-1">Anda sedang merevisi data audit. Gunakan hanya untuk koreksi kesalahan input fatal.</p>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 block mb-2">Kas Fisik (Revisi)</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 text-sm font-medium">Rp</span>
                  <input
                    type="number"
                    value={overrideKasFisik}
                    onChange={(e) => setOverrideKasFisik(e.target.value)}
                    className="w-full bg-slate-50 border border-transparent pl-12 pr-4 py-3 rounded-xl text-sm text-[#0F172A] focus:outline-none focus:bg-white focus:border-blue-600/30 transition-all"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 block mb-2">Catatan Override</label>
                <textarea
                  rows={2}
                  placeholder="Alasan override..."
                  value={overrideCatatan}
                  onChange={(e) => setOverrideCatatan(e.target.value)}
                  className="w-full bg-slate-50 border border-transparent rounded-xl px-4 py-3 text-sm text-[#0F172A] placeholder-slate-400 focus:outline-none focus:bg-white focus:border-blue-600/30 transition-all resize-none"
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => { setOwnerOverride(false); setOverrideKasFisik(''); setOverrideCatatan(''); }}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-600 text-sm font-semibold py-3 rounded-xl transition-all"
                >
                  Batal
                </button>
                <button
                  onClick={() => handleOverride(result!.id_rekonsiliasi)}
                  disabled={overrideSubmitting}
                  className="flex-1 bg-[#BE123C] hover:bg-[#9F1239] text-white text-sm font-semibold py-3 rounded-xl transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-md disabled:opacity-50"
                >
                  {overrideSubmitting ? 'Menyimpan...' : 'Konfirmasi Override'}
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="bg-white p-8 rounded-4xl border border-slate-100 shadow-card lg:col-span-7 space-y-8">
          {isAdmin ? (
            <>
              <div>
                <h3 className="text-lg font-bold text-[#0F172A] tracking-tight">Prosedur Anti-Kebocoran Kas</h3>
                <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">Audit kas laci dilakukan setiap penutupan shift kasir demi keamanan operasional.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { step: '1', title: 'Kunci Pembukuan', desc: 'Admin menghentikan input order pada pukul 21:00 WIB.' },
                  { step: '2', title: 'Hitung Kas Fisik', desc: 'Uang kas di laci kasir dihitung secara manual tanpa terburu-buru.' },
                  { step: '3', title: 'Rekonsiliasi Digital', desc: 'Input kas fisik. Data terkunci otomatis setelah pengiriman.' },
                ].map((item) => (
                  <div key={item.step} className="bg-slate-50 p-5 rounded-2xl border border-slate-100 space-y-3">
                    <div className="w-8 h-8 bg-[#0F172A] rounded-full flex items-center justify-center text-xs font-bold text-white">{item.step}</div>
                    <h4 className="text-sm font-bold text-[#0F172A]">{item.title}</h4>
                    <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Cabang Audit Aktif</h4>
                <p className="text-sm font-semibold text-[#0F172A]">{BRANCH_OPTIONS.find((b) => b.id === activeBranchId)?.nama}</p>
              </div>
            </>
          ) : (
            <>
              <div>
                <h3 className="text-lg font-bold text-[#0F172A] tracking-tight">Komparasi Saldo Kas</h3>
                <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">Visualisasi perbandingan saldo sistem vs fisik untuk audit terpusat.</p>
              </div>

              {result && (
                <div className={`p-6 rounded-2xl border transition-all duration-300 ${discrepancyColor(result.selisih).bg} border-slate-200/40`}>
                  <div className="flex justify-between items-center mb-4">
                    <h4 className={`text-sm font-bold ${discrepancyColor(result.selisih).text}`}>Hasil Audit: {result.nama_cabang}</h4>
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-semibold bg-white ${discrepancyColor(result.selisih).text}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${result.selisih === 0 ? 'bg-emerald-500' : result.selisih > 0 ? 'bg-amber-500' : 'bg-rose-500'}`}></span>
                      {result.status}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-white p-4 rounded-xl border border-slate-100">
                      <span className="text-slate-400 block text-[10px] font-semibold uppercase tracking-wider mb-1">Kas Digital</span>
                      <span className="text-[#0F172A] font-semibold text-sm">{formatIDR(result.kas_digital)}</span>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-slate-100">
                      <span className="text-slate-400 block text-[10px] font-semibold uppercase tracking-wider mb-1">Kas Fisik</span>
                      <span className="text-[#0F172A] font-semibold text-sm">{formatIDR(result.kas_fisik)}</span>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-slate-100">
                      <span className="text-slate-400 block text-[10px] font-semibold uppercase tracking-wider mb-1">Selisih</span>
                      <span className={`font-bold text-sm ${discrepancyColor(result.selisih).text}`}>
                        {result.selisih > 0 ? '+' : ''}{formatIDR(result.selisih)}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 mt-3 leading-relaxed">{result.message}</p>
                </div>
              )}

              {!result && (
                <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                  <svg className="w-10 h-10 text-slate-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <span className="text-xs text-slate-400">Pilih cabang dan kirim audit untuk melihat komparasi.</span>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <div className="bg-white rounded-4xl border border-slate-100 shadow-card p-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h3 className="text-lg font-bold text-[#0F172A] tracking-tight">Riwayat Audit Kas</h3>
            <p className="text-xs text-slate-400 mt-1">
              {isAdmin ? `Log audit cabang Anda (${BRANCH_OPTIONS.find((b) => b.id === selectedAdminBranch)?.nama}).` : 'Log audit gabungan seluruh cabang.'}
            </p>
          </div>
          {!isAdmin && (
            <div className="flex items-center gap-3">
              <select
                value={filterBranch}
                onChange={(e) => setFilterBranch(e.target.value)}
                className="bg-slate-50 border border-transparent rounded-lg px-3 py-2 text-xs font-medium text-slate-700 focus:outline-none focus:bg-white focus:border-blue-600/30 transition-all"
              >
                <option value="all">Semua Cabang</option>
                {BRANCH_OPTIONS.map((b) => (<option key={b.id} value={b.id}>{b.nama}</option>))}
              </select>
              <input
                type="date"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                className="bg-slate-50 border border-transparent rounded-lg px-3 py-2 text-xs font-medium text-slate-700 focus:outline-none focus:bg-white focus:border-blue-600/30 transition-all"
              />
              {filterDate && (
                <button onClick={() => setFilterDate('')} className="text-xs text-slate-400 hover:text-slate-600 transition-colors">Reset</button>
              )}
            </div>
          )}
        </div>

        {historyLoading ? (
          <div className="flex items-center justify-center py-12">
            <svg className="animate-spin h-6 w-6 text-blue-600" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          </div>
        ) : filteredLogs.length === 0 ? (
          <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
            <span className="text-xs text-slate-400">Belum ada riwayat audit.</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 text-[11px] uppercase tracking-wider font-semibold">
                  {!isAdmin && <th className="py-4 px-4">Cabang</th>}
                  <th className="py-4 px-4">Tanggal</th>
                  {!isAdmin && <th className="py-4 px-4 text-right">Kas Digital</th>}
                  <th className="py-4 px-4 text-right">Kas Fisik</th>
                  {!isAdmin && <th className="py-4 px-4 text-right">Selisih</th>}
                  <th className="py-4 px-4 text-center">Status</th>
                  {!isAdmin && <th className="py-4 px-4 text-center">Approval</th>}
                  {!isAdmin && <th className="py-4 px-4 text-center">Aksi</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 text-sm">
                {filteredLogs.map((log) => {
                  const dc = discrepancyColor(log.selisih);
                  const ap = approvalBadge(log.approval_status);
                  return (
                    <tr key={log.id_rekonsiliasi} className="hover:bg-slate-50/50 transition-colors">
                      {!isAdmin && (
                        <td className="py-4 px-4 font-semibold text-[#0F172A] text-xs">{log.nama_cabang}</td>
                      )}
                      <td className="py-4 px-4 text-slate-500 text-xs">{formatDate(log.tanggal)}</td>
                      {!isAdmin && (
                        <td className="py-4 px-4 text-right font-semibold text-[#0F172A] text-xs">{formatIDR(log.kas_digital)}</td>
                      )}
                      <td className="py-4 px-4 text-right font-semibold text-[#0F172A] text-xs">{formatIDR(log.kas_fisik)}</td>
                      {!isAdmin && (
                        <td className="py-4 px-4 text-right">
                          <span className={`font-bold text-xs ${dc.text}`}>
                            {log.selisih > 0 ? '+' : ''}{formatIDR(log.selisih)}
                          </span>
                        </td>
                      )}
                      <td className="py-4 px-4 text-center">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${log.status === 'Cocok' ? 'bg-[#ECFDF5] text-[#047857]' : 'bg-[#FFFBEB] text-[#B45309]'}`}>
                          {log.status}
                        </span>
                      </td>
                      {!isAdmin && (
                        <td className="py-4 px-4 text-center">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${ap.bg} ${ap.text}`}>
                            {ap.label}
                          </span>
                        </td>
                      )}
                      {!isAdmin && (
                        <td className="py-4 px-4 text-center">
                          {log.approval_status === 'Pending' ? (
                            <div className="flex items-center justify-center gap-1.5">
                              <button
                                onClick={() => handleApprove(log.id_rekonsiliasi)}
                                disabled={actionLoading === log.id_rekonsiliasi}
                                className="bg-[#ECFDF5] hover:bg-emerald-100 text-[#047857] text-[10px] font-semibold px-2.5 py-1 rounded-lg border border-[#047857]/10 transition-all disabled:opacity-50"
                              >
                                Setujui
                              </button>
                              <button
                                onClick={() => handleReject(log.id_rekonsiliasi)}
                                disabled={actionLoading === log.id_rekonsiliasi}
                                className="bg-[#FFF1F2] hover:bg-rose-100 text-[#BE123C] text-[10px] font-semibold px-2.5 py-1 rounded-lg border border-[#BE123C]/10 transition-all disabled:opacity-50"
                              >
                                Tolak
                              </button>
                            </div>
                          ) : (
                            <span className="text-[10px] text-slate-400">—</span>
                          )}
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
