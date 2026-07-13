/**
 * Branch Orders API
 * GET /api/branches/:id/orders
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
    const status = url.searchParams.get('status');

    const authHeader = request.headers.get('authorization');
    const authResult = requireAuth(authHeader);

    if (!authResult.authorized) {
      return errorResponse(authResult.error, authResult.status);
    }

    // Check branch access
    if (authResult.user.role === 'Admin' && authResult.user.id_cabang !== id_cabang) {
      return errorResponse('Access denied', 403);
    }

    const where: Record<string, unknown> = { id_cabang };
    if (status) {
      where.status = status;
    }

    const orders = await prisma.order.findMany({
      where,
      include: {
        courier: {
          select: { id_kurir: true, nama_kurir: true },
        },
      },
      orderBy: { created_at: 'desc' },
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
    console.error('[Branch] Orders error:', error);
    return errorResponse('Internal server error', 500);
  }
}
