import { Router, type Request, type Response } from 'express';
import { getCourierById } from '../config/couriers.js';
import { getOrdersByCourier } from '../config/orders.js';

const router = Router();

interface CourierTaskResponse {
  success: boolean;
  id_kurir: string;
  nama_kurir: string;
  id_cabang: string;
  total_tugas: number;
  tugas: Array<{
    id_order: string;
    alamat_penjemputan: string;
    alamat_pengantaran: string;
    koordinat_penjemputan: { latitude: number; longitude: number };
    koordinat_pengantaran: { latitude: number; longitude: number };
    status: string;
    berat_kg?: number;
    google_maps_url: string;
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

    const orders = getOrdersByCourier(id_kurir, courier.id_cabang);

    const tugas = orders.map((order) => ({
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
    }));

    res.status(200).json({
      success: true,
      id_kurir: courier.id_kurir,
      nama_kurir: courier.nama_kurir,
      id_cabang: courier.id_cabang,
      total_tugas: tugas.length,
      tugas,
    });
  },
);

export default router;
