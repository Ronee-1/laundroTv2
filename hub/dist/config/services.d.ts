export interface ServiceTariff {
    id_layanan: string;
    nama_layanan: string;
    kategori: 'kiloan' | 'satuan' | 'bedcover';
    satuan: 'kg' | 'pcs';
    harga_per_satuan: number;
    estimasi_hari: number;
    is_active: boolean;
}
export declare const SERVICE_TARIFFS: ServiceTariff[];
export declare function getActiveServices(): ServiceTariff[];
export declare function getServiceById(id_layanan: string): ServiceTariff | undefined;
export declare function calculateTotalHarga(id_layanan: string, qty: number): number;
export declare function formatServiceOption(service: ServiceTariff): string;
//# sourceMappingURL=services.d.ts.map