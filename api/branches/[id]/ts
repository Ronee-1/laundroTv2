/**
 * Single Branch API
 * GET /api/branches/[id]
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

    const { id } = await params;
    const authHeader = request.headers.get('authorization');
    const authResult = requireAuth(authHeader);

    if (!authResult.authorized) {
      return errorResponse(authResult.error, authResult.status);
    }

    const branch = await prisma.branch.findUnique({
      where: { id_cabang: id },
      include: {
        couriers: true,
        _count: {
          select: {
            orders: true,
            customers: true,
          },
        },
      },
    });

    if (!branch) {
      return errorResponse(`Branch "${id}" not found`, 404);
    }

    return jsonResponse({
      success: true,
      data: { branch },
    });
  } catch (error) {
    console.error('[Branch] Get one error:', error);
    return errorResponse('Internal server error', 500);
  }
}
