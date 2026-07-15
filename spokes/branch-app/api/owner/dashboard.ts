/**
 * Owner Dashboard API
 * GET /api/owner/dashboard
 * Returns consolidated data for executive dashboard
 */

import { prisma } from '../../lib/prisma';
import { requireRole } from '../../utils/auth';
import { getCorsHeaders } from '../../utils/cors';
import { jsonResponse, errorResponse } from '../../utils/response';

export async function GET(request: Request) {
  try {
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: getCorsHeaders() });
    }

    const authHeader = request.headers.get('authorization');
    const authResult = requireRole(authHeader, 'Owner');

    if (!authResult.authorized) {
      return jsonResponse({ success: false, error: authResult.error }, authResult.status);
    }

    // Get all branches with their inventory
    const branches = await prisma.branch.findMany({
      where: { is_active: true },
      include: {
        inventory_items: true,
        orders: {
          where: {
            created_at: {
              gte: new Date(new Date().setDate(1)), // Start of current month
            },
          },
        },
        expenses: {
          where: {
            tanggal: {
              gte: new Date(new Date().setDate(1)),
            },
          },
        },
        cashbook_entries: {
          where: {
            tanggal_jurnal: {
              gte: new Date(new Date().setDate(1)),
            },
          },
        },
        monthly_budgets: {
          where: {
            bulan: new Date().toLocaleString('default', { month: 'short' }).toUpperCase(),
            tahun: new Date().getFullYear(),
          },
        },
      },
    });

    // Calculate consolidated metrics
    let totalOmzet = 0;
    let totalPemasukan = 0;
    let totalPengeluaran = 0;
    let totalPaguBudget = 0;

    const perCabang = branches.map((branch) => {
      // Calculate omzet from orders
      const branchOmzet = branch.orders.reduce((sum, o) => sum + (o.total_harga || 0), 0);
      totalOmzet += branchOmzet;

      // Calculate cashbook income (pemasukan)
      const branchPemasukan = branch.cashbook_entries
        .filter((e) => e.tipe === 'Pemasukan')
        .reduce((sum, e) => sum + e.nominal, 0);
      totalPemasukan += branchPemasukan;

      // Calculate expenses
      const branchPengeluaran = branch.expenses
        .filter((e) => e.status === 'Approve')
        .reduce((sum, e) => sum + e.nominal, 0);
      totalPengeluaran += branchPengeluaran;

      // Budget info
      const budget = branch.monthly_budgets[0];
      const terpakai = budget?.terpakai || branchPengeluaran;
      const pagu = budget?.pagu_anggaran || 0;
      totalPaguBudget += pagu;

      // Calculate saldo (profit)
      const branchSaldo = branchPemasukan - branchPengeluaran;

      // Inventory status
      const inventoryStatus = branch.inventory_items.map((item) => {
        const isLow = item.stok_saat_ini <= item.safety_threshold;
        const isKritis = item.stok_saat_ini < item.safety_threshold * 0.5;

        return {
          item: item.item,
          stok_saat_ini: item.stok_saat_ini,
          safety_threshold: item.safety_threshold,
          max_capacity: item.max_capacity,
          status: isKritis ? 'Kritis' : isLow ? 'Menipis' : 'Aman',
        };
      });

      const hasKritis = inventoryStatus.some((s) => s.status === 'Kritis');
      const hasMenipis = inventoryStatus.some((s) => s.status === 'Menipis');
      const utilizationPercent = pagu > 0 ? (terpakai / pagu) * 100 : 0;
      const isOverBudget = terpakai > pagu;
      const isCloseBudget = utilizationPercent >= 90;

      // Determine health status
      let healthStatus: 'Healthy' | 'Warning' | 'Critical' = 'Healthy';
      if (hasKritis || isOverBudget) healthStatus = 'Critical';
      else if (hasMenipis || isCloseBudget) healthStatus = 'Warning';

      return {
        id_cabang: branch.id_cabang,
        nama_cabang: branch.nama_cabang,
        wilayah: branch.wilayah,
        total_pemasukan: branchPemasukan || branchOmzet, // Fallback to omzet if no cashbook
        total_pengeluaran: branchPengeluaran,
        omzet: branchOmzet,
        saldo: branchSaldo,
        pagu_anggaran: pagu,
        terpakai,
        sisa_pagu: Math.max(0, pagu - terpakai),
        utilization_percent: Math.round(utilizationPercent * 100) / 100,
        health_status: healthStatus,
        category_breakdown: {},
        alerts: [],
        transaction_count: branch.orders.length + branch.expenses.length,
        map_coordinates: {
          latitude: branch.latitude,
          longitude: branch.longitude,
          pin_color: hasKritis || isOverBudget ? 'red' : hasMenipis || isCloseBudget ? 'yellow' : 'green',
        },
        inventory: {
          stocks: inventoryStatus,
          overall_status: hasKritis ? 'Kritis' : hasMenipis ? 'Menipis' : 'Aman',
        },
        in_transit: [],
        replenishment: {
          needs_replenishment: hasKritis,
          items: inventoryStatus
            .filter((s) => s.status === 'Kritis' || s.status === 'Menipis')
            .map((s) => ({
              item: s.item,
              satuan: 'PCS',
              stok_saat_ini: s.stok_saat_ini,
              max_capacity: s.max_capacity,
              safety_threshold: s.safety_threshold,
              kebutuhan: s.max_capacity - s.stok_saat_ini,
              is_below_threshold: s.status === 'Kritis' || s.status === 'Menipis',
            })),
        },
      };
    });

    const totalProfit = totalPemasukan - totalPengeluaran;
    const profitEfficiency = totalOmzet > 0 ? (totalProfit / totalOmzet) * 100 : 0;
    const branchesNeedingAttention = perCabang.filter(
      (b) => b.health_status === 'Critical' || b.health_status === 'Warning'
    ).length;

    return jsonResponse({
      success: true,
      summary: {
        total_pemasukan: totalPemasukan,
        total_pengeluaran: totalPengeluaran,
        total_saldo: totalProfit,
        total_omzet: totalOmzet,
        total_cabang: branches.length,
        active_branches: branches.filter((b) => b.is_active).length,
        branches_needing_attention: branchesNeedingAttention,
      },
      per_cabang: perCabang,
      generated_at: new Date().toISOString(),
    });
  } catch (error) {
    console.error('[Owner Dashboard] Error:', error);
    return errorResponse('Internal server error', 500);
  }
}
