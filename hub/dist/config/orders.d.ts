import type { Order, OrderStatus } from '@laundrot/shared-types';
export declare const ORDERS: Order[];
export declare function getOrdersByCourier(id_kurir: string, id_cabang: string): Order[];
export declare function getOrdersByBranch(id_cabang: string): Order[];
export declare function getOrderById(id_order: string): Order | undefined;
export declare function updateOrderStatus(id_order: string, newStatus: OrderStatus): Order | null;
//# sourceMappingURL=orders.d.ts.map