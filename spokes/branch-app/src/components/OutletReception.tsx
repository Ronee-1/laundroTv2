// ==========================================
// PENERIMAAN & INPUT LAYANAN OUTLET - FR-SERVICE-01
// Halaman untuk Admin Outlet memproses pakaian yang dikembalikan kurir
// Dengan kalkulasi otomatis harga dari database tarif
// Dengan pilihan metode pembayaran Tunai / Non-Tunai
// ==========================================

import { useState, useEffect, useMemo } from 'react';
import type { UserRole } from '../App.tsx';
import { useAuth } from '../contexts/AuthContext.tsx';

// Payment method types
export type PaymentMethod = 'Tunai' | 'Non-Tunai';

// Service tariff interface (matches backend)
interface ServiceTariff {
  id_layanan: string;
  nama_layanan: string;
  kategori: 'kiloan' | 'satuan' | 'bedcover';
  satuan: 'kg' | 'pcs';
  harga_per_satuan: number;
  estimasi_hari: number;
}

// Customer interface (matches backend)
interface Customer {
  id_pelanggan: string;
  id_cabang: string;
  nama: string;
  whatsapp: string;
  alamat_maps: string;
  google_maps_url?: string;
  created_at: string;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface Props {
  selectedAdminBranch: string;
  userRole?: UserRole;
  triggerNotification: (msg: string, type?: 'success' | 'error' | 'warning') => void;
}

function formatIDR(num: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(num);
}

// Mock services for demo - will be fetched from API
const MOCK_SERVICES: ServiceTariff[] = [
  { id_layanan: 'SRV-001', nama_layanan: 'Cuci Kering Setrika Reguler', kategori: 'kiloan', satuan: 'kg', harga_per_satuan: 8000, estimasi_hari: 2 },
  { id_layanan: 'SRV-002', nama_layanan: 'Cuci Kering Setrika Ekspres', kategori: 'kiloan', satuan: 'kg', harga_per_satuan: 12000, estimasi_hari: 1 },
  { id_layanan: 'SRV-003', nama_layanan: 'Bedcover Reguler', kategori: 'bedcover', satuan: 'pcs', harga_per_satuan: 25000, estimasi_hari: 3 },
  { id_layanan: 'SRV-004', nama_layanan: 'Bedcover Ekspres', kategori: 'bedcover', satuan: 'pcs', harga_per_satuan: 35000, estimasi_hari: 1 },
  { id_layanan: 'SRV-005', nama_layanan: 'Setrika Only', kategori: 'satuan', satuan: 'kg', harga_per_satuan: 4000, estimasi_hari: 1 },
  { id_layanan: 'SRV-006', nama_layanan: 'Cuci Only', kategori: 'satuan', satuan: 'kg', harga_per_satuan: 5000, estimasi_hari: 1 },
];

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function OutletReception({ selectedAdminBranch, userRole: _userRole, triggerNotification }: Props) {
  const { getToken } = useAuth();
  const [services, setServices] = useState<ServiceTariff[]>(MOCK_SERVICES);
  const [customers, setCustomers] = useState<Customer[]>([]);

  // Form state
  const [selectedCustomer, setSelectedCustomer] = useState<string>('');
  const [selectedService, setSelectedService] = useState<string>('');
  const [quantity, setQuantity] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Tunai');
  const [submitting, setSubmitting] = useState(false);

  // Calculate total price automatically
  const selectedServiceData = useMemo(() => {
    return services.find((s) => s.id_layanan === selectedService);
  }, [services, selectedService]);

  const totalHarga = useMemo(() => {
    if (!selectedServiceData || !quantity) return 0;
    const qty = parseFloat(quantity);
    if (isNaN(qty) || qty <= 0) return 0;
    return qty * selectedServiceData.harga_per_satuan;
  }, [selectedServiceData, quantity]);

  const isFormValid = selectedCustomer && selectedService && quantity && parseFloat(quantity) > 0;

  useEffect(() => {
    async function fetchServices() {
      try {
        const token = getToken();
        const headers: Record<string, string> = {};
        if (token) headers['Authorization'] = `Bearer ${token}`;

        const res = await fetch('/api/services/tariffs', { headers });
        if (res.ok) {
          const json = await res.json();
          if (json.success && json.services) {
            setServices(json.services);
          }
        }
      } catch {
        // Use mock data
      }
    }
    fetchServices();
  }, [getToken]);

  // Fetch customers from API when branch changes
  useEffect(() => {
    async function fetchCustomers() {
      try {
        const token = getToken();
        const headers: Record<string, string> = {};
        if (token) headers['Authorization'] = `Bearer ${token}`;

        const res = await fetch(`/api/branches/${selectedAdminBranch}/customers`, { headers });
        if (res.ok) {
          const json = await res.json();
          if (json.success && json.customers) {
            setCustomers(json.customers);
          }
        }
      } catch {
        // No customers found
      }
    }
    fetchCustomers();
  }, [selectedAdminBranch, getToken]);

  // Reset quantity when service changes
  useEffect(() => {
    setQuantity('');
  }, [selectedService]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // Additional validation before submission
    if (!selectedCustomer) {
      triggerNotification('Pilih pelanggan terlebih dahulu', 'warning');
      return;
    }
    if (!selectedService) {
      triggerNotification('Pilih layanan terlebih dahulu', 'warning');
      return;
    }
    if (!quantity || parseFloat(quantity) <= 0) {
      triggerNotification('Masukkan berat/jumlah yang valid', 'warning');
      return;
    }

    const qty = parseFloat(quantity);
    const customer = customers.find((c) => c.id_pelanggan === selectedCustomer);

    // Validate service exists
    const selectedSvc = services.find((s) => s.id_layanan === selectedService);
    if (!selectedSvc) {
      triggerNotification('Layanan tidak valid. Silakan pilih layanan kembali.', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const token = getToken();
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const res = await fetch(`/api/branches/${selectedAdminBranch}/orders`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          id_pelanggan: selectedCustomer.trim(),
          customer_name: customer?.nama?.trim() ?? 'Unknown',
          customer_whatsapp: customer?.whatsapp?.trim() ?? '',
          id_layanan: selectedService.trim(),
          service_name: selectedSvc.nama_layanan,
          qty: qty,
          satuan: selectedSvc.satuan,
          berat_kg: selectedSvc.satuan === 'kg' ? qty : 0,
          total_harga: totalHarga,
          status: 'Pending',
          metode_pembayaran: paymentMethod,
        }),
      });

      const json = await res.json();

      if (res.ok && json.success) {
        triggerNotification(
          `Order berhasil dicatat! Total: ${formatIDR(totalHarga)} (${paymentMethod}) - ${qty} ${selectedSvc.satuan} × ${formatIDR(selectedSvc.harga_per_satuan)}`,
          'success'
        );
        // Reset form
        setSelectedCustomer('');
        setSelectedService('');
        setQuantity('');
        setPaymentMethod('Tunai');
      } else {
        triggerNotification(json.error ?? 'Gagal menyimpan order', 'error');
      }
    } catch (err) {
      console.error('[OutletReception] Submit error:', err);
      triggerNotification('Tidak dapat terhubung ke server. Pastikan koneksi internet stabil.', 'error');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-navy">Penerimaan & Input Layanan Outlet</h1>
        <p className="text-sm text-slate-500 mt-1">
          Proses penerimaan laundry dari kurir dengan kalkulasi otomatis dari tarif layanan
        </p>
      </div>

      {/* Info Banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <span className="text-xl">ℹ️</span>
          <div>
            <p className="text-sm font-semibold text-blue-800">Kalkulasi Otomatis</p>
            <p className="text-xs text-blue-700 mt-1">
              Harga dihitung otomatis berdasarkan berat/jumlah × tarif layanan yang dipilih.
              Kolom harga manual telah dihilangkan untuk mencegah kesalahan input.
            </p>
          </div>
        </div>
      </div>

      {/* Reception Form */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Pilih Pelanggan */}
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-2">
              Pilih Pelanggan
            </label>
            {customers.length > 0 ? (
              <select
                value={selectedCustomer}
                onChange={(e) => setSelectedCustomer(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm text-navy focus:outline-none focus:border-deep-blue transition-all"
                required
              >
                <option value="">-- Pilih Pelanggan --</option>
                {customers.map((c) => (
                  <option key={c.id_pelanggan} value={c.id_pelanggan}>
                    {c.nama} ({c.whatsapp})
                  </option>
                ))}
              </select>
            ) : (
              <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
                <p className="text-sm text-amber-700">
                  ⚠️ Belum ada pelanggan terdaftar. Daftarkan pelanggan terlebih dahulu melalui menu "Input Pelanggan".
                </p>
              </div>
            )}
          </div>

          {/* Pilih Layanan */}
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-2">
              Pilih Paket Layanan
            </label>
            <select
              value={selectedService}
              onChange={(e) => setSelectedService(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm text-navy focus:outline-none focus:border-deep-blue transition-all"
              required
            >
              <option value="">-- Pilih Layanan --</option>
              {services.map((s) => (
                <option key={s.id_layanan} value={s.id_layanan}>
                  {s.nama_layanan} ({s.estimasi_hari} Hari) - Rp{s.harga_per_satuan.toLocaleString('id-ID')} / {s.satuan}
                </option>
              ))}
            </select>
          </div>

          {/* Berat/Jumlah */}
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-2">
              Berat/Jumlah ({selectedServiceData?.satuan === 'kg' ? 'Kg' : 'Pcs'})
            </label>
            <div className="relative">
              <input
                type="number"
                step={selectedServiceData?.satuan === 'kg' ? '0.5' : '1'}
                min="0"
                placeholder={selectedServiceData?.satuan === 'kg' ? 'Contoh: 2.5' : 'Contoh: 3'}
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 pr-12 text-sm text-navy focus:outline-none focus:border-deep-blue transition-all"
                required
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-slate-400">
                {selectedServiceData?.satuan === 'kg' ? 'Kg' : 'Pcs'}
              </span>
            </div>
          </div>

          {/* Metode Pembayaran */}
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-2">
              Metode Pembayaran
            </label>
            <div className="grid grid-cols-2 gap-3">
              {/* Tunai */}
              <button
                type="button"
                onClick={() => setPaymentMethod('Tunai')}
                className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl border-2 transition-all ${
                  paymentMethod === 'Tunai'
                    ? 'border-deep-blue bg-blue-50 text-deep-blue'
                    : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span className="font-medium text-sm">Tunai</span>
              </button>

              {/* Non-Tunai */}
              <button
                type="button"
                onClick={() => setPaymentMethod('Non-Tunai')}
                className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl border-2 transition-all ${
                  paymentMethod === 'Non-Tunai'
                    ? 'border-deep-blue bg-blue-50 text-deep-blue'
                    : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
                <span className="font-medium text-sm">Non-Tunai</span>
              </button>
            </div>
            <p className="text-xs text-slate-400 mt-2">
              {paymentMethod === 'Tunai'
                ? '💵 Pembayaran langsung di outlet (kas masuk hari ini)'
                : '💳 Pembayaran via transfer/e-wallet (proses verifikasi)'}
            </p>
          </div>

          {/* Price Breakdown */}
          {selectedServiceData && quantity && (
            <div className="bg-base-bg rounded-xl p-4 border border-slate-100">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Rincian Harga</p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-600">Tarif Layanan</span>
                  <span className="font-medium text-navy">
                    {formatIDR(selectedServiceData.harga_per_satuan)} / {selectedServiceData.satuan}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Qty/ Berat</span>
                  <span className="font-medium text-navy">
                    {quantity} {selectedServiceData.satuan}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Metode Bayar</span>
                  <span className={`font-medium px-2 py-0.5 rounded-full text-xs ${
                    paymentMethod === 'Tunai'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-purple-100 text-purple-700'
                  }`}>
                    {paymentMethod === 'Tunai' ? '💵 Tunai' : '💳 Non-Tunai'}
                  </span>
                </div>
                <div className="border-t border-slate-200 pt-2 mt-2 flex justify-between">
                  <span className="font-semibold text-navy">TOTAL</span>
                  <span className="font-bold text-deep-blue text-lg">
                    {formatIDR(totalHarga)}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!isFormValid || submitting}
            className="w-full bg-deep-blue hover:bg-navy text-white font-medium text-sm py-3 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? 'Menyimpan...' : '💾 Simpan Order'}
          </button>
        </form>
      </div>

      {/* Service Reference */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6">
        <h3 className="text-base font-semibold text-navy mb-4">Daftar Tarif Layanan</h3>
        <div className="space-y-2">
          {services.map((s) => (
            <div key={s.id_layanan} className="flex justify-between items-center py-2 border-b border-slate-100 last:border-0">
              <div>
                <p className="text-sm font-medium text-navy">{s.nama_layanan}</p>
                <p className="text-xs text-slate-400">{s.estimasi_hari} Hari</p>
              </div>
              <span className="text-sm font-bold text-deep-blue">
                {formatIDR(s.harga_per_satuan)}/{s.satuan}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
