/**
 * Branch Couriers API
 * GET /api/couriers/branch/:id_cabang
 */

import { prisma } from '../../../../lib/prisma';
import { requireAuth } from '../../../utils/auth';
import { getCorsHeaders } from '../../../utils/cors';
import { jsonResponse, errorResponse } from '../../../utils/response';

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

    // Get couriers with their active orders
    const couriers = await prisma.courier.findMany({
      where: { id_cabang },
      include: {
        orders: {
          where: {
            status: { in: ['Dialokasikan', 'OnRoute', 'PickingUp', 'Delivering'] },
          },
          select: { id_order: true, status: true },
        },
      },
    });

    const courierData = couriers.map((c) => ({
      id_kurir: c.id_kurir,
      nama_kurir: c.nama_kurir,
      nomor_telepon: c.nomor_telepon,
      is_available: c.is_available,
      active_tasks: c.orders.length,
      status: c.is_available ? 'Available' : 'Busy',
    }));

    return jsonResponse({
      success: true,
      data: {
        id_cabang,
        couriers: courierData,
      },
    });
  } catch (error) {
    console.error('[Couriers] Branch error:', error);
    return errorResponse('Internal server error', 500);
  }
}
