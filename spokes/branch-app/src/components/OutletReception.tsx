// ==========================================
// PENERIMAAN & INPUT LAYANAN OUTLET - FR-SERVICE-01
// Halaman untuk Admin Outlet memproses pakaian yang dikembalikan kurir
// Dengan kalkulasi otomatis harga dari database tarif
// ==========================================

import { useState, useEffect, useMemo } from 'react';
import type { UserRole } from '../App.tsx';

// Service tariff interface (matches backend)
interface ServiceTariff {
  id_layanan: string;
  nama_layanan: string;
  kategori: 'kiloan' | 'satuan' | 'bedcover';
  satuan: 'kg' | 'pcs';
  harga_per_satuan: number;
  estimasi_hari: number;
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

// Mock customers for dropdown
const MOCK_CUSTOMERS = [
  { id_pelanggan: 'PLG-001', nama: 'Budi Santoso', whatsapp: '081234567890' },
  { id_pelanggan: 'PLG-002', nama: 'Ani Wijaya', whatsapp: '081234567891' },
  { id_pelanggan: 'PLG-003', nama: 'Dedi Kurniawan', whatsapp: '081234567892' },
];

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function OutletReception({ selectedAdminBranch, userRole: _userRole, triggerNotification }: Props) {
  const [services, setServices] = useState<ServiceTariff[]>(MOCK_SERVICES);
  const [loading, setLoading] = useState(true);

  // Form state
  const [selectedCustomer, setSelectedCustomer] = useState<string>('');
  const [selectedService, setSelectedService] = useState<string>('');
  const [quantity, setQuantity] = useState<string>('');
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
        const res = await fetch('/api/services/tariffs');
        if (res.ok) {
          const json = await res.json();
          if (json.success && json.services) {
            setServices(json.services);
          }
        }
      } catch {
        // Use mock data
      } finally {
        setLoading(false);
      }
    }
    fetchServices();
  }, []);

  // Reset quantity when service changes
  useEffect(() => {
    setQuantity('');
  }, [selectedService]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isFormValid) return;

    const qty = parseFloat(quantity);
    const customer = MOCK_CUSTOMERS.find((c) => c.id_pelanggan === selectedCustomer);

    setSubmitting(true);
    try {
      const res = await fetch(`/api/branches/${selectedAdminBranch}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id_pelanggan: selectedCustomer,
          customer_name: customer?.nama ?? 'Unknown',
          customer_whatsapp: customer?.whatsapp ?? '',
          id_layanan: selectedService,
          qty: qty,
          total_harga: totalHarga,
          status: 'Diproses',
        }),
      });

      const json = await res.json();
      if (res.ok && json.success) {
        triggerNotification(
          `Order berhasil dicatat! Total: ${formatIDR(totalHarga)} (${qty} ${selectedServiceData?.satuan} × ${formatIDR(selectedServiceData?.harga_per_satuan ?? 0)})`,
          'success'
        );
        // Reset form
        setSelectedCustomer('');
        setSelectedService('');
        setQuantity('');
      } else {
        triggerNotification(json.error ?? 'Gagal menyimpan order', 'error');
      }
    } catch {
      triggerNotification('Tidak dapat terhubung ke server', 'error');
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-10 h-10 border-2 border-slate-200 border-t-deep-blue rounded-full animate-spin"></div>
      </div>
    );
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
            <select
              value={selectedCustomer}
              onChange={(e) => setSelectedCustomer(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm text-navy focus:outline-none focus:border-deep-blue transition-all"
              required
            >
              <option value="">-- Pilih Pelanggan --</option>
              {MOCK_CUSTOMERS.map((c) => (
                <option key={c.id_pelanggan} value={c.id_pelanggan}>
                  {c.nama} ({c.whatsapp})
                </option>
              ))}
            </select>
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
