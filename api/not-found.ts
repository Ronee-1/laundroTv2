/**
 * 404 Not Found Handler
 * Handles requests to undefined API routes
 */

import { jsonResponse, errorResponse } from '../utils/response';

export async function GET() {
  return errorResponse('API endpoint not found', 404);
}

export async function POST() {
  return errorResponse('API endpoint not found', 404);
}

export async function PUT() {
  return errorResponse('API endpoint not found', 404);
}

export async function PATCH() {
  return errorResponse('API endpoint not found', 404);
}

export async function DELETE() {
  return errorResponse('API endpoint not found', 404);
}
