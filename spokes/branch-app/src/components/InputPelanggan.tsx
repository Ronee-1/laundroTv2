import { useState } from 'react';

interface Props {
  selectedAdminBranch: string;
  triggerNotification: (msg: string, type?: 'success' | 'error' | 'warning') => void;
}

// ==========================================
// INPUT PELANGGAN - Premium Flat Design
// ==========================================
export function InputPelanggan({ selectedAdminBranch, triggerNotification }: Props) {
  const [nama, setNama] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [alamatMaps, setAlamatMaps] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Strict Google Maps URL validation
  const isValidGoogleMapsUrl = (url: string): boolean => {
    if (!url.trim()) return false;
    return (
      url.includes('google.com/maps') ||
      url.includes('maps.google.com') ||
      url.includes('maps.app.goo.gl') ||
      url.includes('goo.gl/maps')
    );
  };

  const isFormValid = nama.trim() && whatsapp.trim() && isValidGoogleMapsUrl(alamatMaps);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setValidationError(null);

    if (!nama.trim() || !whatsapp.trim() || !alamatMaps.trim()) {
      triggerNotification('Semua kolom wajib diisi!', 'error');
      return;
    }

    if (!isValidGoogleMapsUrl(alamatMaps)) {
      setValidationError('Wajib memasukkan Link Google Maps yang valid');
      triggerNotification('Wajib memasukkan Link Google Maps', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`/api/branches/${selectedAdminBranch}/customer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nama: nama.trim(), whatsapp: whatsapp.trim(), alamat_maps: alamatMaps.trim() }),
      });
      const json = await res.json();
      if (res.ok && json.success) {
        triggerNotification(json.message, 'success');
        setNama('');
        setWhatsapp('');
        setAlamatMaps('');
      } else {
        triggerNotification(json.error ?? 'Gagal mendaftarkan.', 'error');
        setValidationError(json.error ?? 'Pendaftaran gagal');
      }
    } catch {
      triggerNotification('Tidak dapat terhubung ke server.', 'error');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-navy tracking-tight">Input Data Pelanggan</h1>
        <p className="text-sm text-slate-500 mt-1">Pendaftaran profil pelanggan baru</p>
      </div>

      {/* Premium Card - Flat Design with Border */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Nama Lengkap */}
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-2">
              Nama Lengkap
            </label>
            <input
              type="text"
              placeholder="Contoh: Budi Santoso"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-2xl px-4 py-3 text-sm text-navy placeholder:text-slate-400 focus:outline-none focus:border-deep-blue transition-all"
            />
          </div>

          {/* Nomor WhatsApp */}
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-2">
              Nomor WhatsApp
            </label>
            <input
              type="tel"
              placeholder="Contoh: 081234567890"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-2xl px-4 py-3 text-sm text-navy placeholder:text-slate-400 focus:outline-none focus:border-deep-blue transition-all"
            />
          </div>

          {/* Link Google Maps - Strict Validation */}
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-2">
              Link Google Maps
            </label>
            <input
              type="text"
              placeholder="https://maps.app.goo.gl/..."
              value={alamatMaps}
              onChange={(e) => {
                setAlamatMaps(e.target.value);
                if (validationError) setValidationError(null);
              }}
              className={`w-full bg-white border rounded-2xl px-4 py-3 text-sm text-navy placeholder:text-slate-400 focus:outline-none transition-all ${
                validationError
                  ? 'border-red-400 focus:border-red-500'
                  : 'border-slate-200 focus:border-deep-blue'
              }`}
            />
            {validationError ? (
              <div className="mt-2 flex items-center gap-2 text-xs text-red-500 font-medium">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                ⚠️ {validationError}
              </div>
            ) : (
              <span className="text-[11px] text-slate-400 block mt-2">
                Salin tautan koordinat dari Google Maps (wajib mengandung google.com/maps atau maps.app.goo.gl)
              </span>
            )}
          </div>

          {/* Submit Button - Premium Deep Blue */}
          <button
            type="submit"
            disabled={submitting || !isFormValid}
            className={`w-full font-medium text-sm py-3 rounded-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
              isFormValid
                ? 'bg-deep-blue text-white hover:bg-navy'
                : 'bg-slate-100 text-slate-400'
            }`}
          >
            {submitting ? 'Menyimpan...' : 'Simpan Data Pelanggan'}
          </button>
        </form>
      </div>

      {/* Helper Card */}
      <div className="bg-teal-50 border border-teal-200 rounded-2xl p-4">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 bg-teal rounded-xl flex items-center justify-center flex-shrink-0">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h4 className="text-xs font-semibold text-teal">Tips Pendaftaran</h4>
            <p className="text-xs text-slate-600 mt-1">
              Untuk mendapatkan link Google Maps, buka aplikasi Google Maps, cari lokasi pelanggan, lalu pilih "Bagikan" dan salin tautan.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
