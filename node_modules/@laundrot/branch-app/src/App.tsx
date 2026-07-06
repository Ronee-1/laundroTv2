import { useState, useCallback } from 'react';
import { Sidebar } from './components/Sidebar.tsx';
import { TugasHarian } from './components/TugasHarian.tsx';
import { DashboardEksekutif } from './components/DashboardEksekutif.tsx';
import { DashboardAdmin } from './components/DashboardAdmin.tsx';
import { ExpenseForm } from './components/ExpenseForm.tsx';
import { AuditRekonsiliasi } from './components/AuditRekonsiliasi.tsx';
import { InventarisPemantau } from './components/InventarisPemantau.tsx';
import { DashboardKurir } from './components/DashboardKurir.tsx';
import { InputPelanggan } from './components/InputPelanggan.tsx';
import { WhatsAppOrderHub } from './components/WhatsAppOrderHub.tsx';
import { IncomingOrders } from './components/IncomingOrders.tsx';
import { CourierAssignment } from './components/CourierAssignment.tsx';
import { OutletReception } from './components/OutletReception.tsx';

// ==========================================
// PAGE TYPES - FR-LOG-02, FR-SERVICE-01 Integration
// 'incoming-orders' = Pesanan masuk dari WhatsApp Hub
// 'admin-dashboard' = Dashboard Admin Branch
// 'courier-assignment' = FR-005: Alokasi & Plot Tugas Kurir
// 'outlet-reception' = FR-SERVICE-01: Input layanan dengan kalkulasi otomatis
// ==========================================
export type Page = 'tugas' | 'dashboard' | 'admin-dashboard' | 'expense' | 'audit' | 'inventaris' | 'kurir' | 'input-pelanggan' | 'whatsapp-hub' | 'incoming-orders' | 'courier-assignment' | 'outlet-reception';
export type UserRole = 'Owner' | 'Admin Cabang' | 'Kurir Logistik';

export interface Notification {
  message: string;
  type: 'success' | 'error' | 'warning';
}

const ROLE_DEFAULT_PAGE: Record<UserRole, Page> = {
  Owner: 'dashboard',
  'Admin Cabang': 'admin-dashboard',
  'Kurir Logistik': 'kurir',
};

