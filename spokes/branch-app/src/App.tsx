import { useState, useCallback } from 'react';
import { Sidebar } from './components/Sidebar.tsx';
import { TugasHarian } from './components/TugasHarian.tsx';
import { DashboardEksekutif } from './components/DashboardEksekutif.tsx';
import { ExpenseForm } from './components/ExpenseForm.tsx';
import { AuditRekonsiliasi } from './components/AuditRekonsiliasi.tsx';
import { InventarisPemantau } from './components/InventarisPemantau.tsx';
import { DashboardKurir } from './components/DashboardKurir.tsx';

export type Page = 'tugas' | 'dashboard' | 'expense' | 'audit' | 'inventaris' | 'kurir';
export type UserRole = 'Owner' | 'Admin Cabang' | 'Kurir Logistik';

export interface Notification {
  message: string;
  type: 'success' | 'error' | 'warning';
}

function App() {
  const [page, setPage] = useState<Page>('dashboard');
  const [userRole, setUserRole] = useState<UserRole>('Owner');
  const [selectedAdminBranch, setSelectedAdminBranch] = useState('CBG-002');
  const [notification, setNotification] = useState<Notification | null>(null);

  const triggerNotification = useCallback((message: string, type: 'success' | 'error' | 'warning' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  }, []);

  return (
    <div className="min-h-screen bg-[#F1F5F9] text-[#0F172A] font-sans">
      {notification && (
        <div
          className={`fixed top-6 right-6 z-50 max-w-md p-5 rounded-2xl shadow-elevated flex items-start gap-3 border transition-all duration-300 ${
            notification.type === 'success'
              ? 'bg-[#ECFDF5] border-[#047857]/20 text-[#047857]'
              : notification.type === 'error'
                ? 'bg-[#FFF1F2] border-[#BE123C]/20 text-[#BE123C]'
                : 'bg-[#FFFBEB] border-[#B45309]/20 text-[#B45309]'
          }`}
        >
          <div className="mt-0.5 flex-shrink-0">
            {notification.type === 'success' && (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
            {notification.type === 'error' && (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            )}
            {notification.type === 'warning' && (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-sm">Sistem Notifikasi</h4>
            <p className="text-xs mt-1 leading-relaxed">{notification.message}</p>
          </div>
          <button onClick={() => setNotification(null)} className="text-current opacity-60 hover:opacity-100 flex-shrink-0 transition-opacity">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      <header className="bg-white border-b border-slate-200 px-8 py-5 flex flex-wrap justify-between items-center gap-4 sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <div className="bg-[#0F172A] text-white px-4 py-2 rounded-xl font-bold tracking-tight text-base flex items-center gap-2.5">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 100-6 3 3 0 000 6z" />
            </svg>
            LaundroT
          </div>
          <span className="text-xs bg-slate-100 text-slate-600 px-3 py-1.5 rounded-full font-medium">
            v2.0
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-3 bg-slate-50 p-1.5 rounded-xl border border-slate-200">
          <div className="text-xs font-medium px-3 text-slate-500 flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500"></span>
            Role:
          </div>
          <button
            onClick={() => {
              setUserRole('Owner');
              triggerNotification('Beralih ke mode Owner. Akses penuh seluruh cabang.', 'success');
            }}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all duration-300 ${
              userRole === 'Owner'
                ? 'bg-[#0F172A] text-white shadow-soft'
                : 'text-slate-600 hover:bg-white hover:shadow-soft'
            }`}
          >
            Owner
          </button>
          <button
            onClick={() => {
              setUserRole('Admin Cabang');
              triggerNotification('Mode Admin Cabang. Akses terbatas cabang Anda.', 'success');
            }}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all duration-300 ${
              userRole === 'Admin Cabang'
                ? 'bg-[#0F172A] text-white shadow-soft'
                : 'text-slate-600 hover:bg-white hover:shadow-soft'
            }`}
          >
            Admin Cabang
          </button>
          <button
            onClick={() => {
              setUserRole('Kurir Logistik');
              setPage('kurir');
              triggerNotification('Mode Kurir Logistik. Akses dashboard pengiriman.', 'success');
            }}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all duration-300 ${
              userRole === 'Kurir Logistik'
                ? 'bg-[#0F172A] text-white shadow-soft'
                : 'text-slate-600 hover:bg-white hover:shadow-soft'
            }`}
          >
            Kurir Logistik
          </button>

          {userRole === 'Admin Cabang' && (
            <div className="flex items-center gap-2 border-l border-slate-300 pl-3 ml-1">
              <span className="text-xs text-slate-500">Cabang:</span>
              <select
                value={selectedAdminBranch}
                onChange={(e) => {
                  setSelectedAdminBranch(e.target.value);
                  triggerNotification('Cabang aktif diubah.', 'success');
                }}
                className="bg-white border border-slate-200 text-xs font-semibold rounded-lg px-3 py-1.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/30"
              >
                <option value="CBG-001">Depok (Pusat)</option>
                <option value="CBG-002">Jakarta Selatan</option>
                <option value="CBG-003">Bekasi Timur</option>
                <option value="CBG-004">Tangerang Kota</option>
                <option value="CBG-005">Bogor Raya</option>
              </select>
            </div>
          )}
        </div>
      </header>

      <div className="flex">
        <Sidebar currentPage={page} onNavigate={setPage} />

        <main className="flex-1 ml-64 p-8 min-h-[calc(100vh-80px)]">
          {page === 'tugas' && <TugasHarian idKurir="KUR-001" />}
          {page === 'dashboard' && (
            <DashboardEksekutif
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
        </main>
      </div>
    </div>
  );
}

export default App;
