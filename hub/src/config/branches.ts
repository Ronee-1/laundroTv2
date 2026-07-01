import type { Branch } from '@laundrot/shared-types';

export interface BranchWithFinancials extends Branch {
  omzet: number;
  wilayah: string;
}

export const BRANCHES: BranchWithFinancials[] = [
  {
    id_cabang: 'CBG-001',
    nama_cabang: 'Cabang Depok (Pusat)',
    alamat: 'Jl. Margonda Raya No. 88, Depok',
    latitude: -6.3894,
    longitude: 106.8302,
    kuota_harian: 30,
    kuota_terpakai: 0,
    is_active: true,
    created_at: new Date('2024-01-01'),
    updated_at: new Date('2024-01-01'),
    omzet: 24500000,
    wilayah: 'Depok',
  },
  {
    id_cabang: 'CBG-002',
    nama_cabang: 'Cabang Jakarta Selatan',
    alamat: 'Jl. Kemang Raya No. 10, Jakarta Selatan',
    latitude: -6.2615,
    longitude: 106.8106,
    kuota_harian: 30,
    kuota_terpakai: 0,
    is_active: true,
    created_at: new Date('2024-01-01'),
    updated_at: new Date('2024-01-01'),
    omzet: 18200000,
    wilayah: 'Jakarta',
  },
  {
    id_cabang: 'CBG-003',
    nama_cabang: 'Cabang Bekasi Timur',
    alamat: 'Jl. Rawamangun No. 22, Bekasi Timur',
    latitude: -6.1903,
    longitude: 106.8872,
    kuota_harian: 30,
    kuota_terpakai: 0,
    is_active: true,
    created_at: new Date('2024-01-01'),
    updated_at: new Date('2024-01-01'),
    omzet: 15400000,
    wilayah: 'Bekasi',
  },
  {
    id_cabang: 'CBG-004',
    nama_cabang: 'Cabang Tangerang Kota',
    alamat: 'Jl. BSD Raya No. 15, Tangerang',
    latitude: -6.3014,
    longitude: 106.6527,
    kuota_harian: 30,
    kuota_terpakai: 0,
    is_active: true,
    created_at: new Date('2024-01-01'),
    updated_at: new Date('2024-01-01'),
    omzet: 21000000,
    wilayah: 'Tangerang',
  },
  {
    id_cabang: 'CBG-005',
    nama_cabang: 'Cabang Bogor Raya',
    alamat: 'Jl. Pajajaran No. 25, Bogor',
    latitude: -6.5971,
    longitude: 106.8060,
    kuota_harian: 30,
    kuota_terpakai: 0,
    is_active: true,
    created_at: new Date('2024-01-01'),
    updated_at: new Date('2024-01-01'),
    omzet: 12100000,
    wilayah: 'Bogor',
  },
];

export function getActiveBranches(): BranchWithFinancials[] {
  return BRANCHES.filter((b) => b.is_active);
}

export function getBranchById(id_cabang: string): BranchWithFinancials | undefined {
  return BRANCHES.find((b) => b.id_cabang === id_cabang);
}
