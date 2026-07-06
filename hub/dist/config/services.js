"use strict";
// ==========================================
// SERVICE TARIFF CONFIG - FR-SERVICE-01
// Master tarif layanan laundry harian
// Harga dikunci dari database - tidak ada input manual
// ==========================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.SERVICE_TARIFFS = void 0;
exports.getActiveServices = getActiveServices;
exports.getServiceById = getServiceById;
exports.calculateTotalHarga = calculateTotalHarga;
exports.formatServiceOption = formatServiceOption;
exports.SERVICE_TARIFFS = [
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
function getActiveServices() {
    return exports.SERVICE_TARIFFS.filter((s) => s.is_active);
}
function getServiceById(id_layanan) {
    return exports.SERVICE_TARIFFS.find((s) => s.id_layanan === id_layanan);
}
function calculateTotalHarga(id_layanan, qty) {
    const service = getServiceById(id_layanan);
    if (!service)
        return 0;
    return qty * service.harga_per_satuan;
}
function formatServiceOption(service) {
    return `${service.nama_layanan} (${service.estimasi_hari} Hari) - Rp${service.harga_per_satuan.toLocaleString('id-ID')} / ${service.satuan}`;
}
//# sourceMappingURL=services.js.map