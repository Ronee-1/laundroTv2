/**
 * Daily Summary API
 * GET /api/branches/:id/daily-summary
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
    const authHeader = request.headers.get('authorization');
    const authResult = requireAuth(authHeader);

    if (!authResult.authorized) {
      return errorResponse(authResult.error, authResult.status);
    }

    // Check branch access
    if (authResult.user.role === 'Admin' && authResult.user.id_cabang !== id_cabang) {
      return errorResponse('Access denied', 403);
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Get today's orders
    const todayOrders = await prisma.order.findMany({
      where: {
        id_cabang,
        created_at: { gte: today },
      },
    });

    // Get today's expenses
    const todayExpenses = await prisma.expense.findMany({
      where: {
        id_cabang,
        tanggal: { gte: today },
        status: 'Approve',
      },
    });

    // Get today's cashbook entries
    const todayCashbook = await prisma.cashBookEntry.findMany({
      where: {
        id_cabang,
        tanggal_jurnal: { gte: today },
      },
    });

    const totalPemasukan = todayCashbook
      .filter((e) => e.tipe === 'Pemasukan')
      .reduce((sum, e) => sum + e.nominal, 0);

    const totalPengeluaran = todayCashbook
      .filter((e) => e.tipe === 'Pengeluaran')
      .reduce((sum, e) => sum + e.nominal, 0);

    return jsonResponse({
      success: true,
      data: {
        id_cabang,
        tanggal: today.toISOString(),
        orders: {
          total: todayOrders.length,
          pending: todayOrders.filter((o) => o.status === 'Pending').length,
          completed: todayOrders.filter((o) => ['Done', 'Selesai', 'Lunas'].includes(o.status)).length,
        },
        expenses: {
          total: todayExpenses.reduce((sum, e) => sum + e.nominal, 0),
          count: todayExpenses.length,
        },
        cashbook: {
          total_pemasukan: totalPemasukan,
          total_pengeluaran: totalPengeluaran,
          saldo: totalPemasukan - totalPengeluaran,
        },
      },
    });
  } catch (error) {
    console.error('[Branch] Daily summary error:', error);
    return errorResponse('Internal server error', 500);
  }
}
