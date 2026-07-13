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

    return jsonResponse({
      success: true,
      data: { user },
    });
  } catch (error) {
    console.error('[Auth] Get profile error:', error);
    return errorResponse('Internal server error', 500);
  }
}
