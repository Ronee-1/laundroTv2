import type { Request, Response, NextFunction } from 'express';
export interface JwtPayload {
    id_user: string;
    email: string;
    role: 'Owner' | 'Admin' | 'Kurir';
    id_cabang: string | null;
}
export interface AuthenticatedRequest extends Request {
    user?: JwtPayload;
}
/**
 * Generate JWT token for authenticated user
 */
export declare function generateToken(payload: Omit<JwtPayload, 'iat' | 'exp'>): string;
/**
 * Verify and decode JWT token
 */
export declare function verifyToken(token: string): JwtPayload | null;
/**
 * Middleware: Verify JWT token in Authorization header
 */
export declare function authenticateToken(req: AuthenticatedRequest, res: Response, next: NextFunction): void;
type Role = 'Owner' | 'Admin' | 'Kurir';
/**
 * Middleware factory: Require specific role(s) to access endpoint
 */
export declare function requireRole(...allowedRoles: Role[]): (req: AuthenticatedRequest, res: Response, next: NextFunction) => void;
/**
 * Middleware: Only Owner can access
 */
export declare const requireOwner: (req: AuthenticatedRequest, res: Response, next: NextFunction) => void;
/**
 * Middleware: Owner or Admin can access
 */
export declare const requireOwnerOrAdmin: (req: AuthenticatedRequest, res: Response, next: NextFunction) => void;
/**
 * Middleware: Any authenticated user can access
 */
export declare const requireAnyRole: (req: AuthenticatedRequest, res: Response, next: NextFunction) => void;
export {};
//# sourceMappingURL=auth.d.ts.map