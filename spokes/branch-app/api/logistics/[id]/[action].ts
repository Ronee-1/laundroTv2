/**
 * Logistics Action API
 * POST /api/logistics/:id/start-route
 * POST /api/logistics/:id/handover
 * POST /api/logistics/:id/verify
 */

import { prisma } from '../../../lib/prisma';
import { requireAuth } from '../../utils/auth';
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

    const { id: logisticsId } = await params;
    const url = new URL(request.url);
    const action = url.pathname.split('/').pop();

    const authHeader = request.headers.get('authorization');
    const authResult = requireAuth(authHeader);

    if (!authResult.authorized) {
      return errorResponse(authResult.error, authResult.status);
    }

    const log = await prisma.logisticsLog.findUnique({
      where: { id: logisticsId },
    });

    if (!log) {
      return errorResponse('Logistics log not found', 404);
    }

    let newStatus = log.status;
    let message = '';

    switch (action) {
      case 'start-route':
        newStatus = 'DriverEnRoute';
        message = 'Logistics started';
        break;
      case 'handover':
        newStatus = 'AwaitingVerification';
        message = 'Handover completed, awaiting verification';
        break;
      case 'verify':
        newStatus = 'Completed';
        message = 'Logistics verified and completed';
        break;
      default:
        return errorResponse('Unknown action', 400);
    }

    const updated = await prisma.logisticsLog.update({
      where: { id: logisticsId },
      data: { status: newStatus },
    });

    return jsonResponse({
      success: true,
      message,
      data: { log: updated },
    });
  } catch (error) {
    console.error('[Logistics] Action error:', error);
    return errorResponse('Internal server error', 500);
  }
}
