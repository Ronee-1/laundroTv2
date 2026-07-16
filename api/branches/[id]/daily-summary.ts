/**
 * Daily Summary API
 * GET /api/branches/:id/daily-summary
 *
 * Revenue data is sourced from cashbook entries (Audit Kas)
 * Tunai payments are automatically recorded as cashbook entries
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

    // DEBUG: Log timezone info
    console.log(`[DAILY SUMMARY] Requested for branch: ${id_cabang}`);
    console.log(`[DAILY SUMMARY] Today (local midnight): ${today.toISOString()}`);
    console.log(`[DAILY SUMMARY] Now (server time): ${new Date().toISOString()}`);

    // Get start of month
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    // Get today's cashbook entries (PEMASUKAN = Tunai)
    const todayCashbook = await prisma.cashBookEntry.findMany({
      where: {
        id_cabang,
        tanggal_jurnal: { gte: today },
      },
    });

    // DEBUG: Log cashbook entries
    console.log(`[DAILY SUMMARY] Cashbook entries today: ${todayCashbook.length}`);
    todayCashbook.forEach((e) => {
      console.log(`[DAILY SUMMARY]   - ${e.id_jurnal}: ${e.tipe} Rp${e.nominal} at ${e.tanggal_jurnal.toISOString()}`);
    });

    // Get month's cashbook entries
    const monthCashbook = await prisma.cashBookEntry.findMany({
      where: {
        id_cabang,
        tanggal_jurnal: { gte: startOfMonth },
      },
    });

    // Calculate Tunai revenue from cashbook (Pemasukan = Tunai payments)
    const todayCash = todayCashbook
      .filter((e) => e.tipe === 'Pemasukan')
      .reduce((sum, e) => sum + e.nominal, 0);

    // Get Non-Tunai revenue from orders (payments not yet in cashbook)
    const todayOrders = await prisma.order.findMany({
      where: {
        id_cabang,
        created_at: { gte: today },
        metode_pembayaran: 'Non-Tunai',
      },
    });

    // DEBUG: Log Non-Tunai orders
    console.log(`[DAILY SUMMARY] Non-Tunai orders today: ${todayOrders.length}`);
    todayOrders.forEach((o) => {
      console.log(`[DAILY SUMMARY]   - ${o.id_order}: Rp${o.total_harga} at ${o.created_at.toISOString()}`);
    });

    const todayNonCash = todayOrders.reduce((sum, o) => sum + (o.total_harga || 0), 0);

    // Month totals
    const monthCash = monthCashbook
      .filter((e) => e.tipe === 'Pemasukan')
      .reduce((sum, e) => sum + e.nominal, 0);

    const monthOrders = await prisma.order.findMany({
      where: {
        id_cabang,
        created_at: { gte: startOfMonth },
        metode_pembayaran: 'Non-Tunai',
      },
    });

    const monthNonCash = monthOrders.reduce((sum, o) => sum + (o.total_harga || 0), 0);

    // Total revenue = Tunai (cashbook) + Non-Tunai (orders)
    const todayRevenue = todayCash + todayNonCash;
    const monthRevenue = monthCash + monthNonCash;

    // Get today's orders count (all payment types)
    const todayOrdersAll = await prisma.order.findMany({
      where: {
        id_cabang,
        created_at: { gte: today },
      },
    });

    const monthOrdersAll = await prisma.order.findMany({
      where: {
        id_cabang,
        created_at: { gte: startOfMonth },
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

    const totalPengeluaran = todayCashbook
      .filter((e) => e.tipe === 'Pengeluaran')
      .reduce((sum, e) => sum + e.nominal, 0);

    return jsonResponse({
      success: true,
      // Main revenue metrics
      today_revenue: todayRevenue,
      month_revenue: monthRevenue,
      today_orders: todayOrdersAll.length,
      month_orders: monthOrdersAll.length,
      // Tunai from cashbook (Audit Kas)
      today_cash: todayCash,
      month_cash: monthCash,
      // Non-Tunai from orders
      today_non_cash: todayNonCash,
      month_non_cash: monthNonCash,
      // Balance from cashbook
      cashbook_balance: todayCash - totalPengeluaran,
      // Detail data
      data: {
        id_cabang,
        tanggal: today.toISOString(),
        orders: {
          total: todayOrdersAll.length,
          pending: todayOrdersAll.filter((o) => o.status === 'Pending').length,
          completed: todayOrdersAll.filter((o) => ['Done', 'Selesai', 'Lunas'].includes(o.status)).length,
        },
        expenses: {
          total: todayExpenses.reduce((sum, e) => sum + e.nominal, 0),
          count: todayExpenses.length,
        },
        cashbook: {
          total_pemasukan: todayCash,
          total_pengeluaran: totalPengeluaran,
          saldo: todayCash - totalPengeluaran,
        },
      },
    });
  } catch (error) {
    console.error('[Branch] Daily summary error:', error);
    return errorResponse('Internal server error', 500);
  }
}
