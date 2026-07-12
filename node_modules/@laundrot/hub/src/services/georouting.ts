import type { Branch } from '@laundrot/shared-types';
import { getActiveBranches } from '../config/branches.js';

// ==========================================
// GEOROUTING SERVICE - FR-LOG-01 Core Implementation
// Admin Pusat merekomendasikan cabang pemroses berdasarkan jarak terdekat
// dengan koordinat pelanggan ketika menginput data alamat dari WhatsApp
// ==========================================

interface Coordinates {
  latitude: number;
  longitude: number;
}

function toRadians(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

export function haversineDistance(a: Coordinates, b: Coordinates): number {
  const R = 6371;
  const dLat = toRadians(b.latitude - a.latitude);
  const dLon = toRadians(b.longitude - a.longitude);
  const lat1 = toRadians(a.latitude);
  const lat2 = toRadians(b.latitude);

  const x =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));

  return R * c;
}

export interface GeoroutingResult {
  branch: Branch;
  distance_km: number;
}

export async function findNearestBranch(customerCoords: Coordinates): Promise<GeoroutingResult | null> {
  const branches = await getActiveBranches();
  if (branches.length === 0) return null;

  let nearest: GeoroutingResult | null = null;

  for (const branch of branches) {
    const distance_km = haversineDistance(customerCoords, {
      latitude: branch.latitude,
      longitude: branch.longitude,
    });

    if (!nearest || distance_km < nearest.distance_km) {
      nearest = { branch, distance_km };
    }
  }

  return nearest;
}
