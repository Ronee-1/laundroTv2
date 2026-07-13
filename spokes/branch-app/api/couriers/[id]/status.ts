/**
 * Courier Status Update API
 * PATCH /api/couriers/:id/status
 */

import { prisma } from '../../../lib/prisma';
import { requireAuth } from '../../utils/auth';
import { getCorsHeaders } from '../../utils/cors';
import { jsonResponse, errorResponse } from '../../utils/response';

interface StatusRequest {
  is_available: boolean;
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: getCorsHeaders() });
    }

    const { id: id_kurir } = await params;
    const body: StatusRequest = await request.json();
    const authHeader = request.headers.get('authorization');
    const authResult = requireAuth(authHeader);

    if (!authResult.authorized) {
      return errorResponse(authResult.error, authResult.status);
    }

    const courier = await prisma.courier.findUnique({
      where: { id_kurir },
    });

    if (!courier) {
      return errorResponse('Kurir not found', 404);
    }

    const updated = await prisma.courier.update({
      where: { id_kurir },
      data: {
        is_available: body.is_available,
      },
    });

    return jsonResponse({
      success: true,
      message: `Courier status updated to ${body.is_available ? 'Available' : 'Unavailable'}`,
      data: { courier: updated },
    });
  } catch (error) {
    console.error('[Courier] Status error:', error);
    return errorResponse('Internal server error', 500);
  }
}
