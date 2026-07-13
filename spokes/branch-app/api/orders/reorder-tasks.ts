/**
 * Reorder Courier Tasks
 * POST /api/orders/reorder-tasks
 */

import { prisma } from '../../lib/prisma';
import { requireAuth } from '../utils/auth';
import { getCorsHeaders } from '../utils/cors';
import { jsonResponse, errorResponse } from '../utils/response';

interface ReorderRequest {
  id_kurir: string;
  orderIds: string[];
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

    const body: ReorderRequest = await request.json();

    if (!body.id_kurir || !body.orderIds || !Array.isArray(body.orderIds)) {
      return errorResponse('ID Kurir and orderIds array are required', 400);
    }

    // Update sequences
    for (let i = 0; i < body.orderIds.length; i++) {
      const id_order = body.orderIds[i];

      // Upsert courier task sequence
      await prisma.courierTaskSequence.upsert({
        where: {
          id_kurir_id_order: {
            id_kurir: body.id_kurir,
            id_order,
          },
        },
        update: {
          urutan: i + 1,
        },
        create: {
          id_kurir: body.id_kurir,
          id_order,
          urutan: i + 1,
        },
      });
    }

    return jsonResponse({
      success: true,
      message: 'Task order updated',
    });
  } catch (error) {
    console.error('[Orders] Reorder error:', error);
    return errorResponse('Internal server error', 500);
  }
}
