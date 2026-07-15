/**
 * Auth Branches API - Get branches for user creation
 * GET /api/auth/branches - List active branches
 */

import { prisma } from '../../../lib/prisma';
import { requireRole } from '../utils/auth';
import { getCorsHeaders } from '../utils/cors';
import { jsonResponse, errorResponse } from '../utils/response';

export async function GET(request: Request) {
  try {
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: getCorsHeaders() });
    }

    const authHeader = request.headers.get('authorization');
    const authResult = requireRole(authHeader, 'Owner');

    if (!authResult.authorized) {
      return jsonResponse({ success: false, error: authResult.error }, authResult.status);
    }

    const branches = await prisma.branch.findMany({
      where: { is_active: true },
      select: {
        id_cabang: true,
        nama_cabang: true,
        wilayah: true,
      },
      orderBy: { id_cabang: 'asc' },
    });

    return jsonResponse({
      success: true,
      data: { branches },
    });
  } catch (error) {
    console.error('[Auth/Branches] GET error:', error);
    return errorResponse('Internal server error', 500);
  }
}
