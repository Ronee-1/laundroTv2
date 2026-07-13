/**
 * All Reconciliations API - Owner only
 * GET /api/branches/reconcile/all
 */

import { prisma } from '../../../lib/prisma';
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
      return errorResponse(authResult.error, authResult.status);
    }

    const url = new URL(request.url);
    const limit = parseInt(url.searchParams.get('limit') || '50');

    const reconciliations = await prisma.reconciliationLog.findMany({
      include: {
        branch: {
          select: { id_cabang: true, nama_cabang: true },
        },
      },
      orderBy: { tanggal: 'desc' },
      take: limit,
    });

    return jsonResponse({
      success: true,
      data: {
        total: reconciliations.length,
        reconciliations,
      },
    });
  } catch (error) {
    console.error('[Reconcile] Get all error:', error);
    return errorResponse('Internal server error', 500);
  }
}
