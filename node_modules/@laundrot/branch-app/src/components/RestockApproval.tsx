import { useState, useEffect } from 'react';

interface BranchOption { id: string; nama: string }

// ==========================================
// RESTOCK APPROVAL PANEL - Owner approves admin requests + direct restock
// ==========================================
interface RestockRequest {
  id_request: string;
  id_cabang: string;
  nama_cabang: string;
  requested_items: { detergen?: number; pelembut?: number; plastik?: number };
  created_at: string;
}

export function RestockApproval({ onRestockSuccess }: {
  onRestockSuccess: (msg: string) => void;
}) {
  const [pending, setPending] = useState<RestockRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [directForm, setDirectForm] = useState({ branch: '', detergen: '', pelembut: '', plastik: '' });
  const [directSubmitting, setDirectSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<'approval' | 'direct'>('approval');
  const [branches, setBranches] = useState<BranchOption[]>([]);

  useEffect(() => {
    fetchPendingRequests();
    fetchBranches();
  }, []);

  async function fetchPendingRequests() {
    setLoading(true);
    try {
      const res = await fetch('/api/restock/pending');
      const json = await res.json();
      if (json.success) setPending(json.requests);
    } catch { /* ignore */ } finally { setLoading(false); }
  }

  async function fetchBranches() {
    try {
      const res = await fetch('/api/owner/dashboard');
      const json = await res.json();
      if (json.success) setBranches(json.per_cabang.map((b: any) => ({ id: b.id_cabang, nama: b.nama_cabang })));
    } catch { /* ignore */ }
  }

  async function handleApprove(id: string) {
    setActionLoading(id);
    try {
      const res = await fetch(`/api/restock/${id}/approve`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({}) });
      const json = await res.json();
      if (res.ok && json.success) {
        onRestockSuccess(json.message);
        fetchPendingRequests();
      } else {
        onRestockSuccess('Gagal menyetujui: ' + (json.error ?? 'Unknown'));
      }
    } catch { onRestockSuccess('Tidak dapat terhubung ke server.'); }
    finally { setActionLoading(null); }
  }

  async function handleReject(id: string) {
    setActionLoading(id);
    try {
      const res = await fetch(`/api/restock/${id}/reject`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({}) });
      const json = await res.json();
      if (res.ok && json.success) {
        onRestockSuccess(json.message);
        fetchPendingRequests();
      } else {
        onRestockSuccess('Gagal menolak: ' + (json.error ?? 'Unknown'));
      }
    } catch { onRestockSuccess('Tidak dapat terhubung ke server.'); }
    finally { setActionLoading(null); }
  }

  async function handleDirectRestock(e: React.FormEvent) {
    e.preventDefault();
    if (!directForm.branch) return;
    setDirectSubmitting(true);
    try {
      const res = await fetch(`/api/branches/${directForm.branch}/restock`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          detergen: parseInt(directForm.detergen || '0'),
          pelembut: parseInt(directForm.pelembut || '0'),
          plastik: parseInt(directForm.plastik || '0'),
        }),
      });
      const json = await res.json();
      if (res.ok && json.success) {
        onRestockSuccess(json.message);
        setDirectForm({ branch: '', detergen: '', pelembut: '', plastik: '' });
      } else {
        onRestockSuccess('Gagal restok: ' + (json.error ?? 'Unknown'));
      }
    } catch { onRestockSuccess('Tidak dapat terhubung ke server.'); }
    finally { setDirectSubmitting(false); }
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-4">
      <div className="flex gap-1 bg-slate-100 p-1 rounded-xl mb-4">
        {(['approval', 'direct'] as const).map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === tab ? 'bg-white text-navy shadow-sm' : 'text-slate-500 hover:text-navy'}`}>
            {tab === 'approval' ? `📋 Persetujuan (${pending.length})` : '⚡ Restok Langsung'}
          </button>
        ))}
      </div>

      {activeTab === 'approval' ? (
        loading ? (
          <div className="flex justify-center py-8"><div className="w-6 h-6 border-2 border-slate-200 border-t-deep-blue rounded-full animate-spin" /></div>
        ) : pending.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-4xl mb-2">✅</div>
            <p className="text-sm text-slate-500">Tidak ada pengajuan pending</p>
            <p className="text-xs text-slate-400 mt-1">Semua pengajuan sudah diproses</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {pending.map((req) => (
              <div key={req.id_request} className="border border-slate-200 rounded-xl p-4 bg-slate-50">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="text-sm font-semibold text-navy">{req.nama_cabang}</p>
                    <p className="text-xs text-slate-400">{req.id_request}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      {new Date(req.created_at).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })}
                    </p>
                  </div>
                  <span className="text-xs px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full">Pending</span>
                </div>
                <div className="text-xs text-slate-600 mb-3 space-y-0.5 bg-white rounded-lg p-2">
                  {(req.requested_items.detergen ?? 0) > 0 && <p>🧴 Detergen: <b>{req.requested_items.detergen} pcs</b></p>}
                  {(req.requested_items.pelembut ?? 0) > 0 && <p>🧴 Pelembut: <b>{req.requested_items.pelembut} pcs</b></p>}
                  {(req.requested_items.plastik ?? 0) > 0 && <p>📦 Plastik: <b>{req.requested_items.plastik} pcs</b></p>}
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleApprove(req.id_request)} disabled={actionLoading === req.id_request}
                    className="flex-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 text-xs font-semibold py-2.5 rounded-lg transition-all disabled:opacity-50 flex items-center justify-center gap-1">
                    ✓ Setujui
                  </button>
                  <button onClick={() => handleReject(req.id_request)} disabled={actionLoading === req.id_request}
                    className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-semibold py-2.5 rounded-lg transition-all disabled:opacity-50 flex items-center justify-center gap-1">
                    ✕ Tolak
                  </button>
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        <form onSubmit={handleDirectRestock} className="space-y-3">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-xs text-blue-700">
            ⚡ Restok langsung tanpa perlu persetujuan. Stok langsung bertambah ke cabang tujuan.
          </div>
          <select value={directForm.branch} onChange={e => setDirectForm(f => ({ ...f, branch: e.target.value }))}
            className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-navy focus:outline-none focus:border-deep-blue">
            <option value="">Pilih Branch...</option>
            {branches.map(b => <option key={b.id} value={b.id}>{b.nama}</option>)}
          </select>
          {(['detergen', 'pelembut', 'plastik'] as const).map(item => (
            <div key={item}>
              <label className="text-xs font-semibold text-slate-500 uppercase block mb-1">
                {item === 'detergen' ? 'Detergen (pcs)' : item === 'pelembut' ? 'Pelembut (pcs)' : 'Plastik (pcs)'}
              </label>
              <input type="number" min="0" placeholder="0" value={directForm[item]} onChange={e => setDirectForm(f => ({ ...f, [item]: e.target.value }))}
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-navy focus:outline-none focus:border-deep-blue" />
            </div>
          ))}
          <button type="submit" disabled={directSubmitting || !directForm.branch}
            className="w-full bg-deep-blue hover:bg-navy text-white text-sm font-semibold py-3 rounded-xl transition-all disabled:opacity-50">
            {directSubmitting ? 'Menyimpan...' : '⚡ Restok Langsung'}
          </button>
        </form>
      )}
    </div>
  );
}
