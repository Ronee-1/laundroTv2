/**
 * Services Tariffs API
 * GET /api/services/tariffs
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

    const tariffs = await prisma.serviceTariff.findMany({
      where: { is_active: true },
      orderBy: { nama_layanan: 'asc' },
    });

    // Return default tariffs if none exist
    if (tariffs.length === 0) {
      const defaultTariffs = [
        { id_layanan: 'svc-1', nama_layanan: 'Cuci Kiloan', kategori: 'kiloan', satuan: 'kg', harga_per_satuan: 7000, estimasi_hari: 3, is_active: true },
        { id_layanan: 'svc-2', nama_layanan: 'Cuci + Setrika', kategori: 'kiloan', satuan: 'kg', harga_per_satuan: 10000, estimasi_hari: 4, is_active: true },
        { id_layanan: 'svc-3', nama_layanan: 'Setrika Kiloan', kategori: 'kiloan', satuan: 'kg', harga_per_satuan: 5000, estimasi_hari: 2, is_active: true },
        { id_layanan: 'svc-4', nama_layanan: 'Bed Cover', kategori: 'bedcover', satuan: 'pcs', harga_per_satuan: 25000, estimasi_hari: 5, is_active: true },
        { id_layanan: 'svc-5', nama_layanan: 'Bantal', kategori: 'satuan', satuan: 'pcs', harga_per_satuan: 10000, estimasi_hari: 3, is_active: true },
      ];

      return jsonResponse({
        success: true,
        data: {
          tariffs: defaultTariffs,
          isDefault: true,
        },
      });
    }

    return jsonResponse({
      success: true,
      data: { tariffs },
    });
  } catch (error) {
    console.error('[Services] Tariffs error:', error);
    return errorResponse('Internal server error', 500);
  }
}
