/**
 * Restock Requests by Branch
 * GET /api/restock/request
 */

import { prisma } from '../../../lib/prisma';
import { requireAuth } from '../../utils/auth';
import { getCorsHeaders } from '../../utils/cors';
import { jsonResponse, errorResponse } from '../../utils/response';

export async function GET(request: Request) {
  try {
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: getCorsHeaders() });
    }

    const url = new URL(request.url);
    const id_cabang = url.searchParams.get('id_cabang');

    const authHeader = request.headers.get('authorization');
    const authResult = requireAuth(authHeader);

    if (!authResult.authorized) {
      return errorResponse(authResult.error, authResult.status);
    }

    // Build where clause
    const where: Record<string, unknown> = {};

    if (authResult.user.role === 'Admin' && authResult.user.id_cabang) {
      where.id_cabang = authResult.user.id_cabang;
    } else if (id_cabang) {
      where.id_cabang = id_cabang;
    }

    const requests = await prisma.restockRequest.findMany({
      where,
      include: {
        branch: {
          select: { id_cabang: true, nama_cabang: true },
        },
      },
      orderBy: { created_at: 'desc' },
    });

    return jsonResponse({
      success: true,
      data: {
        total: requests.length,
        requests,
      },
    });
  } catch (error) {
    console.error('[Restock] List error:', error);
    return errorResponse('Internal server error', 500);
  }
}
