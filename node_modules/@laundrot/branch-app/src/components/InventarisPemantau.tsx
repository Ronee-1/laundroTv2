import { useState, useEffect } from 'react';
import type { UserRole } from '../App.tsx';
import { RestockModal } from './RestockModal.tsx';

interface StockEntry {
  item: string;
  satuan: string;
  stok_saat_ini: number;
  safety_threshold: number;
  max_capacity: number;
  status: 'Aman' | 'Menipis' | 'Habis';
}

interface BranchInventory {
  id_cabang: string;
  nama_cabang: string;
  inventory: { stocks: StockEntry[]; overall_status: 'Aman' | 'Menipis' | 'Habis' };
}

interface DashboardData { success: boolean; per_cabang: BranchInventory[]; }

interface InTransitLog {
  id: string;
  sentItems: { detergen: number; pelembut: number; plastik: number };
  status: string;
  timestamp: string;
}

interface Props {
  userRole: UserRole;
  selectedAdminBranch: string;
  triggerNotification: (msg: string, type?: 'success' | 'error' | 'warning') => void;
}

function statusStyle(status: string) {
  if (status === 'Aman') return { bg: 'bg-[#ECFDF5]', text: 'text-[#047857]', dot: 'bg-emerald-500' };
  if (status === 'Menipis') return { bg: 'bg-[#FFFBEB]', text: 'text-[#B45309]', dot: 'bg-amber-500' };
  return { bg: 'bg-[#FFF1F2]', text: 'text-[#BE123C]', dot: 'bg-rose-500' };
}

