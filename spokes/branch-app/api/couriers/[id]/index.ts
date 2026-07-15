/**
 * Courier API - Consolidated
 * GET /api/couriers/:id/tasks
 * PATCH /api/couriers/:id/status
 */

import { prisma } from '../../../lib/prisma';
import { requireAuth } from '../../../utils/auth';
import { getCorsHeaders } from '../../../utils/cors';
import { jsonResponse, errorResponse } from '../../../utils/response';

/**
 * Extract coordinates from Google Maps URL
 * Supports:
 * - https://www.google.com/maps/place/.../@lat,lng,...
 * - https://maps.google.com/?q=lat,lng
 * - https://maps.app.goo.gl/... (short link - needs expansion)
 * - https://www.google.com/maps/dir/?api=1&destination=lat,lng
 */
function extractCoordinatesFromGmapsUrl(url: string): { lat: number; lng: number } | null {
  if (!url) return null;

  try {
    // Pattern 1: @lat,lng (Google Maps new format)
    const atMatch = url.match(/@(-?\d+\.?\d*),(-?\d+\.?\d*)/);
    if (atMatch) {
      return { lat: parseFloat(atMatch[1]), lng: parseFloat(atMatch[2]) };
    }

    // Pattern 2: ?q=lat,lng or &q=lat,lng
    const qMatch = url.match(/[?&]q=(-?\d+\.?\d*),(-?\d+\.?\d*)/);
    if (qMatch) {
      return { lat: parseFloat(qMatch[1]), lng: parseFloat(qMatch[2]) };
    }

    // Pattern 3: /place/.../@lat,lng (older format)
    const placeMatch = url.match(/\/place\/[^\/]*@(-?\d+\.?\d*),(-?\d+\.?\d*)/);
    if (placeMatch) {
      return { lat: parseFloat(placeMatch[1]), lng: parseFloat(placeMatch[2]) };
    }

    // Pattern 4: destination=lat,lng
    const destMatch = url.match(/destination=(-?\d+\.?\d*),(-?\d+\.?\d*)/);
    if (destMatch) {
      return { lat: parseFloat(destMatch[1]), lng: parseFloat(destMatch[2]) };
    }

    // Pattern 5: !3dlat!4dlng (some Google Maps formats)
    const bdMatch = url.match(/!3d(-?\d+\.?\d*)!4d(-?\d+\.?\d*)/);
    if (bdMatch) {
      return { lat: parseFloat(bdMatch[1]), lng: parseFloat(bdMatch[2]) };
    }

    return null;
  } catch {
    return null;
  }
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
    const authHeader = request.headers.get('authorization');
    const authResult = requireAuth(authHeader);

    if (!authResult.authorized) return errorResponse(authResult.error, authResult.status);

    const courier = await prisma.courier.findUnique({ where: { id_kurir } });
    if (!courier) return errorResponse(`Kurir "${id_kurir}" tidak ditemukan`, 404);

    const orders = await prisma.order.findMany({
      where: {
        id_kurir,
        status: { in: ['Pending', 'Diproses', 'Dialokasikan', 'OnRoute', 'PickingUp', 'Delivering'] },
      },
      include: {
        // Ambil data customer untuk dapat Google Maps URL
        branch: {
          select: { id_cabang: true, nama_cabang: true },
        },
      },
      orderBy: { assigned_at: 'asc' },
    });

    // Ambil customer IDs dan whatsapp numbers dari orders
    const customerIds = orders.map(o => o.id_pelanggan).filter(Boolean);
    const whatsappNumbers = orders.map(o => o.customer_whatsapp).filter(Boolean);

    // Ambil data customer berdasarkan ID atau whatsapp
    const customers = await prisma.customer.findMany({
      where: {
        OR: [
          { id_pelanggan: { in: customerIds } },
          { whatsapp: { in: whatsappNumbers } },
        ],
      },
      select: { id_pelanggan: true, nama: true, whatsapp: true, alamat_maps: true },
    });

    // Helper function to normalize WhatsApp number for matching
    function normalizeWhatsApp(wa: string): string {
      return wa.replace(/[^0-9]/g, '');
    }

    // Buat map customer - gunakan id_pelanggan sebagai key utama, whatsapp sebagai fallback
    const customerMapById = new Map(customers.map(c => [c.id_pelanggan, c]));
    // WhatsApp map dengan nomor yang sudah di-normalize
    const customerMapByWhatsapp = new Map(
      customers
        .filter(c => c.whatsapp)
        .map(c => [normalizeWhatsApp(c.whatsapp), c])
    );

    const tugas = orders.map((order) => {
      // Cari customer: prioritas 1 = by id_pelanggan, prioritas 2 = by whatsapp (normalize)
      let customer = customerMapById.get(order.id_pelanggan);
      if (!customer && order.customer_whatsapp) {
        customer = customerMapByWhatsapp.get(normalizeWhatsApp(order.customer_whatsapp));
      }

      // Prioritas: Order.google_maps_url > Customer.alamat_maps
      const gmapsUrl = order.google_maps_url || customer?.alamat_maps || '';

      // Parse koordinat dari URL Google Maps jika ada
      let lat = order.latitude_penjemputan;
      let lng = order.longitude_penjemputan;

      // Jika koordinat kosong tapi ada URL GMaps, coba extract dari URL
      if ((lat === 0 || lng === 0) && gmapsUrl) {
        const coords = extractCoordinatesFromGmapsUrl(gmapsUrl);
        if (coords) {
          lat = coords.lat;
          lng = coords.lng;
        }
      }

      // Buat URL Google Maps untuk navigasi
      const navigationUrl = (lat !== 0 && lng !== 0)
        ? `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`
        : (gmapsUrl || '');

      return {
        id_order: order.id_order,
        // Alamat teks dari order atau customer
        alamat_penjemputan: order.alamat_penjemputan || customer?.nama || '',
        // Koordinat (jika 0, akan dianggap tidak valid di frontend)
        latitude: lat,
        longitude: lng,
        latitude_pengantaran: order.latitude_pengantaran,
        longitude_pengantaran: order.longitude_pengantaran,
        status: order.status,
        berat_kg: order.berat_kg ?? null,
        // URL untuk navigasi
        google_maps_url: navigationUrl,
        // URL asli GMaps dari customer
        gmaps_link: gmapsUrl,
        customer_name: order.customer_name || customer?.nama || '',
        customer_whatsapp: order.customer_whatsapp || customer?.whatsapp || '',
        service_name: order.service_name,
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
