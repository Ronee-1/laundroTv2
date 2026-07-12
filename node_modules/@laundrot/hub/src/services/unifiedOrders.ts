// ==========================================
// UNIFIED ORDERS STORAGE SERVICE
// Uses Prisma ORM to store all orders in PostgreSQL
// Supports both WhatsApp Hub and Outlet Reception orders
// ==========================================

import { prisma } from '../lib/prisma.js';
import type { Prisma } from '../generated/prisma/client.js';

// Type definitions matching Prisma schema
export interface WhatsAppOrder {
  id_order: string;
  id_cabang: string;
  customer_name: string;
  customer_whatsapp: string;
  service_name: string;
  berat_kg: number;
  total_harga: number;
  status: string;
  sumber: 'whatsapp';
  tanggal_order: Date;
  wilayah: string;
  alamat_penjemputan: string;
  google_maps_url: string;
  koordinat_penjemputan: { latitude: number; longitude: number };
  // Courier assignment (for filtering purposes) - undefined if not assigned
  id_kurir?: string;
}

export interface OutletOrder {
  id_order: string;
  id_cabang: string;
  customer_name: string;
  customer_whatsapp: string;
  service_name: string;
  berat_kg: number;
  total_harga: number;
  status: string;
  sumber: 'outlet';
  tanggal_order: Date;
  id_pelanggan: string;
  id_layanan: string;
  qty: number;
  satuan: string;
  // Courier assignment (for filtering) - undefined if not assigned
  id_kurir?: string;
}

export type UnifiedOrder = WhatsAppOrder | OutletOrder;

// Create types for Prisma
export type CreateWhatsAppOrder = Omit<Prisma.OrderCreateInput, 'branch' | 'courier'>;
export type CreateOutletOrder = Omit<Prisma.OrderCreateInput, 'branch' | 'courier'>;

let orderCounter = 1;

function generateOrderId(prefix: string = 'ORD'): string {
  const id = `${prefix}-${String(orderCounter++).padStart(6, '0')}`;
  return id;
}

// ==========================================
// WhatsApp Order Management (using Prisma)
// ==========================================
export async function createWhatsAppOrder(data: {
  id_cabang: string;
  customer_name: string;
  customer_whatsapp: string;
  service_name: string;
  berat_kg: number;
  total_harga: number;
  status: string;
  wilayah: string;
  alamat_penjemputan: string;
  google_maps_url: string;
  koordinat_penjemputan: { latitude: number; longitude: number };
}): Promise<WhatsAppOrder> {
  const id_order = generateOrderId('ORD-WA');

  const order = await prisma.order.create({
    data: {
      id_order,
      id_cabang: data.id_cabang,
      id_pelanggan: `PLG-${Date.now()}`,
      alamat_penjemputan: data.alamat_penjemputan,
      alamat_pengantaran: data.alamat_penjemputan,
      latitude_penjemputan: data.koordinat_penjemputan.latitude,
      longitude_penjemputan: data.koordinat_penjemputan.longitude,
      latitude_pengantaran: data.koordinat_penjemputan.latitude,
      longitude_pengantaran: data.koordinat_penjemputan.longitude,
      status: data.status || 'Baru',
      berat_kg: data.berat_kg,
      total_harga: data.total_harga,
      customer_name: data.customer_name,
      customer_whatsapp: data.customer_whatsapp,
      service_name: data.service_name,
      wilayah: data.wilayah,
      google_maps_url: data.google_maps_url,
      source: 'whatsapp',
    },
  });

  console.log(`[UNIFIED ORDERS] WhatsApp order created in DB: ${id_order} at ${data.id_cabang}`);

  return {
    id_order: order.id_order,
    id_cabang: order.id_cabang,
    customer_name: order.customer_name || '',
    customer_whatsapp: order.customer_whatsapp || '',
    service_name: order.service_name || '',
    berat_kg: order.berat_kg || 0,
    total_harga: order.total_harga || 0,
    status: order.status,
    sumber: 'whatsapp',
    tanggal_order: order.tanggal_order,
    wilayah: order.wilayah || '',
    alamat_penjemputan: order.alamat_penjemputan,
    google_maps_url: order.google_maps_url || '',
    koordinat_penjemputan: {
      latitude: order.latitude_penjemputan,
      longitude: order.longitude_penjemputan,
    },
    id_kurir: order.id_kurir || undefined,
  };
}

export async function getWhatsAppOrdersByBranch(id_cabang: string): Promise<WhatsAppOrder[]> {
  const orders = await prisma.order.findMany({
    where: { id_cabang, source: 'whatsapp' },
    orderBy: { tanggal_order: 'desc' },
  });

  return orders.map((o) => ({
    id_order: o.id_order,
    id_cabang: o.id_cabang,
    customer_name: o.customer_name || '',
    customer_whatsapp: o.customer_whatsapp || '',
    service_name: o.service_name || '',
    berat_kg: o.berat_kg || 0,
    total_harga: o.total_harga || 0,
    status: o.status,
    sumber: 'whatsapp' as const,
    tanggal_order: o.tanggal_order,
    wilayah: o.wilayah || '',
    alamat_penjemputan: o.alamat_penjemputan,
    google_maps_url: o.google_maps_url || '',
    koordinat_penjemputan: {
      latitude: o.latitude_penjemputan,
      longitude: o.longitude_penjemputan,
    },
    id_kurir: o.id_kurir || undefined,
  }));
}

