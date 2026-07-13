/**
 * Branch Logistics API
 * GET /api/logistics/branch/:id
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

    const logs = await prisma.logisticsLog.findMany({
      where: { id_cabang },
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
        id_cabang,
        total: logs.length,
        logs,
      },
    });
  } catch (error) {
    console.error('[Logistics] Branch error:', error);
    return errorResponse('Internal server error', 500);
  }
}
