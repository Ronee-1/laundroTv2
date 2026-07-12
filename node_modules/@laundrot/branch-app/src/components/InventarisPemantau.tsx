import { useState, useEffect } from 'react';
import type { UserRole } from '../App.tsx';
import { RestockApproval } from './RestockApproval.tsx';
import { RestockRequestModal } from './RestockRequestModal.tsx';
import { RestockModal } from './RestockModal.tsx';

interface StockEntry {
  item: string;
  satuan: string;
  stok_saat_ini: number;
  safety_threshold: number;
  max_capacity: number;
  status: 'Aman' | 'Menipis' | 'Kritis';
}

interface BranchInventory {
  id_cabang: string;
  nama_cabang: string;
  inventory: { stocks: StockEntry[]; overall_status: 'Aman' | 'Menipis' | 'Kritis'; last_updated?: string };
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

function getStatusStyle(status: string) {
  if (status === 'Aman') return { bg: 'bg-teal-50 text-teal border-teal-200', dot: 'bg-teal' };
  if (status === 'Menipis') return { bg: 'bg-amber-50 text-amber-600 border-amber-200', dot: 'bg-amber-500' };
  if (status === 'Kritis') return { bg: 'bg-red-50 text-red-600 border-red-200', dot: 'bg-red-500' };
  return { bg: 'bg-red-50 text-red-600 border-red-200', dot: 'bg-red-500' };
}

// ==========================================
// INVENTARIS PEMANTAU - FR-INV-01 Supporting Extension
// Modul pengawasan inventaris dengan safety threshold otomatis
// Permintaan stok bahan baku darurat dari cabang ke Outlet Utama
// Mendukung: Indikator sukses selisih kas Rp0 (stok terkontrol = kas terkontrol)
// Extends: FR-FIN-02 (permintaan stok darurat)
// ==========================================
export function InventarisPemantau({ userRole, selectedAdminBranch, triggerNotification }: Props) {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showRestockRequestModal, setShowRestockRequestModal] = useState(false);
  const [showRestockModal, setShowRestockModal] = useState(false);
  const [inTransitLogs, setInTransitLogs] = useState<InTransitLog[]>([]);
  const [showVerifyForm, setShowVerifyForm] = useState(false);
  const [verifyLogId, setVerifyLogId] = useState<string | null>(null);
  const [verifySentItems, setVerifySentItems] = useState<{ detergen: number; pelembut: number; plastik: number }>({ detergen: 0, pelembut: 0, plastik: 0 });
  const [verifyForm, setVerifyForm] = useState({ detergen: '', pelembut: '', plastik: '' });
  const [verifying, setVerifying] = useState(false);

  const [showAdjustModal, setShowAdjustModal] = useState(false);
  const [showApprovalPanel, setShowApprovalPanel] = useState(false);
  const [adjustForm, setAdjustForm] = useState({ item: 'Detergen' as 'Detergen' | 'Pelembut' | 'Plastik', stok_baru: '', alasan: '' });
  const [adjusting, setAdjusting] = useState(false);

