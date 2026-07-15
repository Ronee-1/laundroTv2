/**
 * Orders API - Get All Orders
 * GET /api/orders
 * Query params: id_cabang, status, limit, offset, incoming
 */

import { prisma } from '../../lib/prisma';
import { requireAuth } from '../../utils/auth';
import { getCorsHeaders } from '../../utils/cors';
import { jsonResponse, errorResponse } from '../../utils/response';

/**
 * Extract coordinates from Google Maps URL
 */
function extractCoordinatesFromGmapsUrl(url: string): { lat: number; lng: number } | null {
  if (!url) return null;
  try {
    const atMatch = url.match(/@(-?\d+\.?\d*),(-?\d+\.?\d*)/);
    if (atMatch) return { lat: parseFloat(atMatch[1]), lng: parseFloat(atMatch[2]) };
    const qMatch = url.match(/[?&]q=(-?\d+\.?\d*),(-?\d+\.?\d*)/);
    if (qMatch) return { lat: parseFloat(qMatch[1]), lng: parseFloat(qMatch[2]) };
    const destMatch = url.match(/destination=(-?\d+\.?\d*),(-?\d+\.?\d*)/);
    if (destMatch) return { lat: parseFloat(destMatch[1]), lng: parseFloat(destMatch[2]) };
    return null;
  } catch {
    return null;
  }
}

export async function GET(request: Request) {
  try {
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: getCorsHeaders() });
    }

    const authHeader = request.headers.get('authorization');
    const authResult = requireAuth(authHeader);

    if (!authResult.authorized) {
      return jsonResponse({ success: false, error: authResult.error }, authResult.status);
    }

    const url = new URL(request.url);
    const id_cabang = url.searchParams.get('id_cabang');
    const status = url.searchParams.get('status');
    const incoming = url.searchParams.get('incoming') === 'true';
    const limit = parseInt(url.searchParams.get('limit') || '50');
    const offset = parseInt(url.searchParams.get('offset') || '0');

    // Build where clause based on user role
    const where: Record<string, unknown> = {};

    // Admin can only see their branch orders
    if (authResult.user.role === 'Admin' && authResult.user.id_cabang) {
      where.id_cabang = authResult.user.id_cabang;
    } else if (id_cabang) {
      where.id_cabang = id_cabang;
    }

    if (status) {
      where.status = status;
    }

    // Jika incoming=true, hanya order yang belum ditugaskan
    if (incoming) {
      where.id_kurir = null;
    }

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: {
          branch: {
            select: { id_cabang: true, nama_cabang: true },
          },
          courier: {
            select: { id_kurir: true, nama_kurir: true },
          },
        },
        orderBy: { created_at: 'desc' },
        take: limit,
        skip: offset,
      }),
      prisma.order.count({ where }),
    ]);

    // Normalize WhatsApp for matching
    function normalizeWhatsApp(wa: string): string {
      return wa.replace(/[^0-9]/g, '');
    }

    // Get customer data
    const customerIds = orders.map(o => o.id_pelanggan).filter(Boolean);
    const whatsappNumbers = orders.map(o => o.customer_whatsapp).filter(Boolean);

    const customers = await prisma.customer.findMany({
      where: {
        OR: [
          { id_pelanggan: { in: customerIds } },
          { whatsapp: { in: whatsappNumbers } },
        ],
      },
      select: {
        id_pelanggan: true,
        nama: true,
        whatsapp: true,
        alamat_maps: true,
        google_maps_url: true,
      },
    });

    const customerMapById = new Map(customers.map(c => [c.id_pelanggan, c]));
    const customerMapByWhatsapp = new Map(
      customers.filter(c => c.whatsapp).map(c => [normalizeWhatsApp(c.whatsapp), c])
    );

    // Transform orders with customer data
    const ordersWithCustomer = orders.map(order => {
      let customer = customerMapById.get(order.id_pelanggan);
      if (!customer && order.customer_whatsapp) {
        customer = customerMapByWhatsapp.get(normalizeWhatsApp(order.customer_whatsapp));
      }

      // Prioritas GMaps URL
      const gmapsUrl = order.google_maps_url || customer?.alamat_maps || customer?.google_maps_url || '';

      // Extract coordinates
      let lat = order.latitude_penjemputan;
      let lng = order.longitude_penjemputan;

      if ((lat === 0 || lng === 0) && gmapsUrl) {
        const coords = extractCoordinatesFromGmapsUrl(gmapsUrl);
        if (coords) {
          lat = coords.lat;
          lng = coords.lng;
        }
      }

      const navigationUrl = (lat !== 0 && lng !== 0)
        ? `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`
        : gmapsUrl;

      return {
        id_order: order.id_order,
        customer_name: order.customer_name || customer?.nama || '',
        customer_whatsapp: order.customer_whatsapp || customer?.whatsapp || '',
        service_type: order.service_type || '',
        service_name: order.service_name || '',
        wilayah: order.wilayah || '',
        berat_kg: order.berat_kg ?? 0,
        alamat_penjemputan: order.alamat_penjemputan || '',
        google_maps_url: navigationUrl,
        gmaps_link: gmapsUrl,
        latitude: lat,
        longitude: lng,
        status: order.status,
        tanggal_order: order.tanggal_order?.toISOString() || new Date().toISOString(),
        // Include full order data
        id_kurir: order.id_kurir,
        id_cabang: order.id_cabang,
        catatan: order.catatan,
        total_harga: order.total_harga,
        source: order.source,
        assigned_at: order.assigned_at?.toISOString(),
      };
    });

    return jsonResponse({
      success: true,
      id_cabang,
      total_orders: ordersWithCustomer.length,
      orders: ordersWithCustomer,
    });
  } catch (error) {
    console.error('[Orders] Get all error:', error);
    return errorResponse('Internal server error', 500);
  }
}

