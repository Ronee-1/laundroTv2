/**
 * BranchSelection Component
 * Shown after Admin/Kurir login to select their assigned branch
 */

import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface Branch {
  id: string;
  nama: string;
  wilayah?: string;
}

interface BranchSelectionProps {
  onComplete: () => void;
  onLogout: () => void;
}

export function BranchSelection({ onComplete, onLogout }: BranchSelectionProps) {
  const { user } = useAuth();
  const [branches, setBranches] = useState<Branch[]>([]);
  const [selectedBranch, setSelectedBranch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch branches
    fetch('/api/branches')
      .then(r => r.json())
      .then(json => {
        if (json.success) {
          const branchList = json.branches.map((b: { id_cabang: string; nama_cabang: string; wilayah?: string }) => ({
            id: b.id_cabang,
            nama: b.nama_cabang,
            wilayah: b.wilayah
          }));
          setBranches(branchList);

          // If user has assigned branch, select it
          if (user?.id_cabang) {
            const userBranch = branchList.find((b: Branch) => b.id === user.id_cabang);
            if (userBranch) {
              setSelectedBranch(userBranch.id);
            }
          }
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [user?.id_cabang]);

  const handleContinue = () => {
    if (selectedBranch) {
      // Store selected branch in session storage
      sessionStorage.setItem('selected_branch', selectedBranch);
      onComplete();
    }
  };

  const getRoleColor = () => {
    if (user?.role === 'Admin') return { bg: '#dbeafe', text: '#2563eb', border: '#93c5fd' };
    return { bg: '#d1fae5', text: '#059669', border: '#6ee7b7' };
  };

  const roleColors = getRoleColor();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#f8f9ff' }}>
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-slate-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
          <p className="mt-4" style={{ color: '#464652' }}>Memuat...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6" style={{ backgroundColor: '#f8f9ff' }}>
      {/* Logo */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6" style={{ backgroundColor: '#15157d' }}>
          <svg className="w-8 h-8" style={{ color: '#14b8a6' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold" style={{ color: '#15157d' }}>LaundroTruck</h1>
      </div>

      {/* User Info Card */}
      <div
        className="w-full max-w-sm p-6 rounded-3xl mb-6"
        style={{ backgroundColor: 'white', border: `2px solid ${roleColors.border}` }}
      >
        <div className="flex items-center gap-4 mb-4">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg"
            style={{ backgroundColor: roleColors.bg, color: roleColors.text }}
          >
            {user?.nama?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'U'}
          </div>
          <div>
            <h3 className="font-semibold" style={{ color: '#0b1c30' }}>{user?.nama}</h3>
            <span
              className="inline-block px-2 py-0.5 rounded text-xs font-medium mt-1"
              style={{ backgroundColor: roleColors.bg, color: roleColors.text }}
            >
              {user?.role}
            </span>
          </div>
        </div>
        <p className="text-sm" style={{ color: '#464652' }}>
          {user?.role === 'Admin'
            ? 'Pilih cabang yang akan dikelola'
            : 'Pilih cabang untuk tugas Anda'}
        </p>
      </div>

      {/* Branch Selection */}
      <div
        className="w-full max-w-sm p-6 rounded-3xl"
        style={{ backgroundColor: 'white' }}
      >
        <label className="block text-sm font-medium mb-3" style={{ color: '#0b1c30' }}>
          Pilih Branch/Cabang
        </label>

        {branches.length > 0 ? (
          <select
            value={selectedBranch}
            onChange={(e) => setSelectedBranch(e.target.value)}
            className="w-full px-4 py-3 rounded-xl text-base outline-none cursor-pointer"
            style={{
              backgroundColor: '#f8f9ff',
              border: '1.5px solid #e5e4ed',
              color: '#0b1c30',
            }}
          >
            <option value="">-- Pilih Branch --</option>
            {branches.map((branch) => (
              <option key={branch.id} value={branch.id}>
                {branch.nama} {branch.wilayah ? `(${branch.wilayah})` : ''}
              </option>
            ))}
          </select>
        ) : (
          <p className="text-sm" style={{ color: '#ef4444' }}>Tidak ada branch tersedia</p>
        )}

        <button
          onClick={handleContinue}
          disabled={!selectedBranch}
          className="w-full mt-6 py-3 rounded-xl font-semibold text-white transition-all disabled:opacity-50"
          style={{ backgroundColor: selectedBranch ? '#15157d' : '#9ca3af' }}
        >
          Lanjutkan
        </button>
      </div>

      {/* Logout */}
      <button
        onClick={onLogout}
        className="mt-6 text-sm flex items-center gap-2"
        style={{ color: '#64748b' }}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Login dengan akun lain
      </button>
    </div>
  );
}

export default BranchSelection;
