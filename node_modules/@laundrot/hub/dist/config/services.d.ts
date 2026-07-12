export interface ServiceTariff {
    id_layanan: string;
    nama_layanan: string;
    kategori: 'kiloan' | 'satuan' | 'bedcover';
    satuan: 'kg' | 'pcs';
    harga_per_satuan: number;
    estimasi_hari: number;
    is_active: boolean;
}
/**
 * Get all active services from database
 */
export declare function getActiveServicesFromDB(): Promise<ServiceTariff[]>;
/**
 * Get all services from database
 */
export declare function getAllServicesFromDB(): Promise<ServiceTariff[]>;
/**
 * Get service by ID from database
 */
export declare function getServiceByIdFromDB(id_layanan: string): Promise<ServiceTariff | null>;
/**
 * Get active services - sync version for simple routes
 */
export declare function getActiveServices(): ServiceTariff[];
/**
 * Get service by ID - sync version
 */
export declare function getServiceById(id_layanan: string): ServiceTariff | undefined;
/**
 * Calculate total price
 */
export declare function calculateTotalHarga(id_layanan: string, qty: number): number;
/**
 * Format service option for display
 */
export declare function formatServiceOption(service: ServiceTariff): string;
/**
 * Seed default services to database (for initial setup)
 */
export declare function seedDefaultServices(): Promise<void>;
//# sourceMappingURL=services.d.ts.map