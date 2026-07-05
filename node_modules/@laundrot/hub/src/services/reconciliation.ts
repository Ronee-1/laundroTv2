// ==========================================
// RECONCILIATION SERVICE - FR-FIN-09 Core Implementation
// Audit & Rekonsiliasi Kas - formulir input kas fisik vs kas digital harian
// Sistem menghitung selisih (discrepancy) dan menyimpan log audit
// Mendukung indikator sukses: Selisih kas = Rp0
// ==========================================

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
    approval_status: 'Pending',
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

export function getReconciliationById(id_rekonsiliasi: string): ReconciliationLog | undefined {
  return RECONCILIATION_LOGS.find((log) => log.id_rekonsiliasi === id_rekonsiliasi);
}

export function approveReconciliation(id_rekonsiliasi: string, catatan_owner?: string): ReconciliationLog | null {
  const log = getReconciliationById(id_rekonsiliasi);
  if (!log || log.approval_status !== 'Pending') return null;
  log.approval_status = 'Disetujui';
  log.catatan_owner = catatan_owner;
  return log;
}

export function rejectReconciliation(id_rekonsiliasi: string, catatan_owner?: string): ReconciliationLog | null {
  const log = getReconciliationById(id_rekonsiliasi);
  if (!log || log.approval_status !== 'Pending') return null;
  log.approval_status = 'Ditolak';
  log.catatan_owner = catatan_owner;
  return log;
}

export function overrideReconciliation(
  id_rekonsiliasi: string,
  new_kas_fisik: number,
  catatan_owner?: string,
): ReconciliationLog | null {
  const log = getReconciliationById(id_rekonsiliasi);
  if (!log) return null;
  log.kas_fisik = new_kas_fisik;
  log.selisih = new_kas_fisik - log.kas_digital;
  log.status = log.selisih === 0 ? 'Cocok' : 'Selisih';
  log.approval_status = 'Pending';
  log.catatan_owner = catatan_owner ?? log.catatan_owner;
  return log;
}
