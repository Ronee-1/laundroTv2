import { useState } from 'react';
import { TugasHarian } from './components/TugasHarian.tsx';
import { DashboardEksekutif } from './components/DashboardEksekutif.tsx';

type Page = 'tugas' | 'dashboard';

function App() {
  const [page, setPage] = useState<Page>('tugas');

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <header className="mb-8">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6 shadow-lg">
            <h1 className="text-3xl font-bold text-white mb-1">LaundroT</h1>
            <p className="text-blue-100 text-sm">Aplikasi Kurir Cabang</p>
          </div>
        </header>

        <nav className="flex gap-2 mb-8 bg-white rounded-lg border border-gray-200 p-1.5 shadow-sm">
          <button
            onClick={() => setPage('tugas')}
            className={`flex-1 px-4 py-2.5 rounded-md font-semibold text-sm transition-all ${
              page === 'tugas'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <span className="flex items-center justify-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
              Tugas Harian
            </span>
          </button>
          <button
            onClick={() => setPage('dashboard')}
            className={`flex-1 px-4 py-2.5 rounded-md font-semibold text-sm transition-all ${
              page === 'dashboard'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <span className="flex items-center justify-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
              Dashboard Eksekutif
            </span>
          </button>
        </nav>

        <main>
          {page === 'tugas' && <TugasHarian idKurir="KUR-001" />}
          {page === 'dashboard' && <DashboardEksekutif />}
        </main>
      </div>
    </div>
  );
}

export default App;
