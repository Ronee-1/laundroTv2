import { TugasHarian } from './components/TugasHarian.tsx';

function App() {
  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', maxWidth: 600, margin: '0 auto', padding: 16 }}>
      <header style={{ borderBottom: '2px solid #1a73e8', paddingBottom: 8, marginBottom: 16 }}>
        <h1 style={{ margin: 0, color: '#1a73e8' }}>LaundroT</h1>
        <p style={{ margin: '4px 0 0', color: '#666', fontSize: 14 }}>Aplikasi Kurir Cabang</p>
      </header>
      <TugasHarian idKurir="KUR-001" />
    </div>
  );
}

export default App;
