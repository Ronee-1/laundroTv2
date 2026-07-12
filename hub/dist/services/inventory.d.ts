export type StockItem = 'Detergen' | 'Pelembut' | 'Plastik';
export interface StockEntry {
    item: StockItem;
    satuan: string;
    stok_saat_ini: number;
    safety_threshold: number;
    max_capacity: number;
    status: 'Aman' | 'Menipis' | 'Kritis';
}
export interface BranchInventory {
    id_cabang: string;
    stocks: StockEntry[];
    last_updated: Date;
}
export declare const SAFETY_THRESHOLDS: {
    detergen: number;
    pelembut: number;
    plastik: number;
};
/**
 * Get inventory by branch
 */
export declare function getInventoryByBranch(id_cabang: string): Promise<BranchInventory | null>;
/**
 * Get all inventory across all branches
 */
export declare function getAllInventory(): Promise<BranchInventory[]>;
/**
 * Get inventory status for a branch
 */
export declare function getInventoryStatus(id_cabang: string): Promise<'Aman' | 'Menipis' | 'Kritis'>;
/**
 * Restock inventory items for a branch
 */
export declare function restockInventory(id_cabang: string, additions: {
    detergen?: number;
    pelembut?: number;
    plastik?: number;
}): Promise<BranchInventory | null>;
export interface AnomalyLog {
    id: string;
    id_cabang: string;
    nama_cabang: string;
    item: string;
    stok_lama: number;
    stok_baru: number;
    alasan: string;
    timestamp: string;
}
/**
 * Adjust inventory manually (with anomaly logging)
 */
export declare function adjustInventory(id_cabang: string, adjustments: {
    item: StockItem;
    stok_baru: number;
    alasan: string;
}): Promise<BranchInventory | null>;
/**
 * Get all inventory anomalies
 */
export declare function getAnomalies(): Promise<AnomalyLog[]>;
/**
 * Initialize inventory for a new branch
 */
export declare function initializeBranchInventory(id_cabang: string): Promise<void>;
//# sourceMappingURL=inventory.d.ts.map