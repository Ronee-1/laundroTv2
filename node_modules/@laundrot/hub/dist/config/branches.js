"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MACRO_FINANCIALS = exports.BRANCHES = void 0;
exports.getActiveBranches = getActiveBranches;
exports.getBranchById = getBranchById;
exports.BRANCHES = [
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
// Macro financials - Total Konsolidasi Omzet = Rp91.200.000
exports.MACRO_FINANCIALS = {
    total_konsolidasi_omzet: 91200000,
    batas_anggaran_operasional: 22500000,
};
function getActiveBranches() {
    return exports.BRANCHES.filter((b) => b.is_active);
}
function getBranchById(id_cabang) {
    return exports.BRANCHES.find((b) => b.id_cabang === id_cabang);
}
//# sourceMappingURL=branches.js.map