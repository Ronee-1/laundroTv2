/**
 * Owner Dashboard API
 * GET /api/owner/dashboard
 * Returns consolidated data for executive dashboard
 */

import { prisma } from '../../lib/prisma';
import { requireRole } from '../utils/auth';
import { getCorsHeaders } from '../utils/cors';
import { jsonResponse, errorResponse } from '../utils/response';

export async function GET(request: Request) {
  try {
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: getCorsHeaders() });
    }

    const authHeader = request.headers.get('authorization');
    const authResult = requireRole(authHeader, 'Owner');

    if (!authResult.authorized) {
      return errorResponse(authResult.error, authResult.status);
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
    let totalPengeluaran = 0;
    let totalPaguBudget = 0;

    const branchData = branches.map((branch) => {
      // Calculate omzet from orders
      const branchOmzet = branch.orders.reduce((sum, o) => sum + (o.total_harga || 0), 0);
      totalOmzet += branchOmzet;

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

      return {
        id_cabang: branch.id_cabang,
        nama_cabang: branch.nama_cabang,
        wilayah: branch.wilayah,
        latitude: branch.latitude,
        longitude: branch.longitude,
        omzet: branchOmzet,
        total_pengeluaran: branchPengeluaran,
        pagu_anggaran: pagu,
        terpakai,
        utilization_percent: Math.round(utilizationPercent * 100) / 100,
        inventory: {
          stocks: inventoryStatus,
        },
        map_status: hasKritis || isOverBudget ? 'Kritis' : hasMenipis || isCloseBudget ? 'Butuh Perhatian' : 'Aman',
      };
    });

    const totalProfit = totalOmzet - totalPengeluaran;
    const profitEfficiency = totalOmzet > 0 ? (totalProfit / totalOmzet) * 100 : 0;

    return jsonResponse({
      success: true,
      data: {
        summary: {
          total_omzet: totalOmzet,
          total_pengeluaran: totalPengeluaran,
          total_profit: totalProfit,
          profit_efficiency: Math.round(profitEfficiency * 100) / 100,
          total_budget_pagu: totalPaguBudget,
        },
        branches: branchData,
        total_branches: branches.length,
        generated_at: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('[Owner Dashboard] Error:', error);
    return errorResponse('Internal server error', 500);
  }
}
