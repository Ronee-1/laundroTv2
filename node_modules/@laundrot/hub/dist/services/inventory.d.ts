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
export declare function getInventoryByBranch(id_cabang: string): BranchInventory | undefined;
export declare function getAllInventory(): BranchInventory[];
export declare function getInventoryStatus(id_cabang: string): 'Aman' | 'Menipis' | 'Kritis';
export declare function restockInventory(id_cabang: string, additions: {
    detergen?: number;
    pelembut?: number;
    plastik?: number;
}): BranchInventory | null;
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
export declare function adjustInventory(id_cabang: string, adjustments: {
    item: StockItem;
    stok_baru: number;
    alasan: string;
}): BranchInventory | null;
export declare function getAnomalies(): AnomalyLog[];
//# sourceMappingURL=inventory.d.ts.map