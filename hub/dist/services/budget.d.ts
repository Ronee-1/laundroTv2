export { MACRO_FINANCIALS } from '../config/branches.js';
export interface MonthlyBudget {
    id: string;
    id_cabang: string;
    bulan: string;
    tahun: number;
    pagu_anggaran: number;
    terpakai: number;
}
/**
 * Get or create budget for a branch in a specific month/year
 */
export declare function getOrCreateBudget(id_cabang: string, bulan?: string, tahun?: number): Promise<MonthlyBudget | null>;
/**
 * Get budget for a branch (legacy sync signature for compatibility)
 */
export declare function getBudget(id_cabang: string, bulan?: string, tahun?: number): Promise<MonthlyBudget | null>;
/**
 * Get remaining budget (sisa pagu)
 */
export declare function getSisaPagu(id_cabang: string): Promise<number>;
/**
 * Deduct from budget when expense is approved
 */
export declare function deductBudget(id_cabang: string, nominal: number): Promise<boolean>;
/**
 * Check if expense would exceed budget
 */
export declare function checkOverbudget(id_cabang: string, nominal: number): Promise<{
    overbudget: boolean;
    sisa_pagu: number;
    pagu_anggaran: number;
    terpakai: number;
    requested: number;
    projected_total: number;
}>;
/**
 * Get all budgets (for admin purposes)
 */
export declare function getAllBudgets(): Promise<MonthlyBudget[]>;
/**
 * Update budget pagu (for owner to adjust)
 */
export declare function updateBudgetPagu(id_cabang: string, pagu_anggaran: number, bulan?: string, tahun?: number): Promise<MonthlyBudget | null>;
//# sourceMappingURL=budget.d.ts.map