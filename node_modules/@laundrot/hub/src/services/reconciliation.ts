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

const RECONCILIATION_LOGS: ReconciliationLog[] = [];

export function createReconciliation(params: {
  id_cabang: string;
  kas_digital: number;
  kas_fisik: number;
  catatan?: string;
}): ReconciliationLog {
  const selisih = params.kas_fisik - params.kas_digital;
  const log: ReconciliationLog = {
    id_rekonsiliasi: `REC-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
    id_cabang: params.id_cabang,
    tanggal: new Date(),
    kas_digital: params.kas_digital,
    kas_fisik: params.kas_fisik,
    selisih,
    status: selisih === 0 ? 'Cocok' : 'Selisih',
    catatan: params.catatan,
    created_at: new Date(),
  };

  RECONCILIATION_LOGS.push(log);
  return log;
}

export function getReconciliationByBranch(id_cabang: string): ReconciliationLog[] {
  return RECONCILIATION_LOGS.filter((log) => log.id_cabang === id_cabang);
}

export function getAllReconciliations(): ReconciliationLog[] {
  return [...RECONCILIATION_LOGS];
}

export function getLatestReconciliation(id_cabang: string): ReconciliationLog | undefined {
  const logs = getReconciliationByBranch(id_cabang);
  return logs.length > 0 ? logs[logs.length - 1] : undefined;
}
