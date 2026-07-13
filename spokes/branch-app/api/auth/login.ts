/**
 * Authentication API - Login
 * POST /api/auth/login
 */

import bcrypt from 'bcrypt';
import { prisma } from '../../lib/prisma';
import { generateToken } from '../../utils/auth';
import { getCorsHeaders } from '../../utils/cors';
import { jsonResponse, errorResponse } from '../../utils/response';

interface LoginRequest {
  email: string;
  password: string;
}

export async function POST(request: Request): Promise<Response> {
  try {
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: getCorsHeaders() });
    }

    const body: LoginRequest = await request.json();

    if (!body.email || !body.password) {
      return errorResponse('Email and password are required', 400);
    }

    const user = await prisma.user.findUnique({
      where: { email: body.email.toLowerCase().trim() },
    });

    if (!user) {
      return errorResponse('Invalid email or password', 401);
    }

    if (!user.is_active) {
      return errorResponse('Account is deactivated', 403);
    }

    const isPasswordValid = await bcrypt.compare(body.password, user.password);

    if (!isPasswordValid) {
      return errorResponse('Invalid email or password', 401);
    }

    let branchInfo = null;
    if (user.id_cabang) {
      const branch = await prisma.branch.findUnique({
        where: { id_cabang: user.id_cabang },
        select: { id_cabang: true, nama_cabang: true, wilayah: true },
      });
      branchInfo = branch;
    }

    let courierId: string | null = null;
    if (user.role === 'Kurir' && user.id_cabang) {
      const courier = await prisma.courier.findFirst({
        where: { id_cabang: user.id_cabang },
        select: { id_kurir: true },
      });
      courierId = courier?.id_kurir ?? null;
    }

    const token = generateToken({
      id_user: user.id_user,
      email: user.email,
      role: user.role as 'Owner' | 'Admin' | 'Kurir',
      id_cabang: user.id_cabang,
    });

    return jsonResponse({
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: {
          id_user: user.id_user,
          nama: user.nama,
          email: user.email,
          role: user.role,
          id_cabang: user.id_cabang,
          branch: branchInfo,
          courier_id: courierId,
        },
      },
    });
  } catch (error) {
    console.error('[Auth] Login error:', error);
    return errorResponse('Internal server error', 500);
  }
}
