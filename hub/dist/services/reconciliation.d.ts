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
export declare function createReconciliation(params: {
    id_cabang: string;
    kas_digital: number;
    kas_fisik: number;
    catatan?: string;
}): ReconciliationLog;
export declare function getReconciliationByBranch(id_cabang: string): ReconciliationLog[];
export declare function getAllReconciliations(): ReconciliationLog[];
export declare function getLatestReconciliation(id_cabang: string): ReconciliationLog | undefined;
export declare function getReconciliationById(id_rekonsiliasi: string): ReconciliationLog | undefined;
export declare function approveReconciliation(id_rekonsiliasi: string, catatan_owner?: string): ReconciliationLog | null;
export declare function rejectReconciliation(id_rekonsiliasi: string, catatan_owner?: string): ReconciliationLog | null;
export declare function overrideReconciliation(id_rekonsiliasi: string, new_kas_fisik: number, catatan_owner?: string): ReconciliationLog | null;
//# sourceMappingURL=reconciliation.d.ts.map