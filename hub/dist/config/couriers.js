"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.COURIERS = void 0;
exports.getCourierById = getCourierById;
exports.COURIERS = [
    {
        id_kurir: 'KUR-001',
        id_cabang: 'CBG-001',
        nama_kurir: 'Budi Santoso',
        nomor_telepon: '+6281234567890',
        is_available: true,
        created_at: new Date('2024-01-01'),
        updated_at: new Date('2024-01-01'),
    },
    {
        id_kurir: 'KUR-002',
        id_cabang: 'CBG-001',
        nama_kurir: 'Agus Wijaya',
        nomor_telepon: '+6281234567891',
        is_available: true,
        created_at: new Date('2024-01-01'),
        updated_at: new Date('2024-01-01'),
    },
    {
        id_kurir: 'KUR-003',
        id_cabang: 'CBG-002',
        nama_kurir: 'Dedi Kurniawan',
        nomor_telepon: '+6281234567892',
        is_available: true,
        created_at: new Date('2024-01-01'),
        updated_at: new Date('2024-01-01'),
    },
    {
        id_kurir: 'KUR-004',
        id_cabang: 'CBG-003',
        nama_kurir: 'Rina Susanti',
        nomor_telepon: '+6281234567893',
        is_available: true,
        created_at: new Date('2024-01-01'),
        updated_at: new Date('2024-01-01'),
    },
    {
        id_kurir: 'KUR-005',
        id_cabang: 'CBG-004',
        nama_kurir: 'Eko Prasetyo',
        nomor_telepon: '+6281234567894',
        is_available: true,
        created_at: new Date('2024-01-01'),
        updated_at: new Date('2024-01-01'),
    },
];
function getCourierById(id_kurir) {
    return exports.COURIERS.find((c) => c.id_kurir === id_kurir);
}
//# sourceMappingURL=couriers.js.map