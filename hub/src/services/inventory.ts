import { prisma } from '../lib/prisma.js';
import { getBranchById } from '../config/branches.js';

// ==========================================
// INVENTORY SERVICE - FR-INV-01 Core Implementation
// Modul pengawasan inventaris dengan safety threshold otomatis
// Permintaan stok bahan baku darurat dari cabang ke Outlet Utama
// Mendukung indikator sukses: Selisih kas Rp0 (stok terkontrol)
// Extends: FR-FIN-02 (permintaan stok darurat)
// ==========================================

export type StockItem = 'Detergen' | 'Pelembut' | 'Plastik';

export interface StockEntry {
  item: StockItem;
  satuan: string;
  stok_saat_ini: number;
  safety_threshold: number;
  max_capacity: number;
  status: 'Aman' | 'Menipis' | 'Kritis';
}

export interface BranchInventory {
  id_cabang: string;
  stocks: StockEntry[];
  last_updated: Date;
}

function determineStatus(stok: number, threshold: number): 'Aman' | 'Menipis' | 'Kritis' {
  if (stok <= 0) return 'Kritis';
  if (stok < threshold * 0.5) return 'Kritis';
  if (stok <= threshold) return 'Menipis';
  return 'Aman';
}

// Safety Stock Thresholds per PRD:
export const SAFETY_THRESHOLDS = {
  detergen: 50,
  pelembut: 50,
  plastik: 100,
};

// ==========================================
// INVENTORY CRUD OPERATIONS
// ==========================================

/**
 * Get inventory by branch
 */
export async function getInventoryByBranch(id_cabang: string): Promise<BranchInventory | null> {
  const items = await prisma.inventoryItem.findMany({
    where: { id_cabang },
  });

  if (items.length === 0) return null;

  const stocks: StockEntry[] = items.map((item) => ({
    item: item.item as StockItem,
    satuan: item.satuan,
    stok_saat_ini: item.stok_saat_ini,
    safety_threshold: item.safety_threshold,
    max_capacity: item.max_capacity,
    status: determineStatus(item.stok_saat_ini, item.safety_threshold),
  }));

  return {
    id_cabang,
    stocks,
    last_updated: new Date(),
  };
}

/**
 * Get all inventory across all branches
 */
export async function getAllInventory(): Promise<BranchInventory[]> {
  const items = await prisma.inventoryItem.findMany({
    orderBy: [
      { id_cabang: 'asc' },
      { item: 'asc' },
    ],
  });

  // Group by branch
  const grouped = new Map<string, StockEntry[]>();
  for (const item of items) {
    const entry: StockEntry = {
      item: item.item as StockItem,
      satuan: item.satuan,
      stok_saat_ini: item.stok_saat_ini,
      safety_threshold: item.safety_threshold,
      max_capacity: item.max_capacity,
      status: determineStatus(item.stok_saat_ini, item.safety_threshold),
    };

    if (!grouped.has(item.id_cabang)) {
      grouped.set(item.id_cabang, []);
    }
    grouped.get(item.id_cabang)!.push(entry);
  }

  const inventories: BranchInventory[] = [];
  for (const [id_cabang, stocks] of grouped) {
    inventories.push({
      id_cabang,
      stocks,
      last_updated: new Date(),
    });
  }

  return inventories;
}

/**
 * Get inventory status for a branch
 */
export async function getInventoryStatus(id_cabang: string): Promise<'Aman' | 'Menipis' | 'Kritis'> {
  const inventory = await getInventoryByBranch(id_cabang);
  if (!inventory) return 'Kritis';

  const hasKritis = inventory.stocks.some((s) => s.status === 'Kritis');
  if (hasKritis) return 'Kritis';

  const hasMenipis = inventory.stocks.some((s) => s.status === 'Menipis');
  if (hasMenipis) return 'Menipis';

  return 'Aman';
}

/**
 * Restock inventory items for a branch
 */
