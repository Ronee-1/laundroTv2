import type { Order, OrderStatus } from '@laundrot/shared-types';
export declare const ORDERS: Order[];
export declare function getOrdersByCourier(id_kurir: string, id_cabang: string): Order[];
export declare function getOrdersByBranch(id_cabang: string): Order[];
export declare function getOrderById(id_order: string): Order | undefined;
export declare function updateOrderStatus(id_order: string, newStatus: OrderStatus): Order | null;
export interface CreateOrderFromWhatsAppParams {
    id_cabang: string;
    customer_name: string;
    customer_whatsapp: string;
    service_type: string;
    berat_kg: number;
    wilayah: string;
    alamat_penjemputan: string;
    koordinat_penjemputan: {
        latitude: number;
        longitude: number;
    };
    google_maps_url: string;
}
export declare function createOrderFromWhatsApp(params: CreateOrderFromWhatsAppParams): Order;
export declare function getIncomingOrdersByBranch(id_cabang: string): Order[];
export declare function getAllOrdersByBranch(id_cabang: string): Order[];
export declare function assignOrderToCourier(id_order: string, id_kurir: string, assigned_by?: string): Order | null;
export interface CourierTaskSequence {
    id_order: string;
    urutan: number;
    id_kurir: string;
    alamat_penjemputan: string;
    status: string;
    berat_kg?: number;
    assigned_at?: Date;
}
export declare function getCourierTaskSequence(id_kurir: string): CourierTaskSequence[];
export declare function setCourierTaskSequence(id_kurir: string, sequences: CourierTaskSequence[]): void;
export declare function reorderCourierTasks(id_kurir: string, orderedTaskIds: string[]): CourierTaskSequence[];
export declare function getAssignedOrdersByCourier(id_kurir: string): {
    orders: Order[];
    sequences: CourierTaskSequence[];
};
//# sourceMappingURL=orders.d.ts.map