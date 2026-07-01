import { Router, type Request, type Response } from 'express';
import { BRANCHES } from '../config/branches.js';
import { getAllJournalEntries } from '../services/cashbook.js';
import { getAllExpenses, getExpensesByBranchAndCategory, type ExpenseCategory } from '../services/expense.js';
import { getBudget } from '../services/budget.js';

const router = Router();

type HealthStatus = 'Healthy' | 'Warning' | 'Critical';

interface CategoryAlert {
  kategori: ExpenseCategory;
  nominal: number;
  percent_of_total: number;
  message: string;
}

interface BranchFinancial {
  id_cabang: string;
  nama_cabang: string;
  total_pemasukan: number;
  total_pengeluaran: number;
  saldo: number;
  pagu_anggaran: number;
  terpakai: number;
  sisa_pagu: number;
  utilization_percent: number;
  health_status: HealthStatus;
  category_breakdown: Record<ExpenseCategory, number>;
  alerts: CategoryAlert[];
  transaction_count: number;
}

interface DashboardResponse {
  success: boolean;
  summary: {
    total_pemasukan: number;
    total_pengeluaran: number;
    total_saldo: number;
    total_cabang: number;
    active_branches: number;
    branches_needing_attention: number;
  };
  per_cabang: BranchFinancial[];
  generated_at: string;
}

function determineHealthStatus(utilization_percent: number): HealthStatus {
  if (utilization_percent >= 90) return 'Critical';
  if (utilization_percent >= 70) return 'Warning';
  return 'Healthy';
}

function detectCategoryAlerts(
  categoryBreakdown: Record<ExpenseCategory, number>,
  totalPengeluaran: number,
): CategoryAlert[] {
  const alerts: CategoryAlert[] = [];
  const SPIKE_THRESHOLD = 0.4;

  if (totalPengeluaran === 0) return alerts;

  for (const [kategori, nominal] of Object.entries(categoryBreakdown)) {
    const percent = nominal / totalPengeluaran;

    if (percent > SPIKE_THRESHOLD) {
      alerts.push({
        kategori: kategori as ExpenseCategory,
        nominal,
        percent_of_total: Math.round(percent * 10000) / 100,
        message: `Pengeluaran kategori ${kategori} mencapai ${Math.round(percent * 100)}% dari total pengeluaran cabang. Perlu ditinjau.`,
      });
    }
  }

  return alerts;
}

router.get('/dashboard', (_req: Request, res: Response<DashboardResponse>) => {
  const journals = getAllJournalEntries();
  const expenses = getAllExpenses();

  const perCabang: BranchFinancial[] = BRANCHES.map((branch) => {
    const branchJournals = journals.filter((j) => j.id_cabang === branch.id_cabang);
    const branchExpenses = expenses.filter((e) => e.id_cabang === branch.id_cabang && e.status === 'Approve');

    const total_pemasukan = branchJournals
      .filter((j) => j.tipe === 'Pemasukan')
      .reduce((sum, j) => sum + j.nominal, 0);

    const total_pengeluaran = branchJournals
      .filter((j) => j.tipe === 'Pengeluaran')
      .reduce((sum, j) => sum + j.nominal, 0);

    const budget = getBudget(branch.id_cabang);
    const pagu_anggaran = budget?.pagu_anggaran ?? 0;
    const terpakai = budget?.terpakai ?? 0;
    const sisa_pagu = pagu_anggaran - terpakai;
    const utilization_percent = pagu_anggaran > 0 ? (terpakai / pagu_anggaran) * 100 : 0;
    const rounded_utilization = Math.round(utilization_percent * 100) / 100;

    const health_status = determineHealthStatus(rounded_utilization);
    const category_breakdown = getExpensesByBranchAndCategory(branch.id_cabang);
    const alerts = detectCategoryAlerts(category_breakdown, total_pengeluaran);

    return {
      id_cabang: branch.id_cabang,
      nama_cabang: branch.nama_cabang,
      total_pemasukan,
      total_pengeluaran,
      saldo: total_pemasukan - total_pengeluaran,
      pagu_anggaran,
      terpakai,
      sisa_pagu,
      utilization_percent: rounded_utilization,
      health_status,
      category_breakdown,
      alerts,
      transaction_count: branchJournals.length + branchExpenses.length,
    };
  });

  const total_pemasukan = perCabang.reduce((sum, b) => sum + b.total_pemasukan, 0);
  const total_pengeluaran = perCabang.reduce((sum, b) => sum + b.total_pengeluaran, 0);
  const total_saldo = total_pemasukan - total_pengeluaran;
  const active_branches = BRANCHES.filter((b) => b.is_active).length;
  const branches_needing_attention = perCabang.filter(
    (b) => b.health_status === 'Warning' || b.health_status === 'Critical',
  ).length;

  res.status(200).json({
    success: true,
    summary: {
      total_pemasukan,
      total_pengeluaran,
      total_saldo,
      total_cabang: BRANCHES.length,
      active_branches,
      branches_needing_attention,
    },
    per_cabang: perCabang,
    generated_at: new Date().toISOString(),
  });
});

export default router;
