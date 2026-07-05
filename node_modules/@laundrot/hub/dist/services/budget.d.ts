import { MACRO_FINANCIALS } from '../config/branches.js';
export interface MonthlyBudget {
    id_cabang: string;
    bulan: string;
    tahun: number;
    pagu_anggaran: number;
    terpakai: number;
}
export { MACRO_FINANCIALS };
export declare function getBudget(id_cabang: string, bulan?: string, tahun?: number): MonthlyBudget | undefined;
export declare function getSisaPagu(id_cabang: string): number;
export declare function deductBudget(id_cabang: string, nominal: number): boolean;
export declare function checkOverbudget(id_cabang: string, nominal: number): {
    overbudget: boolean;
    sisa_pagu: number;
    pagu_anggaran: number;
    terpakai: number;
    requested: number;
    projected_total: number;
};
//# sourceMappingURL=budget.d.ts.map