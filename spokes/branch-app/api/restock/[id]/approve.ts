/**
 * Restock Approval/Rejection API
 * POST /api/restock/:id/approve
 * POST /api/restock/:id/reject
 */

import { prisma } from '../../../lib/prisma';
import { requireRole } from '../../utils/auth';
import { getCorsHeaders } from '../../utils/cors';
import { jsonResponse, errorResponse } from '../../utils/response';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: getCorsHeaders() });
    }

    const { id } = await params;
    const url = new URL(request.url);
    const action = url.pathname.includes('/approve') ? 'approve' : 'reject';

    const authHeader = request.headers.get('authorization');
    const authResult = requireRole(authHeader, 'Owner');

    if (!authResult.authorized) {
      return errorResponse(authResult.error, authResult.status);
    }

    const restockRequest = await prisma.restockRequest.findUnique({
      where: { id_request: id },
    });

    if (!restockRequest) {
      return errorResponse('Restock request not found', 404);
    }

    const updated = await prisma.restockRequest.update({
      where: { id_request: id },
      data: {
        status: action === 'approve' ? 'Approved' : 'Rejected',
        reviewed_by: authResult.user.id_user,
        reviewed_at: new Date(),
      },
    });

    // If approved, update inventory
    if (action === 'approve') {
      const items = updated.requested_items as Record<string, number>;

      for (const [item, qty] of Object.entries(items)) {
        if (qty > 0) {
          await prisma.inventoryItem.updateMany({
            where: {
              id_cabang: updated.id_cabang,
              item: item.charAt(0).toUpperCase() + item.slice(1),
            },
            data: {
              stok_saat_ini: {
                increment: qty,
              },
            },
          });
        }
      }
    }

    return jsonResponse({
      success: true,
      message: `Restock request ${action}d`,
      data: { request: updated },
    });
  } catch (error) {
    console.error('[Restock] Action error:', error);
    return errorResponse('Internal server error', 500);
  }
}
