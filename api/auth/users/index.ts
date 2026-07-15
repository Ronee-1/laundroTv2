/**
 * Users API - Owner only
 * GET /api/auth/users - List all users
 * DELETE /api/auth/users/:id - Deactivate user
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

    const users = await prisma.user.findMany({
      where: { is_active: true },
      include: {
        branch: {
          select: {
            id_cabang: true,
            nama_cabang: true,
            wilayah: true,
          },
        },
      },
      orderBy: { created_at: 'desc' },
    });

    return jsonResponse({
      success: true,
      data: users,
    });
  } catch (error) {
    console.error('[Users] GET error:', error);
    return errorResponse('Internal server error', 500);
  }
}

/**
 * DELETE /api/auth/users/:id - Deactivate user
 */
export async function DELETE(request: Request) {
  try {
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: getCorsHeaders() });
    }

    const authHeader = request.headers.get('authorization');
    const authResult = requireRole(authHeader, 'Owner');

    if (!authResult.authorized) {
      return jsonResponse({ success: false, error: authResult.error }, authResult.status);
    }

    // Extract user ID from URL path
    const url = new URL(request.url);
    const pathParts = url.pathname.split('/');
    const userId = pathParts[pathParts.length - 1];

    if (!userId) {
      return jsonResponse({ success: false, error: 'User ID is required' }, 400);
    }

    // Prevent owner from deactivating themselves
    if (authResult.user.id_user === userId) {
      return jsonResponse({ success: false, error: 'Tidak dapat menonaktifkan akun sendiri' }, 400);
    }

    // Find the user
    const user = await prisma.user.findUnique({
      where: { id_user: userId },
    });

    if (!user) {
      return jsonResponse({ success: false, error: 'User tidak ditemukan' }, 404);
    }

    // Prevent deactivating Owner accounts
    if (user.role === 'Owner') {
      return jsonResponse({ success: false, error: 'Tidak dapat menonaktifkan akun Owner' }, 403);
    }

    // Deactivate the user
    await prisma.user.update({
      where: { id_user: userId },
      data: { is_active: false },
    });

    console.log(`[Users] User deactivated: ${user.email} by ${authResult.user.email}`);

    return jsonResponse({
      success: true,
      message: `Akun "${user.nama}" berhasil dinonaktifkan`,
    });
  } catch (error) {
    console.error('[Users] DELETE error:', error);
    return errorResponse('Internal server error', 500);
  }
}
