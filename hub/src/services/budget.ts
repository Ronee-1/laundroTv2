import { MACRO_FINANCIALS } from '../config/branches.js';

// ==========================================
// BUDGET SERVICE - FR-FIN-03 Core Implementation
// Kontrol anggaran ketat (Anti-Overbudget)
// Deviasi pengeluaran bulanan maksimal 5% dari pagu yang ditetapkan
// ==========================================

export interface MonthlyBudget {
  id_cabang: string;
  bulan: string;
  tahun: number;
  pagu_anggaran: number;
  terpakai: number;
}

const BUDGETS: MonthlyBudget[] = [
  {
    id_cabang: 'CBG-001',
    bulan: 'Juli',
    tahun: 2026,
    pagu_anggaran: 5000000,
    terpakai: 350000,
  },
  {
    id_cabang: 'CBG-002',
    bulan: 'Juli',
    tahun: 2026,
    pagu_anggaran: 5000000,
    terpakai: 2300000,
  },
  {
    id_cabang: 'CBG-003',
    bulan: 'Juli',
    tahun: 2026,
    pagu_anggaran: 4000000,
    terpakai: 1200000,
  },
  {
    id_cabang: 'CBG-004',
    bulan: 'Juli',
    tahun: 2026,
    pagu_anggaran: 4500000,
    terpakai: 2800000,
  },
  {
    id_cabang: 'CBG-005',
    bulan: 'Juli',
    tahun: 2026,
    pagu_anggaran: 4000000,
    terpakai: 3850000, // Near limit - 96.25% utilized
  },
];

// Export macro financials for dashboard
export { MACRO_FINANCIALS };

export function getBudget(id_cabang: string, bulan?: string, tahun?: number): MonthlyBudget | undefined {
  const now = new Date();
  const targetBulan = bulan ?? now.toLocaleDateString('id-ID', { month: 'long' });
  const targetTahun = tahun ?? now.getFullYear();

  return BUDGETS.find((b) => b.id_cabang === id_cabang && b.bulan === targetBulan && b.tahun === targetTahun);
}

export function getSisaPagu(id_cabang: string): number {
  const budget = getBudget(id_cabang);
  if (!budget) return 0;
  return budget.pagu_anggaran - budget.terpakai;
}

export function deductBudget(id_cabang: string, nominal: number): boolean {
  const budget = getBudget(id_cabang);
  if (!budget) return false;

  const sisa = budget.pagu_anggaran - budget.terpakai;
  if (nominal > sisa) return false;

  budget.terpakai += nominal;
  return true;
}

export function checkOverbudget(id_cabang: string, nominal: number): {
  overbudget: boolean;
  sisa_pagu: number;
  pagu_anggaran: number;
  terpakai: number;
  requested: number;
  projected_total: number;
} {
  const budget = getBudget(id_cabang);

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
