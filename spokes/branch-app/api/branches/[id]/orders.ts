/**
 * Branch Orders API for Spoke
 * GET /api/branches/:id/orders
 * POST /api/branches/:id/orders
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
    const url = new URL(request.url);
    const status = url.searchParams.get('status');

    const authHeader = request.headers.get('authorization');
    const authResult = requireAuth(authHeader);

    if (!authResult.authorized) {
      return errorResponse(authResult.error, authResult.status);
    }

    // Check branch access
    if (authResult.user.role === 'Admin' && authResult.user.id_cabang !== id_cabang) {
      return errorResponse('Access denied', 403);
    }

    const where: Record<string, unknown> = { id_cabang };
    if (status) {
      where.status = status;
    }

    const orders = await prisma.order.findMany({
      where,
      include: {
        courier: {
          select: { id_kurir: true, nama_kurir: true },
        },
      },
      orderBy: { created_at: 'desc' },
    });

    return jsonResponse({
      success: true,
      data: {
        id_cabang,
        total: orders.length,
        orders,
      },
    });
  } catch (error) {
    console.error('[Branch] Orders error:', error);
    return errorResponse('Internal server error', 500);
  }
}

/**
 * Create new order for branch
 * POST /api/branches/:id/orders
 */
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: getCorsHeaders() });
    }

    const { id: id_cabang } = await params;
    const body = await request.json();

    const authHeader = request.headers.get('authorization');
    const authResult = requireAuth(authHeader);

    if (!authResult.authorized) {
      return errorResponse(authResult.error, authResult.status);
    }

    // Check branch access
    if (authResult.user.role === 'Admin' && authResult.user.id_cabang !== id_cabang) {
      return errorResponse('Access denied to this branch', 403);
    }

    // Get branch info for address
    const branch = await prisma.branch.findUnique({
      where: { id_cabang },
    });

    if (!branch) {
      return errorResponse(`Branch "${id_cabang}" not found`, 404);
    }

    // Generate order ID
    const id_order = `ORD-O-${Date.now().toString(36).toUpperCase().padStart(6, '0')}`;

    // Create order with branch relation
    const order = await prisma.order.create({
      data: {
        id_order,
        id_cabang,
        id_pelanggan: body.id_pelanggan || '',
        alamat_penjemputan: body.alamat_penjemputan || branch.alamat,
        alamat_pengantaran: body.alamat_pengantaran || branch.alamat,
        latitude_penjemputan: body.latitude_penjemputan || branch.latitude,
        longitude_penjemputan: body.longitude_penjemputan || branch.longitude,
        latitude_pengantaran: body.latitude_pengantaran || branch.latitude,
        longitude_pengantaran: body.longitude_pengantaran || branch.longitude,
        status: body.status || 'Pending',
        catatan: body.catatan,
        berat_kg: body.berat_kg,
        total_harga: body.total_harga,
        customer_name: body.customer_name,
        customer_whatsapp: body.customer_whatsapp,
        service_type: body.service_type,
        service_name: body.service_name,
        qty: body.qty,
        satuan: body.satuan,
        wilayah: branch.wilayah,
        source: 'outlet',
        assigned_by: authResult.user.id_user,
        metode_pembayaran: body.metode_pembayaran || 'Tunai',
        tanggal_order: new Date(),
        created_at: new Date(),
        // Connect to existing branch relation
        branch: {
          connect: { id_cabang: id_cabang },
        },
      },
    });

    // Auto-create cashbook entry for Tunai payments
    if (order.metode_pembayaran === 'Tunai' && order.total_harga > 0) {
      const id_jurnal = `JRN-${Date.now().toString(36).toUpperCase()}`;
      await prisma.cashBookEntry.create({
        data: {
          id_jurnal,
          id_cabang,
          id_transaksi: order.id_order,
          nominal: order.total_harga,
          tipe: 'Pemasukan',
          deskripsi: `Pendapatan laundry - ${order.customer_name || 'Pelanggan'} - ${order.service_name || 'Layanan'} - Tunai`,
          tanggal_jurnal: new Date(),
        },
      });
    }

    return jsonResponse({
      success: true,
      message: 'Order created successfully',
      data: { order },
    }, 201);
  } catch (error) {
    console.error('[Branch] Create order error:', error);
    return errorResponse('Internal server error', 500);
  }
}
