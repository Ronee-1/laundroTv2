import { useState } from 'react';
import type { UserRole } from '../App.tsx';

const BRANCH_OPTIONS = [
  { id: 'CBG-001', nama: 'Cabang Depok (Pusat)' },
  { id: 'CBG-002', nama: 'Cabang Jakarta Selatan' },
  { id: 'CBG-003', nama: 'Cabang Bekasi Timur' },
  { id: 'CBG-004', nama: 'Cabang Tangerang Kota' },
  { id: 'CBG-005', nama: 'Cabang Bogor Raya' },
];

interface ReconcileResponse {
  success: boolean;
  id_rekonsiliasi?: string;
  id_cabang?: string;
  nama_cabang?: string;
  kas_digital?: number;
  kas_fisik?: number;
  selisih?: number;
  status?: string;
  message?: string;
  error?: string;
}

interface Props {
  userRole: UserRole;
  selectedAdminBranch: string;
  triggerNotification: (msg: string, type?: 'success' | 'error' | 'warning') => void;
}

function formatIDR(num: number): string {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num);
}

export function AuditRekonsiliasi({ userRole, selectedAdminBranch, triggerNotification }: Props) {
  const [selectedBranchId, setSelectedBranchId] = useState('CBG-001');
  const [kasFisik, setKasFisik] = useState('');
  const [catatan, setCatatan] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<ReconcileResponse | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const targetBranchId = userRole === 'Owner' ? selectedBranchId : selectedAdminBranch;
    const kas_fisik = parseFloat(kasFisik);
    if (isNaN(kas_fisik) || kas_fisik < 0) { triggerNotification('Nominal kas fisik tidak valid!', 'error'); return; }
    setSubmitting(true);
    setResult(null);
    try {
      const res = await fetch(`/api/branches/${targetBranchId}/reconcile`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ kas_fisik, catatan: catatan || undefined }) });
      const json = (await res.json()) as ReconcileResponse;
      if (!res.ok) { triggerNotification(json.error ?? 'Terjadi kesalahan.', 'error'); return; }
      setResult(json);
      if (json.status === 'Cocok') { triggerNotification(json.message ?? 'Audit berhasil: kas cocok.', 'success'); } else { triggerNotification(json.message ?? 'Selisih terdeteksi!', 'warning'); }
      setKasFisik('');
      setCatatan('');
    } catch { triggerNotification('Tidak dapat terhubung ke server.', 'error'); } finally { setSubmitting(false); }
  }

  const activeBranchId = userRole === 'Owner' ? selectedBranchId : selectedAdminBranch;

  return (
    <div className="space-y-8 max-w-[1400px]">
      <div>
        <h1 className="text-3xl font-bold text-[#0F172A] tracking-tight">Audit Rekonsiliasi Kas</h1>
        <p className="text-slate-500 text-sm mt-1.5">Pencocokan saldo kas riil versus saldo buku digital untuk mengeliminasi kebocoran.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="bg-white p-8 rounded-4xl border border-slate-100 shadow-card lg:col-span-5 h-fit">
          <h3 className="text-lg font-bold text-[#0F172A] mb-6">Input Audit Kas</h3>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-xs font-semibold text-slate-500 block mb-2">Cabang Audit</label>
              {userRole === 'Owner' ? (
                <select value={selectedBranchId} onChange={(e) => setSelectedBranchId(e.target.value)} className="w-full bg-slate-50 border border-transparent rounded-xl px-4 py-3 text-sm text-[#0F172A] focus:outline-none focus:bg-white focus:border-blue-600/30 transition-all">
                  {BRANCH_OPTIONS.map((b) => (<option key={b.id} value={b.id}>{b.nama}</option>))}
                </select>
              ) : (
                <div className="w-full bg-slate-50 border border-transparent rounded-xl px-4 py-3 text-sm text-[#B45309] font-semibold">{BRANCH_OPTIONS.find((b) => b.id === selectedAdminBranch)?.nama}</div>
              )}
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-500 block mb-2">Uang Kas Fisik di Laci (IDR)</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 text-sm font-medium">Rp</span>
                <input type="number" placeholder="15.200.000" value={kasFisik} onChange={(e) => setKasFisik(e.target.value)} className="w-full bg-slate-50 border border-transparent pl-12 pr-4 py-3 rounded-xl text-sm text-[#0F172A] placeholder-slate-400 focus:outline-none focus:bg-white focus:border-blue-600/30 transition-all" required />
              </div>
              <span className="text-[10px] text-slate-400 mt-1.5 block">Nominal rupiah yang dihitung secara manual di outlet.</span>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-500 block mb-2">Catatan / Justifikasi</label>
              <textarea rows={3} placeholder="Tulis alasan jika terdapat selisih..." value={catatan} onChange={(e) => setCatatan(e.target.value)} className="w-full bg-slate-50 border border-transparent rounded-xl px-4 py-3 text-sm text-[#0F172A] placeholder-slate-400 focus:outline-none focus:bg-white focus:border-blue-600/30 transition-all resize-none" />
            </div>

            <button type="submit" disabled={submitting} className="w-full bg-[#047857] hover:bg-emerald-700 text-white font-semibold text-sm py-3.5 rounded-xl transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-md disabled:opacity-50">
              {submitting ? 'Memproses...' : 'Kirim & Rekonsiliasi'}
            </button>
          </form>
        </div>

        <div className="bg-white p-8 rounded-4xl border border-slate-100 shadow-card lg:col-span-7 space-y-8">
          <div>
            <h3 className="text-lg font-bold text-[#0F172A] tracking-tight">Prosedur Anti-Kebocoran Kas</h3>
            <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">Audit kas laci dilakukan setiap penutupan shift kasir demi keamanan operasional.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { step: '1', title: 'Kunci Pembukuan', desc: 'Admin menghentikan input order pada pukul 21:00 WIB.' },
              { step: '2', title: 'Hitung Kas Fisik', desc: 'Uang kas di laci kasir dihitung secara manual tanpa terburu-buru.' },
              { step: '3', title: 'Rekonsiliasi Digital', desc: 'Input kas fisik. Jika selisih, buat justifikasi tertulis ke pusat.' },
            ].map((item) => (
              <div key={item.step} className="bg-slate-50 p-5 rounded-2xl border border-slate-100 space-y-3">
                <div className="w-8 h-8 bg-[#0F172A] rounded-full flex items-center justify-center text-xs font-bold text-white">{item.step}</div>
                <h4 className="text-sm font-bold text-[#0F172A]">{item.title}</h4>
                <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          {result && (
            <div className={`p-6 rounded-2xl border transition-all duration-300 ${result.status === 'Cocok' ? 'bg-[#ECFDF5] border-[#047857]/10' : 'bg-[#FFFBEB] border-[#B45309]/10'}`}>
              <div className="flex justify-between items-center mb-4">
                <h4 className={`text-sm font-bold ${result.status === 'Cocok' ? 'text-[#047857]' : 'text-[#B45309]'}`}>Hasil Audit: {result.nama_cabang}</h4>
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-semibold ${result.status === 'Cocok' ? 'bg-white text-[#047857]' : 'bg-white text-[#B45309]'}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${result.status === 'Cocok' ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
                  {result.status}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-white p-4 rounded-xl border border-slate-100">
                  <span className="text-slate-400 block text-[10px] font-semibold uppercase tracking-wider mb-1">Kas Digital</span>
                  <span className="text-[#0F172A] font-semibold text-sm">{formatIDR(result.kas_digital ?? 0)}</span>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-100">
                  <span className="text-slate-400 block text-[10px] font-semibold uppercase tracking-wider mb-1">Kas Fisik</span>
                  <span className="text-[#0F172A] font-semibold text-sm">{formatIDR(result.kas_fisik ?? 0)}</span>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-100">
                  <span className="text-slate-400 block text-[10px] font-semibold uppercase tracking-wider mb-1">Selisih</span>
                  <span className={`font-bold text-sm ${(result.selisih ?? 0) === 0 ? 'text-[#047857]' : (result.selisih ?? 0) > 0 ? 'text-blue-600' : 'text-[#BE123C]'}`}>
                    {(result.selisih ?? 0) > 0 ? '+' : ''}{formatIDR(result.selisih ?? 0)}
                  </span>
                </div>
              </div>
              <p className="text-xs text-slate-500 mt-3 leading-relaxed">{result.message}</p>
            </div>
          )}

          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Cabang Audit Aktif</h4>
            <p className="text-sm font-semibold text-[#0F172A]">{BRANCH_OPTIONS.find((b) => b.id === activeBranchId)?.nama}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
