-- ============================================================
-- MIGRATION: Add Users Table for Authentication
-- Date: 2026-07-08
-- Description: Creates the users table for authentication and
--              role-based access control (Owner, Admin, Kurir)
-- ============================================================

-- Create enum type for UserRole
DO $$ BEGIN
    CREATE TYPE "UserRole" AS ENUM ('Owner', 'Admin', 'Kurir');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create Users table
CREATE TABLE IF NOT EXISTS "users" (
    "id_user" TEXT NOT NULL PRIMARY KEY,
    "nama" TEXT NOT NULL,
    "email" TEXT NOT NULL UNIQUE,
    "password" TEXT NOT NULL,
    "role" "UserRole" NOT NULL,
    "id_cabang" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Add foreign key constraint (if id_cabang is provided)
ALTER TABLE "users"
    ADD CONSTRAINT "users_id_cabang_fkey"
    FOREIGN KEY ("id_cabang")
    REFERENCES "branches"("id_cabang")
    ON DELETE SET NULL
    ON UPDATE CASCADE;

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS "users_email_idx" ON "users"("email");
CREATE INDEX IF NOT EXISTS "users_id_cabang_idx" ON "users"("id_cabang");
CREATE INDEX IF NOT EXISTS "users_role_idx" ON "users"("role");

-- ============================================================
-- SEED: Owner User with Bcrypt Hashed Password
-- ============================================================
--
-- Bcrypt hash for password "12345678" with salt rounds 12
-- Generated using: bcrypt.hashSync('12345678', 12)
--
-- Note: The actual seed data will be created via Prisma seed script
-- This SQL is for reference and manual database setup
-- ============================================================
