/**
 * LoginPage Component
 * Login with role selection (Owner, Admin, Kurir)
 * Admin/Kurir must select their branch before login
 */

import { useState, type FormEvent } from 'react';
import { useAuth } from '../contexts/AuthContext';

// Role configuration
const ROLES = [
  {
    id: 'Owner',
    title: 'Pemilik Bisnis',
    description: 'Akses penuh dashboard, keuangan multi-cabang, logistik & audit terpusat',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    color: { bg: '#fef3c7', icon: '#d97706', border: '#fcd34d' },
  },
  {
    id: 'Admin',
    title: 'Admin Branch',
    description: 'Kelola stok, audit kas blind-input, verifikasi logistik & input pelanggan',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
    color: { bg: '#dbeafe', icon: '#2563eb', border: '#93c5fd' },
  },
  {
    id: 'Kurir',
    title: 'Kurir Logistik',
    description: 'Tugas antar-jemput pelanggan & pengiriman operasional antar cabang',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
      </svg>
    ),
    color: { bg: '#d1fae5', icon: '#059669', border: '#6ee7b7' },
  },
];

// Available branches
const BRANCHES = [
  { id: 'CBG-001', nama: 'Cabang Depok (Pusat)', wilayah: 'Depok' },
  { id: 'CBG-002', nama: 'Cabang Jakarta Selatan', wilayah: 'DKI Jakarta' },
  { id: 'CBG-003', nama: 'Cabang Bekasi Timur', wilayah: 'Bekasi' },
  { id: 'CBG-004', nama: 'Cabang Tangerang Kota', wilayah: 'Tangerang' },
  { id: 'CBG-005', nama: 'Cabang Bogor Raya', wilayah: 'Bogor' },
];

interface LoginPageProps {
  onSuccess: () => void;
}

