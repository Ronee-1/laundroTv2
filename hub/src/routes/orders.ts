import { Router, type Request, type Response } from 'express';
import type { OrderStatus } from '@laundrot/shared-types';
import { findNearestBranch } from '../services/georouting.js';
import { checkQuota, generateDelayMessage, getNextBusinessDay } from '../services/quota.js';
import { updateOrderStatus } from '../config/orders.js';
import { createJournalEntry } from '../services/cashbook.js';
import { getBranchById } from '../config/branches.js';

const router = Router();

interface AllocateOrderBody {
  alamat_pelanggan: string;
  koordinat: {
    latitude: number;
    longitude: number;
  };
  id_pelanggan?: string;
  catatan?: string;
}

interface AllocateSuccessResponse {
  success: true;
  status: 'Dialokasikan';
  id_cabang: string;
  nama_cabang: string;
  distance_km: number;
  sisa_kuota: number;
  message: string;
}

interface QuotaFullResponse {
  success: false;
  status: 'Kuota Penuh';
  id_cabang: string;
  nama_cabang: string;
  kuota_harian: number;
  kuota_terpakai: number;
  reschedule_date: string;
  whatsapp_template: string;
}

type AllocateResponse = AllocateSuccessResponse | QuotaFullResponse;

router.post('/allocate', (req: Request<{}, AllocateResponse, AllocateOrderBody>, res: Response<AllocateResponse>) => {
  const { alamat_pelanggan, koordinat } = req.body;

  if (!koordinat || typeof koordinat.latitude !== 'number' || typeof koordinat.longitude !== 'number') {
    res.status(400).json({
      success: false,
      status: 'Kuota Penuh',
      id_cabang: '',
      nama_cabang: '',
      kuota_harian: 0,
      kuota_terpakai: 0,
      reschedule_date: '',
      whatsapp_template: 'Error: Koordinat pelanggan tidak valid.',
    });
    return;
  }

  const nearest = findNearestBranch(koordinat);

  if (!nearest) {
    res.status(503).json({
      success: false,
      status: 'Kuota Penuh',
      id_cabang: '',
      nama_cabang: '',
      kuota_harian: 0,
      kuota_terpakai: 0,
      reschedule_date: '',
      whatsapp_template: 'Error: Tidak ada cabang aktif yang tersedia.',
    });
    return;
  }

  const quota = checkQuota(nearest.branch.id_cabang);

  if (!quota) {
    res.status(500).json({
      success: false,
      status: 'Kuota Penuh',
      id_cabang: nearest.branch.id_cabang,
      nama_cabang: nearest.branch.nama_cabang,
      kuota_harian: 0,
      kuota_terpakai: 0,
      reschedule_date: '',
      whatsapp_template: 'Error: Data cabang tidak ditemukan.',
    });
    return;
  }

  if (!quota.available) {
    const rescheduleDate = getNextBusinessDay();
    const whatsappTemplate = generateDelayMessage(nearest.branch, rescheduleDate);

    res.status(200).json({
      success: false,
      status: 'Kuota Penuh',
      id_cabang: nearest.branch.id_cabang,
      nama_cabang: nearest.branch.nama_cabang,
      kuota_harian: quota.kuota_harian,
      kuota_terpakai: quota.kuota_terpakai,
      reschedule_date: rescheduleDate.toISOString(),
      whatsapp_template: whatsappTemplate,
    });
    return;
  }

  res.status(200).json({
    success: true,
    status: 'Dialokasikan',
    id_cabang: nearest.branch.id_cabang,
    nama_cabang: nearest.branch.nama_cabang,
    distance_km: Math.round(nearest.distance_km * 100) / 100,
    sisa_kuota: quota.sisa_kuota,
    message: `Pesanan dari "${alamat_pelanggan}" dialokasikan ke ${nearest.branch.nama_cabang} (${Math.round(nearest.distance_km * 100) / 100} km).`,
  });
});

const VALID_STATUSES: OrderStatus[] = [
  'Pending',
  'Diproses',
  'Siap Diantar',
  'Dalam Pengiriman',
  'Selesai',
  'Lunas',
  'Dibatalkan',
];

interface UpdateStatusBody {
  status: OrderStatus;
}

interface UpdateStatusResponse {
  success: boolean;
  id_order: string;
  status: string;
  id_cabang: string;
  journal?: {
    id_jurnal: string;
    nominal: number;
    tipe: string;
    deskripsi: string;
    tanggal_jurnal: string;
  };
  message: string;
}

router.patch(
  '/:id_order/status',
  (req: Request<{ id_order: string }, UpdateStatusResponse, UpdateStatusBody>, res: Response<UpdateStatusResponse>) => {
    const { id_order } = req.params;
    const { status } = req.body;

    if (!status || !VALID_STATUSES.includes(status)) {
      res.status(400).json({
        success: false,
        id_order,
        status: '',
        id_cabang: '',
        message: `Status tidak valid. Status yang diizinkan: ${VALID_STATUSES.join(', ')}`,
      });
      return;
    }

    const updatedOrder = updateOrderStatus(id_order, status);

    if (!updatedOrder) {
      res.status(404).json({
        success: false,
        id_order,
        status: '',
        id_cabang: '',
        message: `Pesanan dengan ID "${id_order}" tidak ditemukan.`,
      });
      return;
    }

    let journal = undefined;

    if (status === 'Selesai' || status === 'Lunas') {
      const branch = getBranchById(updatedOrder.id_cabang);
      const nominal = updatedOrder.total_harga ?? 0;

      const entry = createJournalEntry({
        id_cabang: updatedOrder.id_cabang,
        id_transaksi: updatedOrder.id_order,
        nominal,
        tipe: 'Pemasukan',
        deskripsi: `Pendapatan pesanan ${updatedOrder.id_order} dari ${branch?.nama_cabang ?? updatedOrder.id_cabang}`,
      });

      journal = {
        id_jurnal: entry.id_jurnal,
        nominal: entry.nominal,
        tipe: entry.tipe,
        deskripsi: entry.deskripsi,
        tanggal_jurnal: entry.tanggal_jurnal.toISOString(),
      };
    }

    res.status(200).json({
      success: true,
      id_order: updatedOrder.id_order,
      status: updatedOrder.status,
      id_cabang: updatedOrder.id_cabang,
      journal,
      message:
        journal
          ? `Status pesanan diubah menjadi "${status}". Jurnal otomatis tercatat di Buku Kas Pusat.`
          : `Status pesanan diubah menjadi "${status}".`,
    });
  },
);

export default router;
