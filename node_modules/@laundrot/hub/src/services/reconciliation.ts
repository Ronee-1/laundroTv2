// ==========================================
// RECONCILIATION SERVICE - FR-FIN-09 Core Implementation
// Audit & Rekonsiliasi Kas - formulir input kas fisik vs kas digital harian
// Sistem menghitung selisih (discrepancy) dan menyimpan log audit
// Mendukung indikator sukses: Selisih kas = Rp0
// ==========================================

import { prisma } from '../lib/prisma.js';

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

// ==========================================
// RECONCILIATION CRUD OPERATIONS
// ==========================================

/**
 * Create new reconciliation log
 */
export async function createReconciliation(params: {
  id_cabang: string;
  kas_digital: number;
  kas_fisik: number;
  catatan?: string;
}): Promise<ReconciliationLog> {
  const id_rekonsiliasi = `REC-${Date.now().toString(36).toUpperCase()}`;
  const selisih = params.kas_fisik - params.kas_digital;

  const log = await prisma.reconciliationLog.create({
    data: {
      id_rekonsiliasi,
      id_cabang: params.id_cabang,
      kas_digital: params.kas_digital,
      kas_fisik: params.kas_fisik,
      selisih,
      status: selisih === 0 ? 'Cocok' : 'Selisih',
      approval_status: 'Pending',
      catatan: params.catatan,
    },
  });

  return {
    id_rekonsiliasi: log.id_rekonsiliasi,
    id_cabang: log.id_cabang,
    tanggal: log.tanggal,
    kas_digital: log.kas_digital,
    kas_fisik: log.kas_fisik,
    selisih: log.selisih,
    status: log.status as 'Cocok' | 'Selisih',
    approval_status: log.approval_status as ApprovalStatus,
    catatan: log.catatan ?? undefined,
    catatan_owner: log.catatan_owner ?? undefined,
    created_at: log.created_at,
  };
}

/**
 * Get reconciliation logs by branch
 */
export async function getReconciliationByBranch(id_cabang: string): Promise<ReconciliationLog[]> {
  const logs = await prisma.reconciliationLog.findMany({
    where: { id_cabang },
    orderBy: { tanggal: 'desc' },
  });

  return logs.map((log) => ({
    id_rekonsiliasi: log.id_rekonsiliasi,
    id_cabang: log.id_cabang,
    tanggal: log.tanggal,
    kas_digital: log.kas_digital,
    kas_fisik: log.kas_fisik,
    selisih: log.selisih,
    status: log.status as 'Cocok' | 'Selisih',
    approval_status: log.approval_status as ApprovalStatus,
    catatan: log.catatan ?? undefined,
    catatan_owner: log.catatan_owner ?? undefined,
    created_at: log.created_at,
  }));
}

/**
 * Get all reconciliations
 */
export async function getAllReconciliations(): Promise<ReconciliationLog[]> {
  const logs = await prisma.reconciliationLog.findMany({
    orderBy: { tanggal: 'desc' },
  });

  return logs.map((log) => ({
    id_rekonsiliasi: log.id_rekonsiliasi,
    id_cabang: log.id_cabang,
    tanggal: log.tanggal,
    kas_digital: log.kas_digital,
    kas_fisik: log.kas_fisik,
    selisih: log.selisih,
    status: log.status as 'Cocok' | 'Selisih',
    approval_status: log.approval_status as ApprovalStatus,
    catatan: log.catatan ?? undefined,
    catatan_owner: log.catatan_owner ?? undefined,
    created_at: log.created_at,
  }));
}

/**
 * Get latest reconciliation for a branch
 */
export async function getLatestReconciliation(id_cabang: string): Promise<ReconciliationLog | null> {
  const log = await prisma.reconciliationLog.findFirst({
    where: { id_cabang },
    orderBy: { tanggal: 'desc' },
  });

  if (!log) return null;

  return {
    id_rekonsiliasi: log.id_rekonsiliasi,
    id_cabang: log.id_cabang,
    tanggal: log.tanggal,
    kas_digital: log.kas_digital,
    kas_fisik: log.kas_fisik,
    selisih: log.selisih,
    status: log.status as 'Cocok' | 'Selisih',
    approval_status: log.approval_status as ApprovalStatus,
    catatan: log.catatan ?? undefined,
    catatan_owner: log.catatan_owner ?? undefined,
    created_at: log.created_at,
  };
}

