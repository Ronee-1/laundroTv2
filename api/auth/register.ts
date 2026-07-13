/**
 * Authentication API - Register New User (Owner only)
 * POST /api/auth/register
 */

import bcrypt from 'bcryptjs';
import { prisma } from '../../lib/prisma';
import { requireRole } from '../utils/auth';
import { getCorsHeaders } from '../utils/cors';
import { jsonResponse, errorResponse } from '../utils/response';

const BCRYPT_SALT_ROUNDS = 12;

interface CreateUserRequest {
  nama: string;
  email: string;
  password: string;
  role: 'Admin' | 'Kurir';
  id_cabang: string;
}

export async function POST(request: Request) {
  try {
    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: getCorsHeaders() });
    }

    const authHeader = request.headers.get('authorization');
    const authResult = requireRole(authHeader, 'Owner');

    if (!authResult.authorized) {
      return errorResponse(authResult.error, authResult.status);
    }

    const body: CreateUserRequest = await request.json();

    // Validation
    const errors: string[] = [];

    if (!body.nama || body.nama.trim().length < 2) {
      errors.push('Nama must be at least 2 characters');
    }

    if (!body.email || !body.email.includes('@')) {
      errors.push('Valid email is required');
    }

    if (!body.password || body.password.length < 6) {
      errors.push('Password must be at least 6 characters');
    }

    if (!body.role || !['Admin', 'Kurir'].includes(body.role)) {
      errors.push('Role must be either "Admin" or "Kurir"');
    }

    if (!body.id_cabang) {
      errors.push('ID_Cabang is required');
    }

    if (errors.length > 0) {
      return errorResponse('Validation failed', 400, errors);
    }

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: body.email.toLowerCase().trim() },
    });

    if (existingUser) {
      return errorResponse('Email already registered', 409);
    }

    // Check if branch exists
    const branch = await prisma.branch.findUnique({
      where: { id_cabang: body.id_cabang },
    });

    if (!branch) {
      return errorResponse(`Branch with ID "${body.id_cabang}" not found`, 404);
    }

    // Check if branch already has an admin
    if (body.role === 'Admin') {
      const existingAdmin = await prisma.user.findFirst({
        where: {
          id_cabang: body.id_cabang,
          role: 'Admin',
          is_active: true,
        },
      });

      if (existingAdmin) {
        return errorResponse(`Branch "${branch.nama_cabang}" already has an active Admin`, 409);
      }
    }

    // Create user
    const hashedPassword = await bcrypt.hash(body.password, BCRYPT_SALT_ROUNDS);
    const rolePrefix = body.role === 'Admin' ? 'ADM' : 'KUR';
    const userId = `${rolePrefix}-${Date.now().toString(36).toUpperCase()}`;

    const newUser = await prisma.user.create({
      data: {
        id_user: userId,
        nama: body.nama.trim(),
        email: body.email.toLowerCase().trim(),
        password: hashedPassword,
        role: body.role as 'Admin' | 'Kurir',
        id_cabang: body.id_cabang,
        is_active: true,
      },
      select: {
        id_user: true,
        nama: true,
        email: true,
        role: true,
        id_cabang: true,
        is_active: true,
        created_at: true,
      },
    });

    // If creating Kurir, also create Courier record
    if (body.role === 'Kurir') {
      const courierId = `KUR-USR-${newUser.id_user.slice(-4).toUpperCase()}`;

      await prisma.courier.upsert({
        where: { id_kurir: courierId },
        update: {},
        create: {
          id_kurir: courierId,
          id_cabang: body.id_cabang,
          nama_kurir: body.nama.trim(),
          nomor_telepon: '+6280000000000',
          is_available: true,
        },
      });
    }

    console.log(`[Auth] User created: ${newUser.email} (${body.role}) at ${branch.nama_cabang}`);

    return jsonResponse({
      success: true,
      message: `User ${body.role} "${body.nama}" created successfully`,
      data: {
        user: newUser,
        branch: {
          id_cabang: branch.id_cabang,
          nama_cabang: branch.nama_cabang,
          wilayah: branch.wilayah,
        },
      },
    }, 201);
  } catch (error) {
    console.error('[Auth] Register error:', error);
    return errorResponse('Internal server error', 500);
  }
}
