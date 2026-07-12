// ==========================================
// EXPENSE SERVICE - FR-FIN-08 Core Implementation
// Formulir input pengeluaran operasional harian
// (tanggal, nominal, kategori kustom, bukti nota)
// Extends: FR-FIN-02 (approval), FR-FIN-03 (overbudget)
// ==========================================

import { prisma } from '../lib/prisma.js';

// ==========================================
// TYPE DEFINITIONS
// ==========================================

export type ExpenseStatus = 'Pending' | 'Approve' | 'Reject';

export type ExpenseCategory =
  | 'BBM'
  | 'Sewa & Utilitas'
  | 'Gaji'
  | 'Belanja Darurat'
  | 'Pemeliharaan'
  | 'Lain-lain';

export const DEFAULT_CATEGORIES: ExpenseCategory[] = [
  'BBM',
  'Sewa & Utilitas',
  'Gaji',
  'Belanja Darurat',
  'Pemeliharaan',
  'Lain-lain',
];

export interface Expense {
  id_expense: string;
  id_cabang: string;
  tanggal: Date;
  nominal: number;
  deskripsi: string;
  kategori: string;
  bukti_nota_url: string;
  status: ExpenseStatus;
  tanggal_pengajuan: Date;
  tanggal_approval?: Date;
  catatan_approval?: string;
  created_at: Date;
  updated_at: Date;
}

// ==========================================
// CUSTOM CATEGORIES (stored in DB via ExpenseCategory model)
// ==========================================

let cachedCategories: string[] | null = null;

/**
 * Get all expense categories (from DB + defaults)
 */
export async function getCategoriesFromDB(): Promise<string[]> {
  if (cachedCategories) return cachedCategories;

  const dbCategories = await prisma.expenseCategory.findMany({
    orderBy: { name: 'asc' },
  });

  cachedCategories = [...DEFAULT_CATEGORIES, ...dbCategories.map((c) => c.name)];
  return cachedCategories;
}

/**
 * Sync function for routes that don't need DB (e.g., simple GET)
 */
export function getCategories(): string[] {
  // Return cached or default if available
  if (cachedCategories) return cachedCategories;
  return DEFAULT_CATEGORIES;
}

/**
 * Add custom category to database
 */
export async function addCategoryToDB(name: string): Promise<boolean> {
  try {
    await prisma.expenseCategory.create({
      data: { id: `CAT-${Date.now()}`, name },
    });
    cachedCategories = null; // Invalidate cache
    return true;
  } catch {
    return false;
  }
}

/**
 * Legacy sync function for addCategory
 */
export function addCategory(name: string): boolean {
  // This is sync for backward compatibility
  // In production, use addCategoryToDB
  const all = getCategories();
  if (all.includes(name)) return false;
  DEFAULT_CATEGORIES.push(name as ExpenseCategory);
  return true;
}

// ==========================================
// EXPENSE CRUD OPERATIONS
// ==========================================

/**
 * Create new expense (Pending status)
 */
export async function createExpense(params: {
  id_cabang: string;
  tanggal: Date;
  nominal: number;
  deskripsi: string;
  kategori: string;
  bukti_nota_url?: string;
}): Promise<Expense> {
  const id_expense = `EXP-${Date.now().toString(36).toUpperCase()}`;

  const expense = await prisma.expense.create({
    data: {
      id_expense,
      id_cabang: params.id_cabang,
      tanggal: params.tanggal,
      nominal: params.nominal,
      deskripsi: params.deskripsi,
      kategori: params.kategori,
      bukti_nota_url: params.bukti_nota_url ?? '',
      status: 'Pending',
      tanggal_pengajuan: new Date(),
    },
  });

  return {
    id_expense: expense.id_expense,
    id_cabang: expense.id_cabang,
    tanggal: expense.tanggal,
    nominal: expense.nominal,
    deskripsi: expense.deskripsi,
    kategori: expense.kategori,
    bukti_nota_url: expense.bukti_nota_url,
    status: expense.status as ExpenseStatus,
    tanggal_pengajuan: expense.tanggal_pengajuan,
    created_at: expense.created_at,
    updated_at: expense.updated_at,
  };
}

/**
 * Get expense by ID
 */
export async function getExpenseById(id_expense: string): Promise<Expense | null> {
  const expense = await prisma.expense.findUnique({
    where: { id_expense },
  });

  if (!expense) return null;

  return {
    id_expense: expense.id_expense,
    id_cabang: expense.id_cabang,
    tanggal: expense.tanggal,
    nominal: expense.nominal,
    deskripsi: expense.deskripsi,
    kategori: expense.kategori,
    bukti_nota_url: expense.bukti_nota_url,
    status: expense.status as ExpenseStatus,
    tanggal_pengajuan: expense.tanggal_pengajuan,
    tanggal_approval: expense.tanggal_approval ?? undefined,
    catatan_approval: expense.catatan_approval ?? undefined,
    created_at: expense.created_at,
    updated_at: expense.updated_at,
  };
}

