/**
 * Orders API - Get All Orders
 * GET /api/orders
 * Query params: id_cabang, status, limit, offset
 */

import { prisma } from '../../lib/prisma';
import { requireAuth } from '../utils/auth';
import { getCorsHeaders } from '../utils/cors';
import { jsonResponse, errorResponse } from '../utils/response';

export async function GET(request: Request) {
  try {
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: getCorsHeaders() });
    }

    const authHeader = request.headers.get('authorization');
    const authResult = requireAuth(authHeader);

    if (!authResult.authorized) {
      return errorResponse(authResult.error, authResult.status);
    }

    const url = new URL(request.url);
    const id_cabang = url.searchParams.get('id_cabang');
    const status = url.searchParams.get('status');
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

    return jsonResponse({
      success: true,
      data: {
        total,
        limit,
        offset,
        orders,
      },
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
      return errorResponse(authResult.error, authResult.status);
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
        metode_pembayaran: body.metode_pembayaran || 'Tunai',
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
