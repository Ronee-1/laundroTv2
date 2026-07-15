/**
 * Logistics API - GET /api/logistics/active
 * Returns active logistics logs for the authenticated courier's branch
 */

import { prisma } from '../../lib/prisma';
import { requireAuth } from '../../utils/auth';
import { getCorsHeaders } from '../../utils/cors';
import { jsonResponse, errorResponse } from '../../utils/response';

export async function GET(request: Request) {
  try {
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: getCorsHeaders() });
    }

    const authHeader = request.headers.get('authorization');
    const authResult = requireAuth(authHeader);

    if (!authResult.authorized) return errorResponse(authResult.error, authResult.status);

    const user = authResult.user;

    // Get branch ID — courier gets from their courier record, admin/owner from user record
    let id_cabang = user.id_cabang;

    if (!id_cabang && user.role === 'Kurir') {
      // Fallback: look up courier record to find branch
      const courier = await prisma.courier.findFirst({
        where: {},
        select: { id_cabang: true },
      });
      id_cabang = courier?.id_cabang ?? null;
    }

    if (!id_cabang) return errorResponse('Branch not found for user', 404);

    // Fetch active logistics logs for this branch
    const logisticsLogs = await prisma.logisticsLog.findMany({
      where: {
        id_cabang,
        status: { in: ['In-Transit', 'Driver-En-Route', 'Awaiting-Verification'] },
      },
      orderBy: { timestamp: 'asc' },
      include: {
        branch: {
          select: { id_cabang: true, nama_cabang: true },
        },
      },
    });

    // Enrich with branch name from the relation (already loaded)
    const logs = logisticsLogs.map((log) => {
      const sentItems = log.sent_items as { detergen: number; pelembut: number; plastik: number };
      const receivedItems = log.received_items as { detergen: number; pelembut: number; plastik: number } | null;

      return {
        id: log.id,
        branchId: log.id_cabang,
        nama_cabang: log.branch.nama_cabang,
        sentItems: {
          detergen: sentItems?.detergen ?? 0,
          pelembut: sentItems?.pelembut ?? 0,
          plastik: sentItems?.plastik ?? 0,
        },
        receivedItems: receivedItems ?? null,
        status: log.status,
        timestamp: log.timestamp.toISOString(),
      };
    });

    return jsonResponse({
      success: true,
      id_cabang,
      total: logs.length,
      logs,
    });
  } catch (error) {
    console.error('[Logistics Active] GET error:', error);
    return errorResponse('Internal server error', 500);
  }
}
