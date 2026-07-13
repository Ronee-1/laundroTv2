/**
 * JWT Authentication Utilities for Vercel Serverless
 */

import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'laundrot-secret-key-change-in-production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

export interface JwtPayload {
  id_user: string;
  email: string;
  role: 'Owner' | 'Admin' | 'Kurir';
  id_cabang: string | null;
}

export function generateToken(payload: Omit<JwtPayload, 'iat' | 'exp'>): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

export function verifyToken(token: string): JwtPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JwtPayload;
  } catch {
    return null;
  }
}

export function extractToken(authHeader: string | null): string | null {
  if (!authHeader) return null;
  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') return null;
  return parts[1] ?? null;
}

export function authenticateRequest(authHeader: string | null): JwtPayload | null {
  const token = extractToken(authHeader);
  if (!token) return null;
  return verifyToken(token);
}

type Role = 'Owner' | 'Admin' | 'Kurir';

export function hasRole(user: JwtPayload | null, ...allowedRoles: Role[]): boolean {
  if (!user) return false;
  return allowedRoles.includes(user.role);
}

export function requireAuth(authHeader: string | null): { authorized: true; user: JwtPayload } | { authorized: false; error: string; status: number } {
  const user = authenticateRequest(authHeader);
  if (!user) {
    return { authorized: false, error: 'Authentication required', status: 401 };
  }
  return { authorized: true, user };
}

export function requireRole(authHeader: string | null, ...allowedRoles: Role[]):
  { authorized: true; user: JwtPayload } | { authorized: false; error: string; status: number } {
  const result = requireAuth(authHeader);
  if (!result.authorized) return result;
  if (!hasRole(result.user, ...allowedRoles)) {
    return { authorized: false, error: 'Access denied', status: 403 };
  }
  return { authorized: true, user: result.user };
}
