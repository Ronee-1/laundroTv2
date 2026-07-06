import { Router, type Request, type Response } from 'express';
import { getActiveServices, calculateTotalHarga } from '../config/services.js';

const router = Router();

// ==========================================
// SERVICE TARIFF ROUTES - FR-SERVICE-01
// Master tarif layanan laundry harian
// ==========================================

interface ServiceTariffResponse {
  success: true;
  services: Array<{
    id_layanan: string;
    nama_layanan: string;
    kategori: string;
    satuan: string;
    harga_per_satuan: number;
    estimasi_hari: number;
  }>;
}

// GET all active service tariffs
router.get('/tariffs', (_req: Request, res: Response<ServiceTariffResponse>) => {
  const services = getActiveServices();
  res.status(200).json({
    success: true,
    services: services.map((s) => ({
      id_layanan: s.id_layanan,
      nama_layanan: s.nama_layanan,
      kategori: s.kategori,
      satuan: s.satuan,
      harga_per_satuan: s.harga_per_satuan,
      estimasi_hari: s.estimasi_hari,
    })),
  });
});

// Calculate total price
interface CalculateBody {
  id_layanan: string;
  qty: number;
}

type CalculateResponse = | { success: true; id_layanan: string; qty: number; harga_per_satuan: number; total_harga: number; formatted: string }
  | { success: false; error: string };

router.post('/calculate', (req: Request<Record<string, never>, CalculateResponse, CalculateBody>, res: Response<CalculateResponse>) => {
  const { id_layanan, qty } = req.body;

  if (!id_layanan || typeof qty !== 'number' || qty <= 0) {
    res.status(400).json({ success: false, error: 'id_layanan dan qty (positif) wajib diisi.' });
    return;
  }

  const services = getActiveServices();
  const service = services.find((s) => s.id_layanan === id_layanan);

  if (!service) {
    res.status(404).json({ success: false, error: `Layanan "${id_layanan}" tidak ditemukan.` });
    return;
  }

  const total_harga = calculateTotalHarga(id_layanan, qty);
  res.status(200).json({
    success: true,
    id_layanan,
    qty,
    harga_per_satuan: service.harga_per_satuan,
    total_harga,
    formatted: `Rp${total_harga.toLocaleString('id-ID')}`,
  });
});

export default router;
