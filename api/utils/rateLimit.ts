/**
 * Rate Limiter for Vercel Serverless
 * Simple in-memory rate limiting with IP tracking
 */

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

// Clean up expired entries every minute
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore.entries()) {
    if (entry.resetTime <= now) {
      rateLimitStore.delete(key);
    }
  }
}, 60000);

export interface RateLimitConfig {
  windowMs: number;  // Time window in milliseconds
  maxRequests: number;  // Max requests per window
}

const defaultConfig: RateLimitConfig = {
  windowMs: 60 * 1000,  // 1 minute
  maxRequests: 100,  // 100 requests per minute
};

const authConfig: RateLimitConfig = {
  windowMs: 15 * 60 * 1000,  // 15 minutes
  maxRequests: 10,  // 10 login attempts per 15 minutes
};

/**
 * Get client identifier (IP address)
 */
function getClientId(request: Request): string {
  // Vercel provides client IP in headers
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }

  const realIp = request.headers.get('x-real-ip');
  if (realIp) {
    return realIp;
  }

  // Fallback
  return 'unknown';
}

/**
 * Check rate limit and return rate limit info
 */
export function checkRateLimit(
  request: Request,
  config: RateLimitConfig = defaultConfig
): { allowed: boolean; remaining: number; resetIn: number } {
  const clientId = getClientId(request);
  const now = Date.now();

  let entry = rateLimitStore.get(clientId);

  // Create new entry if doesn't exist or expired
  if (!entry || entry.resetTime <= now) {
    entry = {
      count: 0,
      resetTime: now + config.windowMs,
    };
  }

  entry.count++;
  rateLimitStore.set(clientId, entry);

  const remaining = Math.max(0, config.maxRequests - entry.count);
  const resetIn = Math.max(0, entry.resetTime - now);

  return {
    allowed: entry.count <= config.maxRequests,
    remaining,
    resetIn,
  };
}

/**
 * Rate limit middleware wrapper
 */
export function withRateLimit<T extends Request>(
  handler: (request: Request, ...args: unknown[]) => Promise<Response>,
  config: RateLimitConfig = defaultConfig
) {
  return async (request: Request, ...args: unknown[]): Promise<Response> => {
    const { allowed, remaining, resetIn } = checkRateLimit(request, config);

    if (!allowed) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Too many requests. Please try again later.',
          retryAfter: Math.ceil(resetIn / 1000),
        }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'Retry-After': Math.ceil(resetIn / 1000).toString(),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': Math.ceil(resetIn / 1000).toString(),
          },
        }
      );
    }

    const response = await handler(request, ...args);

    // Add rate limit headers
    const headers = new Headers(response.headers);
    headers.set('X-RateLimit-Remaining', remaining.toString());
    headers.set('X-RateLimit-Reset', Math.ceil(resetIn / 1000).toString());

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers,
    });
  };
}

/**
 * Get rate limiter for auth endpoints (stricter)
 */
export function withAuthRateLimit<T extends Request>(
  handler: (request: Request, ...args: unknown[]) => Promise<Response>
): (request: Request, ...args: unknown[]) => Promise<Response> {
  return withRateLimit(handler, authConfig);
}
