import { Router, type Request, type Response } from 'express';
import bcrypt from 'bcrypt';
import { prisma } from '../../lib/prisma.js';
import { generateToken, authenticateToken, requireOwner } from '../../middleware/auth.js';
import type { AuthenticatedRequest } from '../../middleware/auth.js';

const router = Router();

// ============================================================
// CONSTANTS
// ============================================================

const BCRYPT_SALT_ROUNDS = 12;

// ============================================================
// TYPE DEFINITIONS
// ============================================================

interface LoginRequest {
  email: string;
  password: string;
}

interface CreateUserRequest {
  nama: string;
  email: string;
  password: string;
  role: 'Admin' | 'Kurir';
  id_cabang: string;
}

// ============================================================
// AUTH ROUTES
// ============================================================

/**
 * POST /api/auth/login
 * Login for all roles (Owner, Admin, Kurir)
 *
 * Test credentials:
 * - Owner: budi@gmail.com / haihh
 * - Admin: admin@laundrot.com / haihh
 * - Kurir: kurir@laundrot.com / haihh
 */
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password }: LoginRequest = req.body;

    // Validate input
    if (!email || !password) {
      res.status(400).json({
        success: false,
        error: 'Email and password are required',
      });
      return;
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (!user) {
      res.status(401).json({
        success: false,
        error: 'Invalid email or password',
      });
      return;
    }

    // Check if user is active
    if (!user.is_active) {
      res.status(403).json({
        success: false,
        error: 'Account is deactivated. Please contact administrator.',
      });
      return;
    }

    // Verify password using bcrypt
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      res.status(401).json({
        success: false,
        error: 'Invalid email or password',
      });
      return;
    }

    // Get branch info if user has one
    let branchInfo = null;
    if (user.id_cabang) {
      const branch = await prisma.branch.findUnique({
        where: { id_cabang: user.id_cabang },
        select: { id_cabang: true, nama_cabang: true, wilayah: true },
      });
      branchInfo = branch;
    }

    // Get courier ID if user is a Kurir
    let courierId: string | null = null;
    if (user.role === 'Kurir' && user.id_cabang) {
      const courier = await prisma.courier.findFirst({
        where: { id_cabang: user.id_cabang },
        select: { id_kurir: true },
      });
      courierId = courier?.id_kurir ?? null;
    }

    // Generate JWT token with role information
    const token = generateToken({
      id_user: user.id_user,
      email: user.email,
      role: user.role as 'Owner' | 'Admin' | 'Kurir',
      id_cabang: user.id_cabang,
    });

    // Return success response
    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: {
          id_user: user.id_user,
          nama: user.nama,
          email: user.email,
          role: user.role,
          id_cabang: user.id_cabang,
          branch: branchInfo,
          courier_id: courierId, // Return courier ID for Kurir users
        },
      },
    });
  } catch (error) {
    console.error('[Auth] Login error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
});

/**
 * POST /api/auth/register
 * Create new user (Admin or Kurir) - Owner only
 */
router.post(
  '/register',
  authenticateToken,
  requireOwner,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { nama, email, password, role, id_cabang }: CreateUserRequest = req.body;

      // ============================================================
      // VALIDATION
      // ============================================================

      const errors: string[] = [];

      if (!nama || nama.trim().length < 2) {
        errors.push('Nama must be at least 2 characters');
      }

      if (!email || !email.includes('@')) {
        errors.push('Valid email is required');
      }

      if (!password || password.length < 6) {
        errors.push('Password must be at least 6 characters');
      }

      if (!role || !['Admin', 'Kurir'].includes(role)) {
        errors.push('Role must be either "Admin" or "Kurir"');
      }

      if (!id_cabang) {
        errors.push('ID_Cabang is required');
      }

      if (errors.length > 0) {
        res.status(400).json({
          success: false,
          error: 'Validation failed',
          details: errors,
        });
        return;
      }

      // Check if email already exists
      const existingUser = await prisma.user.findUnique({
        where: { email: email.toLowerCase().trim() },
      });

      if (existingUser) {
        res.status(409).json({
          success: false,
          error: 'Email already registered',
        });
        return;
      }

      // Check if branch exists
      const branch = await prisma.branch.findUnique({
        where: { id_cabang: id_cabang },
      });

      if (!branch) {
        res.status(404).json({
          success: false,
          error: `Branch with ID "${id_cabang}" not found`,
        });
        return;
      }

      // Check if branch already has an admin (if creating Admin)
      if (role === 'Admin') {
        const existingAdmin = await prisma.user.findFirst({
          where: {
            id_cabang: id_cabang,
            role: 'Admin',
            is_active: true,
          },
        });

        if (existingAdmin) {
          res.status(409).json({
            success: false,
            error: `Branch "${branch.nama_cabang}" already has an active Admin`,
          });
          return;
        }
      }

      // ============================================================
      // CREATE USER
      // ============================================================

      const hashedPassword = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);

      const rolePrefix = role === 'Admin' ? 'ADM' : 'KUR';
      const userId = `${rolePrefix}-${Date.now().toString(36).toUpperCase()}`;

      const newUser = await prisma.user.create({
        data: {
          id_user: userId,
          nama: nama.trim(),
          email: email.toLowerCase().trim(),
          password: hashedPassword,
          role: role as 'Admin' | 'Kurir',
          id_cabang: id_cabang,
          is_active: true,
        },
        select: {
          id_user: true,
          nama: true,
          email: true,
          role: true,
          id_cabang: true,
          is_active: true,
          created_at: true,
        },
      });

      // If creating Kurir, also create Courier record
      if (role === 'Kurir') {
        const courierId = `KUR-USR-${newUser.id_user.slice(-4).toUpperCase()}`;

        await prisma.courier.upsert({
          where: { id_kurir: courierId },
          update: {},
          create: {
            id_kurir: courierId,
            id_cabang: id_cabang,
            nama_kurir: nama.trim(),
            nomor_telepon: '+6280000000000',
            is_available: true,
          },
        });
      }

      console.log(`[Auth] User created: ${newUser.email} (${role}) at ${branch.nama_cabang} by ${req.user?.email}`);

      res.status(201).json({
        success: true,
        message: `User ${role} "${nama}" created successfully`,
        data: {
          user: newUser,
          branch: {
            id_cabang: branch.id_cabang,
            nama_cabang: branch.nama_cabang,
            wilayah: branch.wilayah,
          },
        },
      });
    } catch (error) {
      console.error('[Auth] Register error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
      });
    }
  },
);

