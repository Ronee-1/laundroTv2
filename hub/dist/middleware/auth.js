"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAnyRole = exports.requireOwnerOrAdmin = exports.requireOwner = void 0;
exports.generateToken = generateToken;
exports.verifyToken = verifyToken;
exports.authenticateToken = authenticateToken;
exports.requireRole = requireRole;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// ============================================================
// JWT CONFIGURATION
// ============================================================
const JWT_SECRET = process.env.JWT_SECRET || 'laundrot-secret-key-change-in-production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';
// ============================================================
// JWT UTILITIES
// ============================================================
/**
 * Generate JWT token for authenticated user
 */
function generateToken(payload) {
    return jsonwebtoken_1.default.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}
/**
 * Verify and decode JWT token
 */
function verifyToken(token) {
    try {
        return jsonwebtoken_1.default.verify(token, JWT_SECRET);
    }
    catch {
        return null;
    }
}
// ============================================================
// AUTHENTICATION MIDDLEWARE
// ============================================================
/**
 * Middleware: Verify JWT token in Authorization header
 */
function authenticateToken(req, res, next) {
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
/**
 * Middleware factory: Require specific role(s) to access endpoint
 */
function requireRole(...allowedRoles) {
    return (req, res, next) => {
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
exports.requireOwner = requireRole('Owner');
/**
 * Middleware: Owner or Admin can access
 */
exports.requireOwnerOrAdmin = requireRole('Owner', 'Admin');
/**
 * Middleware: Any authenticated user can access
 */
exports.requireAnyRole = requireRole('Owner', 'Admin', 'Kurir');
//# sourceMappingURL=auth.js.map