import type { LogisticsLog, LogisticsStatus, StockCapacity } from '@laundrot/shared-types';
import { getInventoryByBranch, type StockEntry } from './inventory.js';

const LOGISTICS: LogisticsLog[] = [];

let nextId = 1;

function generateId(): string {
  return `LOG-${String(nextId++).padStart(4, '0')}`;
}

export function createShipment(
  branchId: string,
  sentItems: StockCapacity,
): LogisticsLog {
  const log: LogisticsLog = {
    id: generateId(),
    branchId,
    sentItems,
    receivedItems: null,
    discrepancy: null,
    status: 'In-Transit',
    timestamp: new Date(),
  };
  LOGISTICS.push(log);
  return log;
}

export function verifyShipment(
  logId: string,
  receivedItems: StockCapacity,
): LogisticsLog | null {
  const log = LOGISTICS.find((l) => l.id === logId);
  if (!log || (log.status !== 'Awaiting-Verification' && log.status !== 'In-Transit')) return null;

  log.receivedItems = receivedItems;

  const discrepancy: StockCapacity = {
    detergen: receivedItems.detergen - log.sentItems.detergen,
    pelembut: receivedItems.pelembut - log.sentItems.pelembut,
    plastik: receivedItems.plastik - log.sentItems.plastik,
  };

  const hasDiscrepancy =
    discrepancy.detergen !== 0 || discrepancy.pelembut !== 0 || discrepancy.plastik !== 0;

  log.discrepancy = hasDiscrepancy ? discrepancy : null;
  log.status = hasDiscrepancy ? 'Completed-Discrepancy' : 'Completed';

  return log;
}

export function getLogisticsByBranch(branchId: string): LogisticsLog[] {
  return LOGISTICS.filter((l) => l.branchId === branchId);
}

export function getInTransitByBranch(branchId: string): LogisticsLog[] {
  return LOGISTICS.filter((l) => l.branchId === branchId && l.status === 'In-Transit');
}

export function getActiveShipments(): LogisticsLog[] {
  return LOGISTICS.filter((l) =>
    l.status === 'In-Transit' || l.status === 'Driver-En-Route' || l.status === 'Awaiting-Verification',
  );
}

export function getActiveShipmentsByBranch(branchId: string): LogisticsLog[] {
  return LOGISTICS.filter((l) =>
    l.branchId === branchId &&
    (l.status === 'In-Transit' || l.status === 'Driver-En-Route' || l.status === 'Awaiting-Verification'),
  );
}

export function startRoute(logId: string): LogisticsLog | null {
  const log = LOGISTICS.find((l) => l.id === logId);
  if (!log || log.status !== 'In-Transit') return null;
  log.status = 'Driver-En-Route';
  return log;
}

export function handoverShipment(logId: string): LogisticsLog | null {
  const log = LOGISTICS.find((l) => l.id === logId);
  if (!log || log.status !== 'Driver-En-Route') return null;
  log.status = 'Awaiting-Verification';
  return log;
}

export function getAllLogistics(): LogisticsLog[] {
  return [...LOGISTICS];
}

export function getLogisticsById(logId: string): LogisticsLog | undefined {
  return LOGISTICS.find((l) => l.id === logId);
}

export interface ReplenishmentItem {
  item: string;
  satuan: string;
  stok_saat_ini: number;
  max_capacity: number;
  safety_threshold: number;
  kebutuhan: number;
  is_below_threshold: boolean;
}

export interface ReplenishmentRecommendation {
  branchId: string;
  items: ReplenishmentItem[];
  needs_replenishment: boolean;
}

export function getReplenishmentRecommendation(branchId: string): ReplenishmentRecommendation {
  const inventory = getInventoryByBranch(branchId);
  if (!inventory) {
    return { branchId, items: [], needs_replenishment: false };
  }

  const items: ReplenishmentItem[] = inventory.stocks.map((s: StockEntry) => {
    const is_below_threshold = s.stok_saat_ini <= s.safety_threshold;
    const kebutuhan = Math.max(s.max_capacity - s.stok_saat_ini, 0);
    return {
      item: s.item,
      satuan: s.satuan,
      stok_saat_ini: s.stok_saat_ini,
      max_capacity: s.max_capacity,
      safety_threshold: s.safety_threshold,
      kebutuhan,
      is_below_threshold,
    };
  });

  const needs_replenishment = items.some((i) => i.is_below_threshold);

  return { branchId, items, needs_replenishment };
}
