/**
 * Security Headers Middleware
 * Adds security headers to all API responses
 */

import { getCorsHeaders } from './cors';

export function withSecurityHeaders(response: Response): Response {
  const headers = new Headers(response.headers);

  // Add CORS headers
  Object.entries(getCorsHeaders()).forEach(([key, value]) => {
    headers.set(key, value);
  });

  // Add security headers
  headers.set('X-Content-Type-Options', 'nosniff');
  headers.set('X-Frame-Options', 'DENY');
  headers.set('X-XSS-Protection', '1; mode=block');
  headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

/**
 * Create a JSON response with security headers
 */
export function secureJsonResponse(data: unknown, status = 200): Response {
  const response = new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
    },
  });

  return response;
}

/**
 * Create an error response with security headers
 */
export function secureErrorResponse(message: string, status = 500): Response {
  const response = new Response(
    JSON.stringify({
      success: false,
      error: message,
      timestamp: new Date().toISOString(),
    }),
    {
      status,
      headers: {
        'Content-Type': 'application/json',
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'DENY',
        'X-XSS-Protection': '1; mode=block',
      },
    }
  );

  return response;
}
