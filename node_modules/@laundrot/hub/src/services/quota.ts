import type { Branch } from '@laundrot/shared-types';
import { getBranchById } from '../config/branches.js';

export interface QuotaCheckResult {
  available: boolean;
  kuota_harian: number;
  kuota_terpakai: number;
  sisa_kuota: number;
}

export async function checkQuota(id_cabang: string): Promise<QuotaCheckResult | null> {
  const branch = await getBranchById(id_cabang);
  if (!branch) return null;

  return {
    available: branch.kuota_terpakai < branch.kuota_harian,
    kuota_harian: branch.kuota_harian,
    kuota_terpakai: branch.kuota_terpakai,
    sisa_kuota: branch.kuota_harian - branch.kuota_terpakai,
  };
}

export function generateDelayMessage(branch: Branch, rescheduleDate: Date): string {
  const tanggal = rescheduleDate.toLocaleDateString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return `Halo Kak! 👋

Mohon maaf, saat ini kuota penjemputan di ${branch.nama_cabang} sudah penuh untuk hari ini.

Kami telah menjadwalkan ulang penjemputan laundry Kakak pada:
📅 ${tanggal}

Tim kurir kami akan menghubungi Kakak kembali untuk konfirmasi jadwal.

Terima kasih atas kesabaran Kakak! 🙏

— Laundro Truck`;
}

export function getNextBusinessDay(): Date {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(8, 0, 0, 0);
  return tomorrow;
}
