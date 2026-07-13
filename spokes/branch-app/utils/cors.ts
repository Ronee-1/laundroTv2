/**
 * CORS Configuration for Vercel Serverless
 */

export function getCorsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, Accept, Origin',
    'Access-Control-Allow-Credentials': 'true',
  };
}

/**
 * Handle CORS preflight requests
 */
export function handleCorsPreflight() {
  return new Response(null, {
    status: 204,
    headers: getCorsHeaders(),
  });
}
