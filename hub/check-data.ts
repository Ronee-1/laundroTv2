// Quick check for revenue data
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import 'dotenv/config';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:51582/laundrot' });
const prisma = new PrismaClient({ adapter });

async function checkData() {
  console.log('=== Revenue per Branch (Cashbook - Tunai) ===');
  const cashbook = await prisma.cashBookEntry.groupBy({
    by: ['id_cabang'],
    _sum: { nominal: true },
    where: { tipe: 'Pemasukan' }
  });
  console.log(cashbook);

  console.log('\n=== Orders per Branch ===');
  const orders = await prisma.order.groupBy({
    by: ['id_cabang', 'metode_pembayaran'],
    _count: { id_order: true }
  });
  console.log(orders);

  console.log('\n=== Daily Summary Preview ===');
  const branches = ['CBG-001', 'CBG-002', 'CBG-003', 'CBG-004', 'CBG-005'];
  for (const branch of branches) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayCash = await prisma.cashBookEntry.aggregate({
      where: { id_cabang: branch, tipe: 'Pemasukan', tanggal_jurnal: { gte: today } },
      _sum: { nominal: true }
    });
    const todayNonCash = await prisma.order.aggregate({
      where: { id_cabang: branch, metode_pembayaran: 'Non-Tunai', created_at: { gte: today } },
      _sum: { total_harga: true }
    });
    const todayOrders = await prisma.order.count({
      where: { id_cabang: branch, created_at: { gte: today } }
    });

    const totalToday = (todayCash._sum.nominal || 0) + (todayNonCash._sum.total_harga || 0);
    console.log(`${branch}: Total Hari Ini=Rp${totalToday.toLocaleString('id-ID')}, Orders=${todayOrders}`);
  }

  await prisma.$disconnect();
}

checkData().catch(console.error);
