/**
 * Reconciliation API
 * POST /api/branches/[id]/reconcile
 * POST /api/branches/[id]/reconcile - Create reconciliation
 * GET /api/branches/[id]/reconcile - Get reconciliation history
 */

import { prisma } from '../../../lib/prisma';
import { requireRole } from '../../utils/auth';
import { getCorsHeaders } from '../../utils/cors';
import { jsonResponse, errorResponse } from '../../utils/response';

interface ReconcileRequest {
  kas_fisik: number;
  catatan?: string;
}

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
    const limit = parseInt(url.searchParams.get('limit') || '10');

    const authHeader = request.headers.get('authorization');
    const authResult = requireRole(authHeader, 'Owner', 'Admin');

    if (!authResult.authorized) {
      return errorResponse(authResult.error, authResult.status);
    }

    // Check branch access
    if (authResult.user.role === 'Admin' && authResult.user.id_cabang !== id_cabang) {
      return errorResponse('Access denied', 403);
    }

    const reconciliations = await prisma.reconciliationLog.findMany({
      where: { id_cabang },
      orderBy: { tanggal: 'desc' },
      take: limit,
    });

    return jsonResponse({
      success: true,
      data: { reconciliations },
    });
  } catch (error) {
    console.error('[Reconcile] Get error:', error);
    return errorResponse('Internal server error', 500);
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: getCorsHeaders() });
    }

    const { id: id_cabang } = await params;
    const body: ReconcileRequest = await request.json();

    const authHeader = request.headers.get('authorization');
    const authResult = requireRole(authHeader, 'Owner', 'Admin');

    if (!authResult.authorized) {
      return errorResponse(authResult.error, authResult.status);
    }

    // Check branch access
    if (authResult.user.role === 'Admin' && authResult.user.id_cabang !== id_cabang) {
      return errorResponse('Access denied', 403);
    }

    if (body.kas_fisik === undefined || body.kas_fisik < 0) {
      return errorResponse('Kas fisik is required and must be >= 0', 400);
    }

    // Get branch info
    const branch = await prisma.branch.findUnique({
      where: { id_cabang },
    });

    if (!branch) {
      return errorResponse(`Branch "${id_cabang}" not found`, 404);
    }

    // Calculate digital cash (sum of cashbook entries)
    const cashEntries = await prisma.cashBookEntry.findMany({
      where: {
        id_cabang,
        tanggal_jurnal: {
          gte: new Date(new Date().setHours(0, 0, 0, 0)),
        },
      },
    });

    const kasDigital = cashEntries.reduce((sum, entry) => {
      return entry.tipe === 'Pemasukan' ? sum + entry.nominal : sum - entry.nominal;
    }, 0);

    const selisih = body.kas_fisik - kasDigital;
    const status = selisih === 0 ? 'Cocok' : 'Selisih';

    // Create reconciliation log
    const reconciliation = await prisma.reconciliationLog.create({
      data: {
        id_cabang,
        kas_digital: kasDigital,
        kas_fisik: body.kas_fisik,
        selisih,
        status,
        catatan: body.catatan,
        approval_status: 'Pending',
      },
    });

    return jsonResponse({
      success: true,
      data: {
        id_rekonsiliasi: reconciliation.id_rekonsiliasi,
        id_cabang,
        nama_cabang: branch.nama_cabang,
        kas_digital: kasDigital,
        kas_fisik: body.kas_fisik,
        selisih,
        status,
        approval_status: 'Pending',
        message: status === 'Cocok' ? 'Rekonsiliasi berhasil. Kas digital dan fisik cocok.' : `Rekonsiliasi menemukan selisih: Rp ${selisih.toLocaleString('id-ID')}`,
      },
    }, 201);
  } catch (error) {
    console.error('[Reconcile] Create error:', error);
    return errorResponse('Internal server error', 500);
  }
}
