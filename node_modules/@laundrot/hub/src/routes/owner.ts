import { Router, type Request, type Response } from 'express';
import { BRANCHES } from '../config/branches.js';
import { getAllJournalEntries } from '../services/cashbook.js';
import {
  getAllExpenses,
  getExpensesByBranchAndCategory,
  getTotalApprovedExpenses,
} from '../services/expense.js';
import { getBudget } from '../services/budget.js';
import { getInventoryByBranch, getInventoryStatus, type StockEntry } from '../services/inventory.js';

const router = Router();

type HealthStatus = 'Healthy' | 'Warning' | 'Critical';
type MapPinColor = 'green' | 'yellow' | 'red';

interface CategoryAlert {
  kategori: string;
  nominal: number;
  percent_of_total: number;
  message: string;
}

interface MapCoordinates {
  latitude: number;
  longitude: number;
  pin_color: MapPinColor;
}

interface InventoryData {
  stocks: StockEntry[];
  overall_status: 'Aman' | 'Menipis' | 'Habis';
}

interface BranchFinancial {
  id_cabang: string;
  nama_cabang: string;
  wilayah: string;
  total_pemasukan: number;
  total_pengeluaran: number;
  omzet: number;
  saldo: number;
  pagu_anggaran: number;
  terpakai: number;
  sisa_pagu: number;
  utilization_percent: number;
  health_status: HealthStatus;
  category_breakdown: Record<string, number>;
  alerts: CategoryAlert[];
  transaction_count: number;
  map_coordinates: MapCoordinates;
  inventory: InventoryData;
}

interface DashboardResponse {
  success: boolean;
  summary: {
    total_pemasukan: number;
    total_pengeluaran: number;
    total_saldo: number;
    total_omzet: number;
    total_cabang: number;
    active_branches: number;
    branches_needing_attention: number;
  };
  per_cabang: BranchFinancial[];
  generated_at: string;
}

function determineHealthStatus(utilization_percent: number, inventoryStatus: string): HealthStatus {
  if (utilization_percent >= 90 || inventoryStatus === 'Habis') return 'Critical';
  if (utilization_percent >= 70 || inventoryStatus === 'Menipis') return 'Warning';
  return 'Healthy';
}

function determineMapPinColor(
  utilization_percent: number,
  inventoryStatus: 'Aman' | 'Menipis' | 'Habis',
): MapPinColor {
  if (utilization_percent >= 90 || inventoryStatus === 'Habis') return 'red';
  if (utilization_percent >= 80 || inventoryStatus === 'Menipis') return 'yellow';
  return 'green';
}

function detectCategoryAlerts(
  categoryBreakdown: Record<string, number>,
  totalPengeluaran: number,
): CategoryAlert[] {
  const alerts: CategoryAlert[] = [];
  const SPIKE_THRESHOLD = 0.4;

  if (totalPengeluaran === 0) return alerts;

  for (const [kategori, nominal] of Object.entries(categoryBreakdown)) {
    const percent = nominal / totalPengeluaran;

    if (percent > SPIKE_THRESHOLD) {
      alerts.push({
        kategori,
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
  const _expenses = getAllExpenses();

  const perCabang: BranchFinancial[] = BRANCHES.map((branch) => {
    const branchJournals = journals.filter((j) => j.id_cabang === branch.id_cabang);

    const total_pemasukan = branchJournals
      .filter((j) => j.tipe === 'Pemasukan')
      .reduce((sum, j) => sum + j.nominal, 0);

    const total_pengeluaran_from_journal = branchJournals
      .filter((j) => j.tipe === 'Pengeluaran')
      .reduce((sum, j) => sum + j.nominal, 0);

    const total_approved_expenses = getTotalApprovedExpenses(branch.id_cabang);

    const total_pengeluaran = total_pengeluaran_from_journal > 0 ? total_pengeluaran_from_journal : total_approved_expenses;

    const budget = getBudget(branch.id_cabang);
    const pagu_anggaran = budget?.pagu_anggaran ?? 0;
    const terpakai = budget?.terpakai ?? 0;
    const sisa_pagu = pagu_anggaran - terpakai;
    const utilization_percent = pagu_anggaran > 0 ? (terpakai / pagu_anggaran) * 100 : 0;
    const rounded_utilization = Math.round(utilization_percent * 100) / 100;

    const category_breakdown = getExpensesByBranchAndCategory(branch.id_cabang);
    const alerts = detectCategoryAlerts(category_breakdown, total_pengeluaran);

    const inventoryData = getInventoryByBranch(branch.id_cabang);
    const inventoryStatus = getInventoryStatus(branch.id_cabang);
    const pin_color = determineMapPinColor(rounded_utilization, inventoryStatus);
    const health_status = determineHealthStatus(rounded_utilization, inventoryStatus);

    return {
      id_cabang: branch.id_cabang,
      nama_cabang: branch.nama_cabang,
      wilayah: branch.wilayah,
      total_pemasukan,
      total_pengeluaran,
      omzet: branch.omzet,
      saldo: branch.omzet - total_pengeluaran,
      pagu_anggaran,
      terpakai,
      sisa_pagu,
      utilization_percent: rounded_utilization,
      health_status,
      category_breakdown,
      alerts,
      transaction_count: branchJournals.length,
      map_coordinates: {
        latitude: branch.latitude,
        longitude: branch.longitude,
        pin_color,
      },
      inventory: {
        stocks: inventoryData?.stocks ?? [],
        overall_status: inventoryStatus,
      },
    };
  });

  const total_pemasukan = perCabang.reduce((sum, b) => sum + b.total_pemasukan, 0);
  const total_pengeluaran = perCabang.reduce((sum, b) => sum + b.total_pengeluaran, 0);
  const total_omzet = perCabang.reduce((sum, b) => sum + b.omzet, 0);
  const total_saldo = total_omzet - total_pengeluaran;
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
      total_omzet,
      total_cabang: BRANCHES.length,
      active_branches,
      branches_needing_attention,
    },
    per_cabang: perCabang,
    generated_at: new Date().toISOString(),
  });
});

export default router;
