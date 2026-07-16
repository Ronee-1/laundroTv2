/**
 * Branch Budget API
 * GET /api/branches/:id/budget
 *
 * Returns monthly budget data for the specified branch
 */

import { prisma } from '../../../lib/prisma';
import { requireAuth } from '../../utils/auth';
import { getCorsHeaders } from '../../utils/cors';
import { jsonResponse, errorResponse } from '../../utils/response';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: getCorsHeaders() });
    }

    const { id: id_cabang } = await params;
    const url = new URL(request.url);
    const bulan = url.searchParams.get('bulan');
    const tahun = url.searchParams.get('tahun');

    const authHeader = request.headers.get('authorization');
    const authResult = requireAuth(authHeader);

    if (!authResult.authorized) {
      return errorResponse(authResult.error, authResult.status);
    }

    // Check branch access
    if (authResult.user.role === 'Admin' && authResult.user.id_cabang !== id_cabang) {
      return errorResponse('Access denied', 403);
    }

    // Get current month/year if not provided
    const now = new Date();
    const bulanParam = bulan || now.toLocaleString('id-ID', { month: 'short' }).toUpperCase();
    const tahunParam = tahun ? parseInt(tahun) : now.getFullYear();

    // Get monthly budget for this branch
    const monthlyBudget = await prisma.monthlyBudget.findFirst({
      where: {
        id_cabang,
        bulan: bulanParam,
        tahun: tahunParam,
      },
    });

    // Calculate budget utilization from expenses
    const startOfMonth = new Date(tahunParam, getMonthIndex(bulanParam), 1);
    const endOfMonth = new Date(tahunParam, getMonthIndex(bulanParam) + 1, 0, 23, 59, 59);

    const expenses = await prisma.expense.findMany({
      where: {
        id_cabang,
        tanggal: {
          gte: startOfMonth,
          lte: endOfMonth,
        },
        status: 'Approve',
      },
    });

    const terpakai = expenses.reduce((sum, e) => sum + e.nominal, 0);
    const pagu_anggaran = monthlyBudget?.pagu_anggaran || 0;
    const sisa_pagu = pagu_anggaran - terpakai;
    const utilization_percent = pagu_anggaran > 0 ? Math.round((terpakai / pagu_anggaran) * 100) : 0;

    // Calculate daily average (based on days passed in month)
    const daysInMonth = endOfMonth.getDate();
    const currentDay = Math.min(now.getDate(), daysInMonth);
    const daysPassed = currentDay > 0 ? currentDay : 1;
    const daily_average = daysPassed > 0 ? Math.round(terpakai / daysPassed) : 0;

    // Get branch info
    const branch = await prisma.branch.findUnique({
      where: { id_cabang },
      select: { nama_cabang: true, omzet: true },
    });

    return jsonResponse({
      success: true,
      data: {
        id_cabang,
        nama_cabang: branch?.nama_cabang || id_cabang,
        bulan: bulanParam,
        tahun: tahunParam,
        budget: {
          pagu_anggaran,
          terpakai,
          sisa_pagu,
          utilization_percent,
          daily_average,
          omzet: branch?.omzet || 0,
        },
      },
    });
  } catch (error) {
    console.error('[Branch Budget] Error:', error);
    return errorResponse('Internal server error', 500);
  }
}

// Helper function to convert month name to index
function getMonthIndex(monthName: string): number {
  const months: Record<string, number> = {
    'JAN': 0, 'FEB': 1, 'MAR': 2, 'APR': 3, 'MAY': 4, 'JUN': 5,
    'JUL': 6, 'AUG': 7, 'SEP': 8, 'OCT': 9, 'NOV': 10, 'DEC': 11,
  };
  return months[monthName.toUpperCase()] || 0;
}
