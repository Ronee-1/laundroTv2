/**
 * Standard API Response Helpers
 */

export function successResponse<T>(data: T, status = 200) {
  return new Response(JSON.stringify({ success: true, data }), {
    status,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

export function errorResponse(message: string, status = 500, details?: unknown) {
  const body: Record<string, unknown> = { success: false, error: message };
  if (details) body.details = details;

  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

export function jsonResponse(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
