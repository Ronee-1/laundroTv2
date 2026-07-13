/**
 * Courier Tasks API
 * GET /api/couriers/[id]/tasks
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

    const { id: id_kurir } = await params;
    const url = new URL(request.url);
    const requestedCabang = url.searchParams.get('id_cabang');

    const authHeader = request.headers.get('authorization');
    const authResult = requireAuth(authHeader);

    if (!authResult.authorized) {
      return errorResponse(authResult.error, authResult.status);
    }

    // Get courier info
    const courier = await prisma.courier.findUnique({
      where: { id_kurir },
    });

    if (!courier) {
      return errorResponse(`Kurir "${id_kurir}" tidak ditemukan.`, 404);
    }

    // Branch context validation
    if (requestedCabang && requestedCabang !== courier.id_cabang) {
      return errorResponse(`Akses ditolak: Kurir ${id_kurir} hanya dapat mengakses data cabang ${courier.id_cabang}.`, 403);
    }

    // Get assigned orders for this courier
    const orders = await prisma.order.findMany({
      where: {
        id_kurir,
        status: {
          in: ['Dialokasikan', 'OnRoute', 'PickingUp', 'Delivering'],
        },
      },
      orderBy: { assigned_at: 'asc' },
    });

    // Map to tasks format
    const tugas = orders.map((order) => {
      let googleMapsUrl = '#';
      if (order.latitude_penjemputan && order.longitude_penjemputan) {
        googleMapsUrl = buildGoogleMapsUrl(order.latitude_penjemputan, order.longitude_penjemputan);
      }

      return {
        id_order: order.id_order,
        alamat_penjemputan: order.alamat_penjemputan || 'Alamat tidak tersedia',
        alamat_pengantaran: order.alamat_pengantaran || order.alamat_penjemputan || '',
        koordinat_penjemputan: {
          latitude: order.latitude_penjemputan,
          longitude: order.longitude_penjemputan,
        },
        koordinat_pengantaran: {
          latitude: order.latitude_pengantaran,
          longitude: order.longitude_pengantaran,
        },
        status: order.status,
        berat_kg: order.berat_kg ?? null,
        google_maps_url: googleMapsUrl,
        customer_name: order.customer_name,
        customer_whatsapp: order.customer_whatsapp,
      };
    });

    return jsonResponse({
      success: true,
      id_kurir: courier.id_kurir,
      nama_kurir: courier.nama_kurir,
      id_cabang: courier.id_cabang,
      total_tugas: tugas.length,
      tugas,
    });
  } catch (error) {
    console.error('[Courier Tasks] Get error:', error);
    return errorResponse('Internal server error', 500);
  }
}
