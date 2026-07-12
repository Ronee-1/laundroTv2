import { prisma } from '../lib/prisma.js';
import { getInventoryByBranch, type StockEntry } from './inventory.js';
import type { StockCapacity } from '@laundrot/shared-types';

// ==========================================
// LOGISTICS SERVICE - FR-INV-02, STOCK TRANSFER
// ==========================================

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

interface LogisticsLogResponse {
  id: string;
  branchId: string;
  sentItems: StockCapacity;
  receivedItems: StockCapacity | null;
  discrepancy: StockCapacity | null;
  status: string;
  timestamp: Date;
}

// ==========================================
// LOGISTICS CRUD OPERATIONS
// ==========================================

/**
 * Create new shipment log
 */
export async function createShipment(
  branchId: string,
  sentItems: StockCapacity,
): Promise<LogisticsLogResponse> {
  const id = `LOG-${Date.now().toString(36).toUpperCase()}`;

  const log = await prisma.logisticsLog.create({
    data: {
      id_cabang: branchId,
      sent_items: sentItems as any,
      status: 'In-Transit',
    },
  });

  return {
    id: log.id,
    branchId: log.id_cabang,
    sentItems: log.sent_items as unknown as StockCapacity,
    receivedItems: null,
    discrepancy: null,
    status: log.status,
    timestamp: log.timestamp,
  };
}

/**
 * Verify shipment received
 */
export async function verifyShipment(
  logId: string,
  receivedItems: StockCapacity,
): Promise<LogisticsLogResponse | null> {
  try {
    const log = await prisma.logisticsLog.findUnique({
      where: { id: logId },
    });

    if (!log || (log.status !== 'Awaiting-Verification' && log.status !== 'In-Transit')) {
      return null;
    }

    const discrepancy: StockCapacity = {
      detergen: receivedItems.detergen - (log.sent_items as any).detergen,
      pelembut: receivedItems.pelembut - (log.sent_items as any).pelembut,
      plastik: receivedItems.plastik - (log.sent_items as any).plastik,
    };

    const hasDiscrepancy =
      discrepancy.detergen !== 0 || discrepancy.pelembut !== 0 || discrepancy.plastik !== 0;

    const updated = await prisma.logisticsLog.update({
      where: { id: logId },
      data: {
        received_items: receivedItems as any,
        discrepancy: hasDiscrepancy ? discrepancy as any : undefined,
        status: hasDiscrepancy ? 'Completed-Discrepancy' : 'Completed',
      },
    });

    return {
      id: updated.id,
      branchId: updated.id_cabang,
      sentItems: updated.sent_items as unknown as StockCapacity,
      receivedItems: updated.received_items as unknown as StockCapacity | null,
      discrepancy: updated.discrepancy as unknown as StockCapacity | null,
      status: updated.status,
      timestamp: updated.timestamp,
    };
  } catch {
    return null;
  }
}

/**
 * Get logistics by branch
 */
export async function getLogisticsByBranch(branchId: string): Promise<LogisticsLogResponse[]> {
  const logs = await prisma.logisticsLog.findMany({
    where: { id_cabang: branchId },
    orderBy: { timestamp: 'desc' },
  });

  return logs.map((log) => ({
    id: log.id,
    branchId: log.id_cabang,
    sentItems: log.sent_items as unknown as StockCapacity,
    receivedItems: log.received_items as unknown as StockCapacity | null,
    discrepancy: log.discrepancy as unknown as StockCapacity | null,
    status: log.status,
    timestamp: log.timestamp,
  }));
}

/**
 * Get in-transit shipments for a branch
 */
export async function getInTransitByBranch(branchId: string): Promise<LogisticsLogResponse[]> {
  const logs = await prisma.logisticsLog.findMany({
    where: { id_cabang: branchId, status: 'In-Transit' },
    orderBy: { timestamp: 'desc' },
  });

  return logs.map((log) => ({
    id: log.id,
    branchId: log.id_cabang,
    sentItems: log.sent_items as unknown as StockCapacity,
    receivedItems: log.received_items as unknown as StockCapacity | null,
    discrepancy: log.discrepancy as unknown as StockCapacity | null,
    status: log.status,
    timestamp: log.timestamp,
  }));
}

/**
 * Get all active shipments
 */
