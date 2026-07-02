import type { LogisticsLog, StockCapacity } from '@laundrot/shared-types';
export declare function createShipment(branchId: string, sentItems: StockCapacity): LogisticsLog;
export declare function verifyShipment(logId: string, receivedItems: StockCapacity): LogisticsLog | null;
export declare function getLogisticsByBranch(branchId: string): LogisticsLog[];
export declare function getInTransitByBranch(branchId: string): LogisticsLog[];
export declare function getActiveShipments(): LogisticsLog[];
export declare function getActiveShipmentsByBranch(branchId: string): LogisticsLog[];
export declare function startRoute(logId: string): LogisticsLog | null;
export declare function handoverShipment(logId: string): LogisticsLog | null;
export declare function getAllLogistics(): LogisticsLog[];
export declare function getLogisticsById(logId: string): LogisticsLog | undefined;
export interface ReplenishmentItem {
    item: string;
    satuan: string;
    stok_saat_ini: number;
    max_capacity: number;
    safety_threshold: number;
    kebutuhan: number;
    is_below_threshold: boolean;
}
export interface ReplenishmentRecommendation {
    branchId: string;
    items: ReplenishmentItem[];
    needs_replenishment: boolean;
}
export declare function getReplenishmentRecommendation(branchId: string): ReplenishmentRecommendation;
//# sourceMappingURL=logistics.d.ts.map