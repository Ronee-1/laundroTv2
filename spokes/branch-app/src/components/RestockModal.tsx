import { useState } from 'react';
import type { UserRole } from '../App.tsx';

interface BranchOption { id: string; nama: string; }

interface Props {
  branches: BranchOption[];
  initialBranchId: string;
  userRole: UserRole;
  selectedAdminBranch: string;
  onClose: () => void;
  onSuccess: (msg: string) => void;
}

// ==========================================
// RESTOCK MODAL - Premium Flat Design
// ==========================================
export function RestockModal({ branches, initialBranchId, userRole, selectedAdminBranch, onClose, onSuccess }: Props) {
  const [selectedBranch, setSelectedBranch] = useState(initialBranchId);
  const [stockForm, setStockForm] = useState({ detergen: '', pelembut: '', plastik: '' });
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const targetBranchId = userRole === 'Owner' ? selectedBranch : selectedAdminBranch;
    setSubmitting(true);
    try {
      const res = await fetch(`/api/branches/${targetBranchId}/restock`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ detergen: parseInt(stockForm.detergen || '0', 10), pelembut: parseInt(stockForm.pelembut || '0', 10), plastik: parseInt(stockForm.plastik || '0', 10) }) });
      const json = await res.json();
      if (res.ok && json.success) { onSuccess(json.message); onClose(); } else { onSuccess('Gagal: ' + (json.error ?? 'Unknown')); }
    } catch { onSuccess('Tidak dapat terhubung.'); } finally { setSubmitting(false); }
  }

  return (
    <div className="fixed inset-0 bg-navy/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-sm w-full">
        <div className="p-5 border-b border-slate-200 flex justify-between items-center">
          <div>
            <h3 className="text-base font-bold text-navy">Distribusi Restock</h3>
            <p className="text-xs text-slate-500 mt-0.5">Kirim stok ke cabang</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-navy">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* Branch Selection */}
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-2">Cabang</label>
            {userRole === 'Owner' ? (
              <select value={selectedBranch} onChange={(e) => setSelectedBranch(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-2xl px-4 py-3 text-sm text-navy focus:outline-none focus:border-deep-blue transition-all">
                {branches.map((b) => (<option key={b.id} value={b.id}>{b.nama}</option>))}
              </select>
            ) : (
              <div className="w-full bg-amber-50 border border-amber-200 rounded-2xl px-4 py-3 text-sm font-medium text-amber-600">{branches.find((b) => b.id === selectedAdminBranch)?.nama}</div>
            )}
          </div>

          {/* Stock Inputs */}
          {(['detergen', 'pelembut', 'plastik'] as const).map((item) => (
            <div key={item}>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-2">
                {item === 'detergen' ? 'Detergen (pcs)' : item === 'pelembut' ? 'Pelembut (pcs)' : 'Plastik Packing (pcs)'}
              </label>
              <input type="number" placeholder="Jumlah..." value={stockForm[item]} onChange={(e) => setStockForm({ ...stockForm, [item]: e.target.value })}
                className="w-full bg-white border border-slate-200 rounded-2xl px-4 py-3 text-sm text-navy placeholder:text-slate-400 focus:outline-none focus:border-deep-blue transition-all" />
            </div>
          ))}

          {/* Action Buttons */}
          <div className="flex gap-2 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-600 text-sm font-medium py-3 rounded-2xl transition-all">Batal</button>
            <button type="submit" disabled={submitting}
              className="flex-1 bg-deep-blue hover:bg-navy text-white text-sm font-medium py-3 rounded-2xl transition-all disabled:opacity-50">
              {submitting ? 'Mengirim...' : 'Konfirmasi'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