export async function getAllWhatsAppOrders(): Promise<WhatsAppOrder[]> {
  const orders = await prisma.order.findMany({
    where: { source: 'whatsapp' },
    orderBy: { tanggal_order: 'desc' },
  });

  return orders.map((o) => ({
    id_order: o.id_order,
    id_cabang: o.id_cabang,
    customer_name: o.customer_name || '',
    customer_whatsapp: o.customer_whatsapp || '',
    service_name: o.service_name || '',
    berat_kg: o.berat_kg || 0,
    total_harga: o.total_harga || 0,
    status: o.status,
    sumber: 'whatsapp' as const,
    tanggal_order: o.tanggal_order,
    wilayah: o.wilayah || '',
    alamat_penjemputan: o.alamat_penjemputan,
    google_maps_url: o.google_maps_url || '',
    koordinat_penjemputan: {
      latitude: o.latitude_penjemputan,
      longitude: o.longitude_penjemputan,
    },
    id_kurir: o.id_kurir || undefined,
  }));
}

// ==========================================
// Outlet Order Management (using Prisma)
// ==========================================
export async function createOutletOrder(data: {
  id_cabang: string;
  id_pelanggan: string;
  customer_name: string;
  customer_whatsapp: string;
  id_layanan: string;
  service_name: string;
  qty: number;
  satuan: string;
  berat_kg: number;
  total_harga: number;
  status: string;
}): Promise<OutletOrder> {
  const id_order = generateOrderId('ORD-O');

  const order = await prisma.order.create({
    data: {
      id_order,
      id_cabang: data.id_cabang,
      id_pelanggan: data.id_pelanggan,
      alamat_penjemputan: '',
      alamat_pengantaran: '',
      latitude_penjemputan: 0,
      longitude_penjemputan: 0,
      latitude_pengantaran: 0,
      longitude_pengantaran: 0,
      status: data.status || 'Baru',
      berat_kg: data.berat_kg,
      total_harga: data.total_harga,
      customer_name: data.customer_name,
      customer_whatsapp: data.customer_whatsapp,
      service_name: data.service_name,
      source: 'outlet',
      qty: data.qty,
      satuan: data.satuan,
    },
  });

  console.log(`[UNIFIED ORDERS] Outlet order created in DB: ${id_order} at ${data.id_cabang}`);

  return {
    id_order: order.id_order,
    id_cabang: order.id_cabang,
    customer_name: order.customer_name || '',
    customer_whatsapp: order.customer_whatsapp || '',
    service_name: order.service_name || '',
    berat_kg: order.berat_kg || 0,
    total_harga: order.total_harga || 0,
    status: order.status,
    sumber: 'outlet',
    tanggal_order: order.tanggal_order,
    id_pelanggan: order.id_pelanggan,
    id_layanan: data.id_layanan,
    qty: order.qty || 0,
    satuan: order.satuan || 'pcs',
    id_kurir: order.id_kurir || undefined,
  };
}

export async function getOutletOrdersByBranch(id_cabang: string): Promise<OutletOrder[]> {
  const orders = await prisma.order.findMany({
    where: { id_cabang, source: 'outlet' },
    orderBy: { tanggal_order: 'desc' },
  });

  return orders.map((o) => ({
    id_order: o.id_order,
    id_cabang: o.id_cabang,
    customer_name: o.customer_name || '',
    customer_whatsapp: o.customer_whatsapp || '',
    service_name: o.service_name || '',
    berat_kg: o.berat_kg || 0,
    total_harga: o.total_harga || 0,
    status: o.status,
    sumber: 'outlet',
    tanggal_order: o.tanggal_order,
    id_pelanggan: o.id_pelanggan,
    id_layanan: '',
    qty: o.qty || 0,
    satuan: o.satuan || 'pcs',
    id_kurir: o.id_kurir || undefined,
  }));
}

export async function getAllOutletOrders(): Promise<OutletOrder[]> {
  const orders = await prisma.order.findMany({
    where: { source: 'outlet' },
    orderBy: { tanggal_order: 'desc' },
  });

  return orders.map((o) => ({
    id_order: o.id_order,
    id_cabang: o.id_cabang,
    customer_name: o.customer_name || '',
    customer_whatsapp: o.customer_whatsapp || '',
    service_name: o.service_name || '',
    berat_kg: o.berat_kg || 0,
    total_harga: o.total_harga || 0,
    status: o.status,
    sumber: 'outlet',
    tanggal_order: o.tanggal_order,
    id_pelanggan: o.id_pelanggan,
    id_layanan: '',
    qty: o.qty || 0,
    satuan: o.satuan || 'pcs',
    id_kurir: o.id_kurir || undefined,
  }));
}

