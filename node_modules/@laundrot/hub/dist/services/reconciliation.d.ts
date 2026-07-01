export interface ReconciliationLog {
    id_rekonsiliasi: string;
    id_cabang: string;
    tanggal: Date;
    kas_digital: number;
    kas_fisik: number;
    selisih: number;
    status: 'Cocok' | 'Selisih';
    catatan?: string;
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
//# sourceMappingURL=reconciliation.d.ts.map