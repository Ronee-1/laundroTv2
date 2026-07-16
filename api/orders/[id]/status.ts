/**
 * Order Status Update API
 * PATCH /api/orders/[id]/status
 */

import { prisma } from '../../../../lib/prisma';
import { requireAuth } from '../../../utils/auth';
import { getCorsHeaders } from '../../../utils/cors';
import { jsonResponse, errorResponse } from '../../../utils/response';

interface StatusUpdateRequest {
  status?: string;
  id_kurir?: string;
  catatan?: string;
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: getCorsHeaders() });
    }

    const { id: id_order } = await params;
    const body: StatusUpdateRequest = await request.json();
    const authHeader = request.headers.get('authorization');
    const authResult = requireAuth(authHeader);

    if (!authResult.authorized) {
      return errorResponse(authResult.error, authResult.status);
    }

    // Validate that at least status or id_kurir is provided
    if (!body.status && !body.id_kurir) {
      return errorResponse('Status or ID Kurir is required', 400);
    }

    // Verify order exists
    const order = await prisma.order.findUnique({
      where: { id_order },
    });

    if (!order) {
      return errorResponse('Order not found', 404);
    }

    // Check access
    if (authResult.user.role === 'Admin' && authResult.user.id_cabang !== order.id_cabang) {
      return errorResponse('Access denied', 403);
    }

    // Build update data
    const updateData: Record<string, unknown> = {};

    // Update status if provided
    if (body.status) {
      const validStatuses = ['Pending', 'Dialokasikan', 'OnRoute', 'PickingUp', 'Delivering', 'Selesai', 'Done', 'Lunas', 'Dibatalkan', 'Canceled'];

      // Also allow 'Diproses' as it's used in the business flow
      if (!validStatuses.includes(body.status) && body.status !== 'Diproses') {
        return errorResponse(`Invalid status: ${body.status}. Valid statuses are: ${validStatuses.join(', ')}`, 400);
      }

      updateData.status = body.status;

      // Set tanggal_selesai when marking as Done or Selesai
      if (['Done', 'Selesai', 'Lunas'].includes(body.status)) {
        updateData.tanggal_selesai = new Date();
      }
    }

    // Update id_kurir if provided
    if (body.id_kurir) {
      // Verify courier exists
      const courier = await prisma.courier.findUnique({
        where: { id_kurir: body.id_kurir },
      });

      if (!courier) {
        return errorResponse('Kurir not found', 404);
      }

      updateData.id_kurir = body.id_kurir;
      updateData.assigned_by = authResult.user.id_user;
      updateData.assigned_at = new Date();
    }

    // Update catatan if provided
    if (body.catatan !== undefined) {
      updateData.catatan = body.catatan;
    }

    // Perform the update
    const updated = await prisma.order.update({
      where: { id_order },
      data: updateData,
    });

    return jsonResponse({
      success: true,
      message: `Order ${id_order} updated successfully`,
      data: { order: updated },
    });
  } catch (error) {
    console.error('[Order] Status update error:', error);
    return errorResponse('Internal server error', 500);
  }
}
