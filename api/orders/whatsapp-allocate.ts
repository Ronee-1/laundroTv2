/**
 * WhatsApp Order Allocation API
 * POST /api/orders/whatsapp-allocate
 */

import { prisma } from '../../lib/prisma';
import { requireAuth } from '../utils/auth';
import { getCorsHeaders } from '../utils/cors';
import { jsonResponse, errorResponse } from '../utils/response';

interface AllocateRequest {
  orderId: string;
  id_kurir?: string;
}

export async function POST(request: Request) {
  try {
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: getCorsHeaders() });
    }

    const authHeader = request.headers.get('authorization');
    const authResult = requireAuth(authHeader);

    if (!authResult.authorized) {
      return errorResponse(authResult.error, authResult.status);
    }

    const body: AllocateRequest = await request.json();

    if (!body.orderId) {
      return errorResponse('Order ID is required', 400);
    }

    const order = await prisma.order.findUnique({
      where: { id_order: body.orderId },
    });

    if (!order) {
      return errorResponse('Order not found', 404);
    }

    // Update order status
    const updated = await prisma.order.update({
      where: { id_order: body.orderId },
      data: {
        status: body.id_kurir ? 'Dialokasikan' : 'Pending',
        id_kurir: body.id_kurir,
        assigned_at: body.id_kurir ? new Date() : null,
      },
    });

    return jsonResponse({
      success: true,
      message: body.id_kurir ? 'Order allocated to kurir' : 'Order marked as pending',
      data: { order: updated },
    });
  } catch (error) {
    console.error('[Orders] WhatsApp allocate error:', error);
    return errorResponse('Internal server error', 500);
  }
}
