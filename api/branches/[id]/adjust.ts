/**
 * Stock Adjustment API
 * POST /api/branches/:id/adjust
 */

import { prisma } from '../../../lib/prisma';
import { requireAuth } from '../../utils/auth';
import { getCorsHeaders } from '../../utils/cors';
import { jsonResponse, errorResponse } from '../../utils/response';

interface AdjustRequest {
  item: string;
  stok_baru: number;
  alasan: string;
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
    const body: AdjustRequest = await request.json();
    const authHeader = request.headers.get('authorization');
    const authResult = requireAuth(authHeader);

    if (!authResult.authorized) {
      return errorResponse(authResult.error, authResult.status);
    }

    // Check branch access
    if (authResult.user.role === 'Admin' && authResult.user.id_cabang !== id_cabang) {
      return errorResponse('Access denied', 403);
    }

    if (!body.item || body.stok_baru === undefined || !body.alasan) {
      return errorResponse('Item, stok_baru, and alasan are required', 400);
    }

    // Get current inventory
    const current = await prisma.inventoryItem.findUnique({
      where: {
        id_cabang_item: {
          id_cabang,
          item: body.item,
        },
      },
    });

    if (!current) {
      return errorResponse(`Item "${body.item}" not found`, 404);
    }

    // Create anomaly log
    await prisma.inventoryAnomaly.create({
      data: {
        id_cabang,
        nama_cabang: (await prisma.branch.findUnique({ where: { id_cabang } }))?.nama_cabang || '',
        item: body.item,
        stok_lama: current.stok_saat_ini,
        stok_baru: body.stok_baru,
        alasan: body.alasan,
      },
    });

    // Update inventory
    const updated = await prisma.inventoryItem.update({
      where: {
        id_cabang_item: {
          id_cabang,
          item: body.item,
        },
      },
      data: {
        stok_saat_ini: body.stok_baru,
      },
    });

    return jsonResponse({
      success: true,
      message: 'Stock adjusted successfully',
      data: { item: updated },
    });
  } catch (error) {
    console.error('[Branch] Adjust error:', error);
    return errorResponse('Internal server error', 500);
  }
}