// ==========================================
// Unified Order Access (using Prisma)
// ==========================================
export async function getAllOrders(): Promise<UnifiedOrder[]> {
  const orders = await prisma.order.findMany({
    orderBy: { tanggal_order: 'desc' },
  });

  return orders.map((o) => {
    if (o.source === 'outlet') {
      return {
        id_order: o.id_order,
        id_cabang: o.id_cabang,
        customer_name: o.customer_name || '',
        customer_whatsapp: o.customer_whatsapp || '',
        service_name: o.service_name || '',
        berat_kg: o.berat_kg || 0,
        total_harga: o.total_harga || 0,
        status: o.status,
        sumber: 'outlet' as const,
        tanggal_order: o.tanggal_order,
        id_pelanggan: o.id_pelanggan,
        id_layanan: '',
        qty: o.qty || 0,
        satuan: o.satuan || 'pcs',
        id_kurir: o.id_kurir || undefined,
      } as OutletOrder;
    } else {
      return {
        id_order: o.id_order,
        id_cabang: o.id_cabang,
        customer_name: o.customer_name || '',
        customer_whatsapp: o.customer_whatsapp || '',
        service_name: o.service_name || '',
        berat_kg: o.berat_kg || 0,
        total_harga: o.total_harga || 0,
        status: o.status,
        sumber: 'whatsapp' as const,
        tanggal_order: o.tanggal_order,
        wilayah: o.wilayah || '',
        alamat_penjemputan: o.alamat_penjemputan,
        google_maps_url: o.google_maps_url || '',
        koordinat_penjemputan: {
          latitude: o.latitude_penjemputan,
          longitude: o.longitude_penjemputan,
        },
        id_kurir: o.id_kurir || undefined,
      } as WhatsAppOrder;
    }
  });
}

export async function getOrdersByBranch(id_cabang: string): Promise<UnifiedOrder[]> {
  const whereClause = id_cabang ? { id_cabang } : {};
  const orders = await prisma.order.findMany({
    where: whereClause,
    orderBy: { tanggal_order: 'desc' },
  });

  return orders.map((o) => {
    if (o.source === 'outlet') {
      return {
        id_order: o.id_order,
        id_cabang: o.id_cabang,
        customer_name: o.customer_name || '',
        customer_whatsapp: o.customer_whatsapp || '',
        service_name: o.service_name || '',
        berat_kg: o.berat_kg || 0,
        total_harga: o.total_harga || 0,
        status: o.status,
        sumber: 'outlet' as const,
        tanggal_order: o.tanggal_order,
        id_pelanggan: o.id_pelanggan,
        id_layanan: (o as any).id_layanan || '',
        qty: o.qty || 0,
        satuan: o.satuan || 'pcs',
        id_kurir: o.id_kurir || undefined,
      } as OutletOrder;
    } else {
      return {
        id_order: o.id_order,
        id_cabang: o.id_cabang,
        customer_name: o.customer_name || '',
        customer_whatsapp: o.customer_whatsapp || '',
        service_name: o.service_name || '',
        berat_kg: o.berat_kg || 0,
        total_harga: o.total_harga || 0,
        status: o.status,
        sumber: 'whatsapp' as const,
        tanggal_order: o.tanggal_order,
        wilayah: o.wilayah || '',
        alamat_penjemputan: o.alamat_penjemputan,
        google_maps_url: o.google_maps_url || '',
        koordinat_penjemputan: {
          latitude: o.latitude_penjemputan,
          longitude: o.longitude_penjemputan,
        },
        id_kurir: o.id_kurir || undefined,
      } as WhatsAppOrder;
    }
  });
}

// ==========================================
// Statistics (using Prisma)
// ==========================================
export async function getOrderStats() {
  const allOrders = await prisma.order.findMany();

  const totalWhatsApp = allOrders.filter((o) => o.source === 'whatsapp').length;
  const totalOutlet = allOrders.filter((o) => o.source === 'outlet').length;
  const totalOrders = totalWhatsApp + totalOutlet;

  const ordersByBranch: Record<string, { whatsapp: number; outlet: number; total: number }> = {};

  for (const order of allOrders) {
    if (!ordersByBranch[order.id_cabang]) {
      ordersByBranch[order.id_cabang] = { whatsapp: 0, outlet: 0, total: 0 };
    }
    ordersByBranch[order.id_cabang].total++;
    if (order.source === 'whatsapp') {
      ordersByBranch[order.id_cabang].whatsapp++;
    } else if (order.source === 'outlet') {
      ordersByBranch[order.id_cabang].outlet++;
    }
  }

  const totalRevenue = allOrders
    .filter((o) => o.status === 'Selesai' || o.status === 'Lunas')
    .reduce((sum, o) => sum + (o.total_harga || 0), 0);

  return {
    total_orders: totalOrders,
    whatsapp_orders: totalWhatsApp,
    outlet_orders: totalOutlet,
    total_revenue: totalRevenue,
    orders_by_branch: ordersByBranch,
  };
}
