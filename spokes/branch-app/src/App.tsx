/**
 * LaundroTruck - Branch Application
 * Main App Component with Authentication Integration
 */

import { useState, useCallback, useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LoginPage } from './components/LoginPage';
import { Sidebar } from './components/Sidebar';
import { TugasHarian } from './components/TugasHarian';
import { DashboardEksekutif } from './components/DashboardEksekutif';
import { DashboardAdmin } from './components/DashboardAdmin';
import { ExpenseForm } from './components/ExpenseForm';
import { AuditRekonsiliasi } from './components/AuditRekonsiliasi';
import { InventarisPemantau } from './components/InventarisPemantau';
import { DashboardKurir } from './components/DashboardKurir';
import { InputPelanggan } from './components/InputPelanggan';
import { WhatsAppOrderHub } from './components/WhatsAppOrderHub';
import { IncomingOrders } from './components/IncomingOrders';
import { CourierAssignment } from './components/CourierAssignment';
import { OutletReception } from './components/OutletReception';
import { UserManagement } from './components/UserManagement';

// ==========================================
// PAGE TYPES - FR-LOG-02, FR-SERVICE-01, RBAC Integration
// 'incoming-orders' = Pesanan masuk dari WhatsApp Hub
// 'admin-dashboard' = Dashboard Admin Branch
// 'courier-assignment' = FR-005: Alokasi & Plot Tugas Kurir
// 'outlet-reception' = FR-SERVICE-01: Input layanan dengan kalkulasi otomatis
// ==========================================
export type Page = 'tugas' | 'dashboard' | 'admin-dashboard' | 'expense' | 'audit' | 'inventaris' | 'kurir' | 'input-pelanggan' | 'whatsapp-hub' | 'incoming-orders' | 'courier-assignment' | 'outlet-reception' | 'user-management';
export type UserRole = 'Owner' | 'Admin' | 'Kurir';

export interface Notification {
  message: string;
  type: 'success' | 'error' | 'warning';
}

const ROLE_DEFAULT_PAGE: Record<UserRole, Page> = {
  Owner: 'dashboard',
  Admin: 'admin-dashboard',
  Kurir: 'kurir',
};

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
// BRANCH SELECTOR COMPONENT
// ============================================
interface BranchSelectorProps {
  selectedBranch: string;
  onBranchChange: (branch: string) => void;
}

function BranchSelector({ selectedBranch, onBranchChange }: BranchSelectorProps) {
  const branches = [
    { id: 'CBG-001', nama: 'Depok (Pusat)' },
    { id: 'CBG-002', nama: 'Jakarta Selatan' },
    { id: 'CBG-003', nama: 'Bekasi Timur' },
    { id: 'CBG-004', nama: 'Tangerang Kota' },
    { id: 'CBG-005', nama: 'Bogor Raya' },
  ];

  return (
    <div className="flex items-center gap-2 px-4 py-2 rounded-xl" style={{ backgroundColor: '#eff4ff', border: '1px solid #c7c5d4' }}>
      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: '#0056c6' }}></span>
      <select
        value={selectedBranch}
        onChange={(e) => onBranchChange(e.target.value)}
        className="bg-transparent text-sm font-medium focus:outline-none cursor-pointer"
        style={{ color: '#0b1c30' }}
      >
        {branches.map((branch) => (
          <option key={branch.id} value={branch.id}>
            {branch.id} - {branch.nama}
          </option>
        ))}
      </select>
    </div>
  );
}

// ============================================
// MAIN APP CONTENT (Authenticated)
// ============================================
function AppContent() {
  const { isAuthenticated, user, logout } = useAuth();
  const [page, setPage] = useState<Page>('dashboard');
  const [selectedAdminBranch, setSelectedAdminBranch] = useState('CBG-002');
  const [notification, setNotification] = useState<Notification | null>(null);

  // Initialize page based on user role
  useEffect(() => {
    if (user) {
      const role = user.role as UserRole;
      setPage(ROLE_DEFAULT_PAGE[role] || 'dashboard');

      // Set default branch based on user's assigned branch
      if (user.id_cabang) {
        setSelectedAdminBranch(user.id_cabang);
      }
    }
  }, [user]);

  const triggerNotification = useCallback((message: string, type: 'success' | 'error' | 'warning' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  }, []);

  // Login Screen
  if (!isAuthenticated) {
    return (
      <>
        <LoginPage onSuccess={() => {}} />
        {notification && (
          <NotificationToast notification={notification} onClose={() => setNotification(null)} />
        )}
      </>
    );
  }

  // Get user role for display
  const userRole = (user?.role as UserRole) || 'Owner';
  const userName = user?.nama || 'User';

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
          {/* Branch Selector - Only for Admin */}
          {userRole === 'Admin' && (
            <BranchSelector
              selectedBranch={selectedAdminBranch}
              onBranchChange={(branch) => {
                setSelectedAdminBranch(branch);
                triggerNotification('Cabang aktif diubah.', 'success');
              }}
            />
          )}

          {/* User Info */}
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl" style={{ backgroundColor: '#eff4ff', border: '1px solid #c7c5d4' }}>
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: '#10b981' }}></span>
            <span className="text-sm font-medium" style={{ color: '#0b1c30' }}>{userName}</span>
            <span style={{ color: '#c7c5d4' }}>|</span>
            <span className="text-sm font-medium" style={{ color: '#464652' }}>{userRole}</span>
          </div>

          <button
            onClick={logout}
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
          {page === 'user-management' && userRole === 'Owner' && (
            <UserManagement
              onNotification={(msg, type) => triggerNotification(msg, type || 'success')}
            />
          )}
        </main>
      </div>
    </div>
  );
}

// ============================================
// APP WRAPPER WITH AUTH PROVIDER
// ============================================
function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