/**
 * GET /api/auth/me
 * Get current authenticated user profile
 */
router.get(
  '/me',
  authenticateToken,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          error: 'Not authenticated',
        });
        return;
      }

      const user = await prisma.user.findUnique({
        where: { id_user: req.user.id_user },
        select: {
          id_user: true,
          nama: true,
          email: true,
          role: true,
          id_cabang: true,
          is_active: true,
          created_at: true,
          branch: {
            select: {
              id_cabang: true,
              nama_cabang: true,
              wilayah: true,
            },
          },
        },
      });

      if (!user) {
        res.status(404).json({
          success: false,
          error: 'User not found',
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: { user },
      });
    } catch (error) {
      console.error('[Auth] Get profile error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
      });
    }
  },
);

/**
 * GET /api/auth/users
 * List all users - Owner only
 */
router.get(
  '/users',
  authenticateToken,
  requireOwner,
  async (_req: AuthenticatedRequest, res: Response) => {
    try {
      const users = await prisma.user.findMany({
        where: { is_active: true },
        select: {
          id_user: true,
          nama: true,
          email: true,
          role: true,
          id_cabang: true,
          is_active: true,
          created_at: true,
          branch: {
            select: {
              id_cabang: true,
              nama_cabang: true,
              wilayah: true,
            },
          },
        },
        orderBy: { created_at: 'desc' },
      });

      res.status(200).json({
        success: true,
        data: {
          total: users.length,
          users,
        },
      });
    } catch (error) {
      console.error('[Auth] List users error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
      });
    }
  },
);

/**
 * DELETE /api/auth/users/:id
 * Deactivate user - Owner only
 */
router.delete(
  '/users/:id',
  authenticateToken,
  requireOwner,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { id } = req.params;

      const user = await prisma.user.findUnique({
        where: { id_user: id },
      });

      if (!user) {
        res.status(404).json({
          success: false,
          error: 'User not found',
        });
        return;
      }

      if (user.id_user === req.user?.id_user) {
        res.status(400).json({
          success: false,
          error: 'Cannot deactivate your own account',
        });
        return;
      }

      if (user.role === 'Owner') {
        res.status(400).json({
          success: false,
          error: 'Cannot deactivate Owner account',
        });
        return;
      }

      await prisma.user.update({
        where: { id_user: id },
        data: { is_active: false },
      });

      console.log(`[Auth] User deactivated: ${user.email} by ${req.user?.email}`);

      res.status(200).json({
        success: true,
        message: 'User deactivated successfully',
      });
    } catch (error) {
      console.error('[Auth] Deactivate user error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
      });
    }
  },
);

/**
 * GET /api/auth/branches
 * Get all branches for user management
 */
router.get(
  '/branches',
  authenticateToken,
  requireOwner,
  async (_req: AuthenticatedRequest, res: Response) => {
    try {
      const branches = await prisma.branch.findMany({
        where: { is_active: true },
        select: {
          id_cabang: true,
          nama_cabang: true,
          wilayah: true,
          alamat: true,
        },
        orderBy: { id_cabang: 'asc' },
      });

      res.status(200).json({
        success: true,
        data: { branches },
      });
    } catch (error) {
      console.error('[Auth] List branches error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
      });
    }
  },
);

export default router;
