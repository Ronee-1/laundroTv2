// ==========================================
// SIDEBAR NAVIGATION - FR-LOG-02 Integration
// 'incoming-orders' menu for Admin Branch
// Shows orders allocated from WhatsApp Hub
// ==========================================
import type { Page, UserRole } from '../App.tsx';

interface SidebarProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  userRole: UserRole;
}

const NAV_ITEMS: { key: Page; label: string; roles: UserRole[]; icon: React.ReactNode }[] = [
  {
    key: 'dashboard',
    label: 'Dashboard',
    roles: ['Owner', 'Admin Cabang'],
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
  {
    key: 'whatsapp-hub',
    label: 'WhatsApp Hub',
    roles: ['Owner'],
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    ),
  },
  {
    key: 'expense',
    label: 'Pengeluaran',
    roles: ['Owner'],
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2-3 .895-3 2-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    key: 'inventaris',
    label: 'Inventaris',
    roles: ['Owner', 'Admin Cabang'],
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    ),
  },
  {
    key: 'audit',
    label: 'Audit Kas',
    roles: ['Owner', 'Admin Cabang'],
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
  },
  {
    key: 'tugas',
    label: 'Tugas Kurir',
    roles: ['Kurir Logistik'],
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
    ),
  },
  {
    key: 'kurir',
    label: 'Dashboard Kurir',
    roles: ['Kurir Logistik'],
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
      </svg>
    ),
  },
  {
    key: 'input-pelanggan',
    label: 'Input Pelanggan',
    roles: ['Admin Cabang'],
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
      </svg>
    ),
  },
  {
    key: 'incoming-orders',
    label: 'Pesanan Masuk',
    roles: ['Admin Cabang'],
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
  },
];

export function Sidebar({ currentPage, onNavigate, userRole }: SidebarProps) {
  const visibleItems = NAV_ITEMS.filter((item) => item.roles.includes(userRole));

  return (
    <aside className="fixed left-0 top-[65px] h-[calc(100vh-65px)] w-60 bg-white border-r border-slate-200 flex flex-col z-30">
      <nav className="flex-1 p-4 space-y-1">
        <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-4 px-3">Menu</div>
        {visibleItems.map((item) => {
          const isActive = currentPage === item.key;
          return (
            <button
              key={item.key}
              onClick={() => onNavigate(item.key)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-deep-blue text-white'
                  : 'text-slate-500 hover:bg-base-bg hover:text-navy'
              }`}
            >
              <span className={isActive ? 'text-white' : 'text-slate-400'}>
                {item.icon}
              </span>
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* System Info Footer */}
      <div className="p-4 border-t border-slate-200">
        <div className="bg-base-bg p-4 rounded-2xl">
          <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-3">Info Sistem</div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-500">Cabang</span>
              <span className="font-semibold text-navy">5</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Arsitektur</span>
              <span className="font-semibold text-navy">Hub-Spoke</span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
