/**
 * All Orders API (for Admin/Owner)
 * GET /api/orders/all
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
    const limit = parseInt(url.searchParams.get('limit') || '100');

    // Build where clause
    const where: Record<string, unknown> = {};

    if (authResult.user.role === 'Admin' && authResult.user.id_cabang) {
      where.id_cabang = authResult.user.id_cabang;
    } else if (id_cabang) {
      where.id_cabang = id_cabang;
    }

    const orders = await prisma.order.findMany({
      where,
      include: {
        branch: {
          select: { id_cabang: true, nama_cabang: true },
        },
        courier: {
          select: { id_kurir: true, nama_kurir: true },
        },
      },
      orderBy: { created_at: 'desc' },
      take: limit,
    });

    return jsonResponse({
      success: true,
      data: {
        total: orders.length,
        orders,
      },
    });
  } catch (error) {
    console.error('[Orders] All error:', error);
    return errorResponse('Internal server error', 500);
  }
}
