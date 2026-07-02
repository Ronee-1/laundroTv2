export type StockItem = 'Detergen' | 'Pelembut' | 'Plastik';

export interface StockEntry {
  item: StockItem;
  satuan: string;
  stok_saat_ini: number;
  safety_threshold: number;
  max_capacity: number;
  status: 'Aman' | 'Menipis' | 'Habis';
}

export interface BranchInventory {
  id_cabang: string;
  stocks: StockEntry[];
  last_updated: Date;
}

function determineStatus(stok: number, threshold: number): 'Aman' | 'Menipis' | 'Habis' {
  if (stok <= 0) return 'Habis';
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
      { item: 'Detergen', satuan: 'L', stok_saat_ini: 45, safety_threshold: 15, max_capacity: 100, status: 'Aman' },
      { item: 'Pelembut', satuan: 'L', stok_saat_ini: 30, safety_threshold: 15, max_capacity: 80, status: 'Aman' },
      { item: 'Plastik', satuan: 'pcs', stok_saat_ini: 120, safety_threshold: 30, max_capacity: 200, status: 'Aman' },
    ]),
    last_updated: new Date(),
  },
  {
    id_cabang: 'CBG-002',
    stocks: refreshStatuses([
      { item: 'Detergen', satuan: 'L', stok_saat_ini: 12, safety_threshold: 15, max_capacity: 100, status: 'Aman' },
      { item: 'Pelembut', satuan: 'L', stok_saat_ini: 25, safety_threshold: 15, max_capacity: 80, status: 'Aman' },
      { item: 'Plastik', satuan: 'pcs', stok_saat_ini: 18, safety_threshold: 30, max_capacity: 200, status: 'Aman' },
    ]),
    last_updated: new Date(),
  },
  {
    id_cabang: 'CBG-003',
    stocks: refreshStatuses([
      { item: 'Detergen', satuan: 'L', stok_saat_ini: 22, safety_threshold: 15, max_capacity: 100, status: 'Aman' },
      { item: 'Pelembut', satuan: 'L', stok_saat_ini: 14, safety_threshold: 15, max_capacity: 80, status: 'Aman' },
      { item: 'Plastik', satuan: 'pcs', stok_saat_ini: 85, safety_threshold: 30, max_capacity: 200, status: 'Aman' },
    ]),
    last_updated: new Date(),
  },
  {
    id_cabang: 'CBG-004',
    stocks: refreshStatuses([
      { item: 'Detergen', satuan: 'L', stok_saat_ini: 40, safety_threshold: 15, max_capacity: 100, status: 'Aman' },
      { item: 'Pelembut', satuan: 'L', stok_saat_ini: 35, safety_threshold: 15, max_capacity: 80, status: 'Aman' },
      { item: 'Plastik', satuan: 'pcs', stok_saat_ini: 110, safety_threshold: 30, max_capacity: 200, status: 'Aman' },
    ]),
    last_updated: new Date(),
  },
  {
    id_cabang: 'CBG-005',
    stocks: refreshStatuses([
      { item: 'Detergen', satuan: 'L', stok_saat_ini: 8, safety_threshold: 15, max_capacity: 100, status: 'Aman' },
      { item: 'Pelembut', satuan: 'L', stok_saat_ini: 9, safety_threshold: 15, max_capacity: 80, status: 'Aman' },
      { item: 'Plastik', satuan: 'pcs', stok_saat_ini: 45, safety_threshold: 30, max_capacity: 200, status: 'Aman' },
    ]),
    last_updated: new Date(),
  },
];

export function getInventoryByBranch(id_cabang: string): BranchInventory | undefined {
  return INVENTORY.find((inv) => inv.id_cabang === id_cabang);
}

export function getAllInventory(): BranchInventory[] {
  return [...INVENTORY];
}

export function getInventoryStatus(id_cabang: string): 'Aman' | 'Menipis' | 'Habis' {
  const inventory = getInventoryByBranch(id_cabang);
  if (!inventory) return 'Habis';

  const hasHabis = inventory.stocks.some((s) => s.status === 'Habis');
  if (hasHabis) return 'Habis';

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
