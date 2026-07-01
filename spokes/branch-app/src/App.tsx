import { useState } from 'react';
import { TugasHarian } from './components/TugasHarian.tsx';
import { DashboardEksekutif } from './components/DashboardEksekutif.tsx';

type Page = 'tugas' | 'dashboard';

function App() {
  const [page, setPage] = useState<Page>('tugas');

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', maxWidth: 600, margin: '0 auto', padding: 16 }}>
      <header style={{ borderBottom: '2px solid #1a73e8', paddingBottom: 8, marginBottom: 16 }}>
        <h1 style={{ margin: 0, color: '#1a73e8' }}>LaundroT</h1>
        <p style={{ margin: '4px 0 0', color: '#666', fontSize: 14 }}>Aplikasi Kurir Cabang</p>
      </header>

      <nav style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        <button
          onClick={() => setPage('tugas')}
          style={{
            padding: '8px 16px',
            backgroundColor: page === 'tugas' ? '#1a73e8' : '#f3f4f6',
            color: page === 'tugas' ? '#fff' : '#374151',
            border: 'none',
            borderRadius: 6,
            fontSize: 14,
            fontWeight: 500,
            cursor: 'pointer',
          }}
        >
          Tugas Harian
        </button>
        <button
          onClick={() => setPage('dashboard')}
          style={{
            padding: '8px 16px',
            backgroundColor: page === 'dashboard' ? '#1a73e8' : '#f3f4f6',
            color: page === 'dashboard' ? '#fff' : '#374151',
            border: 'none',
            borderRadius: 6,
            fontSize: 14,
            fontWeight: 500,
            cursor: 'pointer',
          }}
        >
          Dashboard Eksekutif
        </button>
      </nav>

      {page === 'tugas' && <TugasHarian idKurir="KUR-001" />}
      {page === 'dashboard' && <DashboardEksekutif />}
    </div>
  );
}

export default App;
