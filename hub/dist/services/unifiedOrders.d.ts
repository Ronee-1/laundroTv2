import type { Prisma } from '../generated/prisma/client.js';
export interface WhatsAppOrder {
    id_order: string;
    id_cabang: string;
    customer_name: string;
    customer_whatsapp: string;
    service_name: string;
    berat_kg: number;
    total_harga: number;
    status: string;
    sumber: 'whatsapp';
    tanggal_order: Date;
    wilayah: string;
    alamat_penjemputan: string;
    google_maps_url: string;
    koordinat_penjemputan: {
        latitude: number;
        longitude: number;
    };
    id_kurir?: string;
}
export interface OutletOrder {
    id_order: string;
    id_cabang: string;
    customer_name: string;
    customer_whatsapp: string;
    service_name: string;
    berat_kg: number;
    total_harga: number;
    status: string;
    sumber: 'outlet';
    tanggal_order: Date;
    id_pelanggan: string;
    id_layanan: string;
    qty: number;
    satuan: string;
    id_kurir?: string;
}
export type UnifiedOrder = WhatsAppOrder | OutletOrder;
export type CreateWhatsAppOrder = Omit<Prisma.OrderCreateInput, 'branch' | 'courier'>;
export type CreateOutletOrder = Omit<Prisma.OrderCreateInput, 'branch' | 'courier'>;
export declare function createWhatsAppOrder(data: {
    id_cabang: string;
    customer_name: string;
    customer_whatsapp: string;
    service_name: string;
    berat_kg: number;
    total_harga: number;
    status: string;
    wilayah: string;
    alamat_penjemputan: string;
    google_maps_url: string;
    koordinat_penjemputan: {
        latitude: number;
        longitude: number;
    };
}): Promise<WhatsAppOrder>;
export declare function getWhatsAppOrdersByBranch(id_cabang: string): Promise<WhatsAppOrder[]>;
export declare function getAllWhatsAppOrders(): Promise<WhatsAppOrder[]>;
export declare function createOutletOrder(data: {
    id_cabang: string;
    id_pelanggan: string;
    customer_name: string;
    customer_whatsapp: string;
    id_layanan: string;
    service_name: string;
    qty: number;
    satuan: string;
    berat_kg: number;
    total_harga: number;
    status: string;
}): Promise<OutletOrder>;
export declare function getOutletOrdersByBranch(id_cabang: string): Promise<OutletOrder[]>;
export declare function getAllOutletOrders(): Promise<OutletOrder[]>;
export declare function getAllOrders(): Promise<UnifiedOrder[]>;
export declare function getOrdersByBranch(id_cabang: string): Promise<UnifiedOrder[]>;
export declare function getOrderStats(): Promise<{
    total_orders: number;
    whatsapp_orders: number;
    outlet_orders: number;
    total_revenue: number;
    orders_by_branch: Record<string, {
        whatsapp: number;
        outlet: number;
        total: number;
    }>;
}>;
//# sourceMappingURL=unifiedOrders.d.ts.map