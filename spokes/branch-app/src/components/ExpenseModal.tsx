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

// ==========================================
// EXPENSE MODAL - Premium Flat Design
// ==========================================
export function ExpenseModal({ branches, userRole, selectedAdminBranch, onClose, onSuccess, onError }: Props) {
  const [categories, setCategories] = useState<string[]>(DEFAULT_CATEGORIES);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const [formData, setFormData] = useState({ cabangId: 'CBG-002', nominal: '', kategori: 'BBM', deskripsi: '', tanggal: new Date().toISOString().split('T')[0] });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetch('/api/expenses/categories').then((r) => r.json()).then((json) => { if (json.success && Array.isArray(json.categories)) setCategories(json.categories); }).catch(() => {});
  }, []);

  // FR-FIN-03: Handle Overbudget Error
  // Frontend harus menangkap string error eksak 'Overbudget' dan menampilkan popup peringatan
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const targetBranchId = userRole === 'Owner' ? formData.cabangId : selectedAdminBranch;
    const nominal = parseFloat(formData.nominal);
    if (isNaN(nominal) || nominal <= 0) { onError('Nominal tidak valid!'); return; }
    setSubmitting(true);
    try {
      const res = await fetch('/api/expenses/request', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id_cabang: targetBranchId, tanggal: formData.tanggal, nominal, deskripsi: formData.deskripsi, kategori: formData.kategori, bukti_nota_url: '' }) });
      const json = await res.json();

      // FR-FIN-03: Check for exact 'Overbudget' error string
      if (!res.ok || json.error === 'Overbudget') {
        // Display popup warning for Overbudget error per FR-FIN-03
        const errorMessage = json.error === 'Overbudget'
          ? `Overbudget: Pengeluaran Rp${nominal.toLocaleString('id-ID')} melebihi sisa pagu anggaran bulanan. Deviasi maksimal 5% dari pagu yang ditetapkan.`
          : (json.error ?? json.message ?? 'Terjadi kesalahan.');

        // Call onError with the Overbudget message to trigger popup
        onError(errorMessage);
        return;
      }

      if (json.success) {
        onSuccess(json.message);
        onClose();
      } else {
        onError(json.error ?? json.message ?? 'Terjadi kesalahan.');
      }
    } catch { onError('Tidak dapat terhubung ke server.'); } finally { setSubmitting(false); }
  }

  async function handleAddCategory(e: React.FormEvent) {
    e.preventDefault();
    if (!newCategory.trim()) return;
    if (categories.includes(newCategory.trim())) { onError('Kategori sudah ada!'); return; }
    try {
      const res = await fetch('/api/expenses/categories', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: newCategory.trim() }) });
      const json = await res.json();
      if (res.ok && json.success) { setCategories(json.categories ?? [...categories, newCategory.trim()]); setNewCategory(''); setShowCategoryForm(false); onSuccess('Kategori berhasil ditambahkan.'); } else { onError(json.message ?? 'Gagal.'); }
    } catch { setCategories([...categories, newCategory.trim()]); setNewCategory(''); setShowCategoryForm(false); }
  }

  return (
    <div className="fixed inset-0 bg-navy/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="p-5 border-b border-slate-200 flex justify-between items-center sticky top-0 bg-white z-10">
          <div>
            <h3 className="text-base font-bold text-navy">Catat Pengeluaran</h3>
            <p className="text-xs text-slate-500 mt-0.5">Input pengeluaran operasional</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-navy">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* Asal Cabang */}
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-2">Asal Cabang</label>
            {userRole === 'Owner' ? (
              <select value={formData.cabangId} onChange={(e) => setFormData({ ...formData, cabangId: e.target.value })}
                className="w-full bg-white border border-slate-200 rounded-2xl px-4 py-3 text-sm text-navy focus:outline-none focus:border-deep-blue transition-all">
                {branches.map((b) => (<option key={b.id} value={b.id}>{b.nama}</option>))}
              </select>
            ) : (
              <div className="w-full bg-amber-50 border border-amber-200 rounded-2xl px-4 py-3 text-sm font-medium text-amber-600">{branches.find((b) => b.id === selectedAdminBranch)?.nama} (Terkunci)</div>
            )}
          </div>

          {/* Kategori */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Kategori</label>
              <button type="button" onClick={() => setShowCategoryForm(!showCategoryForm)}
                className="text-[11px] text-deep-blue hover:text-navy font-medium transition-all">+ Kategori Baru</button>
            </div>
            {showCategoryForm && (
              <div className="flex gap-2 mb-2">
                <input type="text" placeholder="Nama kategori..." value={newCategory} onChange={(e) => setNewCategory(e.target.value)}
                  className="flex-1 bg-white border border-slate-200 rounded-2xl px-4 py-2.5 text-sm text-navy placeholder:text-slate-400 focus:outline-none focus:border-deep-blue transition-all" />
                <button type="button" onClick={handleAddCategory}
                  className="bg-deep-blue text-white text-xs px-3 py-2.5 rounded-2xl font-medium hover:bg-navy transition-all">Tambah</button>
              </div>
            )}
            <select value={formData.kategori} onChange={(e) => setFormData({ ...formData, kategori: e.target.value })}
              className="w-full bg-white border border-slate-200 rounded-2xl px-4 py-3 text-sm text-navy focus:outline-none focus:border-deep-blue transition-all">
              {categories.map((cat) => (<option key={cat} value={cat}>{cat}</option>))}
            </select>
          </div>

          {/* Nominal */}
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-2">Nominal (IDR)</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400 text-sm">Rp</span>
              <input type="number" placeholder="150.000" value={formData.nominal} onChange={(e) => setFormData({ ...formData, nominal: e.target.value })}
                className="w-full bg-white border border-slate-200 rounded-2xl pl-10 pr-4 py-3 text-sm text-navy placeholder:text-slate-400 focus:outline-none focus:border-deep-blue transition-all"
                required />
            </div>
          </div>

          {/* Tanggal */}
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-2">Tanggal</label>
            <input type="date" value={formData.tanggal} onChange={(e) => setFormData({ ...formData, tanggal: e.target.value })}
              className="w-full bg-white border border-slate-200 rounded-2xl px-4 py-3 text-sm text-navy focus:outline-none focus:border-deep-blue transition-all"
              required />
          </div>

          {/* Deskripsi */}
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-2">Deskripsi</label>
            <textarea rows={2} placeholder="Jelaskan tujuan..." value={formData.deskripsi} onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })}
              className="w-full bg-white border border-slate-200 rounded-2xl px-4 py-3 text-sm text-navy placeholder:text-slate-400 focus:outline-none focus:border-deep-blue transition-all resize-none"
              required />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-600 text-sm font-medium py-3 rounded-2xl transition-all">Batal</button>
            <button type="submit" disabled={submitting}
              className="flex-1 bg-deep-blue hover:bg-navy text-white text-sm font-medium py-3 rounded-2xl transition-all disabled:opacity-50">
              {submitting ? 'Mengirim...' : 'Kirim & Validasi'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
