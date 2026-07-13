/**
 * Reconciliation History API
 * GET /api/branches/:id/reconcile/history
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
    const limit = parseInt(url.searchParams.get('limit') || '30');

    const authHeader = request.headers.get('authorization');
    const authResult = requireAuth(authHeader);

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
      data: {
        id_cabang,
        total: reconciliations.length,
        reconciliations,
      },
    });
  } catch (error) {
    console.error('[Reconcile] History error:', error);
    return errorResponse('Internal server error', 500);
  }
}
