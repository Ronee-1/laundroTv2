// ==========================================
// SERVICE TARIFF CONFIG - FR-SERVICE-01
// Master tarif layanan laundry harian
// Harga dikunci dari database - tidak ada input manual
// ==========================================

export interface ServiceTariff {
  id_layanan: string;
  nama_layanan: string;
  kategori: 'kiloan' | 'satuan' | 'bedcover';
  satuan: 'kg' | 'pcs';
  harga_per_satuan: number;
  estimasi_hari: number;
  is_active: boolean;
}

export const SERVICE_TARIFFS: ServiceTariff[] = [
  // Cuci Kering Setrika - Kiloan
  {
    id_layanan: 'SRV-001',
    nama_layanan: 'Cuci Kering Setrika Reguler',
    kategori: 'kiloan',
    satuan: 'kg',
    harga_per_satuan: 8000,
    estimasi_hari: 2,
    is_active: true,
  },
  {
    id_layanan: 'SRV-002',
    nama_layanan: 'Cuci Kering Setrika Ekspres',
    kategori: 'kiloan',
    satuan: 'kg',
    harga_per_satuan: 12000,
    estimasi_hari: 1,
    is_active: true,
  },
  // Bedcover
  {
    id_layanan: 'SRV-003',
    nama_layanan: 'Bedcover Reguler',
    kategori: 'bedcover',
    satuan: 'pcs',
    harga_per_satuan: 25000,
    estimasi_hari: 3,
    is_active: true,
  },
  {
    id_layanan: 'SRV-004',
    nama_layanan: 'Bedcover Ekspres',
    kategori: 'bedcover',
    satuan: 'pcs',
    harga_per_satuan: 35000,
    estimasi_hari: 1,
    is_active: true,
  },
  // Satuan items
  {
    id_layanan: 'SRV-005',
    nama_layanan: 'Setrika Only',
    kategori: 'satuan',
    satuan: 'kg',
    harga_per_satuan: 4000,
    estimasi_hari: 1,
    is_active: true,
  },
  {
    id_layanan: 'SRV-006',
    nama_layanan: 'Cuci Only',
    kategori: 'satuan',
    satuan: 'kg',
    harga_per_satuan: 5000,
    estimasi_hari: 1,
    is_active: true,
  },
];

export function getActiveServices(): ServiceTariff[] {
  return SERVICE_TARIFFS.filter((s) => s.is_active);
}

export function getServiceById(id_layanan: string): ServiceTariff | undefined {
  return SERVICE_TARIFFS.find((s) => s.id_layanan === id_layanan);
}

export function calculateTotalHarga(id_layanan: string, qty: number): number {
  const service = getServiceById(id_layanan);
  if (!service) return 0;
  return qty * service.harga_per_satuan;
}

export function formatServiceOption(service: ServiceTariff): string {
  return `${service.nama_layanan} (${service.estimasi_hari} Hari) - Rp${service.harga_per_satuan.toLocaleString('id-ID')} / ${service.satuan}`;
}
