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
  if (selisih === 0) return { bg: 'bg-teal-50', text: 'text-teal', border: 'border-teal-200' };
  if (selisih > 0) return { bg: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-200' };
  return { bg: 'bg-red-50', text: 'text-red-600', border: 'border-red-200' };
}

function approvalStyle(status: string): { bg: string; text: string; border: string; label: string } {
  if (status === 'Disetujui') return { bg: 'bg-teal-50', text: 'text-teal', border: 'border-teal-200', label: 'Disetujui' };
  if (status === 'Ditolak') return { bg: 'bg-red-50', text: 'text-red-600', border: 'border-red-200', label: 'Ditolak' };
  return { bg: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-200', label: 'Pending' };
}

// ==========================================
// AUDIT REKONSILIASI KAS - FR-FIN-09 Supporting Extension
// Modul Audit & Rekonsiliasi Kas untuk deteksi selisih dana harian
// Mendukung indikator sukses: Selisih kas audit = Rp0
// Extends: FR-FIN-02 (form pengeluaran darurat), FR-OWN-01 (dashboard)
// ==========================================
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
  const [overBudgetError, setOverBudgetError] = useState<string | null>(null);

  const isAdmin = userRole === 'Admin Cabang';

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

  useEffect(() => { fetchHistory(); }, [fetchHistory]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const targetBranchId = isAdmin ? selectedAdminBranch : selectedBranchId;
    const kas_fisik_val = parseFloat(kasFisik);
    if (isNaN(kas_fisik_val) || kas_fisik_val < 0) {
      triggerNotification('Nominal kas fisik tidak valid!', 'error');
      return;
    }

    // Check for over-budget scenario
    if (kas_fisik_val > 22000000) {
      setOverBudgetError('Over Budget: Melebihi Batas Sisa. Nominal melebihi sisa batas anggaran operasional.');
      triggerNotification('Over Budget: Melebihi Batas Sisa.', 'error');
      return;
    }

    setOverBudgetError(null);
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
    const kas_fisik_val = parseFloat(overrideKasFisik);
    if (isNaN(kas_fisik_val) || kas_fisik_val < 0) {
      triggerNotification('Nominal override tidak valid!', 'error');
      return;
    }
    setOverrideSubmitting(true);
    try {
      const res = await fetch(`/api/branches/reconcile/${id}/override`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ kas_fisik: kas_fisik_val, catatan_owner: overrideCatatan || undefined }),
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
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-navy tracking-tight">Audit Rekonsiliasi Kas</h1>
        <p className="text-sm text-slate-500 mt-1">
          {isAdmin ? 'Input blind closing shift — kas fisik bersifat final setelah dikirim.' : 'Pemantauan komparasi saldo kas riil vs digital.'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Audit Form - Blind Input Design */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6">
          <div className="flex justify-between items-center mb-5">
            <h3 className="text-base font-bold text-navy">{isAdmin ? 'Input Audit Kas' : 'Form Audit'}</h3>
            {isAdmin && isLocked && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-red-50 text-red-600 border border-red-200">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                Terkunci
              </span>
            )}
          </div>

          {!ownerOverride ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Branch Selection */}
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-2">Cabang</label>
                {!isAdmin ? (
                  <select value={selectedBranchId} onChange={(e) => setSelectedBranchId(e.target.value)} disabled={isLocked}
                    className="w-full bg-white border border-slate-200 rounded-2xl px-4 py-3 text-sm text-navy focus:outline-none focus:border-deep-blue transition-all disabled:opacity-50">
                    {BRANCH_OPTIONS.map((b) => (<option key={b.id} value={b.id}>{b.nama}</option>))}
                  </select>
                ) : (
                  <div className="w-full bg-amber-50 border border-amber-200 rounded-2xl px-4 py-3 text-sm font-medium text-amber-600">
                    {BRANCH_OPTIONS.find((b) => b.id === selectedAdminBranch)?.nama}
                  </div>
                )}
              </div>

              {/* Blind Input - Kas Fisik */}
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-2">
                  Uang Kas Fisik (IDR)
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400 text-sm">Rp</span>
                  <input type="number" placeholder="15.200.000" value={kasFisik} onChange={(e) => { setKasFisik(e.target.value); setOverBudgetError(null); }}
                    disabled={isLocked}
                    className="w-full bg-white border border-slate-200 rounded-2xl pl-10 pr-4 py-3 text-sm text-navy placeholder:text-slate-400 focus:outline-none focus:border-deep-blue transition-all disabled:opacity-50"
                    required />
                </div>
                <span className="text-[11px] text-slate-400 block mt-2">
                  Masukkan nominal kas fisik di laci kas Anda
                </span>
              </div>

              {/* Over Budget Error */}
              {overBudgetError && (
                <div className="bg-red-50 border border-red-200 rounded-2xl p-3">
                  <div className="flex items-center gap-2 text-xs text-red-600 font-medium">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {overBudgetError}
                  </div>
                </div>
              )}

              {/* Catatan */}
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-2">Catatan</label>
                <textarea rows={2} placeholder="Alasan jika terdapat selisih..." value={catatan} onChange={(e) => setCatatan(e.target.value)}
                  disabled={isLocked}
                  className="w-full bg-white border border-slate-200 rounded-2xl px-4 py-3 text-sm text-navy placeholder:text-slate-400 focus:outline-none focus:border-deep-blue transition-all resize-none disabled:opacity-50" />
              </div>

              {/* Submit Button - Deep Blue Premium */}
              {isAdmin && (
                <button type="submit" disabled={submitting || isLocked || !!overBudgetError}
                  className="w-full bg-deep-blue hover:bg-navy text-white font-medium text-sm py-3 rounded-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                  {submitting ? 'Memproses...' : isLocked ? 'Terkunci — Data Final' : 'Kirim & Validasi Ke Pusat / Rekonsiliasi Akhir Hari'}
                </button>
              )}
            </form>
          ) : (
            <div className="space-y-4">
              <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
                <p className="text-xs font-semibold text-red-600">Mode Override Owner</p>
                <p className="text-xs text-slate-500 mt-0.5">Revisi data audit fatal.</p>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-2">Kas Fisik (Revisi)</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400 text-sm">Rp</span>
                  <input type="number" value={overrideKasFisik} onChange={(e) => setOverrideKasFisik(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-2xl pl-10 pr-4 py-3 text-sm text-navy focus:outline-none focus:border-deep-blue transition-all" />
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => { setOwnerOverride(false); setOverrideKasFisik(''); setOverrideCatatan(''); }}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-600 text-sm font-medium py-2.5 rounded-2xl transition-all">Batal</button>
                <button onClick={() => handleOverride(result!.id_rekonsiliasi)} disabled={overrideSubmitting}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white text-sm font-medium py-2.5 rounded-2xl transition-all disabled:opacity-50">
                  {overrideSubmitting ? 'Menyimpan...' : 'Konfirmasi Override'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Result Panel - Premium Design */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6">
          <h3 className="text-base font-bold text-navy mb-4">Komparasi Saldo</h3>

          {isAdmin ? (
            <div className="space-y-4">
              {/* Blind Input Procedure Card */}
              <div className="bg-base-bg rounded-2xl p-4">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">Prosedur Anti-Kebocoran</p>
                <div className="space-y-4">
                  {[
                    { step: '1', title: 'Kunci Pembukuan', desc: 'Admin menghentikan input order pukul 21:00.' },
                    { step: '2', title: 'Hitung Kas Fisik', desc: 'Uang kas di laci dihitung manual.' },
                    { step: '3', title: 'Rekonsiliasi Digital', desc: 'Input kas fisik, data terkunci otomatis.' }
                  ].map((item) => (
                    <div key={item.step} className="flex gap-3">
                      <div className="w-8 h-8 bg-deep-blue rounded-2xl flex items-center justify-center text-xs font-bold text-white flex-shrink-0">{item.step}</div>
                      <div>
                        <h4 className="text-sm font-semibold text-navy">{item.title}</h4>
                        <p className="text-xs text-slate-500">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Final Instruction for Admin */}
              <div className="bg-teal-50 border border-teal-200 rounded-2xl p-4">
                <p className="text-xs font-semibold text-teal uppercase tracking-wider mb-2">Langkah Terakhir Audit</p>
                <p className="text-sm font-bold text-navy">Hitung Jumlah Uang Fisik Di Laci Kas</p>
                <p className="text-xs text-slate-500 mt-2">
                  Masukkan nominal kas fisik Anda ke kolom "Uang Kas Fisik" di sebelah kiri.
                  Setelah dikirim, data akan terkunci dan tidak dapat diubah.
                </p>
              </div>
            </div>
          ) : result ? (
            <div className={`p-4 rounded-2xl border ${discrepancyStyle(result.selisih).bg} ${discrepancyStyle(result.selisih).border}`}>
              <div className="flex justify-between items-center mb-3">
                <h4 className={`text-sm font-semibold ${discrepancyStyle(result.selisih).text}`}>Hasil: {result.nama_cabang}</h4>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${discrepancyStyle(result.selisih).bg} ${discrepancyStyle(result.selisih).border}`}>{result.status}</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div className="bg-white rounded-2xl p-3 text-center">
                  <span className="text-[10px] text-slate-400 block">Kas Digital</span>
                  <span className="text-sm font-semibold text-navy">{formatIDR(result.kas_digital)}</span>
                </div>
                <div className="bg-white rounded-2xl p-3 text-center">
                  <span className="text-[10px] text-slate-400 block">Kas Fisik</span>
                  <span className="text-sm font-semibold text-navy">{formatIDR(result.kas_fisik)}</span>
                </div>
                <div className="bg-white rounded-2xl p-3 text-center">
                  <span className="text-[10px] text-slate-400 block">Selisih</span>
                  <span className={`text-sm font-bold ${discrepancyStyle(result.selisih).text}`}>{result.selisih > 0 ? '+' : ''}{formatIDR(result.selisih)}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 bg-base-bg rounded-2xl">
              <svg className="w-8 h-8 text-slate-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <span className="text-xs text-slate-400">Pilih cabang & kirim audit</span>
            </div>
          )}
        </div>
      </div>

      {/* History Table - Premium Design */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
          <div>
            <h3 className="text-base font-bold text-navy">Riwayat Audit Kas</h3>
            <p className="text-xs text-slate-500 mt-0.5">Log audit cabang</p>
          </div>
          {!isAdmin && (
            <div className="flex items-center gap-2">
              <select value={filterBranch} onChange={(e) => setFilterBranch(e.target.value)}
                className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-navy focus:outline-none focus:border-deep-blue transition-all">
                <option value="all">Semua</option>
                {BRANCH_OPTIONS.map((b) => (<option key={b.id} value={b.id}>{b.nama}</option>))}
              </select>
              <input type="date" value={filterDate} onChange={(e) => setFilterDate(e.target.value)}
                className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-navy focus:outline-none focus:border-deep-blue transition-all" />
            </div>
          )}
        </div>

        {historyLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="w-6 h-6 border-2 border-slate-200 border-t-deep-blue rounded-full animate-spin"></div>
          </div>
        ) : filteredLogs.length === 0 ? (
          <div className="text-center py-8 bg-base-bg rounded-2xl">
            <span className="text-xs text-slate-400">Belum ada riwayat audit</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-200 text-xs text-slate-400 uppercase tracking-wider font-medium">
                  {!isAdmin && <th className="py-3 px-3">Cabang</th>}
                  <th className="py-3 px-3">Tanggal</th>
                  {!isAdmin && <th className="py-3 px-3 text-right">Kas Digital</th>}
                  <th className="py-3 px-3 text-right">Kas Fisik</th>
                  {!isAdmin && <th className="py-3 px-3 text-right">Selisih</th>}
                  <th className="py-3 px-3 text-center">Status</th>
                  {!isAdmin && <th className="py-3 px-3 text-center">Approval</th>}
                  {!isAdmin && <th className="py-3 px-3 text-center">Aksi</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filteredLogs.map((log) => {
                  const ds = discrepancyStyle(log.selisih);
                  const ap = approvalStyle(log.approval_status);
                  return (
                    <tr key={log.id_rekonsiliasi} className="hover:bg-base-bg transition-all">
                      {!isAdmin && <td className="py-3 px-3 font-medium text-navy text-xs">{log.nama_cabang}</td>}
                      <td className="py-3 px-3 text-slate-500 text-xs">{formatDate(log.tanggal)}</td>
                      {!isAdmin && <td className="py-3 px-3 text-right font-medium text-navy text-xs">{formatIDR(log.kas_digital)}</td>}
                      <td className="py-3 px-3 text-right font-medium text-navy text-xs">{formatIDR(log.kas_fisik)}</td>
                      {!isAdmin && (
                        <td className="py-3 px-3 text-right">
                          <span className={`font-bold text-xs ${ds.text}`}>{log.selisih > 0 ? '+' : ''}{formatIDR(log.selisih)}</span>
                        </td>
                      )}
                      <td className="py-3 px-3 text-center">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium border ${log.status === 'Cocok' ? 'bg-teal-50 text-teal border-teal-200' : 'bg-amber-50 text-amber-600 border-amber-200'}`}>
                          {log.status}
                        </span>
                      </td>
                      {!isAdmin && (
                        <td className="py-3 px-3 text-center">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium border ${ap.bg} ${ap.border}`}>{ap.label}</span>
                        </td>
                      )}
                      {!isAdmin && (
                        <td className="py-3 px-3 text-center">
                          {log.approval_status === 'Pending' ? (
                            <div className="flex items-center justify-center gap-1">
                              <button onClick={() => handleApprove(log.id_rekonsiliasi)} disabled={actionLoading === log.id_rekonsiliasi}
                                className="bg-teal-50 hover:bg-teal-100 text-teal text-[10px] font-medium px-2 py-1 rounded-xl transition-all disabled:opacity-50">Setujui</button>
                              <button onClick={() => handleReject(log.id_rekonsiliasi)} disabled={actionLoading === log.id_rekonsiliasi}
                                className="bg-red-50 hover:bg-red-100 text-red-600 text-[10px] font-semibold px-2 py-1 rounded-xl transition-all disabled:opacity-50">Tolak</button>
                            </div>
                          ) : <span className="text-[10px] text-slate-400">—</span>}
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
