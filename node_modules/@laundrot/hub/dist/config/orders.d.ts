import type { Order } from '@laundrot/shared-types';
/**
 * Create order from WhatsApp Hub allocation (async)
 */
export declare function createOrderFromWhatsApp(params: {
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
}): Promise<Order>;
/**
 * Get orders by branch from database (async)
 */
export declare function getOrdersByBranchFromDB(id_cabang: string): Promise<Order[]>;
/**
 * Get incoming orders (Pending) for a branch from database (async)
 */
export declare function getIncomingOrdersByBranchFromDB(id_cabang: string): Promise<Order[]>;
/**
 * Get orders assigned to a courier from database (async)
 */
export declare function getAssignedOrdersByCourierFromDB(id_kurir: string): Promise<Order[]>;
/**
 * Get all orders from database (async)
 */
export declare function getAllOrdersFromDB(): Promise<Order[]>;
/**
 * Get order by ID from database (async)
 */
export declare function getOrderByIdFromDB(id_order: string): Promise<Order | null>;
/**
 * Update order status in database (async)
 */
export declare function updateOrderStatusInDB(id_order: string, newStatus: string): Promise<Order | null>;
/**
 * Assign order to courier (async)
 */
export declare function assignOrderToCourierInDB(id_order: string, id_kurir: string, assigned_by?: string): Promise<Order | null>;
export declare function getOrdersByCourier(id_kurir: string, id_cabang: string): Order[];
export declare function getOrdersByBranch(id_cabang: string): Order[];
export declare function getOrderById(id_order: string): Order | undefined;
export declare function updateOrderStatus(id_order: string, newStatus: string): Order | null;
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
export declare function createOrderFromWhatsAppSync(params: CreateOrderFromWhatsAppParams): Order;
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