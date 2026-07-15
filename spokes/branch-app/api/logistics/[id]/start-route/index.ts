/**
 * Logistics API - PATCH /api/logistics/:id/start-route
 * Marks a logistics log as "Driver-En-Route" when courier starts driving
 */

import { prisma } from '../../../lib/prisma';
import { requireAuth } from '../../../utils/auth';
import { getCorsHeaders } from '../../../utils/cors';
import { jsonResponse, errorResponse } from '../../../utils/response';

export async function PATCH(
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

    if (!authResult.authorized) return errorResponse(authResult.error, authResult.status);

    const log = await prisma.logisticsLog.findUnique({ where: { id } });
    if (!log) return errorResponse('Logistik tidak ditemukan', 404);

    if (log.status !== 'In-Transit') {
      return errorResponse(`Tidak dapat memulai rute dari status "${log.status}"`, 400);
    }

    const updated = await prisma.logisticsLog.update({
      where: { id },
      data: { status: 'Driver-En-Route' },
    });

    return jsonResponse({
      success: true,
      message: 'Rute dimulai. Saat di lokasi cabang tujuan, tekan "Serah Terima".',
      data: { logistics: updated },
    });
  } catch (error) {
    console.error('[Logistics StartRoute] PATCH error:', error);
    return errorResponse('Internal server error', 500);
  }
}
