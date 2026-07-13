/**
 * Single Order API
 * GET/PATCH /api/orders/[id]
 */

import { prisma } from '../../../lib/prisma';
import { requireAuth } from '../../utils/auth';
import { getCorsHeaders } from '../../utils/cors';
import { jsonResponse, errorResponse } from '../../utils/response';

function buildGoogleMapsUrl(lat: number, lng: number): string {
  return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
}

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

    const order = await prisma.order.findUnique({
      where: { id_order: id },
      include: {
        branch: {
          select: { id_cabang: true, nama_cabang: true },
        },
        courier: {
          select: { id_kurir: true, nama_kurir: true, nomor_telepon: true },
        },
      },
    });

    if (!order) {
      return errorResponse(`Order "${id}" not found`, 404);
    }

    // Check access
    if (authResult.user.role === 'Admin' && authResult.user.id_cabang !== order.id_cabang) {
      return errorResponse('Access denied', 403);
    }

    return jsonResponse({
      success: true,
      data: { order },
    });
  } catch (error) {
    console.error('[Order] Get one error:', error);
    return errorResponse('Internal server error', 500);
  }
}

/**
 * Update Order Status
 * PATCH /api/orders/[id]/status
 */
export async function PATCH(
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

    const body = await request.json();

    if (!body.status) {
      return errorResponse('Status is required', 400);
    }

    // Status flow validation
    const validStatuses = ['Pending', 'Dialokasikan', 'OnRoute', 'PickingUp', 'Delivering', 'Selesai', 'Done', 'Lunas'];
    if (!validStatuses.includes(body.status)) {
      return errorResponse('Invalid status', 400);
    }

    const order = await prisma.order.findUnique({
      where: { id_order: id },
    });

    if (!order) {
      return errorResponse(`Order "${id}" not found`, 404);
    }

    // Check access
    if (authResult.user.role === 'Admin' && authResult.user.id_cabang !== order.id_cabang) {
      return errorResponse('Access denied', 403);
    }

    const updated = await prisma.order.update({
      where: { id_order: id },
      data: {
        status: body.status,
        tanggal_selesai: body.status === 'Done' || body.status === 'Selesai' ? new Date() : undefined,
      },
    });

    return jsonResponse({
      success: true,
      message: `Order status updated to ${body.status}`,
      data: { order: updated },
    });
  } catch (error) {
    console.error('[Order] Update status error:', error);
    return errorResponse('Internal server error', 500);
  }
}
