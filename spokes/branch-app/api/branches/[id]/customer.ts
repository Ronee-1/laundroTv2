/**
 * Branch Customers API
 * POST /api/branches/[id]/customer - Create customer
 */

import { prisma } from '../../../lib/prisma';
import { requireAuth, requireRole } from '../../utils/auth';
import { getCorsHeaders } from '../../utils/cors';
import { jsonResponse, errorResponse } from '../../utils/response';

interface CustomerRequest {
  nama: string;
  whatsapp: string;
  alamat_maps: string;
  google_maps_url?: string;
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
    const authHeader = request.headers.get('authorization');
    const authResult = requireRole(authHeader, 'Owner', 'Admin');

    if (!authResult.authorized) {
      return errorResponse(authResult.error, authResult.status);
    }

    const body: CustomerRequest = await request.json();

    // Validation
    if (!body.nama || body.nama.trim().length < 2) {
      return errorResponse('Nama must be at least 2 characters', 400);
    }

    if (!body.whatsapp) {
      return errorResponse('WhatsApp number is required', 400);
    }

    if (!body.alamat_maps) {
      return errorResponse('Alamat is required', 400);
    }

    // Check if branch exists
    const branch = await prisma.branch.findUnique({
      where: { id_cabang },
    });

    if (!branch) {
      return errorResponse(`Branch "${id_cabang}" not found`, 404);
    }

    // Check branch access for Admin
    if (authResult.user.role === 'Admin' && authResult.user.id_cabang !== id_cabang) {
      return errorResponse('Access denied to this branch', 403);
    }

    // Create customer
    const customer = await prisma.customer.create({
      data: {
        id_pelanggan: `CUST-${Date.now().toString(36).toUpperCase()}`,
        id_cabang,
        nama: body.nama.trim(),
        whatsapp: body.whatsapp,
        alamat_maps: body.alamat_maps,
        google_maps_url: body.google_maps_url,
      },
    });

    return jsonResponse({
      success: true,
      message: 'Customer created successfully',
      data: { customer },
    }, 201);
  } catch (error) {
    console.error('[Branch] Create customer error:', error);
    return errorResponse('Internal server error', 500);
  }
}
