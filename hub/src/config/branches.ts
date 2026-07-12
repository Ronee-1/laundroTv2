import { prisma } from '../lib/prisma.js';
import type { Branch } from '@laundrot/shared-types';

// Re-export Branch type for compatibility
export type { Branch };

export interface BranchWithFinancials extends Branch {
  omzet: number;
  wilayah: string;
}

// ============================================================
// CACHED DATA - Load from DB, refresh on demand
// ============================================================
let cachedBranches: BranchWithFinancials[] | null = null;
let lastFetchTime: number = 0;
const CACHE_TTL_MS = 60_000; // 1 minute cache

// Macro financials - Total Konsolidasi Omzet = Rp91.200.000
export const MACRO_FINANCIALS = {
  total_konsolidasi_omzet: 91200000,
  batas_anggaran_operasional: 22500000,
};

// ============================================================
// DATABASE FUNCTIONS
// ============================================================

/**
 * Fetch all branches from database
 */
export async function fetchBranchesFromDB(): Promise<BranchWithFinancials[]> {
  const branches = await prisma.branch.findMany({
    where: { is_active: true },
    orderBy: { id_cabang: 'asc' },
  });

  return branches.map((b) => ({
    id_cabang: b.id_cabang,
    nama_cabang: b.nama_cabang,
    alamat: b.alamat,
    latitude: b.latitude,
    longitude: b.longitude,
    kuota_harian: b.kuota_harian,
    kuota_terpakai: b.kuota_terpakai,
    is_active: b.is_active,
    created_at: b.created_at,
    updated_at: b.updated_at,
    omzet: b.omzet,
    wilayah: b.wilayah,
  }));
}

/**
 * Get branch by ID from database
 */
export async function fetchBranchByIdFromDB(id_cabang: string): Promise<BranchWithFinancials | null> {
  const branch = await prisma.branch.findUnique({
    where: { id_cabang },
  });

  if (!branch) return null;

  return {
    id_cabang: branch.id_cabang,
    nama_cabang: branch.nama_cabang,
    alamat: branch.alamat,
    latitude: branch.latitude,
    longitude: branch.longitude,
    kuota_harian: branch.kuota_harian,
    kuota_terpakai: branch.kuota_terpakai,
    is_active: branch.is_active,
    created_at: branch.created_at,
    updated_at: branch.updated_at,
    omzet: branch.omzet,
    wilayah: branch.wilayah,
  };
}

// ============================================================
// CACHED ACCESSORS (for backward compatibility)
// ============================================================

/**
 * Get all active branches - uses cache with DB refresh
 */
export async function getActiveBranches(): Promise<BranchWithFinancials[]> {
  const now = Date.now();
  if (!cachedBranches || now - lastFetchTime > CACHE_TTL_MS) {
    cachedBranches = await fetchBranchesFromDB();
    lastFetchTime = now;
  }
  return cachedBranches;
}

/**
 * Get branch by ID - uses cache with DB refresh
 */
export async function getBranchById(id_cabang: string): Promise<BranchWithFinancials | null> {
  // Check cache first
  const now = Date.now();
  if (cachedBranches && now - lastFetchTime <= CACHE_TTL_MS) {
    return cachedBranches.find((b) => b.id_cabang === id_cabang) ?? null;
  }
  // Fallback to direct DB query
  return fetchBranchByIdFromDB(id_cabang);
}

/**
 * Refresh the branches cache (call after mutations)
 */
export async function refreshBranchesCache(): Promise<void> {
  cachedBranches = await fetchBranchesFromDB();
  lastFetchTime = Date.now();
}

/**
 * Get all branches (including inactive) - for admin purposes
 */
export async function getAllBranches(): Promise<BranchWithFinancials[]> {
  const branches = await prisma.branch.findMany({
    orderBy: { id_cabang: 'asc' },
  });

  return branches.map((b) => ({
    id_cabang: b.id_cabang,
    nama_cabang: b.nama_cabang,
    alamat: b.alamat,
    latitude: b.latitude,
    longitude: b.longitude,
    kuota_harian: b.kuota_harian,
    kuota_terpakai: b.kuota_terpakai,
    is_active: b.is_active,
    created_at: b.created_at,
    updated_at: b.updated_at,
    omzet: b.omzet,
    wilayah: b.wilayah,
  }));
}

/**
 * Update branch quota (daily limit usage)
 */
export async function updateBranchQuota(
  id_cabang: string,
  perubahan: number // +1 untuk pakai, -1 untuk reset
): Promise<void> {
  await prisma.branch.update({
    where: { id_cabang },
    data: {
      kuota_terpakai: {
        increment: perubahan,
      },
    },
  });
  // Invalidate cache
  await refreshBranchesCache();
}

/**
 * Update branch omzet
 */
export async function updateBranchOmzet(id_cabang: string, nominal: number): Promise<void> {
  await prisma.branch.update({
    where: { id_cabang },
    data: {
      omzet: {
        increment: nominal,
      },
    },
  });
  // Invalidate cache
  await refreshBranchesCache();
}

/**
 * Initialize cache on startup
 */
export async function initializeBranchesCache(): Promise<void> {
  await refreshBranchesCache();
  console.log('[branches] Cache initialized with', cachedBranches?.length, 'branches');
}
