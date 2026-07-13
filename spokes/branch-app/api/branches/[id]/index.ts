/**
 * Branch API - Consolidated
 * GET /api/branches/:id
 * POST /api/branches/:id/customer
 * GET/POST /api/branches/:id/reconcile
 */

import { prisma } from '../../../lib/prisma';
import { requireAuth, requireRole } from '../../utils/auth';
import { getCorsHeaders } from '../../utils/cors';
import { jsonResponse, errorResponse } from '../../utils/response';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: getCorsHeaders() });
    }

    const { id } = await params;
    const authHeader = request.headers.get('authorization');
    const authResult = requireAuth(authHeader);

    if (!authResult.authorized) {
      return errorResponse(authResult.error, authResult.status);
    }

    const url = new URL(request.url);
    const action = url.pathname.split('/').pop();

    // Handle reconcile endpoint
    if (action === 'reconcile') {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const cashEntries = await prisma.cashBookEntry.findMany({
        where: { id_cabang: id, tanggal_jurnal: { gte: today } },
      });

      const kasDigital = cashEntries.reduce((sum, e) => {
        return e.tipe === 'Pemasukan' ? sum + e.nominal : sum - e.nominal;
      }, 0);

      const kasFisik = 0; // Will be sent in POST
      const selisih = kasFisik - kasDigital;

      return jsonResponse({
        success: true,
        data: { kasDigital, kasFisik, selisih },
      });
    }

    const branch = await prisma.branch.findUnique({
      where: { id_cabang: id },
      include: {
        couriers: true,
        _count: { select: { orders: true, customers: true } },
      },
    });

    if (!branch) {
      return errorResponse(`Branch "${id}" not found`, 404);
    }

    return jsonResponse({ success: true, data: { branch } });
  } catch (error) {
    console.error('[Branch] GET error:', error);
    return errorResponse('Internal server error', 500);
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: getCorsHeaders() });
    }

    const { id: id_cabang } = await params;
    const url = new URL(request.url);
    const action = url.pathname.split('/').pop();
    const authHeader = request.headers.get('authorization');

    if (action === 'customer') {
      const authResult = requireRole(authHeader, 'Owner', 'Admin');
      if (!authResult.authorized) return errorResponse(authResult.error, authResult.status);

      const body = await request.json() as { nama: string; whatsapp: string; alamat_maps: string; google_maps_url?: string };

      if (!body.nama || !body.whatsapp || !body.alamat_maps) {
        return errorResponse('Missing required fields', 400);
      }

      const customer = await prisma.customer.create({
        data: {
          id_pelanggan: `CUST-${Date.now().toString(36).toUpperCase()}`,
          id_cabang,
          nama: body.nama,
          whatsapp: body.whatsapp,
          alamat_maps: body.alamat_maps,
          google_maps_url: body.google_maps_url,
        },
      });

      return jsonResponse({ success: true, data: { customer } }, 201);
    }

    if (action === 'reconcile') {
      const authResult = requireRole(authHeader, 'Owner', 'Admin');
      if (!authResult.authorized) return errorResponse(authResult.error, authResult.status);

      const body = await request.json() as { kas_fisik: number; catatan?: string };
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const cashEntries = await prisma.cashBookEntry.findMany({
        where: { id_cabang, tanggal_jurnal: { gte: today } },
      });

      const kasDigital = cashEntries.reduce((sum, e) => e.tipe === 'Pemasukan' ? sum + e.nominal : sum - e.nominal, 0);
      const selisih = body.kas_fisik - kasDigital;

      const reconciliation = await prisma.reconciliationLog.create({
        data: {
          id_cabang,
          kas_digital: kasDigital,
          kas_fisik: body.kas_fisik,
          selisih,
          status: selisih === 0 ? 'Cocok' : 'Selisih',
          catatan: body.catatan,
        },
      });

      return jsonResponse({ success: true, data: { reconciliation } }, 201);
    }

    return errorResponse('Unknown action', 400);
  } catch (error) {
    console.error('[Branch] POST error:', error);
    return errorResponse('Internal server error', 500);
  }
}
