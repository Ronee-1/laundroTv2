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

const customCategories: string[] = [];

export function getCategories(): string[] {
  return [...DEFAULT_CATEGORIES, ...customCategories];
}

export function addCategory(name: string): boolean {
  const all = getCategories();
  if (all.includes(name)) return false;
  customCategories.push(name);
  return true;
}

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

const EXPENSES: Expense[] = [
  {
    id_expense: 'EXP-SEED-001',
    id_cabang: 'CBG-001',
    tanggal: new Date('2026-06-25'),
    nominal: 350000,
    deskripsi: 'Pengisian bensin truk rute lingkar luar Depok',
    kategori: 'BBM',
    bukti_nota_url: '',
    status: 'Approve',
    tanggal_pengajuan: new Date('2026-06-25'),
    tanggal_approval: new Date('2026-06-25'),
    created_at: new Date('2026-06-25'),
    updated_at: new Date('2026-06-25'),
  },
  {
    id_expense: 'EXP-SEED-002',
    id_cabang: 'CBG-002',
    tanggal: new Date('2026-06-26'),
    nominal: 1500000,
    deskripsi: 'Pembayaran tagihan listrik laundry kilat',
    kategori: 'Sewa & Utilitas',
    bukti_nota_url: '',
    status: 'Approve',
    tanggal_pengajuan: new Date('2026-06-26'),
    tanggal_approval: new Date('2026-06-26'),
    created_at: new Date('2026-06-26'),
    updated_at: new Date('2026-06-26'),
  },
  {
    id_expense: 'EXP-SEED-003',
    id_cabang: 'CBG-003',
    tanggal: new Date('2026-06-27'),
    nominal: 1200000,
    deskripsi: 'Uang lembur kurir akhir pekan',
    kategori: 'Gaji',
    bukti_nota_url: '',
    status: 'Approve',
    tanggal_pengajuan: new Date('2026-06-27'),
    tanggal_approval: new Date('2026-06-27'),
    created_at: new Date('2026-06-27'),
    updated_at: new Date('2026-06-27'),
  },
  {
    id_expense: 'EXP-SEED-004',
    id_cabang: 'CBG-002',
    tanggal: new Date('2026-06-28'),
    nominal: 800000,
    deskripsi: 'Pembelian darurat 4 jerigen detergen di agen lokal',
    kategori: 'Belanja Darurat',
    bukti_nota_url: '',
    status: 'Approve',
    tanggal_pengajuan: new Date('2026-06-28'),
    tanggal_approval: new Date('2026-06-28'),
    created_at: new Date('2026-06-28'),
    updated_at: new Date('2026-06-28'),
  },
];

export function createExpense(params: {
  id_cabang: string;
  tanggal: Date;
  nominal: number;
  deskripsi: string;
  kategori: string;
  bukti_nota_url: string;
}): Expense {
  const expense: Expense = {
    id_expense: `EXP-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
    id_cabang: params.id_cabang,
    tanggal: params.tanggal,
    nominal: params.nominal,
    deskripsi: params.deskripsi,
    kategori: params.kategori,
    bukti_nota_url: params.bukti_nota_url,
    status: 'Pending',
    tanggal_pengajuan: new Date(),
    created_at: new Date(),
    updated_at: new Date(),
  };

  EXPENSES.push(expense);
  return expense;
}

export function getExpenseById(id_expense: string): Expense | undefined {
  return EXPENSES.find((e) => e.id_expense === id_expense);
}

export function getExpensesByBranch(id_cabang: string): Expense[] {
  return EXPENSES.filter((e) => e.id_cabang === id_cabang);
}

export function getApprovedExpensesByBranch(id_cabang: string): Expense[] {
  return EXPENSES.filter((e) => e.id_cabang === id_cabang && e.status === 'Approve');
}

export function getTotalApprovedExpenses(id_cabang: string): number {
  return getApprovedExpensesByBranch(id_cabang).reduce((sum, e) => sum + e.nominal, 0);
}

export function updateExpenseStatus(
  id_expense: string,
  status: ExpenseStatus,
  catatan?: string,
): Expense | null {
  const expense = getExpenseById(id_expense);
  if (!expense) return null;

  expense.status = status;
  expense.updated_at = new Date();

  if (status === 'Approve' || status === 'Reject') {
    expense.tanggal_approval = new Date();
    expense.catatan_approval = catatan;
  }

  return expense;
}

export function getAllExpenses(): Expense[] {
  return [...EXPENSES];
}

export function getExpensesByBranchAndCategory(id_cabang: string): Record<string, number> {
  const expenses = getExpensesByBranch(id_cabang).filter((e) => e.status === 'Approve');
  const breakdown: Record<string, number> = {};

  for (const cat of DEFAULT_CATEGORIES) {
    breakdown[cat] = 0;
  }
  for (const cat of customCategories) {
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
