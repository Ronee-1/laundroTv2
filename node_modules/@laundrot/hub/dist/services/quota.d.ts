import type { Branch } from '@laundrot/shared-types';
export interface QuotaCheckResult {
    available: boolean;
    kuota_harian: number;
    kuota_terpakai: number;
    sisa_kuota: number;
}
export declare function checkQuota(id_cabang: string): Promise<QuotaCheckResult | null>;
export declare function generateDelayMessage(branch: Branch, rescheduleDate: Date): string;
export declare function getNextBusinessDay(): Date;
//# sourceMappingURL=quota.d.ts.map