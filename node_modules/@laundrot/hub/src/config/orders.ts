import type { Order, OrderStatus } from '@laundrot/shared-types';

// ==========================================
// ORDERS CONFIG - FR-LOG-01, FR-LOG-02 Integration
// WhatsApp Order Hub allocates orders to nearest branch
// Branch admin receives allocated orders for batch processing
// ==========================================

export const ORDERS: Order[] = [
  {
    id_order: 'ORD-001',
    id_cabang: 'CBG-001',
    id_pelanggan: 'PLG-001',
    id_kurir: 'KUR-001',
    alamat_penjemputan: 'Jl. Kemang Selatan No. 5, Jakarta Selatan',
    alamat_pengantaran: 'Jl. Kemang Selatan No. 5, Jakarta Selatan',
    koordinat_penjemputan: { latitude: -6.2650, longitude: 106.8130 },
    koordinat_pengantaran: { latitude: -6.2650, longitude: 106.8130 },
    status: 'Pending',
    berat_kg: 3.5,
    total_harga: 70000,
    tanggal_order: new Date('2024-06-01'),
    created_at: new Date('2024-06-01'),
    updated_at: new Date('2024-06-01'),
  },
  {
    id_order: 'ORD-002',
    id_cabang: 'CBG-001',
    id_pelanggan: 'PLG-002',
    id_kurir: 'KUR-001',
    alamat_penjemputan: 'Jl. Bangka Raya No. 12, Jakarta Selatan',
    alamat_pengantaran: 'Jl. Bangka Raya No. 12, Jakarta Selatan',
    koordinat_penjemputan: { latitude: -6.2710, longitude: 106.8200 },
    koordinat_pengantaran: { latitude: -6.2710, longitude: 106.8200 },
    status: 'On Route',
    berat_kg: 2.0,
    total_harga: 40000,
    tanggal_order: new Date('2024-06-01'),
    created_at: new Date('2024-06-01'),
    updated_at: new Date('2024-06-01'),
  },
  {
    id_order: 'ORD-003',
    id_cabang: 'CBG-002',
    id_pelanggan: 'PLG-003',
    id_kurir: 'KUR-003',
    alamat_penjemputan: 'Jl. Puri Indah Blok A No. 8, Jakarta Barat',
    alamat_pengantaran: 'Jl. Puri Indah Blok A No. 8, Jakarta Barat',
    koordinat_penjemputan: { latitude: -6.1850, longitude: 106.7400 },
    koordinat_pengantaran: { latitude: -6.1850, longitude: 106.7400 },
    status: 'Pending',
    berat_kg: 5.0,
    total_harga: 100000,
    tanggal_order: new Date('2024-06-01'),
    created_at: new Date('2024-06-01'),
    updated_at: new Date('2024-06-01'),
  },
  {
    id_order: 'ORD-004',
    id_cabang: 'CBG-003',
    id_pelanggan: 'PLG-004',
    id_kurir: 'KUR-004',
    alamat_penjemputan: 'Jl. Pemuda No. 30, Jakarta Timur',
    alamat_pengantaran: 'Jl. Pemuda No. 30, Jakarta Timur',
    koordinat_penjemputan: { latitude: -6.1920, longitude: 106.8900 },
    koordinat_pengantaran: { latitude: -6.1920, longitude: 106.8900 },
    status: 'Pending',
    berat_kg: 4.0,
    total_harga: 80000,
    tanggal_order: new Date('2024-06-01'),
    created_at: new Date('2024-06-01'),
    updated_at: new Date('2024-06-01'),
  },
];

export function getOrdersByCourier(id_kurir: string, id_cabang: string): Order[] {
  return ORDERS.filter((o) => o.id_kurir === id_kurir && o.id_cabang === id_cabang);
}

export function getOrdersByBranch(id_cabang: string): Order[] {
  return ORDERS.filter((o) => o.id_cabang === id_cabang);
}

export function getOrderById(id_order: string): Order | undefined {
  return ORDERS.find((o) => o.id_order === id_order);
}

export function updateOrderStatus(id_order: string, newStatus: OrderStatus): Order | null {
  const order = getOrderById(id_order);
  if (!order) return null;

  order.status = newStatus;
  order.updated_at = new Date();

  if (newStatus === 'Selesai' || newStatus === 'Lunas' || newStatus === 'Done') {
    order.tanggal_selesai = new Date();
  }

  return order;
}

// FR-LOG-01: Create order from WhatsApp Hub allocation
export interface CreateOrderFromWhatsAppParams {
  id_cabang: string;
  customer_name: string;
  customer_whatsapp: string;
  service_type: string;
  berat_kg: number;
  wilayah: string;
  alamat_penjemputan: string;
  koordinat_penjemputan: { latitude: number; longitude: number };
  google_maps_url: string;
}

export function createOrderFromWhatsApp(params: CreateOrderFromWhatsAppParams): Order {
  const id_order = `ORD-WA-${Date.now()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

  const order: Order = {
    id_order,
    id_cabang: params.id_cabang,
    id_pelanggan: `PLG-${Date.now()}`,
    id_kurir: '', // Will be assigned by branch admin
    alamat_penjemputan: params.alamat_penjemputan,
    alamat_pengantaran: params.alamat_penjemputan,
    koordinat_penjemputan: params.koordinat_penjemputan,
    koordinat_pengantaran: params.koordinat_penjemputan,
    status: 'Pending',
    berat_kg: params.berat_kg,
    total_harga: 0, // Will be calculated based on service
    customer_name: params.customer_name,
    customer_whatsapp: params.customer_whatsapp,
    service_type: params.service_type,
    wilayah: params.wilayah,
    google_maps_url: params.google_maps_url,
    tanggal_order: new Date(),
    created_at: new Date(),
    updated_at: new Date(),
  };

  ORDERS.push(order);
  return order;
}

// Get all incoming orders for a branch (WhatsApp allocated orders)
export function getIncomingOrdersByBranch(id_cabang: string): Order[] {
  return ORDERS.filter((o) => o.id_cabang === id_cabang && o.status === 'Pending');
}

// Get all orders for branch (including processed)
export function getAllOrdersByBranch(id_cabang: string): Order[] {
  return ORDERS.filter((o) => o.id_cabang === id_cabang);
}
