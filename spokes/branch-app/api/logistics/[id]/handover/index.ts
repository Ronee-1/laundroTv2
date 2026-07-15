/**
 * Logistics API - PATCH /api/logistics/:id/handover
 * Marks a logistics log as "Awaiting-Verification" when courier hands over supplies
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

    if (log.status !== 'Driver-En-Route') {
      return errorResponse(`Tidak dapat serah terima dari status "${log.status}"`, 400);
    }

    const updated = await prisma.logisticsLog.update({
      where: { id },
      data: { status: 'Awaiting-Verification' },
    });

    return jsonResponse({
      success: true,
      message: 'Barang telah diterima cabang tujuan. Menunggu verifikasi dari admin.',
      data: { logistics: updated },
    });
  } catch (error) {
    console.error('[Logistics Handover] PATCH error:', error);
    return errorResponse('Internal server error', 500);
  }
}
