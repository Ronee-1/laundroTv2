import { useState, useEffect } from 'react';
import type { UserRole } from '../App.tsx';

interface BranchOption { id: string; nama: string; }

interface Props {
  branches: BranchOption[];
  userRole: UserRole;
  selectedAdminBranch: string;
  onClose: () => void;
  onSuccess: (msg: string) => void;
  onError: (msg: string) => void;
}

const DEFAULT_CATEGORIES = ['BBM', 'Sewa & Utilitas', 'Gaji', 'Belanja Darurat', 'Pemeliharaan', 'Lain-lain'];

export function ExpenseModal({ branches, userRole, selectedAdminBranch, onClose, onSuccess, onError }: Props) {
  const [categories, setCategories] = useState<string[]>(DEFAULT_CATEGORIES);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const [formData, setFormData] = useState({ cabangId: 'CBG-002', nominal: '', kategori: 'BBM', deskripsi: '', tanggal: new Date().toISOString().split('T')[0] });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetch('/api/expenses/categories').then((r) => r.json()).then((json) => { if (json.success && Array.isArray(json.categories)) setCategories(json.categories); }).catch(() => {});
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const targetBranchId = userRole === 'Owner' ? formData.cabangId : selectedAdminBranch;
    const nominal = parseFloat(formData.nominal);
    if (isNaN(nominal) || nominal <= 0) { onError('Nominal pengeluaran tidak valid!'); return; }
    setSubmitting(true);
    try {
      const res = await fetch('/api/expenses/request', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id_cabang: targetBranchId, tanggal: formData.tanggal, nominal, deskripsi: formData.deskripsi, kategori: formData.kategori, bukti_nota_url: '' }) });
      const json = await res.json();
      if (res.ok && json.success) { onSuccess(json.message); onClose(); } else { onError(json.message ?? json.error ?? 'Terjadi kesalahan.'); }
    } catch { onError('Tidak dapat terhubung ke server.'); } finally { setSubmitting(false); }
  }

  async function handleAddCategory(e: React.FormEvent) {
    e.preventDefault();
    if (!newCategory.trim()) return;
    if (categories.includes(newCategory.trim())) { onError('Kategori sudah ada!'); return; }
    try {
      const res = await fetch('/api/expenses/categories', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: newCategory.trim() }) });
      const json = await res.json();
      if (res.ok && json.success) { setCategories(json.categories ?? [...categories, newCategory.trim()]); setNewCategory(''); setShowCategoryForm(false); onSuccess('Kategori berhasil ditambahkan.'); } else { onError(json.message ?? 'Gagal menambah kategori.'); }
    } catch { setCategories([...categories, newCategory.trim()]); setNewCategory(''); setShowCategoryForm(false); }
  }

  return (
    <div className="fixed inset-0 bg-[#0F172A]/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white border border-slate-200 rounded-4xl max-w-lg w-full overflow-hidden shadow-elevated max-h-[90vh] overflow-y-auto">
        <div className="p-7 pb-5 border-b border-slate-100 flex justify-between items-center sticky top-0 bg-white z-10">
          <div>
            <h3 className="text-lg font-bold text-[#0F172A]">Catat Pengeluaran Baru</h3>
            <p className="text-xs text-slate-400 mt-0.5">Input pengeluaran operasional cabang</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors p-1">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-7 space-y-5">
          {userRole === 'Owner' ? (
            <div>
              <label className="text-xs font-semibold text-slate-500 block mb-2">Asal Cabang</label>
              <select value={formData.cabangId} onChange={(e) => setFormData({ ...formData, cabangId: e.target.value })} className="w-full bg-slate-50 border border-transparent rounded-xl px-4 py-3 text-sm text-[#0F172A] focus:outline-none focus:bg-white focus:border-blue-600/30 transition-all">
                {branches.map((b) => (<option key={b.id} value={b.id}>{b.nama}</option>))}
              </select>
            </div>
          ) : (
            <div>
              <label className="text-xs font-semibold text-slate-500 block mb-2">Asal Cabang</label>
              <div className="w-full bg-slate-50 border border-transparent rounded-xl px-4 py-3 text-sm text-[#B45309] font-semibold">{branches.find((b) => b.id === selectedAdminBranch)?.nama} (Terkunci)</div>
            </div>
          )}

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-semibold text-slate-500">Kategori Biaya</label>
              <button type="button" onClick={() => setShowCategoryForm(!showCategoryForm)} className="text-[11px] text-blue-600 hover:text-blue-700 font-semibold transition-colors">+ Kategori Baru</button>
            </div>
            {showCategoryForm && (
              <div className="flex gap-2 mb-3">
                <input type="text" placeholder="Nama kategori..." value={newCategory} onChange={(e) => setNewCategory(e.target.value)} className="flex-1 bg-slate-50 border border-transparent rounded-xl px-4 py-2.5 text-sm text-[#0F172A] focus:outline-none focus:bg-white focus:border-blue-600/30 transition-all" />
                <button type="button" onClick={handleAddCategory} className="bg-[#0F172A] text-white text-xs px-4 py-2.5 rounded-xl font-semibold transition-all hover:bg-slate-800">Tambah</button>
              </div>
            )}
            <select value={formData.kategori} onChange={(e) => setFormData({ ...formData, kategori: e.target.value })} className="w-full bg-slate-50 border border-transparent rounded-xl px-4 py-3 text-sm text-[#0F172A] focus:outline-none focus:bg-white focus:border-blue-600/30 transition-all">
              {categories.map((cat) => (<option key={cat} value={cat}>{cat}</option>))}
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-500 block mb-2">Nominal (IDR)</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 text-sm font-medium">Rp</span>
              <input type="number" placeholder="150.000" value={formData.nominal} onChange={(e) => setFormData({ ...formData, nominal: e.target.value })} className="w-full bg-slate-50 border border-transparent pl-12 pr-4 py-3 rounded-xl text-sm text-[#0F172A] focus:outline-none focus:bg-white focus:border-blue-600/30 transition-all" required />
            </div>
            <span className="text-[10px] text-slate-400 mt-1.5 block">Anggaran diverifikasi otomatis terhadap sisa pagu.</span>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-500 block mb-2">Tanggal Transaksi</label>
            <input type="date" value={formData.tanggal} onChange={(e) => setFormData({ ...formData, tanggal: e.target.value })} className="w-full bg-slate-50 border border-transparent rounded-xl px-4 py-3 text-sm text-[#0F172A] focus:outline-none focus:bg-white focus:border-blue-600/30 transition-all" required />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-500 block mb-2">Deskripsi & Justifikasi</label>
            <textarea rows={2} placeholder="Jelaskan tujuan pembelian operasional..." value={formData.deskripsi} onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })} className="w-full bg-slate-50 border border-transparent rounded-xl px-4 py-3 text-sm text-[#0F172A] placeholder-slate-400 focus:outline-none focus:bg-white focus:border-blue-600/30 transition-all resize-none" required />
          </div>

          <div className="flex gap-3 pt-3">
            <button type="button" onClick={onClose} className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-600 text-sm font-semibold py-3 rounded-xl transition-all">Batal</button>
            <button type="submit" disabled={submitting} className="flex-1 bg-[#0F172A] hover:bg-slate-800 text-white text-sm font-semibold py-3 rounded-xl transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-md disabled:opacity-50">{submitting ? 'Mengirim...' : 'Kirim & Validasi Pagu'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
