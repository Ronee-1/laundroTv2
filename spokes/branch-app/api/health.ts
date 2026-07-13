/**
 * Health Check API - Vercel Serverless Function
 * GET /api/health
 */

import { jsonResponse } from './utils/response';

export async function GET() {
  return jsonResponse({
    status: 'ok',
    service: 'laundrot-api',
    timestamp: new Date().toISOString(),
    version: '2.0.0',
  });
}
