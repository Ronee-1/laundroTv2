/**
 * Logistics Active API
 * GET /api/logistics/active
 */

import { prisma } from '../../lib/prisma';
import { requireAuth } from '../utils/auth';
import { getCorsHeaders } from '../utils/cors';
import { jsonResponse, errorResponse } from '../utils/response';

export async function GET(request: Request) {
  try {
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: getCorsHeaders() });
    }

    const authHeader = request.headers.get('authorization');
    const authResult = requireAuth(authHeader);

    if (!authResult.authorized) {
      return errorResponse(authResult.error, authResult.status);
    }

    const url = new URL(request.url);
    const id_cabang = url.searchParams.get('id_cabang');

    // Build where clause
    const where: Record<string, unknown> = {
      status: { in: ['InTransit', 'DriverEnRoute', 'AwaitingVerification'] },
    };

    if (authResult.user.role === 'Admin' && authResult.user.id_cabang) {
      where.id_cabang = authResult.user.id_cabang;
    } else if (id_cabang) {
      where.id_cabang = id_cabang;
    }

    const logs = await prisma.logisticsLog.findMany({
      where,
      include: {
        branch: {
          select: { id_cabang: true, nama_cabang: true },
        },
      },
      orderBy: { timestamp: 'desc' },
      take: 50,
    });

    return jsonResponse({
      success: true,
      data: {
        total: logs.length,
        logs,
      },
    });
  } catch (error) {
    console.error('[Logistics] Active error:', error);
    return errorResponse('Internal server error', 500);
  }
}
