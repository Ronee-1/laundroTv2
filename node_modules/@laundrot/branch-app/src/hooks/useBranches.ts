import { useState, useEffect } from 'react';

export interface BranchOption {
  id: string;
  nama: string;
  latitude?: number;
  longitude?: number;
}

let cachedBranches: BranchOption[] | null = null;

export function useBranches(): { branches: BranchOption[]; loading: boolean } {
  const [branches, setBranches] = useState<BranchOption[]>(cachedBranches ?? []);
  const [loading, setLoading] = useState(!cachedBranches);

  useEffect(() => {
    if (cachedBranches) {
      console.log('[useBranches] Using cached branches:', cachedBranches.length);
      setBranches(cachedBranches);
      setLoading(false);
      return;
    }
    let cancelled = false;
    async function fetchBranches() {
      console.log('[useBranches] Fetching branches from /api/owner/dashboard');
      try {
        const res = await fetch('/api/owner/dashboard');
        console.log('[useBranches] Response status:', res.status);
        const json = await res.json();
        console.log('[useBranches] Response:', JSON.stringify(json, null, 2)?.slice(0, 500));
        if (cancelled) return;
        if (res.ok && json.success && json.per_cabang) {
          const list: BranchOption[] = json.per_cabang.map((b: any) => ({
            id: b.id_cabang,
            nama: b.nama_cabang,
            latitude: b.map_coordinates?.latitude,
            longitude: b.map_coordinates?.longitude,
          }));
          console.log('[useBranches] Mapped branches:', list);
          cachedBranches = list;
          setBranches(list);
        } else {
          console.warn('[useBranches] Failed to fetch branches:', json);
        }
      } catch (err) {
        console.error('[useBranches] Network error:', err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchBranches();
    return () => { cancelled = true; };
  }, []);

  return { branches, loading };
}
