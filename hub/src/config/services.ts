// ==========================================
// SERVICE TARIFF CONFIG - FR-SERVICE-01
// Master tarif layanan laundry harian
// Harga dikunci dari database - tidak ada input manual
// ==========================================

import { prisma } from '../lib/prisma.js';

export interface ServiceTariff {
  id_layanan: string;
  nama_layanan: string;
  kategori: 'kiloan' | 'satuan' | 'bedcover';
  satuan: 'kg' | 'pcs';
  harga_per_satuan: number;
  estimasi_hari: number;
  is_active: boolean;
}

// ==========================================
// SERVICE TARIFF CRUD OPERATIONS
// ==========================================

/**
 * Get all active services from database
 */
export async function getActiveServicesFromDB(): Promise<ServiceTariff[]> {
  const services = await prisma.serviceTariff.findMany({
    where: { is_active: true },
    orderBy: { id_layanan: 'asc' },
  });

  return services.map((s) => ({
    id_layanan: s.id_layanan,
    nama_layanan: s.nama_layanan,
    kategori: s.kategori as ServiceTariff['kategori'],
    satuan: s.satuan as ServiceTariff['satuan'],
    harga_per_satuan: s.harga_per_satuan,
    estimasi_hari: s.estimasi_hari,
    is_active: s.is_active,
  }));
}

/**
 * Get all services from database
 */
export async function getAllServicesFromDB(): Promise<ServiceTariff[]> {
  const services = await prisma.serviceTariff.findMany({
    orderBy: { id_layanan: 'asc' },
  });

  return services.map((s) => ({
    id_layanan: s.id_layanan,
    nama_layanan: s.nama_layanan,
    kategori: s.kategori as ServiceTariff['kategori'],
    satuan: s.satuan as ServiceTariff['satuan'],
    harga_per_satuan: s.harga_per_satuan,
    estimasi_hari: s.estimasi_hari,
    is_active: s.is_active,
  }));
}

/**
 * Get service by ID from database
 */
export async function getServiceByIdFromDB(id_layanan: string): Promise<ServiceTariff | null> {
  const service = await prisma.serviceTariff.findUnique({
    where: { id_layanan },
  });

  if (!service) return null;

  return {
    id_layanan: service.id_layanan,
    nama_layanan: service.nama_layanan,
    kategori: service.kategori as ServiceTariff['kategori'],
    satuan: service.satuan as ServiceTariff['satuan'],
    harga_per_satuan: service.harga_per_satuan,
    estimasi_hari: service.estimasi_hari,
    is_active: service.is_active,
  };
}

/**
 * Get active services - sync version for simple routes
 */
export function getActiveServices(): ServiceTariff[] {
  // Default services if DB not available
  return DEFAULT_SERVICES;
}

/**
 * Get service by ID - sync version
 */
export function getServiceById(id_layanan: string): ServiceTariff | undefined {
  return DEFAULT_SERVICES.find((s) => s.id_layanan === id_layanan);
}

/**
 * Calculate total price
 */
export function calculateTotalHarga(id_layanan: string, qty: number): number {
  const service = getServiceById(id_layanan);
  if (!service) return 0;
  return qty * service.harga_per_satuan;
}

/**
 * Format service option for display
 */
export function formatServiceOption(service: ServiceTariff): string {
  return `${service.nama_layanan} (${service.estimasi_hari} Hari) - Rp${service.harga_per_satuan.toLocaleString('id-ID')} / ${service.satuan}`;
}

// Default services (fallback)
const DEFAULT_SERVICES: ServiceTariff[] = [
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

/**
 * Seed default services to database (for initial setup)
 */
export async function seedDefaultServices(): Promise<void> {
  for (const service of DEFAULT_SERVICES) {
    await prisma.serviceTariff.upsert({
      where: { id_layanan: service.id_layanan },
      update: {},
      create: {
        id_layanan: service.id_layanan,
        nama_layanan: service.nama_layanan,
        kategori: service.kategori,
        satuan: service.satuan,
        harga_per_satuan: service.harga_per_satuan,
        estimasi_hari: service.estimasi_hari,
        is_active: service.is_active,
      },
    });
  }
  console.log('[Services] Default services seeded');
}
