/**
 * Branches API - Get All Branches
 * GET /api/branches
 */

import { prisma } from '../../lib/prisma';
import { requireAuth } from '../../utils/auth';
import { getCorsHeaders } from '../../utils/cors';
import { jsonResponse, errorResponse } from '../../utils/response';

export async function GET(request: Request) {
  try {
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: getCorsHeaders() });
    }

    const authHeader = request.headers.get('authorization');
    const authResult = requireAuth(authHeader);

    if (!authResult.authorized) {
      return jsonResponse({ success: false, error: authResult.error }, authResult.status);
    }

    const branches = await prisma.branch.findMany({
      where: { is_active: true },
      include: {
        _count: {
          select: {
            orders: true,
            couriers: true,
          },
        },
      },
      orderBy: { id_cabang: 'asc' },
    });

    return jsonResponse({
      success: true,
      data: {
        total: branches.length,
        branches: branches.map(b => ({
          id_cabang: b.id_cabang,
          nama_cabang: b.nama_cabang,
          alamat: b.alamat,
          latitude: b.latitude,
          longitude: b.longitude,
          wilayah: b.wilayah,
          is_active: b.is_active,
          stats: b._count,
        })),
      },
    });
  } catch (error) {
    console.error('[Branches] Get all error:', error);
    return errorResponse('Internal server error', 500);
  }
}