export function LoginPage({ onSuccess }: LoginPageProps) {
  const { login, isLoading } = useAuth();
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [selectedBranch, setSelectedBranch] = useState<string>('CBG-001');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Demo credentials based on role
  const getDemoCredentials = (role: string) => {
    switch (role) {
      case 'Owner':
        return { email: 'budi@gmail.com', password: 'haihh' };
      case 'Admin':
        return { email: 'admin@laundrot.com', password: 'haihh' };
      case 'Kurir':
        return { email: 'kurir@laundrot.com', password: 'haihh' };
      default:
        return { email: '', password: '' };
    }
  };

  const handleRoleSelect = (roleId: string) => {
    setSelectedRole(roleId);
    setError('');
    // Set default branch based on role
    if (roleId === 'Kurir') {
      setSelectedBranch('CBG-002'); // Kurir defaults to Jakarta Selatan
    } else {
      setSelectedBranch('CBG-001'); // Admin defaults to Pusat
    }
    const creds = getDemoCredentials(roleId);
    setEmail(creds.email);
    setPassword(creds.password);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Email dan password harus diisi');
      return;
    }

    // For Admin/Kurir, save selected branch to sessionStorage
    if (selectedRole !== 'Owner') {
      sessionStorage.setItem('selected_branch', selectedBranch);
    }

    const result = await login(email, password);

    if (result.success) {
      onSuccess();
    } else {
      setError(result.error || 'Login gagal');
    }
  };

  const handleBack = () => {
    setSelectedRole(null);
    setEmail('');
    setPassword('');
    setError('');
  };

  // Role Selection Screen
  if (!selectedRole) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6" style={{ backgroundColor: '#f8f9ff' }}>
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6" style={{ backgroundColor: '#15157d' }}>
            <svg className="w-8 h-8" style={{ color: '#14b8a6' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold tracking-tight" style={{ color: '#15157d' }}>LaundroTruck</h1>
          <p className="text-sm mt-2" style={{ color: '#464652' }}>Pilih peran Anda untuk masuk</p>
        </div>

        {/* Role Selection Cards */}
        <div className="w-full max-w-md space-y-4">
          {ROLES.map((role) => (
            <button
              key={role.id}
              onClick={() => handleRoleSelect(role.id)}
              className="w-full flex items-center gap-4 p-5 rounded-2xl transition-all duration-200 text-left group hover:scale-[1.02]"
              style={{
                backgroundColor: 'white',
                border: `2px solid ${role.color.border}`,
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = role.color.bg}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
            >
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center transition-all"
                style={{ backgroundColor: role.color.bg, color: role.color.icon }}
              >
                {role.icon}
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold" style={{ color: '#0b1c30' }}>{role.title}</h3>
                <p className="text-sm mt-1" style={{ color: '#464652' }}>{role.description}</p>
              </div>
              <svg className="w-6 h-6 transition-transform group-hover:translate-x-1" style={{ color: '#777683' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          ))}
        </div>

        {/* Footer */}
        <p className="text-xs mt-12" style={{ color: '#777683' }}>Laundro Truck v2.0 — Hub-and-Spoke Architecture</p>
      </div>
    );
  }

  // Login Form Screen
  const selectedRoleData = ROLES.find((r) => r.id === selectedRole);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6" style={{ backgroundColor: '#f8f9ff' }}>
      {/* Back Button */}
      <button
        onClick={handleBack}
        className="absolute top-6 left-6 flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-xl transition-all"
        style={{ color: '#464652', backgroundColor: 'white', border: '1px solid #e5e4ed' }}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Kembali
      </button>

      {/* Logo */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-4" style={{ backgroundColor: '#15157d' }}>
          <svg className="w-7 h-7" style={{ color: '#14b8a6' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold tracking-tight" style={{ color: '#15157d' }}>LaundroTruck</h1>
        <p className="text-sm mt-2" style={{ color: '#464652' }}>Masuk sebagai {selectedRoleData?.title}</p>
      </div>

      {/* Login Form Card */}
      <div
        className="w-full max-w-sm p-6 rounded-3xl shadow-lg"
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(16px)',
        }}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Role Badge */}
          <div
            className="flex items-center gap-3 p-3 rounded-xl"
            style={{ backgroundColor: selectedRoleData?.color.bg, border: `1px solid ${selectedRoleData?.color.border}` }}
          >
            <div style={{ color: selectedRoleData?.color.icon }}>
              {selectedRoleData?.icon}
            </div>
            <span className="font-medium text-sm" style={{ color: selectedRoleData?.color.icon }}>
              {selectedRoleData?.title}
            </span>
          </div>

          {/* Branch Selection - Only for Admin and Kurir */}
          {selectedRole !== 'Owner' && (
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#0b1c30' }}>
                📍 Pilih Branch Kerja
              </label>
              <div className="relative">
                <select
                  value={selectedBranch}
                  onChange={(e) => setSelectedBranch(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl text-base transition-all outline-none appearance-none cursor-pointer"
                  style={{
                    backgroundColor: '#f8f9ff',
                    border: '1.5px solid #e5e4ed',
                    color: '#0b1c30',
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#15157d'}
                  onBlur={(e) => e.target.style.borderColor = '#e5e4ed'}
                >
                  {BRANCHES.map((branch) => (
                    <option key={branch.id} value={branch.id}>
                      {branch.id} - {branch.nama}
                    </option>
                  ))}
                </select>
                {/* Dropdown Arrow */}
                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                  <svg className="w-5 h-5" style={{ color: '#777683' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
              <p className="mt-2 text-xs" style={{ color: '#777683' }}>
                Anda akan bekerja di branch yang dipilih. Branch dapat diubah nanti dari dashboard.
              </p>
            </div>
          )}

          {/* Email Field */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#0b1c30' }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nama@email.com"
              className="w-full px-4 py-3 rounded-xl text-base transition-all outline-none"
              style={{
                backgroundColor: '#f8f9ff',
                border: '1.5px solid #e5e4ed',
                color: '#0b1c30',
              }}
              onFocus={(e) => e.target.style.borderColor = '#15157d'}
              onBlur={(e) => e.target.style.borderColor = '#e5e4ed'}
            />
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#0b1c30' }}>
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 pr-12 rounded-xl text-base transition-all outline-none"
                style={{
                  backgroundColor: '#f8f9ff',
                  border: '1.5px solid #e5e4ed',
                  color: '#0b1c30',
                }}
                onFocus={(e) => e.target.style.borderColor = '#15157d'}
                onBlur={(e) => e.target.style.borderColor = '#e5e4ed'}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center"
              >
                <svg className="w-5 h-5" style={{ color: '#777683' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {showPassword ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  )}
                </svg>
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div
              className="p-4 rounded-xl flex items-center gap-3 text-sm"
              style={{
                backgroundColor: '#fef2f2',
                border: '1px solid #fecaca',
                color: '#b91c1c'
              }}
            >
              <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {error}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 rounded-xl text-base font-semibold text-white transition-all flex items-center justify-center gap-2 disabled:opacity-60"
            style={{ backgroundColor: '#15157d' }}
            onMouseEnter={(e) => !isLoading && (e.currentTarget.style.backgroundColor = '#0f1259')}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#15157d'}
          >
            {isLoading ? (
              <>
                <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Masuk...
              </>
            ) : (
              <>
                Masuk sebagai {selectedRoleData?.title}
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </>
            )}
          </button>
        </form>

        {/* Demo Credentials Info */}
        <div
          className="mt-6 p-4 rounded-xl text-sm"
          style={{ backgroundColor: '#eff4ff', border: '1px solid #c7c5d4' }}
        >
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#0056c6' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p className="font-medium" style={{ color: '#0056c6' }}>Demo Login</p>
              <p style={{ color: '#464652' }}>
                <strong>Email:</strong> {email}<br />
                <strong>Password:</strong> {password}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <p className="text-xs mt-8" style={{ color: '#777683' }}>
        Laundro Truck v2.0 — Hub-and-Spoke Architecture
      </p>
    </div>
  );
}

export default LoginPage;
