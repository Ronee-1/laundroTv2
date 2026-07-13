/**
 * Expense Categories API
 * GET /api/expenses/categories
 * POST /api/expenses/categories
 */

import { prisma } from '../../lib/prisma';
import { requireAuth } from '../utils/auth';
import { getCorsHeaders } from '../utils/cors';
import { jsonResponse, errorResponse } from '../utils/response';

export async function GET(request: Request) {
  try {
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: getCorsHeaders() });
    }

    const authHeader = request.headers.get('authorization');
    const authResult = requireAuth(authHeader);

    if (!authResult.authorized) {
      return errorResponse(authResult.error, authResult.status);
    }

    const categories = await prisma.expenseCategory.findMany({
      orderBy: { name: 'asc' },
    });

    // Add default categories if none exist
    if (categories.length === 0) {
      const defaultCategories = [
        { id: 'cat-1', name: 'Operasional' },
        { id: 'cat-2', name: 'Bahan Baku' },
        { id: 'cat-3', name: 'Transportasi' },
        { id: 'cat-4', name: 'Listrik & Air' },
        { id: 'cat-5', name: 'Gaji Karyawan' },
        { id: 'cat-6', name: 'Perbaikan' },
        { id: 'cat-7', name: 'Marketing' },
        { id: 'cat-8', name: 'Lainnya' },
      ];

      return jsonResponse({
        success: true,
        data: {
          categories: defaultCategories,
          isDefault: true,
        },
      });
    }

    return jsonResponse({
      success: true,
      data: { categories },
    });
  } catch (error) {
    console.error('[Expenses] Categories error:', error);
    return errorResponse('Internal server error', 500);
  }
}

interface CreateCategoryRequest {
  name: string;
}

export async function POST(request: Request) {
  try {
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: getCorsHeaders() });
    }

    const authHeader = request.headers.get('authorization');
    const authResult = requireAuth(authHeader);

    if (!authResult.authorized) {
      return errorResponse(authResult.error, authResult.status);
    }

    const body: CreateCategoryRequest = await request.json();

    if (!body.name || body.name.trim().length < 2) {
      return errorResponse('Category name is required', 400);
    }

    // Check if category exists
    const existing = await prisma.expenseCategory.findUnique({
      where: { name: body.name.trim() },
    });

    if (existing) {
      return errorResponse('Category already exists', 409);
    }

    const category = await prisma.expenseCategory.create({
      data: {
        id: `cat-${Date.now().toString(36)}`,
        name: body.name.trim(),
      },
    });

    return jsonResponse({
      success: true,
      message: 'Category created',
      data: { category },
    }, 201);
  } catch (error) {
    console.error('[Expenses] Create category error:', error);
    return errorResponse('Internal server error', 500);
  }
}
