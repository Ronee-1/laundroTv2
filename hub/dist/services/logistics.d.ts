import type { StockCapacity } from '@laundrot/shared-types';
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
interface LogisticsLogResponse {
    id: string;
    branchId: string;
    sentItems: StockCapacity;
    receivedItems: StockCapacity | null;
    discrepancy: StockCapacity | null;
    status: string;
    timestamp: Date;
}
/**
 * Create new shipment log
 */
export declare function createShipment(branchId: string, sentItems: StockCapacity): Promise<LogisticsLogResponse>;
/**
 * Verify shipment received
 */
export declare function verifyShipment(logId: string, receivedItems: StockCapacity): Promise<LogisticsLogResponse | null>;
/**
 * Get logistics by branch
 */
export declare function getLogisticsByBranch(branchId: string): Promise<LogisticsLogResponse[]>;
/**
 * Get in-transit shipments for a branch
 */
export declare function getInTransitByBranch(branchId: string): Promise<LogisticsLogResponse[]>;
/**
 * Get all active shipments
 */
export declare function getActiveShipments(): Promise<LogisticsLogResponse[]>;
/**
 * Get active shipments for a specific branch
 */
export declare function getActiveShipmentsByBranch(branchId: string): Promise<LogisticsLogResponse[]>;
/**
 * Start route (driver en route)
 */
export declare function startRoute(logId: string): Promise<LogisticsLogResponse | null>;
/**
 * Handover shipment (awaiting verification)
 */
export declare function handoverShipment(logId: string): Promise<LogisticsLogResponse | null>;
/**
 * Get all logistics
 */
export declare function getAllLogistics(): Promise<LogisticsLogResponse[]>;
/**
 * Get logistics by ID
 */
export declare function getLogisticsById(logId: string): Promise<LogisticsLogResponse | null>;
/**
 * Get replenishment recommendation for a branch
 */
export declare function getReplenishmentRecommendation(branchId: string): Promise<ReplenishmentRecommendation>;
export {};
//# sourceMappingURL=logistics.d.ts.map