import type { Branch } from '@laundrot/shared-types';
export type { Branch };
export interface BranchWithFinancials extends Branch {
    omzet: number;
    wilayah: string;
}
export declare const MACRO_FINANCIALS: {
    total_konsolidasi_omzet: number;
    batas_anggaran_operasional: number;
};
/**
 * Fetch all branches from database
 */
export declare function fetchBranchesFromDB(): Promise<BranchWithFinancials[]>;
/**
 * Get branch by ID from database
 */
export declare function fetchBranchByIdFromDB(id_cabang: string): Promise<BranchWithFinancials | null>;
/**
 * Get all active branches - uses cache with DB refresh
 */
export declare function getActiveBranches(): Promise<BranchWithFinancials[]>;
/**
 * Get branch by ID - uses cache with DB refresh
 */
export declare function getBranchById(id_cabang: string): Promise<BranchWithFinancials | null>;
/**
 * Refresh the branches cache (call after mutations)
 */
export declare function refreshBranchesCache(): Promise<void>;
/**
 * Get all branches (including inactive) - for admin purposes
 */
export declare function getAllBranches(): Promise<BranchWithFinancials[]>;
/**
 * Update branch quota (daily limit usage)
 */
export declare function updateBranchQuota(id_cabang: string, perubahan: number): Promise<void>;
/**
 * Update branch omzet
 */
export declare function updateBranchOmzet(id_cabang: string, nominal: number): Promise<void>;
/**
 * Initialize cache on startup
 */
export declare function initializeBranchesCache(): Promise<void>;
//# sourceMappingURL=branches.d.ts.map