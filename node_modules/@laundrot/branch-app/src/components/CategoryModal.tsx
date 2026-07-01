import { useState } from 'react';

interface Props {
  onClose: () => void;
  onSuccess: (msg: string, categories?: string[]) => void;
  onError: (msg: string) => void;
}

export function CategoryModal({ onClose, onSuccess, onError }: Props) {
  const [newCategory, setNewCategory] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!newCategory.trim()) return;
    setSubmitting(true);
    try {
      const res = await fetch('/api/expenses/categories', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: newCategory.trim() }) });
      const json = await res.json();
      if (res.ok && json.success) { onSuccess(json.message, json.categories); onClose(); } else { onError(json.message ?? 'Kategori sudah ada!'); }
    } catch { onError('Tidak dapat terhubung ke server.'); } finally { setSubmitting(false); }
  }

  return (
    <div className="fixed inset-0 bg-[#0F172A]/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white border border-slate-200 rounded-4xl max-w-sm w-full overflow-hidden shadow-elevated">
        <div className="p-7 pb-5 border-b border-slate-100 flex justify-between items-center">
          <div>
            <h3 className="text-lg font-bold text-[#0F172A]">Kategori Kustom</h3>
            <p className="text-xs text-slate-400 mt-0.5">Tambah kategori pengeluaran baru</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors p-1">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-7 space-y-5">
          <div>
            <label className="text-xs font-semibold text-slate-500 block mb-2">Nama Kategori Baru</label>
            <input type="text" placeholder="Contoh: Renovasi Ringan" value={newCategory} onChange={(e) => setNewCategory(e.target.value)} className="w-full bg-slate-50 border border-transparent rounded-xl px-4 py-3 text-sm text-[#0F172A] placeholder-slate-400 focus:outline-none focus:bg-white focus:border-blue-600/30 transition-all" required />
          </div>
          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose} className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-600 text-sm font-semibold py-3 rounded-xl transition-all">Batal</button>
            <button type="submit" disabled={submitting} className="flex-1 bg-[#0F172A] hover:bg-slate-800 text-white text-sm font-semibold py-3 rounded-xl transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-md disabled:opacity-50">{submitting ? 'Menambah...' : 'Tambahkan'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
