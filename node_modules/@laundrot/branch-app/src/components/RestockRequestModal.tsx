import { useState } from 'react';

interface Props {
  selectedAdminBranch: string;
  onClose: () => void;
  onSuccess: (msg: string) => void;
}

// ==========================================
// RESTOCK REQUEST MODAL - Admin submits request (Pending)
// ==========================================
export function RestockRequestModal({ selectedAdminBranch, onClose, onSuccess }: Props) {
  const [stockForm, setStockForm] = useState({ detergen: '', pelembut: '', plastik: '' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const q = {
      detergen: parseInt(stockForm.detergen || '0', 10),
      pelembut: parseInt(stockForm.pelembut || '0', 10),
      plastik: parseInt(stockForm.plastik || '0', 10),
    };
    if (!q.detergen && !q.pelembut && !q.plastik) { setError('Minimal isi salah satu item.'); return; }
    setSubmitting(true);
    try {
      const res = await fetch(`/api/restock/request?id_cabang=${selectedAdminBranch}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(q),
      });
      const json = await res.json();
      if (res.ok && json.success) {
        onSuccess(`Pengajuan restock terkirim — Menunggu persetujuan Owner.`);
        onClose();
      } else {
        setError(json.error ?? 'Gagal mengirim pengajuan.');
      }
    } catch { setError('Tidak dapat terhubung ke server.'); }
    finally { setSubmitting(false); }
  }

  return (
    <div className="fixed inset-0 bg-navy/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-sm w-full">
        <div className="p-5 border-b border-slate-200 flex justify-between items-start">
          <div>
            <h3 className="text-base font-bold text-navy">Pengajuan Restok</h3>
            <p className="text-xs text-slate-400 mt-0.5">Isi form, terkirim sebagai permintaan Pending</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-navy"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
        </div>
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-700">
            ⚠️ Pengajuan akan masuk ke antrean persetujuan Owner. Stok bertambah setelah disetujui.
          </div>
          {error && <div className="text-xs text-red-500 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</div>}
          {(['detergen', 'pelembut', 'plastik'] as const).map((item) => (
            <div key={item}>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1.5">
                {item === 'detergen' ? 'Detergen Cair (pcs)' : item === 'pelembut' ? 'Pelembut (pcs)' : 'Plastik Packing (pcs)'}
              </label>
              <input type="number" min="0" placeholder="0" value={stockForm[item]} onChange={(e) => setStockForm({ ...stockForm, [item]: e.target.value })}
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-navy placeholder:text-slate-400 focus:outline-none focus:border-deep-blue transition-all" />
            </div>
          ))}
          <button type="submit" disabled={submitting}
            className="w-full bg-deep-blue hover:bg-navy text-white font-medium text-sm py-3 rounded-xl transition-all disabled:opacity-50">
            {submitting ? 'Mengirim...' : '📤 Kirim Pengajuan'}
          </button>
          <button type="button" onClick={onClose}
            className="w-full bg-slate-100 hover:bg-slate-200 text-slate-600 font-medium text-sm py-2.5 rounded-xl transition-all">
            Batal
          </button>
        </form>
      </div>
    </div>
  );
}
