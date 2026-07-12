import { prisma } from '../lib/prisma.js';

// Re-export MACRO_FINANCIALS from branches for compatibility
export { MACRO_FINANCIALS } from '../config/branches.js';

// ==========================================
// BUDGET SERVICE - FR-FIN-03 Core Implementation
// Kontrol anggaran ketat (Anti-Overbudget)
// Deviasi pengeluaran bulanan maksimal 5% dari pagu yang ditetapkan
// ==========================================

export interface MonthlyBudget {
  id: string;
  id_cabang: string;
  bulan: string;
  tahun: number;
  pagu_anggaran: number;
  terpakai: number;
}

/**
 * Get current month name in Indonesian
 */
function getCurrentMonth(): string {
  return new Date().toLocaleDateString('id-ID', { month: 'long' });
}

/**
 * Get or create budget for a branch in a specific month/year
 */
export async function getOrCreateBudget(
  id_cabang: string,
  bulan?: string,
  tahun?: number
): Promise<MonthlyBudget | null> {
  const targetBulan = bulan ?? getCurrentMonth();
  const targetTahun = tahun ?? new Date().getFullYear();

  let budget = await prisma.monthlyBudget.findUnique({
    where: {
      id_cabang_bulan_tahun: {
        id_cabang,
        bulan: targetBulan,
        tahun: targetTahun,
      },
    },
  });

  // If no budget exists for this month, create default budget
  if (!budget) {
    const DEFAULT_PAGU = 5000000; // Default Rp 5.000.000 per bulan

    budget = await prisma.monthlyBudget.create({
      data: {
        id_cabang,
        bulan: targetBulan,
        tahun: targetTahun,
        pagu_anggaran: DEFAULT_PAGU,
        terpakai: 0,
      },
    });
  }

  return {
    id: budget.id,
    id_cabang: budget.id_cabang,
    bulan: budget.bulan,
    tahun: budget.tahun,
    pagu_anggaran: budget.pagu_anggaran,
    terpakai: budget.terpakai,
  };
}

/**
 * Get budget for a branch (legacy sync signature for compatibility)
 */
export async function getBudget(id_cabang: string, bulan?: string, tahun?: number): Promise<MonthlyBudget | null> {
  return getOrCreateBudget(id_cabang, bulan, tahun);
}

/**
 * Get remaining budget (sisa pagu)
 */
export async function getSisaPagu(id_cabang: string): Promise<number> {
  const budget = await getOrCreateBudget(id_cabang);
  if (!budget) return 0;
  return budget.pagu_anggaran - budget.terpakai;
}

/**
 * Deduct from budget when expense is approved
 */
export async function deductBudget(id_cabang: string, nominal: number): Promise<boolean> {
  const budget = await getOrCreateBudget(id_cabang);
  if (!budget) return false;

  const sisa = budget.pagu_anggaran - budget.terpakai;
  if (nominal > sisa) return false;

  // Update terpakai in database
  await prisma.monthlyBudget.update({
    where: {
      id_cabang_bulan_tahun: {
        id_cabang,
        bulan: budget.bulan,
        tahun: budget.tahun,
      },
    },
    data: {
      terpakai: {
        increment: nominal,
      },
    },
  });

  return true;
}

/**
 * Check if expense would exceed budget
 */
export async function checkOverbudget(
  id_cabang: string,
  nominal: number
): Promise<{
  overbudget: boolean;
  sisa_pagu: number;
  pagu_anggaran: number;
  terpakai: number;
  requested: number;
  projected_total: number;
}> {
  const budget = await getOrCreateBudget(id_cabang);

  if (!budget) {
    return {
      overbudget: true,
      sisa_pagu: 0,
      pagu_anggaran: 0,
      terpakai: 0,
      requested: nominal,
      projected_total: nominal,
    };
  }

  const sisa_pagu = budget.pagu_anggaran - budget.terpakai;
  const projected_total = budget.terpakai + nominal;

  return {
    overbudget: nominal > sisa_pagu,
    sisa_pagu,
    pagu_anggaran: budget.pagu_anggaran,
    terpakai: budget.terpakai,
    requested: nominal,
    projected_total,
  };
}

/**
 * Get all budgets (for admin purposes)
 */
export async function getAllBudgets(): Promise<MonthlyBudget[]> {
  const budgets = await prisma.monthlyBudget.findMany({
    orderBy: [
      { tahun: 'desc' },
      { bulan: 'desc' },
      { id_cabang: 'asc' },
    ],
  });

  return budgets.map((b) => ({
    id: b.id,
    id_cabang: b.id_cabang,
    bulan: b.bulan,
    tahun: b.tahun,
    pagu_anggaran: b.pagu_anggaran,
    terpakai: b.terpakai,
  }));
}

/**
 * Update budget pagu (for owner to adjust)
 */
export async function updateBudgetPagu(
  id_cabang: string,
  pagu_anggaran: number,
  bulan?: string,
  tahun?: number
): Promise<MonthlyBudget | null> {
  const targetBulan = bulan ?? getCurrentMonth();
  const targetTahun = tahun ?? new Date().getFullYear();

  const budget = await prisma.monthlyBudget.upsert({
    where: {
      id_cabang_bulan_tahun: {
        id_cabang,
        bulan: targetBulan,
        tahun: targetTahun,
      },
    },
    update: {
      pagu_anggaran,
    },
    create: {
      id_cabang,
      bulan: targetBulan,
      tahun: targetTahun,
      pagu_anggaran,
      terpakai: 0,
    },
  });

  return {
    id: budget.id,
    id_cabang: budget.id_cabang,
    bulan: budget.bulan,
    tahun: budget.tahun,
    pagu_anggaran: budget.pagu_anggaran,
    terpakai: budget.terpakai,
  };
}