/**
 * Get reconciliation by ID
 */
export async function getReconciliationById(id_rekonsiliasi: string): Promise<ReconciliationLog | null> {
  const log = await prisma.reconciliationLog.findUnique({
    where: { id_rekonsiliasi },
  });

  if (!log) return null;

  return {
    id_rekonsiliasi: log.id_rekonsiliasi,
    id_cabang: log.id_cabang,
    tanggal: log.tanggal,
    kas_digital: log.kas_digital,
    kas_fisik: log.kas_fisik,
    selisih: log.selisih,
    status: log.status as 'Cocok' | 'Selisih',
    approval_status: log.approval_status as ApprovalStatus,
    catatan: log.catatan ?? undefined,
    catatan_owner: log.catatan_owner ?? undefined,
    created_at: log.created_at,
  };
}

/**
 * Approve reconciliation
 */
export async function approveReconciliation(id_rekonsiliasi: string, catatan_owner?: string): Promise<ReconciliationLog | null> {
  try {
    const log = await prisma.reconciliationLog.update({
      where: { id_rekonsiliasi },
      data: {
        approval_status: 'Disetujui',
        catatan_owner,
      },
    });

    return {
      id_rekonsiliasi: log.id_rekonsiliasi,
      id_cabang: log.id_cabang,
      tanggal: log.tanggal,
      kas_digital: log.kas_digital,
      kas_fisik: log.kas_fisik,
      selisih: log.selisih,
      status: log.status as 'Cocok' | 'Selisih',
      approval_status: log.approval_status as ApprovalStatus,
      catatan: log.catatan ?? undefined,
      catatan_owner: log.catatan_owner ?? undefined,
      created_at: log.created_at,
    };
  } catch {
    return null;
  }
}

/**
 * Reject reconciliation
 */
export async function rejectReconciliation(id_rekonsiliasi: string, catatan_owner?: string): Promise<ReconciliationLog | null> {
  try {
    const log = await prisma.reconciliationLog.update({
      where: { id_rekonsiliasi },
      data: {
        approval_status: 'Ditolak',
        catatan_owner,
      },
    });

    return {
      id_rekonsiliasi: log.id_rekonsiliasi,
      id_cabang: log.id_cabang,
      tanggal: log.tanggal,
      kas_digital: log.kas_digital,
      kas_fisik: log.kas_fisik,
      selisih: log.selisih,
      status: log.status as 'Cocok' | 'Selisih',
      approval_status: log.approval_status as ApprovalStatus,
      catatan: log.catatan ?? undefined,
      catatan_owner: log.catatan_owner ?? undefined,
      created_at: log.created_at,
    };
  } catch {
    return null;
  }
}

/**
 * Override reconciliation (adjust values)
 */
export async function overrideReconciliation(
  id_rekonsiliasi: string,
  new_kas_fisik: number,
  catatan_owner?: string,
): Promise<ReconciliationLog | null> {
  try {
    const existing = await prisma.reconciliationLog.findUnique({
      where: { id_rekonsiliasi },
    });

    if (!existing) return null;

    const selisih = new_kas_fisik - existing.kas_digital;

    const log = await prisma.reconciliationLog.update({
      where: { id_rekonsiliasi },
      data: {
        kas_fisik: new_kas_fisik,
        selisih,
        status: selisih === 0 ? 'Cocok' : 'Selisih',
        approval_status: 'Pending',
        catatan_owner: catatan_owner ?? existing.catatan_owner ?? undefined,
      },
    });

    return {
      id_rekonsiliasi: log.id_rekonsiliasi,
      id_cabang: log.id_cabang,
      tanggal: log.tanggal,
      kas_digital: log.kas_digital,
      kas_fisik: log.kas_fisik,
      selisih: log.selisih,
      status: log.status as 'Cocok' | 'Selisih',
      approval_status: log.approval_status as ApprovalStatus,
      catatan: log.catatan ?? undefined,
      catatan_owner: log.catatan_owner ?? undefined,
      created_at: log.created_at,
    };
  } catch {
    return null;
  }
}
