/**
 * Branch Couriers API
 * GET /api/couriers/branch/:branchId
 *
 * Returns all couriers for a specific branch
 */

import { prisma } from '../../../lib/prisma';
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

    // Get all couriers for this branch
    const couriers = await prisma.courier.findMany({
      where: { id_cabang },
    });

    // Get active orders count for each courier
    const courierIds = couriers.map(c => c.id_kurir);
    const activeOrders = await prisma.order.findMany({
      where: {
        id_kurir: { in: courierIds },
        status: { in: ['Pending', 'Dialokasikan', 'OnRoute', 'PickingUp', 'Delivering'] },
      },
      select: { id_kurir: true },
    });

    // Count active orders per courier
    const activeOrdersCount: Record<string, number> = {};
    activeOrders.forEach(order => {
      activeOrdersCount[order.id_kurir] = (activeOrdersCount[order.id_kurir] || 0) + 1;
    });

    // Transform couriers with active task count
    const couriersWithTasks = couriers.map(courier => ({
      id_kurir: courier.id_kurir,
      nama_kurir: courier.nama_kurir,
      nomor_telepon: courier.nomor_telepon,
      is_available: courier.is_available,
      status: courier.is_available ? 'Available' : 'Offline',
      active_tasks: activeOrdersCount[courier.id_kurir] || 0,
      created_at: courier.created_at,
      updated_at: courier.updated_at,
    }));

    return jsonResponse({
      success: true,
      data: {
        id_cabang,
        total: couriersWithTasks.length,
        couriers: couriersWithTasks,
      },
      couriers: couriersWithTasks,
    });
  } catch (error) {
    console.error('[Branch Couriers] Error:', error);
    return errorResponse('Internal server error', 500);
  }
}
