/**
 * Prisma Client Singleton for Vercel Serverless
 * Updated for Prisma 7 with pg adapter
 */

import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  pool: Pool | undefined;
};

/**
 * Create Prisma client with pg adapter for Prisma 7
 */
function createPrismaClient(): PrismaClient {
  const connectionString = process.env.DATABASE_URL ||
    'postgresql://postgres:postgres@localhost:51582/laundrot';

  // Create pg Pool
  const pool = new Pool({
    connectionString,
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
  });

  // Create Prisma adapter
  const adapter = new PrismaPg(pool);

  // Create Prisma client with adapter
  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn', 'info'] : ['error'],
  });
}

// Use singleton pattern for development
export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
