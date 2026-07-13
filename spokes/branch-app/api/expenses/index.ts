/**
 * Expenses API
 * GET /api/expenses - List expenses
 * POST /api/expenses - Create expense request
 */

import { prisma } from '../../lib/prisma';
import { requireAuth, requireRole } from '../../utils/auth';
import { getCorsHeaders } from '../../utils/cors';
import { jsonResponse, errorResponse } from '../../utils/response';

export async function GET(request: Request) {
  try {
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: getCorsHeaders() });
    }

    const authHeader = request.headers.get('authorization');
    const authResult = requireAuth(authHeader);

    if (!authResult.authorized) {
      return jsonResponse({ success: false, error: authResult.error }, authResult.status);
    }

    const url = new URL(request.url);
    const id_cabang = url.searchParams.get('id_cabang');
    const status = url.searchParams.get('status');
    const limit = parseInt(url.searchParams.get('limit') || '50');

    // Build where clause
    const where: Record<string, unknown> = {};

    if (authResult.user.role === 'Admin' && authResult.user.id_cabang) {
      where.id_cabang = authResult.user.id_cabang;
    } else if (id_cabang) {
      where.id_cabang = id_cabang;
    }

    if (status) {
      where.status = status;
    }

    const expenses = await prisma.expense.findMany({
      where,
      include: {
        branch: {
          select: { id_cabang: true, nama_cabang: true },
        },
      },
      orderBy: { created_at: 'desc' },
      take: limit,
    });

    return jsonResponse({
      success: true,
      data: {
        total: expenses.length,
        expenses,
      },
    });
  } catch (error) {
    console.error('[Expenses] Get error:', error);
    return errorResponse('Internal server error', 500);
  }
}

interface ExpenseRequest {
  id_cabang: string;
  nominal: number;
  deskripsi: string;
  kategori: string;
  bukti_nota_url?: string;
  tanggal: string;
}

export async function POST(request: Request) {
  try {
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: getCorsHeaders() });
    }

    const authHeader = request.headers.get('authorization');
    const authResult = requireRole(authHeader, 'Owner', 'Admin');

    if (!authResult.authorized) {
      return jsonResponse({ success: false, error: authResult.error }, authResult.status);
    }

    const body: ExpenseRequest = await request.json();

    // Validation
    if (!body.id_cabang || !body.nominal || !body.deskripsi || !body.kategori) {
      return errorResponse('Missing required fields', 400);
    }

    if (body.nominal <= 0) {
      return errorResponse('Nominal must be greater than 0', 400);
    }

    // Check branch access
    if (authResult.user.role === 'Admin' && authResult.user.id_cabang !== body.id_cabang) {
      return errorResponse('Access denied to this branch', 403);
    }

    // Check budget (for Admin)
    if (authResult.user.role === 'Admin') {
      const currentMonth = new Date().toLocaleString('default', { month: 'short' }).toUpperCase();
      const currentYear = new Date().getFullYear();

      const budget = await prisma.monthlyBudget.findUnique({
        where: {
          id_cabang_bulan_tahun: {
            id_cabang: body.id_cabang,
            bulan: currentMonth,
            tahun: currentYear,
          },
        },
      });

      if (budget) {
        const projectedTotal = budget.terpakai + body.nominal;
        if (projectedTotal > budget.pagu_anggaran) {
          return errorResponse(
            `Over Budget: Melebihi Batas Sisa. Sisa pagu: Rp ${(budget.pagu_anggaran - budget.terpakai).toLocaleString('id-ID')}`,
            400
          );
        }
      }
    }

    // Create expense
    const expense = await prisma.expense.create({
      data: {
        id_expense: `EXP-${Date.now().toString(36).toUpperCase()}`,
        id_cabang: body.id_cabang,
        tanggal: new Date(body.tanggal),
        nominal: body.nominal,
        deskripsi: body.deskripsi,
        kategori: body.kategori,
        bukti_nota_url: body.bukti_nota_url || '',
        status: authResult.user.role === 'Owner' ? 'Approve' : 'Pending',
      },
    });

    // Update budget terpakai if approved
    if (expense.status === 'Approve') {
      const currentMonth = new Date().toLocaleString('default', { month: 'short' }).toUpperCase();
      const currentYear = new Date().getFullYear();

      await prisma.monthlyBudget.updateMany({
        where: {
          id_cabang: body.id_cabang,
          bulan: currentMonth,
          tahun: currentYear,
        },
        data: {
          terpakai: {
            increment: body.nominal,
          },
        },
      });

      // Create cashbook entry
      await prisma.cashBookEntry.create({
        data: {
          id_cabang: body.id_cabang,
          id_transaksi: expense.id_expense,
          nominal: body.nominal,
          tipe: 'Pengeluaran',
          deskripsi: `${body.kategori}: ${body.deskripsi}`,
        },
      });
    }

    return jsonResponse({
      success: true,
      message: 'Expense created successfully',
      data: { expense },
    }, 201);
  } catch (error) {
    console.error('[Expenses] Create error:', error);
    return errorResponse('Internal server error', 500);
  }
}
