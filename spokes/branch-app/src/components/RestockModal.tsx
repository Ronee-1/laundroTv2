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
      if (res.ok && json.success) { onSuccess(json.message); onClose(); } else { onSuccess('Gagal restock: ' + (json.error ?? 'Unknown error')); }
    } catch { onSuccess('Tidak dapat terhubung ke server.'); } finally { setSubmitting(false); }
  }

  return (
    <div className="fixed inset-0 bg-[#0F172A]/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white border border-slate-200 rounded-4xl max-w-md w-full overflow-hidden shadow-elevated">
        <div className="p-7 pb-5 border-b border-slate-100 flex justify-between items-center">
          <div>
            <h3 className="text-lg font-bold text-[#0F172A]">Distribusi Restock</h3>
            <p className="text-xs text-slate-400 mt-0.5">Kirim stok bahan baku ke cabang</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors p-1">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-7 space-y-5">
          {userRole === 'Owner' ? (
            <div>
              <label className="text-xs font-semibold text-slate-500 block mb-2">Kirim Ke Cabang</label>
              <select value={selectedBranch} onChange={(e) => setSelectedBranch(e.target.value)} className="w-full bg-slate-50 border border-transparent rounded-xl px-4 py-3 text-sm text-[#0F172A] focus:outline-none focus:bg-white focus:border-blue-600/30 transition-all">
                {branches.map((b) => (<option key={b.id} value={b.id}>{b.nama}</option>))}
              </select>
            </div>
          ) : (
            <div>
              <label className="text-xs font-semibold text-slate-500 block mb-2">Kirim Ke Cabang</label>
              <div className="w-full bg-slate-50 border border-transparent rounded-xl px-4 py-3 text-sm text-[#B45309] font-semibold">{branches.find((b) => b.id === selectedAdminBranch)?.nama} (Terkunci)</div>
            </div>
          )}

          <div>
            <label className="text-xs font-semibold text-slate-500 block mb-2">Detergen Cair (Liter)</label>
            <input type="number" placeholder="Berapa liter?" value={stockForm.detergen} onChange={(e) => setStockForm({ ...stockForm, detergen: e.target.value })} className="w-full bg-slate-50 border border-transparent rounded-xl px-4 py-3 text-sm text-[#0F172A] focus:outline-none focus:bg-white focus:border-blue-600/30 transition-all" />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500 block mb-2">Pelembut & Pewangi (Liter)</label>
            <input type="number" placeholder="Berapa liter?" value={stockForm.pelembut} onChange={(e) => setStockForm({ ...stockForm, pelembut: e.target.value })} className="w-full bg-slate-50 border border-transparent rounded-xl px-4 py-3 text-sm text-[#0F172A] focus:outline-none focus:bg-white focus:border-blue-600/30 transition-all" />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500 block mb-2">Plastik Packing (Pcs)</label>
            <input type="number" placeholder="Berapa pcs?" value={stockForm.plastik} onChange={(e) => setStockForm({ ...stockForm, plastik: e.target.value })} className="w-full bg-slate-50 border border-transparent rounded-xl px-4 py-3 text-sm text-[#0F172A] focus:outline-none focus:bg-white focus:border-blue-600/30 transition-all" />
          </div>

          <div className="flex gap-3 pt-3">
            <button type="button" onClick={onClose} className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-600 text-sm font-semibold py-3 rounded-xl transition-all">Batal</button>
            <button type="submit" disabled={submitting} className="flex-1 bg-[#0F172A] hover:bg-slate-800 text-white text-sm font-semibold py-3 rounded-xl transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-md disabled:opacity-50">{submitting ? 'Mengirim...' : 'Konfirmasi Pengiriman'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
