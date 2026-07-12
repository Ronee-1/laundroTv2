export type ApprovalStatus = 'Pending' | 'Disetujui' | 'Ditolak';
export interface ReconciliationLog {
    id_rekonsiliasi: string;
    id_cabang: string;
    tanggal: Date;
    kas_digital: number;
    kas_fisik: number;
    selisih: number;
    status: 'Cocok' | 'Selisih';
    approval_status: ApprovalStatus;
    catatan?: string;
    catatan_owner?: string;
    created_at: Date;
}
/**
 * Create new reconciliation log
 */
export declare function createReconciliation(params: {
    id_cabang: string;
    kas_digital: number;
    kas_fisik: number;
    catatan?: string;
}): Promise<ReconciliationLog>;
/**
 * Get reconciliation logs by branch
 */
export declare function getReconciliationByBranch(id_cabang: string): Promise<ReconciliationLog[]>;
/**
 * Get all reconciliations
 */
export declare function getAllReconciliations(): Promise<ReconciliationLog[]>;
/**
 * Get latest reconciliation for a branch
 */
export declare function getLatestReconciliation(id_cabang: string): Promise<ReconciliationLog | null>;
/**
 * Get reconciliation by ID
 */
export declare function getReconciliationById(id_rekonsiliasi: string): Promise<ReconciliationLog | null>;
/**
 * Approve reconciliation
 */
export declare function approveReconciliation(id_rekonsiliasi: string, catatan_owner?: string): Promise<ReconciliationLog | null>;
/**
 * Reject reconciliation
 */
export declare function rejectReconciliation(id_rekonsiliasi: string, catatan_owner?: string): Promise<ReconciliationLog | null>;
/**
 * Override reconciliation (adjust values)
 */
export declare function overrideReconciliation(id_rekonsiliasi: string, new_kas_fisik: number, catatan_owner?: string): Promise<ReconciliationLog | null>;
//# sourceMappingURL=reconciliation.d.ts.map