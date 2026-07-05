import type { Branch } from '@laundrot/shared-types';
export interface BranchWithFinancials extends Branch {
    omzet: number;
    wilayah: string;
}
export declare const BRANCHES: BranchWithFinancials[];
export declare const MACRO_FINANCIALS: {
    total_konsolidasi_omzet: number;
    batas_anggaran_operasional: number;
};
export declare function getActiveBranches(): BranchWithFinancials[];
export declare function getBranchById(id_cabang: string): BranchWithFinancials | undefined;
//# sourceMappingURL=branches.d.ts.map