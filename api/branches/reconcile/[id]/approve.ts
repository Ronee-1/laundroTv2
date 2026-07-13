/**
 * Reconcile Approval/Rejection - Owner only
 * POST /api/branches/reconcile/:id/approve
 * POST /api/branches/reconcile/:id/reject
 */

import { prisma } from '../../../../lib/prisma';
import { requireRole } from '../../../utils/auth';
import { getCorsHeaders } from '../../../utils/cors';
import { jsonResponse, errorResponse } from '../../../utils/response';

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

    const reconciliation = await prisma.reconciliationLog.findUnique({
      where: { id_rekonsiliasi: id },
    });

    if (!reconciliation) {
      return errorResponse('Reconciliation not found', 404);
    }

    const updated = await prisma.reconciliationLog.update({
      where: { id_rekonsiliasi: id },
      data: {
        approval_status: action === 'approve' ? 'Disetujui' : 'Ditolak',
        catatan_owner: action === 'approve' ? 'Approved by Owner' : 'Rejected by Owner',
      },
    });

    return jsonResponse({
      success: true,
      message: `Reconciliation ${action}d successfully`,
      data: { reconciliation: updated },
    });
  } catch (error) {
    console.error('[Reconcile] Action error:', error);
    return errorResponse('Internal server error', 500);
  }
}
