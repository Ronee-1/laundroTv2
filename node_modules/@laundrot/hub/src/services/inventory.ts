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
  if (stok < threshold * 0.5) return 'Kritis'; // Less than 50% of threshold = Kritis
  if (stok <= threshold) return 'Menipis';
  return 'Aman';
}

function refreshStatuses(stocks: StockEntry[]): StockEntry[] {
  return stocks.map((s) => ({
    ...s,
    status: determineStatus(s.stok_saat_ini, s.safety_threshold),
  }));
}

const INVENTORY: BranchInventory[] = [
  {
    id_cabang: 'CBG-001',
    stocks: refreshStatuses([
      { item: 'Detergen', satuan: 'pcs', stok_saat_ini: 45, safety_threshold: 50, max_capacity: 100, status: 'Menipis' },
      { item: 'Pelembut', satuan: 'pcs', stok_saat_ini: 30, safety_threshold: 50, max_capacity: 80, status: 'Menipis' },
      { item: 'Plastik', satuan: 'pcs', stok_saat_ini: 120, safety_threshold: 100, max_capacity: 200, status: 'Aman' },
    ]),
    last_updated: new Date(Date.now() - 25 * 60 * 60 * 1000), // > 24 hours ago for testing
  },
  {
    id_cabang: 'CBG-002',
    stocks: refreshStatuses([
      { item: 'Detergen', satuan: 'pcs', stok_saat_ini: 12, safety_threshold: 50, max_capacity: 100, status: 'Kritis' },
      { item: 'Pelembut', satuan: 'pcs', stok_saat_ini: 25, safety_threshold: 50, max_capacity: 80, status: 'Kritis' },
      { item: 'Plastik', satuan: 'pcs', stok_saat_ini: 18, safety_threshold: 100, max_capacity: 200, status: 'Kritis' },
    ]),
    last_updated: new Date(),
  },
  {
    id_cabang: 'CBG-003',
    stocks: refreshStatuses([
      { item: 'Detergen', satuan: 'pcs', stok_saat_ini: 22, safety_threshold: 50, max_capacity: 100, status: 'Kritis' },
      { item: 'Pelembut', satuan: 'pcs', stok_saat_ini: 14, safety_threshold: 50, max_capacity: 80, status: 'Kritis' },
      { item: 'Plastik', satuan: 'pcs', stok_saat_ini: 85, safety_threshold: 100, max_capacity: 200, status: 'Kritis' },
    ]),
    last_updated: new Date(),
  },
  {
    id_cabang: 'CBG-004',
    stocks: refreshStatuses([
      { item: 'Detergen', satuan: 'pcs', stok_saat_ini: 40, safety_threshold: 50, max_capacity: 100, status: 'Kritis' },
      { item: 'Pelembut', satuan: 'pcs', stok_saat_ini: 35, safety_threshold: 50, max_capacity: 80, status: 'Kritis' },
      { item: 'Plastik', satuan: 'pcs', stok_saat_ini: 110, safety_threshold: 100, max_capacity: 200, status: 'Aman' },
    ]),
    last_updated: new Date(),
  },
  {
    id_cabang: 'CBG-005',
    stocks: refreshStatuses([
      { item: 'Detergen', satuan: 'pcs', stok_saat_ini: 8, safety_threshold: 50, max_capacity: 100, status: 'Kritis' },
      { item: 'Pelembut', satuan: 'pcs', stok_saat_ini: 9, safety_threshold: 50, max_capacity: 80, status: 'Kritis' },
      { item: 'Plastik', satuan: 'pcs', stok_saat_ini: 45, safety_threshold: 100, max_capacity: 200, status: 'Kritis' },
    ]),
    last_updated: new Date(),
  },
];

// Safety Stock Thresholds per PRD:
// - Detergen < 50 pcs → Kritis/Menipis
// - Pelembut < 50 pcs → Kritis/Menipis
// - Plastik < 100 pcs → Kritis/Menipis
export const SAFETY_THRESHOLDS = {
  detergen: 50,
  pelembut: 50,
  plastik: 100,
};

export function getInventoryByBranch(id_cabang: string): BranchInventory | undefined {
  return INVENTORY.find((inv) => inv.id_cabang === id_cabang);
}

export function getAllInventory(): BranchInventory[] {
  return [...INVENTORY];
}

export function getInventoryStatus(id_cabang: string): 'Aman' | 'Menipis' | 'Kritis' {
  const inventory = getInventoryByBranch(id_cabang);
  if (!inventory) return 'Kritis';

  const hasKritis = inventory.stocks.some((s) => s.status === 'Kritis');
  if (hasKritis) return 'Kritis';

  const hasMenipis = inventory.stocks.some((s) => s.status === 'Menipis');
  if (hasMenipis) return 'Menipis';

  return 'Aman';
}

export function restockInventory(
  id_cabang: string,
  additions: { detergen?: number; pelembut?: number; plastik?: number },
): BranchInventory | null {
  const inventory = getInventoryByBranch(id_cabang);
  if (!inventory) return null;

  for (const stock of inventory.stocks) {
    if (stock.item === 'Detergen' && additions.detergen) {
      stock.stok_saat_ini = Math.min(stock.stok_saat_ini + additions.detergen, stock.max_capacity);
    }
    if (stock.item === 'Pelembut' && additions.pelembut) {
      stock.stok_saat_ini = Math.min(stock.stok_saat_ini + additions.pelembut, stock.max_capacity);
    }
    if (stock.item === 'Plastik' && additions.plastik) {
      stock.stok_saat_ini = Math.min(stock.stok_saat_ini + additions.plastik, stock.max_capacity);
    }
    stock.status = determineStatus(stock.stok_saat_ini, stock.safety_threshold);
  }

  inventory.last_updated = new Date();
  return inventory;
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

const ANOMALIES: AnomalyLog[] = [];
let nextAnomalyId = 1;

export function adjustInventory(
  id_cabang: string,
  adjustments: { item: StockItem; stok_baru: number; alasan: string }
): BranchInventory | null {
  const inventory = getInventoryByBranch(id_cabang);
  if (!inventory) return null;

  const stock = inventory.stocks.find((s) => s.item === adjustments.item);
  if (!stock) return null;

  const stok_lama = stock.stok_saat_ini;
  stock.stok_saat_ini = adjustments.stok_baru;
  stock.status = determineStatus(stock.stok_saat_ini, stock.safety_threshold);
  inventory.last_updated = new Date();

  const branch = getBranchById(id_cabang);
  const nama_cabang = branch?.nama_cabang ?? id_cabang;

  ANOMALIES.push({
    id: `ANM-${String(nextAnomalyId++).padStart(4, '0')}`,
    id_cabang,
    nama_cabang,
    item: adjustments.item,
    stok_lama,
    stok_baru: adjustments.stok_baru,
    alasan: adjustments.alasan,
    timestamp: new Date().toISOString(),
  });

  return inventory;
}

export function getAnomalies(): AnomalyLog[] {
  return [...ANOMALIES];
}
