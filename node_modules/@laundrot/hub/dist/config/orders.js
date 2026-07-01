"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ORDERS = void 0;
exports.getOrdersByCourier = getOrdersByCourier;
exports.getOrdersByBranch = getOrdersByBranch;
exports.ORDERS = [
    {
        id_order: 'ORD-001',
        id_cabang: 'CBG-001',
        id_pelanggan: 'PLG-001',
        id_kurir: 'KUR-001',
        alamat_penjemputan: 'Jl. Kemang Selatan No. 5, Jakarta Selatan',
        alamat_pengantaran: 'Jl. Kemang Selatan No. 5, Jakarta Selatan',
        koordinat_penjemputan: { latitude: -6.2650, longitude: 106.8130 },
        koordinat_pengantaran: { latitude: -6.2650, longitude: 106.8130 },
        status: 'Diproses',
        berat_kg: 3.5,
        total_harga: 70000,
        tanggal_order: new Date('2024-06-01'),
        created_at: new Date('2024-06-01'),
        updated_at: new Date('2024-06-01'),
    },
    {
        id_order: 'ORD-002',
        id_cabang: 'CBG-001',
        id_pelanggan: 'PLG-002',
        id_kurir: 'KUR-001',
        alamat_penjemputan: 'Jl. Bangka Raya No. 12, Jakarta Selatan',
        alamat_pengantaran: 'Jl. Bangka Raya No. 12, Jakarta Selatan',
        koordinat_penjemputan: { latitude: -6.2710, longitude: 106.8200 },
        koordinat_pengantaran: { latitude: -6.2710, longitude: 106.8200 },
        status: 'Siap Diantar',
        berat_kg: 2.0,
        total_harga: 40000,
        tanggal_order: new Date('2024-06-01'),
        created_at: new Date('2024-06-01'),
        updated_at: new Date('2024-06-01'),
    },
    {
        id_order: 'ORD-003',
        id_cabang: 'CBG-002',
        id_pelanggan: 'PLG-003',
        id_kurir: 'KUR-003',
        alamat_penjemputan: 'Jl. Puri Indah Blok A No. 8, Jakarta Barat',
        alamat_pengantaran: 'Jl. Puri Indah Blok A No. 8, Jakarta Barat',
        koordinat_penjemputan: { latitude: -6.1850, longitude: 106.7400 },
        koordinat_pengantaran: { latitude: -6.1850, longitude: 106.7400 },
        status: 'Diproses',
        berat_kg: 5.0,
        total_harga: 100000,
        tanggal_order: new Date('2024-06-01'),
        created_at: new Date('2024-06-01'),
        updated_at: new Date('2024-06-01'),
    },
    {
        id_order: 'ORD-004',
        id_cabang: 'CBG-003',
        id_pelanggan: 'PLG-004',
        id_kurir: 'KUR-004',
        alamat_penjemputan: 'Jl. Pemuda No. 30, Jakarta Timur',
        alamat_pengantaran: 'Jl. Pemuda No. 30, Jakarta Timur',
        koordinat_penjemputan: { latitude: -6.1920, longitude: 106.8900 },
        koordinat_pengantaran: { latitude: -6.1920, longitude: 106.8900 },
        status: 'Pending',
        berat_kg: 4.0,
        total_harga: 80000,
        tanggal_order: new Date('2024-06-01'),
        created_at: new Date('2024-06-01'),
        updated_at: new Date('2024-06-01'),
    },
];
function getOrdersByCourier(id_kurir, id_cabang) {
    return exports.ORDERS.filter((o) => o.id_kurir === id_kurir && o.id_cabang === id_cabang);
}
function getOrdersByBranch(id_cabang) {
    return exports.ORDERS.filter((o) => o.id_cabang === id_cabang);
}
//# sourceMappingURL=orders.js.map