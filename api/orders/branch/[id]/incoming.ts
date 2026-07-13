/**
 * Branch Incoming Orders API
 * GET /api/orders/branch/:id_cabang/incoming
 */

import { prisma } from '../../../../lib/prisma';
import { requireAuth } from '../../../utils/auth';
import { getCorsHeaders } from '../../../utils/cors';
import { jsonResponse, errorResponse } from '../../../utils/response';

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

    // Get unassigned orders (Pending status)
    const orders = await prisma.order.findMany({
      where: {
        id_cabang,
        status: 'Pending',
        id_kurir: null,
      },
      orderBy: { created_at: 'asc' },
    });

    return jsonResponse({
      success: true,
      data: {
        id_cabang,
        total: orders.length,
        orders,
      },
    });
  } catch (error) {
    console.error('[Orders] Incoming error:', error);
    return errorResponse('Internal server error', 500);
  }
}
