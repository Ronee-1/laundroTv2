/**
 * Branch Inventory API
 * GET /api/branches/:id/inventory
 *
 * Returns inventory items for the specified branch
 */

import { prisma } from '../../../lib/prisma';
import { requireAuth } from '../../utils/auth';
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

    const inventory = await prisma.inventoryItem.findMany({
      where: { id_cabang },
    });

    const stocks = inventory.map((item) => {
      const isLow = item.stok_saat_ini <= item.safety_threshold;
      const isKritis = item.stok_saat_ini < item.safety_threshold * 0.5;

      return {
        item: item.item,
        satuan: item.satuan,
        stok_saat_ini: item.stok_saat_ini,
        safety_threshold: item.safety_threshold,
        max_capacity: item.max_capacity,
        status: isKritis ? 'Kritis' : isLow ? 'Menipis' : 'Aman',
        percent_remaining: Math.round((item.stok_saat_ini / item.max_capacity) * 100),
      };
    });

    const hasKritis = stocks.some((s) => s.status === 'Kritis');
    const hasMenipis = stocks.some((s) => s.status === 'Menipis');

    return jsonResponse({
      success: true,
      data: {
        id_cabang,
        stocks,
        overall_status: hasKritis ? 'Kritis' : hasMenipis ? 'Menipis' : 'Aman',
      },
      stocks,
      overall_status: hasKritis ? 'Kritis' : hasMenipis ? 'Menipis' : 'Aman',
    });
  } catch (error) {
    console.error('[Branch] Inventory error:', error);
    return errorResponse('Internal server error', 500);
  }
}
