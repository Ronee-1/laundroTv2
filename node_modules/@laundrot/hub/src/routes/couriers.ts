import { Router, type Request, type Response } from 'express';
import { getCourierById, getCouriersByBranch } from '../config/couriers.js';
import { getOrdersByCourier, getAssignedOrdersByCourier } from '../config/orders.js';

// ==========================================
// COURIERS ROUTES - FR-LOG-03, FR-005 Implementation
// Courier task management and branch courier listing
// FR-005: Admin can assign orders to couriers and plot task sequence
// ==========================================

const router = Router();

interface CourierTaskResponse {
  success: boolean;
  id_kurir: string;
  nama_kurir: string;
  id_cabang: string;
  total_tugas: number;
  urutan_tugas: boolean; // FR-005: Whether tasks have custom ordering
  tugas: Array<{
    id_order: string;
    alamat_penjemputan: string;
    alamat_pengantaran: string;
    koordinat_penjemputan: { latitude: number; longitude: number };
    koordinat_pengantaran: { latitude: number; longitude: number };
    status: string;
    berat_kg?: number;
    google_maps_url: string;
    urutan?: number; // FR-005: Manual task sequence number
  }>;
}

interface ErrorResponse {
  success: false;
  error: string;
}

function buildGoogleMapsUrl(lat: number, lng: number): string {
  return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
}

router.get(
  '/:id_kurir/tasks',
  (req: Request<{ id_kurir: string }, CourierTaskResponse | ErrorResponse>, res: Response<CourierTaskResponse | ErrorResponse>) => {
    const { id_kurir } = req.params;
    const requestedCabang = req.query.id_cabang as string | undefined;

    const courier = getCourierById(id_kurir);

    if (!courier) {
      res.status(404).json({
        success: false,
        error: `Kurir dengan ID "${id_kurir}" tidak ditemukan.`,
      });
      return;
    }

    if (requestedCabang && requestedCabang !== courier.id_cabang) {
      res.status(403).json({
        success: false,
        error: `Akses ditolak: Kurir ${id_kurir} hanya dapat mengakses data cabang ${courier.id_cabang}. Percobaan akses lintas cabang terdeteksi.`,
      });
      return;
    }

    // FR-005: Get assigned orders with sequence ordering
    const { orders: assignedOrders, sequences } = getAssignedOrdersByCourier(id_kurir);

    const tugas = assignedOrders.map((order) => {
      const sequence = sequences.find((s) => s.id_order === order.id_order);
      return {
        id_order: order.id_order,
        alamat_penjemputan: order.alamat_penjemputan,
        alamat_pengantaran: order.alamat_pengantaran,
        koordinat_penjemputan: order.koordinat_penjemputan,
        koordinat_pengantaran: order.koordinat_pengantaran,
        status: order.status,
        berat_kg: order.berat_kg,
        google_maps_url: buildGoogleMapsUrl(
          order.koordinat_penjemputan.latitude,
          order.koordinat_penjemputan.longitude,
        ),
        urutan: sequence?.urutan,
      };
    });

    res.status(200).json({
      success: true,
      id_kurir: courier.id_kurir,
      nama_kurir: courier.nama_kurir,
      id_cabang: courier.id_cabang,
      total_tugas: tugas.length,
      urutan_tugas: sequences.length > 0 && sequences.length === tugas.length,
      tugas,
    });
  },
);

// ==========================================
// GET COURIERS BY BRANCH - FR-LOG-02 Support
// Returns list of couriers for a specific branch
// Used by branch admin to assign orders to couriers
// ==========================================

interface BranchCouriersResponse {
  success: boolean;
  id_cabang: string;
  couriers: Array<{
    id_kurir: string;
    nama_kurir: string;
    nomor_telepon: string;
    is_available: boolean;
  }>;
}

router.get(
  '/branch/:id_cabang',
  (req: Request<{ id_cabang: string }>, res: Response<BranchCouriersResponse>) => {
    const { id_cabang } = req.params;

    const couriers = getCouriersByBranch(id_cabang);

    res.status(200).json({
      success: true,
      id_cabang,
      couriers: couriers.map((c) => ({
        id_kurir: c.id_kurir,
        nama_kurir: c.nama_kurir,
        nomor_telepon: c.nomor_telepon,
        is_available: c.is_available,
      })),
    });
  },
);

export default router;