/**
 * Get all expenses for a branch
 */
export async function getExpensesByBranch(id_cabang: string): Promise<Expense[]> {
  const expenses = await prisma.expense.findMany({
    where: { id_cabang },
    orderBy: { created_at: 'desc' },
  });

  return expenses.map((e) => ({
    id_expense: e.id_expense,
    id_cabang: e.id_cabang,
    tanggal: e.tanggal,
    nominal: e.nominal,
    deskripsi: e.deskripsi,
    kategori: e.kategori,
    bukti_nota_url: e.bukti_nota_url,
    status: e.status as ExpenseStatus,
    tanggal_pengajuan: e.tanggal_pengajuan,
    tanggal_approval: e.tanggal_approval ?? undefined,
    catatan_approval: e.catatan_approval ?? undefined,
    created_at: e.created_at,
    updated_at: e.updated_at,
  }));
}

/**
 * Get approved expenses for a branch
 */
export async function getApprovedExpensesByBranch(id_cabang: string): Promise<Expense[]> {
  const expenses = await prisma.expense.findMany({
    where: { id_cabang, status: 'Approve' },
    orderBy: { created_at: 'desc' },
  });

  return expenses.map((e) => ({
    id_expense: e.id_expense,
    id_cabang: e.id_cabang,
    tanggal: e.tanggal,
    nominal: e.nominal,
    deskripsi: e.deskripsi,
    kategori: e.kategori,
    bukti_nota_url: e.bukti_nota_url,
    status: e.status as ExpenseStatus,
    tanggal_pengajuan: e.tanggal_pengajuan,
    tanggal_approval: e.tanggal_approval ?? undefined,
    catatan_approval: e.catatan_approval ?? undefined,
    created_at: e.created_at,
    updated_at: e.updated_at,
  }));
}

/**
 * Get total approved expenses for a branch
 */
export async function getTotalApprovedExpenses(id_cabang: string): Promise<number> {
  const result = await prisma.expense.aggregate({
    where: { id_cabang, status: 'Approve' },
    _sum: { nominal: true },
  });

  return result._sum.nominal ?? 0;
}

/**
 * Update expense status (approve/reject)
 */
export async function updateExpenseStatus(
  id_expense: string,
  status: ExpenseStatus,
  catatan?: string,
): Promise<Expense | null> {
  try {
    const expense = await prisma.expense.update({
      where: { id_expense },
      data: {
        status,
        tanggal_approval: new Date(),
        catatan_approval: catatan,
      },
    });

    return {
      id_expense: expense.id_expense,
      id_cabang: expense.id_cabang,
      tanggal: expense.tanggal,
      nominal: expense.nominal,
      deskripsi: expense.deskripsi,
      kategori: expense.kategori,
      bukti_nota_url: expense.bukti_nota_url,
      status: expense.status as ExpenseStatus,
      tanggal_pengajuan: expense.tanggal_pengajuan,
      tanggal_approval: expense.tanggal_approval ?? undefined,
      catatan_approval: expense.catatan_approval ?? undefined,
      created_at: expense.created_at,
      updated_at: expense.updated_at,
    };
  } catch {
    return null;
  }
}

/**
 * Get all expenses (admin)
 */
export async function getAllExpenses(): Promise<Expense[]> {
  const expenses = await prisma.expense.findMany({
    orderBy: { created_at: 'desc' },
  });

  return expenses.map((e) => ({
    id_expense: e.id_expense,
    id_cabang: e.id_cabang,
    tanggal: e.tanggal,
    nominal: e.nominal,
    deskripsi: e.deskripsi,
    kategori: e.kategori,
    bukti_nota_url: e.bukti_nota_url,
    status: e.status as ExpenseStatus,
    tanggal_pengajuan: e.tanggal_pengajuan,
    tanggal_approval: e.tanggal_approval ?? undefined,
    catatan_approval: e.catatan_approval ?? undefined,
    created_at: e.created_at,
    updated_at: e.updated_at,
  }));
}

/**
 * Get expense breakdown by category for a branch
 */
export async function getExpensesByBranchAndCategory(id_cabang: string): Promise<Record<string, number>> {
  const expenses = await getApprovedExpensesByBranch(id_cabang);

  const breakdown: Record<string, number> = {};

  for (const cat of DEFAULT_CATEGORIES) {
    breakdown[cat] = 0;
  }

  for (const expense of expenses) {
    if (breakdown[expense.kategori] !== undefined) {
      breakdown[expense.kategori] += expense.nominal;
    } else {
      breakdown[expense.kategori] = expense.nominal;
    }
  }

  return breakdown;
}