export async function getActiveShipments(): Promise<LogisticsLogResponse[]> {
  const logs = await prisma.logisticsLog.findMany({
    where: {
      status: {
        in: ['In-Transit', 'Driver-En-Route', 'Awaiting-Verification'],
      },
    },
    orderBy: { timestamp: 'desc' },
  });

  return logs.map((log) => ({
    id: log.id,
    branchId: log.id_cabang,
    sentItems: log.sent_items as unknown as StockCapacity,
    receivedItems: log.received_items as unknown as StockCapacity | null,
    discrepancy: log.discrepancy as unknown as StockCapacity | null,
    status: log.status,
    timestamp: log.timestamp,
  }));
}

/**
 * Get active shipments for a specific branch
 */
export async function getActiveShipmentsByBranch(branchId: string): Promise<LogisticsLogResponse[]> {
  const logs = await prisma.logisticsLog.findMany({
    where: {
      id_cabang: branchId,
      status: {
        in: ['In-Transit', 'Driver-En-Route', 'Awaiting-Verification'],
      },
    },
    orderBy: { timestamp: 'desc' },
  });

  return logs.map((log) => ({
    id: log.id,
    branchId: log.id_cabang,
    sentItems: log.sent_items as unknown as StockCapacity,
    receivedItems: log.received_items as unknown as StockCapacity | null,
    discrepancy: log.discrepancy as unknown as StockCapacity | null,
    status: log.status,
    timestamp: log.timestamp,
  }));
}

/**
 * Start route (driver en route)
 */
export async function startRoute(logId: string): Promise<LogisticsLogResponse | null> {
  try {
    const log = await prisma.logisticsLog.findUnique({
      where: { id: logId },
    });

    if (!log || log.status !== 'In-Transit') return null;

    const updated = await prisma.logisticsLog.update({
      where: { id: logId },
      data: { status: 'Driver-En-Route' },
    });

    return {
      id: updated.id,
      branchId: updated.id_cabang,
      sentItems: updated.sent_items as unknown as StockCapacity,
      receivedItems: null,
      discrepancy: null,
      status: updated.status,
      timestamp: updated.timestamp,
    };
  } catch {
    return null;
  }
}

/**
 * Handover shipment (awaiting verification)
 */
export async function handoverShipment(logId: string): Promise<LogisticsLogResponse | null> {
  try {
    const log = await prisma.logisticsLog.findUnique({
      where: { id: logId },
    });

    if (!log || log.status !== 'Driver-En-Route') return null;

    const updated = await prisma.logisticsLog.update({
      where: { id: logId },
      data: { status: 'Awaiting-Verification' },
    });

    return {
      id: updated.id,
      branchId: updated.id_cabang,
      sentItems: updated.sent_items as unknown as StockCapacity,
      receivedItems: null,
      discrepancy: null,
      status: updated.status,
      timestamp: updated.timestamp,
    };
  } catch {
    return null;
  }
}

/**
 * Get all logistics
 */
export async function getAllLogistics(): Promise<LogisticsLogResponse[]> {
  const logs = await prisma.logisticsLog.findMany({
    orderBy: { timestamp: 'desc' },
  });

  return logs.map((log) => ({
    id: log.id,
    branchId: log.id_cabang,
    sentItems: log.sent_items as unknown as StockCapacity,
    receivedItems: log.received_items as unknown as StockCapacity | null,
    discrepancy: log.discrepancy as unknown as StockCapacity | null,
    status: log.status,
    timestamp: log.timestamp,
  }));
}

/**
 * Get logistics by ID
 */
export async function getLogisticsById(logId: string): Promise<LogisticsLogResponse | null> {
  const log = await prisma.logisticsLog.findUnique({
    where: { id: logId },
  });

  if (!log) return null;

  return {
    id: log.id,
    branchId: log.id_cabang,
    sentItems: log.sent_items as unknown as StockCapacity,
    receivedItems: log.received_items as unknown as StockCapacity | null,
    discrepancy: log.discrepancy as unknown as StockCapacity | null,
    status: log.status,
    timestamp: log.timestamp,
  };
}

/**
 * Get replenishment recommendation for a branch
 */
export async function getReplenishmentRecommendation(branchId: string): Promise<ReplenishmentRecommendation> {
  const inventory = await getInventoryByBranch(branchId);
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
