/**
 * Courier API - Consolidated
 * GET /api/couriers/:id/tasks
 * PATCH /api/couriers/:id/status
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

    const { id: id_kurir } = await params;
    const authHeader = request.headers.get('authorization');
    const authResult = requireAuth(authHeader);

    if (!authResult.authorized) return errorResponse(authResult.error, authResult.status);

    const courier = await prisma.courier.findUnique({ where: { id_kurir } });
    if (!courier) return errorResponse(`Kurir "${id_kurir}" tidak ditemukan`, 404);

    const orders = await prisma.order.findMany({
      where: {
        id_kurir,
        status: { in: ['Dialokasikan', 'OnRoute', 'PickingUp', 'Delivering'] },
      },
      orderBy: { assigned_at: 'asc' },
    });

    const tugas = orders.map((order) => ({
      id_order: order.id_order,
      alamat_penjemputan: order.alamat_penjemputan || 'Alamat tidak tersedia',
      alamat_pengantaran: order.alamat_pengantaran || order.alamat_penjemputan || '',
      koordinat_penjemputan: { latitude: order.latitude_penjemputan, longitude: order.longitude_penjemputan },
      koordinat_pengantaran: { latitude: order.latitude_pengantaran, longitude: order.longitude_pengantaran },
      status: order.status,
      berat_kg: order.berat_kg ?? null,
      google_maps_url: `https://www.google.com/maps/dir/?api=1&destination=${order.latitude_penjemputan},${order.longitude_penjemputan}`,
      customer_name: order.customer_name,
      customer_whatsapp: order.customer_whatsapp,
    }));

    return jsonResponse({
      success: true,
      id_kurir: courier.id_kurir,
      nama_kurir: courier.nama_kurir,
      id_cabang: courier.id_cabang,
      total_tugas: tugas.length,
      tugas,
    });
  } catch (error) {
    console.error('[Courier Tasks] error:', error);
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

    const { id: id_kurir } = await params;
    const body = await request.json() as { is_available?: boolean };
    const authHeader = request.headers.get('authorization');
    const authResult = requireAuth(authHeader);

    if (!authResult.authorized) return errorResponse(authResult.error, authResult.status);

    const courier = await prisma.courier.findUnique({ where: { id_kurir } });
    if (!courier) return errorResponse('Kurir not found', 404);

    const updated = await prisma.courier.update({
      where: { id_kurir },
      data: { is_available: body.is_available ?? courier.is_available },
    });

    return jsonResponse({ success: true, data: { courier: updated } });
  } catch (error) {
    console.error('[Courier] PATCH error:', error);
    return errorResponse('Internal server error', 500);
  }
}
