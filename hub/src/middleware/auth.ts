import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// ============================================================
// JWT CONFIGURATION
// ============================================================

const JWT_SECRET = process.env.JWT_SECRET || 'laundrot-secret-key-change-in-production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';

// ============================================================
// TYPES
// ============================================================

export interface JwtPayload {
  id_user: string;
  email: string;
  role: 'Owner' | 'Admin' | 'Kurir';
  id_cabang: string | null;
}

export interface AuthenticatedRequest extends Request {
  user?: JwtPayload;
}

// ============================================================
// JWT UTILITIES
// ============================================================

/**
 * Generate JWT token for authenticated user
 */
export function generateToken(payload: Omit<JwtPayload, 'iat' | 'exp'>): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN as jwt.SignOptions['expiresIn'] });
}

/**
 * Verify and decode JWT token
 */
export function verifyToken(token: string): JwtPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JwtPayload;
  } catch {
    return null;
  }
}

// ============================================================
// AUTHENTICATION MIDDLEWARE
// ============================================================

/**
 * Middleware: Verify JWT token in Authorization header
 */
export function authenticateToken(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): void {
  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    res.status(401).json({
      success: false,
      error: 'Authorization header is required',
    });
    return;
  }

  const parts = authHeader.split(' ');

  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    res.status(401).json({
      success: false,
      error: 'Invalid authorization format. Use: Bearer <token>',
    });
    return;
  }

  const token = parts[1];
  const payload = verifyToken(token);

  if (!payload) {
    res.status(401).json({
      success: false,
      error: 'Invalid or expired token',
    });
    return;
  }

  req.user = payload;
  next();
}

// ============================================================
// ROLE-BASED ACCESS CONTROL MIDDLEWARE
// ============================================================

type Role = 'Owner' | 'Admin' | 'Kurir';

/**
 * Middleware factory: Require specific role(s) to access endpoint
 */
export function requireRole(...allowedRoles: Role[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: 'Authentication required',
      });
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        error: `Access denied. Required role: ${allowedRoles.join(' or ')}`,
      });
      return;
    }

    next();
  };
}

/**
 * Middleware: Only Owner can access
 */
export const requireOwner = requireRole('Owner');

/**
 * Middleware: Owner or Admin can access
 */
export const requireOwnerOrAdmin = requireRole('Owner', 'Admin');

/**
 * Middleware: Any authenticated user can access
 */
export const requireAnyRole = requireRole('Owner', 'Admin', 'Kurir');
