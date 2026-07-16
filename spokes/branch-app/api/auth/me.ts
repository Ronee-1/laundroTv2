/**
 * Authentication API - Get Current User
 * GET /api/auth/me
 */

import { prisma } from '../../lib/prisma';
import { requireAuth } from '../../utils/auth';
import { getCorsHeaders } from '../../utils/cors';
import { jsonResponse, errorResponse } from '../../utils/response';

export async function GET(request: Request) {
  try {
    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: getCorsHeaders() });
    }

    const authHeader = request.headers.get('authorization');
    const authResult = requireAuth(authHeader);

    if (!authResult.authorized) {
      return jsonResponse({ success: false, error: authResult.error }, authResult.status);
    }

    const user = await prisma.user.findUnique({
      where: { id_user: authResult.user.id_user },
      select: {
        id_user: true,
        nama: true,
        email: true,
        role: true,
        id_cabang: true,
        is_active: true,
        created_at: true,
        branch: {
          select: {
            id_cabang: true,
            nama_cabang: true,
            wilayah: true,
          },
        },
      },
    });

    if (!user) {
      return errorResponse('User not found', 404);
    }

    // Find courier_id for Kurir users
    let courier_id: string | null = null;
    if (user.role === 'Kurir' && user.id_cabang) {
      // Strategy 1: Direct match
      let courier = await prisma.courier.findFirst({
        where: {
          id_cabang: user.id_cabang,
          id_kurir: user.id_user,
        },
        select: { id_kurir: true },
      });

      // Strategy 2: Match by name
      if (!courier) {
        courier = await prisma.courier.findFirst({
          where: {
            id_cabang: user.id_cabang,
            nama_kurir: user.nama,
          },
          select: { id_kurir: true },
        });
      }

      courier_id = courier?.id_kurir ?? null;
      console.log(`[Auth/me] courier_id for ${user.nama}: ${courier_id}`);
    }

    return jsonResponse({
      success: true,
      user: {
        ...user,
        courier_id,
      },
    });
  } catch (error) {
    console.error('[Auth] Get profile error:', error);
    return errorResponse('Internal server error', 500);
  }
}
