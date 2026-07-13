/**
 * Order API - Consolidated
 * GET /api/orders/:id
 * PATCH /api/orders/:id (status update)
 * POST /api/orders/:id/assign
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

    const { id } = await params;
    const authHeader = request.headers.get('authorization');
    const authResult = requireAuth(authHeader);

    if (!authResult.authorized) {
      return errorResponse(authResult.error, authResult.status);
    }

    const order = await prisma.order.findUnique({
      where: { id_order: id },
      include: {
        branch: { select: { id_cabang: true, nama_cabang: true } },
        courier: { select: { id_kurir: true, nama_kurir: true } },
      },
    });

    if (!order) return errorResponse(`Order "${id}" not found`, 404);

    return jsonResponse({ success: true, data: { order } });
  } catch (error) {
    console.error('[Order] GET error:', error);
    return errorResponse('Internal server error', 500);
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: getCorsHeaders() });
    }

    const { id } = await params;
    const url = new URL(request.url);
    const action = url.pathname.split('/').pop();
    const authHeader = request.headers.get('authorization');
    const authResult = requireAuth(authHeader);

    if (!authResult.authorized) return errorResponse(authResult.error, authResult.status);

    if (action === 'assign') {
      const body = await request.json() as { id_kurir: string };
      if (!body.id_kurir) return errorResponse('ID Kurir required', 400);

      const order = await prisma.order.update({
        where: { id_order: id },
        data: {
          id_kurir: body.id_kurir,
          status: 'Dialokasikan',
          assigned_at: new Date(),
        },
      });

      return jsonResponse({ success: true, data: { order } });
    }

    const body = await request.json() as { status?: string };
    if (!body.status) return errorResponse('Status required', 400);

    const validStatuses = ['Pending', 'Dialokasikan', 'OnRoute', 'PickingUp', 'Delivering', 'Selesai', 'Done', 'Lunas'];
    if (!validStatuses.includes(body.status)) return errorResponse('Invalid status', 400);

    const order = await prisma.order.update({
      where: { id_order: id },
      data: {
        status: body.status,
        tanggal_selesai: ['Done', 'Selesai'].includes(body.status) ? new Date() : undefined,
      },
    });

    return jsonResponse({ success: true, message: `Status updated to ${body.status}`, data: { order } });
  } catch (error) {
    console.error('[Order] PATCH error:', error);
    return errorResponse('Internal server error', 500);
  }
}
