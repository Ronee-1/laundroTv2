/**
 * UserManagement Component
 * Owner-only page to manage Admin and Kurir users
 */

import { useState, useEffect, useCallback } from 'react';
import { useAuth, authFetch } from '../contexts/AuthContext';

interface Branch {
  id_cabang: string;
  nama_cabang: string;
  wilayah: string;
}

interface User {
  id_user: string;
  nama: string;
  email: string;
  role: 'Owner' | 'Admin' | 'Kurir';
  id_cabang: string | null;
  is_active: boolean;
  created_at: string;
  branch?: {
    id_cabang: string;
    nama_cabang: string;
    wilayah: string;
  };
}

interface CreateUserForm {
  nama: string;
  email: string;
  password: string;
  role: 'Admin' | 'Kurir';
  id_cabang: string;
}

export function UserManagement({ onNotification }: { onNotification: (msg: string, type: 'success' | 'error') => void }) {
  const { getToken } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<CreateUserForm>({
    nama: '',
    email: '',
    password: '',
    role: 'Admin',
    id_cabang: '',
  });
  const [formErrors, setFormErrors] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch branches
  const fetchBranches = useCallback(async () => {
    const token = getToken();
    if (!token) return;

    try {
      const res = await authFetch('/api/auth/branches', {}, token);
      const json = await res.json();
      if (json.success && json.data?.branches) {
        setBranches(json.data.branches);
        if (json.data.branches.length > 0 && !form.id_cabang) {
          setForm((f) => ({ ...f, id_cabang: json.data.branches[0].id_cabang }));
        }
      }
    } catch (e) {
      console.error('Failed to fetch branches:', e);
    }
  }, [getToken, form.id_cabang]);

  // Fetch users
  const fetchUsers = useCallback(async () => {
    const token = getToken();
    if (!token) return;

    setIsLoading(true);
    try {
      const res = await authFetch('/api/auth/users', {}, token);
      const json = await res.json();
      if (json.success) {
        setUsers(json.data.users);
      }
    } catch (e) {
      console.error('Failed to fetch users:', e);
      onNotification('Gagal memuat data pengguna', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [getToken, onNotification]);

  useEffect(() => {
    fetchBranches();
    fetchUsers();
  }, [fetchBranches, fetchUsers]);

  // Create user
  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormErrors([]);

    const errors: string[] = [];
    if (!form.nama.trim() || form.nama.length < 2) errors.push('Nama minimal 2 karakter');
    if (!form.email.includes('@')) errors.push('Email tidak valid');
    if (form.password.length < 6) errors.push('Password minimal 6 karakter');
    if (!form.id_cabang) errors.push('Pilih cabang');

    if (errors.length > 0) {
      setFormErrors(errors);
      return;
    }

    const token = getToken();
    if (!token) return;

    setIsSubmitting(true);
    try {
      const res = await authFetch('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify(form),
      }, token);

      const json = await res.json();
      if (json.success) {
        onNotification(`Akun ${form.role} "${form.nama}" berhasil dibuat!`, 'success');
        setShowModal(false);
        setForm({ nama: '', email: '', password: '', role: 'Admin', id_cabang: branches[0]?.id_cabang || '' });
        fetchUsers();
      } else {
        setFormErrors([json.error || 'Gagal membuat akun']);
      }
    } catch (e) {
      setFormErrors(['Terjadi kesalahan server']);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Deactivate user
  const handleDeactivate = async (userId: string) => {
    if (!confirm('Yakin ingin menonaktifkan akun ini?')) return;

    const token = getToken();
    if (!token) return;

    try {
      const res = await authFetch(`/api/auth/users/${userId}`, { method: 'DELETE' }, token);
      const json = await res.json();
      if (json.success) {
        onNotification('Akun berhasil dinonaktifkan', 'success');
        fetchUsers();
      } else {
        onNotification(json.error || 'Gagal menonaktifkan akun', 'error');
      }
    } catch (e) {
      onNotification('Terjadi kesalahan server', 'error');
    }
  };

  const getRoleBadgeColor = (role: string) => {
    if (role === 'Owner') return { bg: '#fef3c7', text: '#92400e' };
    if (role === 'Admin') return { bg: '#dbeafe', text: '#1e40af' };
    return { bg: '#d1fae5', text: '#065f46' };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: '#0b1c30' }}>Manajemen Pengguna</h1>
          <p className="text-sm mt-1" style={{ color: '#464652' }}>Kelola akun Admin dan Kurir untuk setiap cabang</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-white font-medium text-sm transition-all"
          style={{ backgroundColor: '#15157d' }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#0f1259'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#15157d'}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Tambah Pengguna
        </button>
      </div>

      {/* Users Table */}
      <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: 'white', border: '1px solid #e5e4ed' }}>
        <table className="w-full">
          <thead>
            <tr style={{ backgroundColor: '#f8f9ff', borderBottom: '1px solid #e5e4ed' }}>
              <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wide" style={{ color: '#464652' }}>Nama</th>
              <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wide" style={{ color: '#464652' }}>Email</th>
              <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wide" style={{ color: '#464652' }}>Role</th>
              <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wide" style={{ color: '#464652' }}>Cabang</th>
              <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wide" style={{ color: '#464652' }}>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center" style={{ color: '#777683' }}>
                  Memuat data...
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center" style={{ color: '#777683' }}>
                  Belum ada pengguna
                </td>
              </tr>
            ) : (
              users.map((user) => {
                const badge = getRoleBadgeColor(user.role);
                return (
                  <tr key={user.id_user} className="border-b" style={{ borderColor: '#f0eff8' }}>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center font-semibold text-sm"
                          style={{ backgroundColor: '#eff4ff', color: '#15157d' }}
                        >
                          {user.nama.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                        </div>
                        <span className="font-medium" style={{ color: '#0b1c30' }}>{user.nama}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm" style={{ color: '#464652' }}>{user.email}</td>
                    <td className="px-6 py-4">
                      <span
                        className="inline-block px-3 py-1 rounded-lg text-xs font-medium"
                        style={{ backgroundColor: badge.bg, color: badge.text }}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm" style={{ color: '#464652' }}>
                      {user.branch ? `${user.branch.nama_cabang} (${user.branch.wilayah})` : '-'}
                    </td>
                    <td className="px-6 py-4">
                      {user.role !== 'Owner' && (
                        <button
                          onClick={() => handleDeactivate(user.id_user)}
                          className="text-sm font-medium px-3 py-1.5 rounded-lg transition-all"
                          style={{ color: '#dc2626', backgroundColor: '#fef2f2' }}
                          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#fee2e2'}
                          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#fef2f2'}
                        >
                          Nonaktifkan
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Create User Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div
            className="w-full max-w-lg rounded-3xl p-6 max-h-[90vh] overflow-y-auto"
            style={{ backgroundColor: 'white' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold" style={{ color: '#0b1c30' }}>Tambah Pengguna Baru</h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 rounded-xl transition-colors"
                style={{ color: '#777683', backgroundColor: '#f8f9ff' }}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-4">
              {/* Role Selection */}
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#0b1c30' }}>Role</label>
                <div className="grid grid-cols-2 gap-3">
                  {(['Admin', 'Kurir'] as const).map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setForm({ ...form, role: r })}
                      className="p-4 rounded-xl border-2 text-left transition-all"
                      style={{
                        borderColor: form.role === r ? '#15157d' : '#e5e4ed',
                        backgroundColor: form.role === r ? '#eff4ff' : 'transparent',
                      }}
                    >
                      <span className="font-medium" style={{ color: form.role === r ? '#15157d' : '#464652' }}>{r}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Nama */}
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#0b1c30' }}>Nama Lengkap</label>
                <input
                  type="text"
                  value={form.nama}
                  onChange={(e) => setForm({ ...form, nama: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl text-base outline-none"
                  style={{ backgroundColor: '#f8f9ff', border: '1.5px solid #e5e4ed', color: '#0b1c30' }}
                  placeholder="Masukkan nama lengkap"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#0b1c30' }}>Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl text-base outline-none"
                  style={{ backgroundColor: '#f8f9ff', border: '1.5px solid #e5e4ed', color: '#0b1c30' }}
                  placeholder="nama@email.com"
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#0b1c30' }}>Password</label>
                <input
                  type="text"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl text-base outline-none"
                  style={{ backgroundColor: '#f8f9ff', border: '1.5px solid #e5e4ed', color: '#0b1c30' }}
                  placeholder="Minimal 6 karakter"
                />
              </div>

              {/* Branch Selection */}
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#0b1c30' }}>Cabang</label>
                <select
                  value={form.id_cabang}
                  onChange={(e) => setForm({ ...form, id_cabang: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl text-base outline-none cursor-pointer"
                  style={{ backgroundColor: '#f8f9ff', border: '1.5px solid #e5e4ed', color: '#0b1c30' }}
                >
                  <option value="">Pilih cabang...</option>
                  {branches.map((b) => (
                    <option key={b.id_cabang} value={b.id_cabang}>
                      {b.nama_cabang} ({b.wilayah})
                    </option>
                  ))}
                </select>
              </div>

              {/* Errors */}
              {formErrors.length > 0 && (
                <div className="p-4 rounded-xl" style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca' }}>
                  {formErrors.map((err, i) => (
                    <p key={i} className="text-sm" style={{ color: '#b91c1c' }}>• {err}</p>
                  ))}
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-3 rounded-xl font-medium"
                  style={{ backgroundColor: '#f8f9ff', color: '#464652' }}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-3 rounded-xl font-medium text-white disabled:opacity-60"
                  style={{ backgroundColor: '#15157d' }}
                >
                  {isSubmitting ? 'Membuat...' : 'Buat Akun'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserManagement;
