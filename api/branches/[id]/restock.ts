/**
 * Restock Request API
 * POST /api/branches/:id/restock
 */

import { prisma } from '../../../lib/prisma';
import { requireAuth } from '../../utils/auth';
import { getCorsHeaders } from '../../utils/cors';
import { jsonResponse, errorResponse } from '../../utils/response';

interface RestockRequestBody {
  requested_items: {
    detergen?: number;
    pelembut?: number;
    plastik?: number;
  };
  catatan?: string;
}

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

    const requests = await prisma.restockRequest.findMany({
      where: { id_cabang },
      orderBy: { created_at: 'desc' },
    });

    return jsonResponse({
      success: true,
      data: {
        id_cabang,
        total: requests.length,
        requests,
      },
    });
  } catch (error) {
    console.error('[Branch] Restock error:', error);
    return errorResponse('Internal server error', 500);
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: getCorsHeaders() });
    }

    const { id: id_cabang } = await params;
    const body: RestockRequestBody = await request.json();
    const authHeader = request.headers.get('authorization');
    const authResult = requireAuth(authHeader);

    if (!authResult.authorized) {
      return errorResponse(authResult.error, authResult.status);
    }

    // Check branch access
    if (authResult.user.role === 'Admin' && authResult.user.id_cabang !== id_cabang) {
      return errorResponse('Access denied', 403);
    }

    const branch = await prisma.branch.findUnique({
      where: { id_cabang },
    });

    if (!branch) {
      return errorResponse('Branch not found', 404);
    }

    const restock = await prisma.restockRequest.create({
      data: {
        id_request: `REST-${Date.now().toString(36).toUpperCase()}`,
        id_cabang,
        nama_cabang: branch.nama_cabang,
        created_by: authResult.user.id_user,
        requested_items: body.requested_items,
        status: 'Pending',
        catatan: body.catatan,
      },
    });

    return jsonResponse({
      success: true,
      message: 'Restock request created',
      data: { request: restock },
    }, 201);
  } catch (error) {
    console.error('[Branch] Create restock error:', error);
    return errorResponse('Internal server error', 500);
  }
}