// ============================================
// LOGIN PORTAL - Material Design 3
// ============================================
function LoginPortal({ onLogin }: { onLogin: (role: UserRole) => void }) {
  const roles: { role: UserRole; title: string; description: string; icon: React.ReactNode }[] = [
    {
      role: 'Owner',
      title: 'Pemilik Bisnis',
      description: 'Akses penuh dashboard, keuangan multi-cabang, logistik & audit terpusat',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
    },
    {
      role: 'Admin Cabang',
      title: 'Admin Cabang',
      description: 'Kelola stok, audit kas blind-input, verifikasi logistik & input pelanggan',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
    },
    {
      role: 'Kurir Logistik',
      title: 'Kurir Logistik',
      description: 'Tugas antar-jemput pelanggan & pengiriman operasional antar cabang',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
        </svg>
      ),
    },
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6" style={{ backgroundColor: '#f8f9ff' }}>
      {/* Logo & Branding - Material Design 3 */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6" style={{ backgroundColor: '#15157d' }}>
          <svg className="w-8 h-8" style={{ color: '#14b8a6' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold tracking-tight" style={{ color: '#15157d' }}>LaundroTruck</h1>
        <p className="text-sm mt-2" style={{ color: '#464652' }}>Sistem Multi-Cabang — Pilih peran Anda</p>
      </div>

      {/* Role Selection Cards - Material Design 3 */}
      <div className="w-full max-w-md space-y-3">
        {roles.map((item) => (
          <button
            key={item.role}
            onClick={() => onLogin(item.role)}
            className="w-full flex items-center gap-4 p-5 rounded-2xl transition-all duration-200 text-left group hover:scale-[1.02]"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.85)',
              backdropFilter: 'blur(16px)',
              border: '1px solid #c7c5d4'
            }}
          >
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center transition-all"
              style={{ backgroundColor: '#ccfbf1', color: '#0d9488' }}
            >
              {item.icon}
            </div>
            <div className="flex-1">
              <h3 className="text-base font-semibold" style={{ color: '#0b1c30' }}>{item.title}</h3>
              <p className="text-sm mt-0.5" style={{ color: '#464652' }}>{item.description}</p>
            </div>
            <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" style={{ color: '#464652' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        ))}
      </div>

      <p className="text-xs mt-12" style={{ color: '#777683' }}>Laundro Truck v2.0 — Hub-and-Spoke Architecture</p>
    </div>
  );
}

// ============================================
// NOTIFICATION TOAST - Material Design 3
// ============================================
function NotificationToast({ notification, onClose }: { notification: Notification; onClose: () => void }) {
  const getStyles = () => {
    if (notification.type === 'success') return 'toast-success';
    if (notification.type === 'error') return 'toast-error';
    return 'toast-warning';
  };

  return (
    <div className={`toast ${getStyles()}`}>
      <div className="flex-1 text-sm font-medium">{notification.message}</div>
      <button onClick={onClose} className="opacity-60 hover:opacity-100">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}

// ============================================
// MAIN APP - Material Design 3
// ============================================
function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [page, setPage] = useState<Page>('dashboard');
  const [userRole, setUserRole] = useState<UserRole>('Owner');
  const [selectedAdminBranch, setSelectedAdminBranch] = useState('CBG-002');
  const [notification, setNotification] = useState<Notification | null>(null);

  const triggerNotification = useCallback((message: string, type: 'success' | 'error' | 'warning' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  }, []);

  function handleLogin(role: UserRole) {
    setUserRole(role);
    setPage(ROLE_DEFAULT_PAGE[role]);
    setIsLoggedIn(true);
    triggerNotification(`Selamat datang! Anda masuk sebagai ${role}.`, 'success');
  }

  function handleLogout() {
    setIsLoggedIn(false);
    setUserRole('Owner');
    setPage('dashboard');
    triggerNotification('Anda telah keluar.', 'success');
  }

  // Login Screen
  if (!isLoggedIn) {
    return (
      <>
        <LoginPortal onLogin={handleLogin} />
        {notification && (
          <NotificationToast notification={notification} onClose={() => setNotification(null)} />
        )}
      </>
    );
  }

  // Main Application - Material Design 3
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f8f9ff' }}>
      {notification && (
        <NotificationToast notification={notification} onClose={() => setNotification(null)} />
      )}

      {/* Header - Material Design 3 */}
      <header
        className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-6 h-16"
        style={{
          backgroundColor: 'white',
          borderBottom: '1px solid #c7c5d4'
        }}
      >
        <div className="flex items-center gap-4">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#15157d' }}>
            <svg className="w-5 h-5" style={{ color: '#14b8a6' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
            </svg>
          </div>
          <span className="text-lg font-bold" style={{ color: '#0056c6' }}>LaundroT v2.0</span>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl" style={{ backgroundColor: '#eff4ff', border: '1px solid #c7c5d4' }}>
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: '#0056c6' }}></span>
            <span className="text-sm font-medium" style={{ color: '#0b1c30' }}>{userRole}</span>
            {userRole === 'Admin Cabang' && (
              <>
                <span style={{ color: '#c7c5d4' }}>|</span>
                <select
                  value={selectedAdminBranch}
                  onChange={(e) => {
                    setSelectedAdminBranch(e.target.value);
                    triggerNotification('Cabang aktif diubah.', 'success');
                  }}
                  className="bg-transparent text-sm font-medium focus:outline-none cursor-pointer"
                  style={{ color: '#0b1c30' }}
                >
                  <option value="CBG-001">Depok (Pusat)</option>
                  <option value="CBG-002">Jakarta Selatan</option>
                  <option value="CBG-003">Bekasi Timur</option>
                  <option value="CBG-004">Tangerang Kota</option>
                  <option value="CBG-005">Bogor Raya</option>
                </select>
              </>
            )}
          </div>
          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-1.5 text-sm font-medium px-4 py-2 rounded-xl transition-all"
            style={{
              color: '#464652',
              border: '1px solid #c7c5d4'
            }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Keluar
          </button>
        </div>
      </header>

      {/* Content Area */}
      <div className="flex pt-16">
        <Sidebar currentPage={page} onNavigate={setPage} userRole={userRole} />
        <main className="flex-1 lg:ml-[280px] p-6 min-h-[calc(100vh-64px)]">
          {page === 'tugas' && <TugasHarian idKurir="KUR-001" />}
          {page === 'dashboard' && (
            <DashboardEksekutif
              userRole={userRole}
              selectedAdminBranch={selectedAdminBranch}
              triggerNotification={triggerNotification}
            />
          )}
          {page === 'admin-dashboard' && (
            <DashboardAdmin
              userRole={userRole}
              selectedAdminBranch={selectedAdminBranch}
              triggerNotification={triggerNotification}
            />
          )}
          {page === 'expense' && (
            <ExpenseForm
              userRole={userRole}
              selectedAdminBranch={selectedAdminBranch}
              triggerNotification={triggerNotification}
            />
          )}
          {page === 'audit' && (
            <AuditRekonsiliasi
              userRole={userRole}
              selectedAdminBranch={selectedAdminBranch}
              triggerNotification={triggerNotification}
            />
          )}
          {page === 'inventaris' && (
            <InventarisPemantau
              userRole={userRole}
              selectedAdminBranch={selectedAdminBranch}
              triggerNotification={triggerNotification}
            />
          )}
          {page === 'kurir' && (
            <DashboardKurir
              triggerNotification={triggerNotification}
            />
          )}
          {page === 'input-pelanggan' && (
            <InputPelanggan
              selectedAdminBranch={selectedAdminBranch}
              triggerNotification={triggerNotification}
            />
          )}
          {page === 'courier-assignment' && (
            <CourierAssignment
              selectedAdminBranch={selectedAdminBranch}
              onSuccess={(msg) => triggerNotification(msg, 'success')}
              onError={(msg) => triggerNotification(msg, 'error')}
            />
          )}
          {page === 'outlet-reception' && (
            <OutletReception
              selectedAdminBranch={selectedAdminBranch}
              userRole={userRole}
              triggerNotification={triggerNotification}
            />
          )}
          {page === 'whatsapp-hub' && (
            <WhatsAppOrderHub
              userRole={userRole}
              triggerNotification={triggerNotification}
            />
          )}
          {page === 'incoming-orders' && (
            <IncomingOrders
              selectedAdminBranch={selectedAdminBranch}
              triggerNotification={triggerNotification}
            />
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
