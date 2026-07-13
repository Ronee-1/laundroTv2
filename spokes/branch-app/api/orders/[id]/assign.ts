/**
 * Assign Order to Courier
 * POST /api/orders/:id/assign
 */

import { prisma } from '../../../../lib/prisma';
import { requireAuth } from '../../../utils/auth';
import { getCorsHeaders } from '../../../utils/cors';
import { jsonResponse, errorResponse } from '../../../utils/response';

interface AssignRequest {
  id_kurir: string;
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: getCorsHeaders() });
    }

    const { id: id_order } = await params;
    const body: AssignRequest = await request.json();
    const authHeader = request.headers.get('authorization');
    const authResult = requireAuth(authHeader);

    if (!authResult.authorized) {
      return errorResponse(authResult.error, authResult.status);
    }

    if (!body.id_kurir) {
      return errorResponse('ID Kurir is required', 400);
    }

    // Verify order exists
    const order = await prisma.order.findUnique({
      where: { id_order },
    });

    if (!order) {
      return errorResponse('Order not found', 404);
    }

    // Verify courier exists
    const courier = await prisma.courier.findUnique({
      where: { id_kurir: body.id_kurir },
    });

    if (!courier) {
      return errorResponse('Kurir not found', 404);
    }

    // Update order
    const updated = await prisma.order.update({
      where: { id_order },
      data: {
        id_kurir: body.id_kurir,
        status: 'Dialokasikan',
        assigned_by: authResult.user.id_user,
        assigned_at: new Date(),
      },
    });

    return jsonResponse({
      success: true,
      message: 'Order assigned to kurir',
      data: { order: updated },
    });
  } catch (error) {
    console.error('[Order] Assign error:', error);
    return errorResponse('Internal server error', 500);
  }
}