  async function handleAdjust() {
    if (!adjustForm.stok_baru || !adjustForm.alasan) {
      triggerNotification('Semua field wajib diisi.', 'error');
      return;
    }
    setAdjusting(true);
    try {
      const res = await fetch(`/api/branches/${selectedAdminBranch}/adjust`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          item: adjustForm.item,
          stok_baru: parseInt(adjustForm.stok_baru, 10),
          alasan: adjustForm.alasan,
        }),
      });
      const json = await res.json();
      if (res.ok && json.success) {
        triggerNotification(json.message, 'success');
        setShowAdjustModal(false);
        setAdjustForm({ item: 'Detergen', stok_baru: '', alasan: '' });
        const dashRes = await fetch('/api/owner/dashboard');
        const dashJson = (await dashRes.json()) as DashboardData;
        if (dashRes.ok && dashJson.success) setData(dashJson);
      } else {
        triggerNotification(json.error ?? 'Gagal menyesuaikan stok.', 'error');
      }
    } catch {
      triggerNotification('Tidak dapat terhubung ke server.', 'error');
    } finally {
      setAdjusting(false);
    }
  }

  async function fetchLogistics(branchId: string) {
    try {
      const res = await fetch(`/api/logistics/branch/${branchId}`);
      const json = await res.json();
      if (res.ok && json.success) {
        setInTransitLogs(json.logs.filter((l: { status: string }) => l.status === 'In-Transit' || l.status === 'Driver-En-Route' || l.status === 'Awaiting-Verification'));
      }
    } catch { /* ignore */ }
  }

  // Auto-refresh on mount and periodically
  useEffect(() => {
    let cancelled = false;
    async function fetchInventory() {
      try {
        const res = await fetch('/api/owner/dashboard');
        const json = (await res.json()) as DashboardData;
        if (cancelled) return;
        if (!res.ok || !json.success) { setError('Gagal memuat data.'); return; }
        setData(json);
      } catch { if (!cancelled) setError('Tidak dapat terhubung.'); } finally { if (!cancelled) setLoading(false); }
    }
    fetchInventory();
    // Refresh every 30 seconds for real-time inventory updates
    const interval = setInterval(fetchInventory, 30000);
    // Also refresh when window regains focus
    const handleFocus = () => fetchInventory();
    window.addEventListener('focus', handleFocus);
    return () => {
      cancelled = true;
      clearInterval(interval);
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  useEffect(() => {
    const branchId = userRole === 'Admin' ? selectedAdminBranch : null;
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
        const branchId = userRole === 'Admin' ? selectedAdminBranch : null;
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
        <div className="w-10 h-10 border-2 border-slate-200 border-t-deep-blue rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="bg-white border border-slate-200 rounded-2xl p-6 text-center">
        <p className="text-red-600 text-sm font-medium">{error ?? 'Gagal memuat data.'}</p>
      </div>
    );
  }

  const filteredBranches = data.per_cabang.filter((b) => userRole === 'Owner' || b.id_cabang === selectedAdminBranch);
  const kritisCount = filteredBranches.filter((b) => b.inventory.overall_status === 'Kritis').length;
  const menipisCount = filteredBranches.filter((b) => b.inventory.overall_status === 'Menipis').length;
  const amanCount = filteredBranches.filter((b) => b.inventory.overall_status === 'Aman').length;

  const isAnyStockCritical = filteredBranches.some(branch =>
    branch.inventory.stocks.some(stock => {
      if (stock.item === 'Detergen' && stock.stok_saat_ini < 50) return true;
      if (stock.item === 'Pelembut' && stock.stok_saat_ini < 50) return true;
      if (stock.item === 'Plastik' && stock.stok_saat_ini < 100) return true;
      return false;
    })
  );

  const showNoUpdateWarning = (() => {
    if (userRole !== 'Admin') return false;
    const branch = data.per_cabang.find((b) => b.id_cabang === selectedAdminBranch);
    if (!branch || !branch.inventory.last_updated) return false;
    const lastUpdateDate = new Date(branch.inventory.last_updated);
    const diffMs = Date.now() - lastUpdateDate.getTime();
    return diffMs > 24 * 60 * 60 * 1000;
  })();

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-navy tracking-tight">Gudang & Inventaris</h1>
          <p className="text-sm text-slate-500 mt-1">Deteksi dini stok logistik bahan baku</p>
        </div>
        <div className="flex items-center gap-3">
          {userRole === 'Admin' && (
            <button onClick={() => setShowAdjustModal(true)}
              className="bg-red-50 text-red-600 border border-red-200 px-4 py-2 rounded-2xl text-sm font-medium hover:bg-red-100 transition-all">
              ⚠️ Penyesuaian Stok
            </button>
          )}
          {userRole === 'Admin' && (
            <button onClick={() => setShowRestockRequestModal(true)}
              className="bg-deep-blue text-white px-4 py-2 rounded-2xl text-sm font-medium hover:bg-navy transition-all">
              + Ajukan Restok
            </button>
          )}
          {userRole === 'Owner' && (
            <>
              <button onClick={() => setShowApprovalPanel(true)}
                className="bg-amber-50 text-amber-600 border border-amber-200 px-4 py-2 rounded-2xl text-sm font-medium hover:bg-amber-100 transition-all">
                📋 Konfirmasi Restok
              </button>
              <button onClick={() => setShowRestockModal(true)}
                className="bg-deep-blue text-white px-4 py-2 rounded-2xl text-sm font-medium hover:bg-navy transition-all">
                ⚡ Restok Langsung
              </button>
            </>
          )}
        </div>
      </div>

      {/* Alert Banners */}
      {showNoUpdateWarning && (
        <div className="bg-amber-50 border border-amber-200 px-4 py-3 rounded-2xl flex items-center gap-3">
          <span className="text-base">⚠️</span>
          <div>
            <h4 className="text-sm font-semibold text-amber-600">Peringatan: Data Stok Belum Diperbarui</h4>
            <p className="text-xs text-slate-500 mt-0.5">Cabang Anda belum memperbarui laporan stok fisik dalam 24 jam terakhir.</p>
          </div>
        </div>
      )}

      {isAnyStockCritical && (
        <div className="bg-red-50 border border-red-200 px-4 py-3 rounded-2xl flex items-center gap-3 animate-blink">
          <span className="flex h-2.5 w-2.5 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-600"></span>
          </span>
          <div>
            <h4 className="text-sm font-bold text-red-600 uppercase tracking-wide">⚠️ Stok Kritis / Menipis</h4>
            <p className="text-xs text-slate-500 mt-0.5">Beberapa persediaan di bawah batas pengaman minimum!</p>
          </div>
        </div>
      )}

      {/* Status Summary Cards - Premium Design */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white border border-teal-200 rounded-2xl p-6 text-center">
          <p className="text-3xl font-bold text-teal">{amanCount}</p>
          <p className="text-xs text-slate-500 mt-1">Aman</p>
        </div>
        <div className="bg-white border border-amber-200 rounded-2xl p-6 text-center">
          <p className="text-3xl font-bold text-amber-600">{menipisCount}</p>
          <p className="text-xs text-slate-500 mt-1">Menipis</p>
        </div>
        <div className="bg-white border border-red-200 rounded-2xl p-6 text-center">
          <p className="text-3xl font-bold text-red-600">{kritisCount}</p>
          <p className="text-xs text-slate-500 mt-1">Kritis</p>
        </div>
      </div>

      {/* In-Transit Alert */}
      {inTransitLogs.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-base">🚚</span>
            <h4 className="text-sm font-bold text-amber-600">Logistik Dalam Perjalanan</h4>
          </div>
          {inTransitLogs.map((log) => {
            const canVerify = log.status === 'Awaiting-Verification' || log.status === 'In-Transit';
            return (
              <div key={log.id} className="bg-white/70 rounded-2xl p-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <div>
                  <p className="text-xs font-bold text-navy">{log.id}</p>
                  <p className="text-[10px] text-slate-500">{log.sentItems.detergen} Det · {log.sentItems.pelembut} Pel · {log.sentItems.plastik} Plas</p>
                </div>
                {canVerify && (
                  <button onClick={() => openVerifyForm(log)}
                    className="bg-deep-blue hover:bg-navy text-white text-xs font-medium px-3 py-1.5 rounded-xl transition-all whitespace-nowrap">
                    Verifikasi
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Branch Inventory Grid - Premium Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredBranches.map((branch) => {
          const s = getStatusStyle(branch.inventory.overall_status);
          return (
            <div key={branch.id_cabang} className="bg-white border border-slate-200 rounded-2xl p-6">
              <div className="flex justify-between items-center pb-4 border-b border-slate-200">
                <div>
                  <h4 className="font-semibold text-navy">{branch.nama_cabang}</h4>
                  <span className="text-xs text-slate-400">{branch.id_cabang}</span>
                </div>
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${s.bg}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`}></span>
                  {branch.inventory.overall_status}
                </span>
              </div>

              <div className="space-y-3 mt-4">
                {branch.inventory.stocks.map((stock) => {
                  const isLow = stock.status === 'Kritis' || stock.status === 'Menipis';
                  const pct = Math.min((stock.stok_saat_ini / stock.max_capacity) * 100, 100);
                  const label = stock.item === 'Detergen' ? 'Detergen' : stock.item === 'Pelembut' ? 'Pelembut' : 'Plastik';

                  return (
                    <div key={stock.item} className="space-y-1">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-500 font-medium">{label}</span>
                        <span className={`font-semibold ${isLow ? 'text-red-600' : 'text-navy'}`}>
                          {stock.stok_saat_ini} <span className="text-slate-400 font-normal">/ min {stock.safety_threshold}</span>
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                        <div style={{ width: `${pct}%` }} className={`h-full rounded-full transition-all ${isLow ? 'bg-red-500' : 'bg-deep-blue'}`}></div>
                      </div>
                      {isLow && (
                        <span className="text-[10px] text-red-600 font-semibold animate-blink">
                          ⚠️ {stock.status === 'Kritis' ? 'Stok Kritis' : 'Stok Menipis'}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Verify Modal */}
      {showVerifyForm && verifyLogId && (
        <div className="fixed inset-0 bg-navy/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-sm w-full">
            <div className="p-5 border-b border-slate-200 flex justify-between items-start">
              <div>
                <h3 className="text-base font-bold text-navy">Verifikasi Penerimaan</h3>
                <p className="text-xs text-slate-500 mt-0.5">{verifyLogId}</p>
              </div>
              <button onClick={() => { setShowVerifyForm(false); setVerifyLogId(null); }} className="text-slate-400 hover:text-navy">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div className="bg-base-bg rounded-2xl p-3 text-xs space-y-1">
                <span className="font-semibold text-slate-500 block">Dikirim:</span>
                <div className="flex justify-between"><span className="text-slate-500">Detergen</span><span className="font-medium text-navy">{verifySentItems.detergen} pcs</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Pelembut</span><span className="font-medium text-navy">{verifySentItems.pelembut} pcs</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Plastik</span><span className="font-medium text-navy">{verifySentItems.plastik} pcs</span></div>
              </div>
              {(['detergen', 'pelembut', 'plastik'] as const).map((item) => (
                <div key={item}>
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-2">{item.charAt(0).toUpperCase() + item.slice(1)} (pcs)</label>
                  <input type="number" value={verifyForm[item]} onChange={(e) => setVerifyForm({ ...verifyForm, [item]: e.target.value })}
                    className="w-full bg-white border border-slate-200 rounded-2xl px-4 py-3 text-sm text-navy focus:outline-none focus:border-deep-blue transition-all" />
                </div>
              ))}
              <div className="flex gap-2">
                <button onClick={() => { setShowVerifyForm(false); setVerifyLogId(null); }}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-600 text-sm font-medium py-2.5 rounded-2xl transition-all">Batal</button>
                <button onClick={handleVerify} disabled={verifying}
                  className="flex-1 bg-deep-blue hover:bg-navy text-white text-sm font-medium py-2.5 rounded-2xl transition-all disabled:opacity-50">
                  {verifying ? 'Memproses...' : 'Simpan'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Stock Adjustment Modal - Sends to Owner Anomaly Log */}
      {showAdjustModal && (
        <div className="fixed inset-0 bg-navy/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-sm w-full">
            <div className="p-5 border-b border-slate-200 flex justify-between items-start">
              <div>
                <h3 className="text-base font-bold text-red-600">⚠️ Penyesuaian Stok</h3>
                <p className="text-xs text-slate-500 mt-0.5">Aksi akan dicatat ke Log Anomali Operasional</p>
              </div>
              <button onClick={() => setShowAdjustModal(false)} className="text-slate-400 hover:text-navy">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-2">Bahan Baku</label>
                <select value={adjustForm.item} onChange={(e) => setAdjustForm({ ...adjustForm, item: e.target.value as any })}
                  className="w-full bg-white border border-slate-200 rounded-2xl px-4 py-3 text-sm text-navy focus:outline-none focus:border-deep-blue transition-all">
                  <option value="Detergen">Detergen</option>
                  <option value="Pelembut">Pelembut</option>
                  <option value="Plastik">Plastik Packing</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-2">Jumlah Baru (pcs)</label>
                <input type="number" value={adjustForm.stok_baru} onChange={(e) => setAdjustForm({ ...adjustForm, stok_baru: e.target.value })}
                  className="w-full bg-white border border-slate-200 rounded-2xl px-4 py-3 text-sm text-navy focus:outline-none focus:border-deep-blue transition-all" />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-2">Alasan</label>
                <textarea rows={2} value={adjustForm.alasan} onChange={(e) => setAdjustForm({ ...adjustForm, alasan: e.target.value })}
                  placeholder="Contoh: Salah input / Botol bocor"
                  className="w-full bg-white border border-slate-200 rounded-2xl px-4 py-3 text-sm text-navy placeholder:text-slate-400 focus:outline-none focus:border-deep-blue transition-all resize-none" />
              </div>
              <div className="flex gap-2">
                <button onClick={() => setShowAdjustModal(false)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-600 text-sm font-medium py-2.5 rounded-2xl transition-all">Batal</button>
                <button onClick={handleAdjust} disabled={adjusting}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white text-sm font-medium py-2.5 rounded-2xl transition-all disabled:opacity-50">
                  {adjusting ? 'Menyimpan...' : '⚠️ Simpan & Log'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Admin Restock Request Modal - Creates Pending Request */}
      {showRestockRequestModal && (
        <RestockRequestModal
          selectedAdminBranch={selectedAdminBranch}
          onClose={() => setShowRestockRequestModal(false)}
          onSuccess={(msg) => triggerNotification(msg, 'success')}
        />
      )}

      {/* Owner Direct Restock Modal - Adds stock directly without approval */}
      {showRestockModal && (
        <RestockModal
          branches={data.per_cabang.map((b) => ({ id: b.id_cabang, nama: b.nama_cabang }))}
          initialBranchId={data.per_cabang[0]?.id_cabang ?? 'CBG-001'}
          userRole={userRole}
          selectedAdminBranch={selectedAdminBranch}
          onClose={() => setShowRestockModal(false)}
          onSuccess={(msg) => {
            triggerNotification(msg, 'success');
            setShowRestockModal(false);
          }}
        />
      )}

      {/* Owner Approval Panel - Approve/Reject Admin Restock Requests */}
      {showApprovalPanel && (
        <div className="fixed inset-0 bg-navy/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-hidden">
            <div className="p-5 border-b border-slate-200 flex justify-between items-start">
              <div>
                <h3 className="text-base font-bold text-navy">📋 Konfirmasi Pengajuan Restok</h3>
                <p className="text-xs text-slate-500 mt-0.5">Setujui atau tolak pengajuan dari Admin</p>
              </div>
              <button onClick={() => setShowApprovalPanel(false)} className="text-slate-400 hover:text-navy">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="p-5 overflow-y-auto max-h-[calc(90vh-80px)]">
              <RestockApproval
                onRestockSuccess={(msg) => triggerNotification(msg, 'success')}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