/**
 * Create New Order
 * POST /api/orders
 */
export async function POST(request: Request) {
  try {
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: getCorsHeaders() });
    }

    const authHeader = request.headers.get('authorization');
    const authResult = requireAuth(authHeader);

    if (!authResult.authorized) {
      return jsonResponse({ success: false, error: authResult.error }, authResult.status);
    }

    const body = await request.json();

    // Validation
    if (!body.id_cabang) {
      return errorResponse('ID cabang is required', 400);
    }

    if (!body.alamat_penjemputan) {
      return errorResponse('Alamat penjemputan is required', 400);
    }

    // Check branch access
    if (authResult.user.role === 'Admin' && authResult.user.id_cabang !== body.id_cabang) {
      return errorResponse('Access denied to this branch', 403);
    }

    // Generate order ID
    const id_order = `ORD-${Date.now().toString(36).toUpperCase()}`;

    const order = await prisma.order.create({
      data: {
        id_order,
        id_cabang: body.id_cabang,
        id_pelanggan: body.id_pelanggan || '',
        alamat_penjemputan: body.alamat_penjemputan,
        alamat_pengantaran: body.alamat_pengantaran || body.alamat_penjemputan,
        latitude_penjemputan: body.latitude_penjemputan || 0,
        longitude_penjemputan: body.longitude_penjemputan || 0,
        latitude_pengantaran: body.latitude_pengantaran || body.latitude_penjemputan || 0,
        longitude_pengantaran: body.longitude_pengantaran || body.longitude_penjemputan || 0,
        status: 'Pending',
        catatan: body.catatan,
        berat_kg: body.berat_kg,
        total_harga: body.total_harga,
        customer_name: body.customer_name,
        customer_whatsapp: body.customer_whatsapp,
        service_type: body.service_type,
        service_name: body.service_name,
        qty: body.qty,
        satuan: body.satuan,
        wilayah: body.wilayah,
        source: body.source || 'outlet',
        assigned_by: authResult.user.id_user,
      },
    });

    return jsonResponse({
      success: true,
      message: 'Order created successfully',
      data: { order },
    }, 201);
  } catch (error) {
    console.error('[Orders] Create error:', error);
    return errorResponse('Internal server error', 500);
  }
}
