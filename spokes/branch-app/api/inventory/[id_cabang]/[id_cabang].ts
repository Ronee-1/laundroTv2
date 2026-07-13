/**
 * Inventory API
 * GET /api/inventory/[id_cabang]
 * Get inventory status for a branch
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
      return errorResponse('Access denied to this branch', 403);
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

    // Calculate overall status
    const hasKritis = stocks.some((s) => s.status === 'Kritis');
    const hasMenipis = stocks.some((s) => s.status === 'Menipis');

    return jsonResponse({
      success: true,
      data: {
        id_cabang,
        stocks,
        overall_status: hasKritis ? 'Kritis' : hasMenipis ? 'Menipis' : 'Aman',
      },
    });
  } catch (error) {
    console.error('[Inventory] Get error:', error);
    return errorResponse('Internal server error', 500);
  }
}

/**
 * Update Inventory Stock
 * PATCH /api/inventory/[id_cabang]
 */
interface UpdateInventoryRequest {
  item: string;
  stok_saat_ini: number;
  alasan?: string;
}

export async function PATCH(
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

    // Only Owner and Admin can update inventory
    if (!['Owner', 'Admin'].includes(authResult.user.role)) {
      return errorResponse('Access denied', 403);
    }

    // Check branch access
    if (authResult.user.role === 'Admin' && authResult.user.id_cabang !== id_cabang) {
      return errorResponse('Access denied to this branch', 403);
    }

    const body: UpdateInventoryRequest = await request.json();

    if (!body.item || body.stok_saat_ini === undefined) {
      return errorResponse('Item and stok_saat_ini are required', 400);
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
      return errorResponse(`Item "${body.item}" not found in this branch`, 404);
    }

    // Create anomaly log if stock changed significantly
    if (body.stok_saat_ini !== current.stok_saat_ini && Math.abs(body.stok_saat_ini - current.stok_saat_ini) >= 10) {
      await prisma.inventoryAnomaly.create({
        data: {
          id_cabang,
          nama_cabang: (await prisma.branch.findUnique({ where: { id_cabang } }))?.nama_cabang || '',
          item: body.item,
          stok_lama: current.stok_saat_ini,
          stok_baru: body.stok_saat_ini,
          alasan: body.alasan || 'Manual adjustment',
        },
      });
    }

    // Update inventory
    const updated = await prisma.inventoryItem.update({
      where: {
        id_cabang_item: {
          id_cabang,
          item: body.item,
        },
      },
      data: {
        stok_saat_ini: body.stok_saat_ini,
      },
    });

    return jsonResponse({
      success: true,
      message: 'Inventory updated successfully',
      data: { item: updated },
    });
  } catch (error) {
    console.error('[Inventory] Update error:', error);
    return errorResponse('Internal server error', 500);
  }
}
