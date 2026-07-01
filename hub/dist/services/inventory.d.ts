export type StockItem = 'Detergen' | 'Pelembut' | 'Plastik';
export interface StockEntry {
    item: StockItem;
    satuan: string;
    stok_saat_ini: number;
    safety_threshold: number;
    status: 'Aman' | 'Menipis' | 'Habis';
}
export interface BranchInventory {
    id_cabang: string;
    stocks: StockEntry[];
    last_updated: Date;
}
export declare function getInventoryByBranch(id_cabang: string): BranchInventory | undefined;
export declare function getAllInventory(): BranchInventory[];
export declare function getInventoryStatus(id_cabang: string): 'Aman' | 'Menipis' | 'Habis';
export declare function restockInventory(id_cabang: string, additions: {
    detergen?: number;
    pelembut?: number;
    plastik?: number;
}): BranchInventory | null;
//# sourceMappingURL=inventory.d.ts.map