export async function restockInventory(
  id_cabang: string,
  additions: { detergen?: number; pelembut?: number; plastik?: number },
): Promise<BranchInventory | null> {
  const itemMap: Record<string, number | undefined> = {
    'Detergen': additions.detergen,
    'Pelembut': additions.pelembut,
    'Plastik': additions.plastik,
  };

  // Update each item
  for (const [itemName, addAmount] of Object.entries(itemMap)) {
    if (!addAmount || addAmount <= 0) continue;

    const current = await prisma.inventoryItem.findUnique({
      where: {
        id_cabang_item: {
          id_cabang,
          item: itemName,
        },
      },
    });

    if (current) {
      const newStok = Math.min(current.stok_saat_ini + addAmount, current.max_capacity);
      await prisma.inventoryItem.update({
        where: {
          id_cabang_item: {
            id_cabang,
            item: itemName,
          },
        },
        data: { stok_saat_ini: newStok },
      });
    }
  }

  return getInventoryByBranch(id_cabang);
}

export interface AnomalyLog {
  id: string;
  id_cabang: string;
  nama_cabang: string;
  item: string;
  stok_lama: number;
  stok_baru: number;
  alasan: string;
  timestamp: string;
}

/**
 * Adjust inventory manually (with anomaly logging)
 */
export async function adjustInventory(
  id_cabang: string,
  adjustments: { item: StockItem; stok_baru: number; alasan: string },
): Promise<BranchInventory | null> {
  const current = await prisma.inventoryItem.findUnique({
    where: {
      id_cabang_item: {
        id_cabang,
        item: adjustments.item,
      },
    },
  });

  if (!current) return null;

  const stok_lama = current.stok_saat_ini;

  // Update inventory
  await prisma.inventoryItem.update({
    where: {
      id_cabang_item: {
        id_cabang,
        item: adjustments.item,
      },
    },
    data: { stok_saat_ini: adjustments.stok_baru },
  });

  // Log anomaly
  const branch = await getBranchById(id_cabang);
  const nama_cabang = branch?.nama_cabang ?? id_cabang;

  await prisma.inventoryAnomaly.create({
    data: {
      id_cabang,
      nama_cabang,
      item: adjustments.item,
      stok_lama,
      stok_baru: adjustments.stok_baru,
      alasan: adjustments.alasan,
    },
  });

  return getInventoryByBranch(id_cabang);
}

/**
 * Get all inventory anomalies
 */
export async function getAnomalies(): Promise<AnomalyLog[]> {
  const anomalies = await prisma.inventoryAnomaly.findMany({
    orderBy: { timestamp: 'desc' },
    take: 100, // Limit to recent 100
  });

  return anomalies.map((a) => ({
    id: a.id,
    id_cabang: a.id_cabang,
    nama_cabang: a.nama_cabang,
    item: a.item,
    stok_lama: a.stok_lama,
    stok_baru: a.stok_baru,
    alasan: a.alasan,
    timestamp: a.timestamp.toISOString(),
  }));
}

/**
 * Initialize inventory for a new branch
 */
export async function initializeBranchInventory(id_cabang: string): Promise<void> {
  const defaultItems = [
    { item: 'Detergen', satuan: 'pcs', stok: 50, threshold: 50, capacity: 100 },
    { item: 'Pelembut', satuan: 'pcs', stok: 50, threshold: 50, capacity: 80 },
    { item: 'Plastik', satuan: 'pcs', stok: 100, threshold: 100, capacity: 200 },
  ];

  for (const item of defaultItems) {
    await prisma.inventoryItem.upsert({
      where: {
        id_cabang_item: {
          id_cabang,
          item: item.item,
        },
      },
      update: {},
      create: {
        id_cabang,
        item: item.item,
        satuan: item.satuan,
        stok_saat_ini: item.stok,
        safety_threshold: item.threshold,
        max_capacity: item.capacity,
      },
    });
  }
}