export function InventarisPemantau({ userRole, selectedAdminBranch, triggerNotification }: Props) {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showRestockModal, setShowRestockModal] = useState(false);
  const [restockBranchId, setRestockBranchId] = useState('CBG-002');
  const [inTransitLogs, setInTransitLogs] = useState<InTransitLog[]>([]);
  const [showVerifyForm, setShowVerifyForm] = useState(false);
  const [verifyLogId, setVerifyLogId] = useState<string | null>(null);
  const [verifySentItems, setVerifySentItems] = useState<{ detergen: number; pelembut: number; plastik: number }>({ detergen: 0, pelembut: 0, plastik: 0 });
  const [verifyForm, setVerifyForm] = useState({ detergen: '', pelembut: '', plastik: '' });
  const [verifying, setVerifying] = useState(false);

  async function fetchLogistics(branchId: string) {
    try {
      const res = await fetch(`/api/logistics/branch/${branchId}`);
      const json = await res.json();
      if (res.ok && json.success) {
        setInTransitLogs(json.logs.filter((l: { status: string }) => l.status === 'In-Transit' || l.status === 'Driver-En-Route' || l.status === 'Awaiting-Verification'));
      }
    } catch { /* ignore */ }
  }

  useEffect(() => {
    let cancelled = false;
    async function fetchInventory() {
      try {
        const res = await fetch('/api/owner/dashboard');
        const json = (await res.json()) as DashboardData;
        if (cancelled) return;
        if (!res.ok || !json.success) { setError('Gagal memuat data inventaris.'); return; }
        setData(json);
      } catch { if (!cancelled) setError('Tidak dapat terhubung ke server.'); } finally { if (!cancelled) setLoading(false); }
    }
    fetchInventory();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    const branchId = userRole === 'Admin Cabang' ? selectedAdminBranch : null;
    if (branchId) fetchLogistics(branchId);
    else setInTransitLogs([]);
  }, [userRole, selectedAdminBranch]);

  function openVerifyForm(log: InTransitLog) {
    setVerifyLogId(log.id);
    setVerifySentItems(log.sentItems);
    setVerifyForm({ detergen: '', pelembut: '', plastik: '' });
    setShowVerifyForm(true);
  }

  async function handleVerify() {
    if (!verifyLogId) return;
    setVerifying(true);
    try {
      const receivedItems = {
        detergen: parseInt(verifyForm.detergen || '0', 10),
        pelembut: parseInt(verifyForm.pelembut || '0', 10),
        plastik: parseInt(verifyForm.plastik || '0', 10),
      };
      const res = await fetch(`/api/logistics/${verifyLogId}/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ receivedItems }),
      });
      const json = await res.json();
      if (res.ok && json.success) {
        triggerNotification(json.message, json.logistics.status === 'Completed' ? 'success' : 'warning');
        setShowVerifyForm(false);
        setVerifyLogId(null);
        const branchId = userRole === 'Admin Cabang' ? selectedAdminBranch : null;
        if (branchId) fetchLogistics(branchId);
        const dashRes = await fetch('/api/owner/dashboard');
        const dashJson = (await dashRes.json()) as DashboardData;
        if (dashRes.ok && dashJson.success) setData(dashJson);
      } else {
        triggerNotification(json.error ?? 'Gagal verifikasi.', 'error');
      }
    } catch {
      triggerNotification('Tidak dapat terhubung ke server.', 'error');
    } finally {
      setVerifying(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="text-center">
          <svg className="animate-spin h-8 w-8 text-blue-600 mx-auto mb-4" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <p className="text-slate-500 text-sm">Memuat data inventaris...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="bg-[#FFF1F2] border border-[#BE123C]/10 rounded-2xl p-6 text-center">
        <p className="text-[#BE123C] text-sm font-medium">{error ?? 'Gagal memuat data.'}</p>
      </div>
    );
  }

  const filteredBranches = data.per_cabang.filter((b) => userRole === 'Owner' || b.id_cabang === selectedAdminBranch);
  const habisCount = filteredBranches.filter((b) => b.inventory.overall_status === 'Habis').length;
  const menipisCount = filteredBranches.filter((b) => b.inventory.overall_status === 'Menipis').length;
  const amanCount = filteredBranches.filter((b) => b.inventory.overall_status === 'Aman').length;

  return (
    <div className="space-y-8 max-w-[1400px]">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#0F172A] tracking-tight">Gudang & Inventaris</h1>
          <p className="text-slate-500 text-sm mt-1.5">Deteksi dini stok logistik bahan baku produksi laundry harian.</p>
        </div>
        <button
          onClick={() => { setRestockBranchId(userRole === 'Admin Cabang' ? selectedAdminBranch : 'CBG-002'); setShowRestockModal(true); }}
          className="bg-[#0F172A] hover:bg-slate-800 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-md"
        >
          + Restock Bahan Baku
        </button>
      </div>

      <div className="grid grid-cols-3 gap-5">
        <div className="bg-white border border-slate-100 rounded-4xl p-6 text-center shadow-card">
          <p className="text-3xl font-light text-[#047857] tracking-tight">{amanCount}</p>
          <p className="text-xs text-slate-400 font-medium mt-1.5">Aman</p>
        </div>
        <div className="bg-white border border-slate-100 rounded-4xl p-6 text-center shadow-card">
          <p className="text-3xl font-light text-[#B45309] tracking-tight">{menipisCount}</p>
          <p className="text-xs text-slate-400 font-medium mt-1.5">Menipis</p>
        </div>
        <div className="bg-white border border-slate-100 rounded-4xl p-6 text-center shadow-card">
          <p className="text-3xl font-light text-[#BE123C] tracking-tight">{habisCount}</p>
          <p className="text-xs text-slate-400 font-medium mt-1.5">Habis</p>
        </div>
      </div>

      {inTransitLogs.length > 0 && (
        <div className="bg-[#FFFBEB] border border-amber-200/60 rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-3">
            <span className="text-lg">🚚</span>
            <div>
              <h4 className="text-sm font-bold text-[#B45309]">Logistik Dalam Perjalanan</h4>
              <p className="text-xs text-amber-700/80 mt-0.5">Ada {inTransitLogs.length} pengiriman yang sedang diproses untuk cabang Anda.</p>
            </div>
          </div>
          <div className="space-y-3">
            {inTransitLogs.map((log) => {
              const canVerify = log.status === 'Awaiting-Verification' || log.status === 'In-Transit';
              return (
                <div key={log.id} className="bg-white/70 rounded-xl p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-bold text-[#0F172A]">{log.id}</p>
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-semibold ${
                        log.status === 'Driver-En-Route' ? 'bg-[#F5F3FF] text-[#6D28D9]' :
                        log.status === 'Awaiting-Verification' ? 'bg-[#FFFBEB] text-[#B45309]' :
                        'bg-blue-100 text-[#1E3A8A]'
                      }`}>
                        {log.status === 'Driver-En-Route' ? 'Kurir Menuju Lokasi' :
                         log.status === 'Awaiting-Verification' ? 'Siap Verifikasi' :
                         'In-Transit'}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-500 mt-0.5">
                      Dikirim: {log.sentItems.detergen}L Detergen · {log.sentItems.pelembut}L Pelembut · {log.sentItems.plastik}pcs Plastik
                    </p>
                    <p className="text-[10px] text-slate-400 mt-0.5">{new Date(log.timestamp).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                  </div>
                  {canVerify && (
                    <button
                      onClick={() => openVerifyForm(log)}
                      className="bg-[#B45309] hover:bg-[#92400E] text-white text-xs font-semibold px-4 py-2 rounded-xl transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-md whitespace-nowrap"
                    >
                      Verifikasi Barang
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {showVerifyForm && verifyLogId && (
        <div className="fixed inset-0 bg-[#0F172A]/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white border border-slate-200 rounded-4xl max-w-md w-full overflow-hidden shadow-elevated">
            <div className="p-7 pb-5 border-b border-slate-100">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-bold text-[#0F172A]">Audit Verifikasi Penerimaan</h3>
                  <p className="text-xs text-slate-400 mt-0.5">{verifyLogId} — Masukkan jumlah fisik yang benar-benar diterima</p>
                </div>
                <button onClick={() => { setShowVerifyForm(false); setVerifyLogId(null); }} className="text-slate-400 hover:text-slate-600 transition-colors p-1">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
            </div>
            <div className="p-7 space-y-5">
              <div className="bg-slate-50 rounded-xl p-4 space-y-2 text-xs">
                <span className="font-semibold text-slate-500 block mb-2">Jumlah yang Dikirim Pusat (Referensi)</span>
                <div className="flex justify-between"><span className="text-slate-500">Detergen</span><span className="font-semibold text-[#0F172A]">{verifySentItems.detergen} L</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Pelembut</span><span className="font-semibold text-[#0F172A]">{verifySentItems.pelembut} L</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Plastik</span><span className="font-semibold text-[#0F172A]">{verifySentItems.plastik} pcs</span></div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-500 block mb-2">Detergen Diterima (Liter)</label>
                <input type="number" placeholder="Jumlah fisik sebenarnya" value={verifyForm.detergen} onChange={(e) => setVerifyForm({ ...verifyForm, detergen: e.target.value })} className="w-full bg-slate-50 border border-transparent rounded-xl px-4 py-3 text-sm text-[#0F172A] focus:outline-none focus:bg-white focus:border-blue-600/30 transition-all" />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 block mb-2">Pelembut Diterima (Liter)</label>
                <input type="number" placeholder="Jumlah fisik sebenarnya" value={verifyForm.pelembut} onChange={(e) => setVerifyForm({ ...verifyForm, pelembut: e.target.value })} className="w-full bg-slate-50 border border-transparent rounded-xl px-4 py-3 text-sm text-[#0F172A] focus:outline-none focus:bg-white focus:border-blue-600/30 transition-all" />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 block mb-2">Plastik Diterima (Pcs)</label>
                <input type="number" placeholder="Jumlah fisik sebenarnya" value={verifyForm.plastik} onChange={(e) => setVerifyForm({ ...verifyForm, plastik: e.target.value })} className="w-full bg-slate-50 border border-transparent rounded-xl px-4 py-3 text-sm text-[#0F172A] focus:outline-none focus:bg-white focus:border-blue-600/30 transition-all" />
              </div>

              <div className="flex gap-3 pt-2">
                <button onClick={() => { setShowVerifyForm(false); setVerifyLogId(null); }} className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-600 text-sm font-semibold py-3 rounded-xl transition-all">Batal</button>
                <button onClick={handleVerify} disabled={verifying} className="flex-1 bg-[#1E3A8A] hover:bg-[#1E40AF] text-white text-sm font-semibold py-3 rounded-xl transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-md disabled:opacity-50">{verifying ? 'Memverifikasi...' : 'Simpan Verifikasi'}</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredBranches.map((branch) => {
          const s = statusStyle(branch.inventory.overall_status);
          return (
            <div key={branch.id_cabang} className="bg-white p-7 rounded-4xl border border-slate-100 shadow-card hover:shadow-card-hover transition-shadow duration-300">
              <div className="flex justify-between items-center pb-4 mb-5 border-b border-slate-100">
                <div>
                  <h4 className="font-bold text-[#0F172A] text-base">{branch.nama_cabang}</h4>
                  <span className="text-xs text-slate-400">{branch.id_cabang}</span>
                </div>
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-semibold ${s.bg} ${s.text}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`}></span>
                  {branch.inventory.overall_status}
                </span>
              </div>

              <div className="space-y-5">
                {branch.inventory.stocks.map((stock) => {
                  const isLow = stock.stok_saat_ini < stock.safety_threshold;
                  const maxRef = stock.max_capacity ?? (stock.item === 'Detergen' ? 100 : stock.item === 'Pelembut' ? 80 : 200);
                  const pct = Math.min((stock.stok_saat_ini / maxRef) * 100, 100);
                  const label = stock.item === 'Detergen' ? 'Detergen Cair (Konsentrat)' : stock.item === 'Pelembut' ? 'Pelembut & Pewangi' : 'Plastik Packing';

                  return (
                    <div key={stock.item} className="space-y-2">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-500 font-medium">{label}</span>
                        <span className={`font-semibold ${isLow ? 'text-[#BE123C]' : 'text-[#0F172A]'}`}>
                          {stock.stok_saat_ini} {stock.satuan} <span className="text-slate-400 font-normal">/ min {stock.safety_threshold}</span>
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div style={{ width: `${pct}%` }} className={`h-full rounded-full transition-all duration-500 ${isLow ? 'bg-[#BE123C]' : 'bg-blue-500'}`}></div>
                      </div>
                      {isLow && (
                        <span className="text-[10px] text-[#BE123C] font-semibold block">Stok di bawah batas pengaman. Butuh restock segera.</span>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex justify-end">
                <button
                  onClick={() => { setRestockBranchId(branch.id_cabang); setShowRestockModal(true); }}
                  className="bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-300 text-slate-700 font-semibold text-xs px-4 py-2 rounded-xl transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-md"
                >
                  Restock Cabang
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {showRestockModal && (
        <RestockModal
          branches={data.per_cabang.map((b) => ({ id: b.id_cabang, nama: b.nama_cabang }))}
          initialBranchId={restockBranchId}
          userRole={userRole}
          selectedAdminBranch={selectedAdminBranch}
          onClose={() => setShowRestockModal(false)}
          onSuccess={(msg) => triggerNotification(msg, 'success')}
        />
      )}
    </div>
  );
}
