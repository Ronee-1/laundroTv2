/**
 * Seed Script for LaundroT Database
 * Run with: npm run seed
 */

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const BCRYPT_SALT = 12;

async function main() {
  console.log('🌱 Starting database seed...\n');

  // ============================================================
  // SEED BRANCHES FIRST (required for foreign keys)
  // ============================================================
  console.log('📍 Seeding Branches...');

  const branches = [
    { id_cabang: 'CBG-001', nama_cabang: 'Depok (Pusat)', alamat: 'Jl. Margonda Raya No. 1, Depok', latitude: -6.4025, longitude: 106.7942, wilayah: 'Depok' },
    { id_cabang: 'CBG-002', nama_cabang: 'Jakarta Selatan', alamat: 'Jl. Sudirman No. 1, Jakarta Selatan', latitude: -6.2088, longitude: 106.8456, wilayah: 'Jakarta Selatan' },
    { id_cabang: 'CBG-003', nama_cabang: 'Bekasi Timur', alamat: 'Jl. Ahmad Yani No. 1, Bekasi Timur', latitude: -6.2389, longitude: 107.0246, wilayah: 'Bekasi' },
    { id_cabang: 'CBG-004', nama_cabang: 'Tangerang Kota', alamat: 'Jl. Daan Mogot No. 1, Tangerang', latitude: -6.1782, longitude: 106.6300, wilayah: 'Tangerang' },
    { id_cabang: 'CBG-005', nama_cabang: 'Bogor Raya', alamat: 'Jl. Pajajaran No. 1, Bogor', latitude: -6.5971, longitude: 106.8060, wilayah: 'Bogor' },
  ];

  for (const branch of branches) {
    await prisma.branch.upsert({
      where: { id_cabang: branch.id_cabang },
      update: {},
      create: branch,
    });
    console.log(`✅ Branch: ${branch.nama_cabang}`);
  }

  // ============================================================
  // SEED COURIERS FIRST (required for user Kurir)
  // ============================================================
  console.log('\n🚴 Seeding Couriers...');

  const couriers = [
    { id_kurir: 'KUR-001', id_cabang: 'CBG-001', nama_kurir: 'Ahmad Fauzi', nomor_telepon: '081234567890' },
    { id_kurir: 'KUR-002', id_cabang: 'CBG-001', nama_kurir: 'Budi Santoso', nomor_telepon: '081234567891' },
    { id_kurir: 'KUR-003', id_cabang: 'CBG-002', nama_kurir: 'Dedi Kurniawan', nomor_telepon: '081234567892' },
    { id_kurir: 'KUR-004', id_cabang: 'CBG-002', nama_kurir: 'Eko Prasetyo', nomor_telepon: '081234567893' },
    { id_kurir: 'KUR-005', id_cabang: 'CBG-003', nama_kurir: 'Fajar Nugroho', nomor_telepon: '081234567894' },
  ];

  for (const courier of couriers) {
    await prisma.courier.upsert({
      where: { id_kurir: courier.id_kurir },
      update: {},
      create: { ...courier, is_available: true },
    });
    console.log(`✅ Courier: ${courier.nama_kurir}`);
  }

  // ============================================================
  // SEED USERS (after branches exist)
  // ============================================================
  console.log('\n📋 Seeding Users...');

  // Owner (no branch)
  const hashedOwner = await bcrypt.hash('haihh', BCRYPT_SALT);
  await prisma.user.upsert({
    where: { email: 'budi@gmail.com' },
    update: {},
    create: {
      id_user: 'OWN-001',
      nama: 'Budi Santoso',
      email: 'budi@gmail.com',
      password: hashedOwner,
      role: 'Owner',
      id_cabang: null,
      is_active: true,
    },
  });
  console.log('✅ Owner: budi@gmail.com / haihh');

  // Admin (CBG-002)
  const hashedAdmin = await bcrypt.hash('haihh', BCRYPT_SALT);
  await prisma.user.upsert({
    where: { email: 'admin@laundrot.com' },
    update: {},
    create: {
      id_user: 'ADM-001',
      nama: 'Siti Aminah',
      email: 'admin@laundrot.com',
      password: hashedAdmin,
      role: 'Admin',
      id_cabang: 'CBG-002',
      is_active: true,
    },
  });
  console.log('✅ Admin: admin@laundrot.com / haihh');

  // Kurir (CBG-002, KUR-003)
  const hashedKurir = await bcrypt.hash('haihh', BCRYPT_SALT);
  await prisma.user.upsert({
    where: { email: 'kurir@laundrot.com' },
    update: {},
    create: {
      id_user: 'KUR-003',
      nama: 'Dedi Kurniawan',
      email: 'kurir@laundrot.com',
      password: hashedKurir,
      role: 'Kurir',
      id_cabang: 'CBG-002',
      is_active: true,
    },
  });
  console.log('✅ Kurir: kurir@laundrot.com / haihh');

  // ============================================================
  // SEED INVENTORY
  // ============================================================
  console.log('\n📦 Seeding Inventory...');

  const inventoryItems = [
    { id_cabang: 'CBG-001', item: 'Detergen', satuan: 'pcs', stok_saat_ini: 80, safety_threshold: 50, max_capacity: 100 },
    { id_cabang: 'CBG-001', item: 'Pelembut', satuan: 'pcs', stok_saat_ini: 60, safety_threshold: 50, max_capacity: 80 },
    { id_cabang: 'CBG-001', item: 'Plastik', satuan: 'pcs', stok_saat_ini: 200, safety_threshold: 100, max_capacity: 500 },
    { id_cabang: 'CBG-002', item: 'Detergen', satuan: 'pcs', stok_saat_ini: 75, safety_threshold: 50, max_capacity: 100 },
    { id_cabang: 'CBG-002', item: 'Pelembut', satuan: 'pcs', stok_saat_ini: 45, safety_threshold: 50, max_capacity: 80 },
    { id_cabang: 'CBG-002', item: 'Plastik', satuan: 'pcs', stok_saat_ini: 150, safety_threshold: 100, max_capacity: 500 },
  ];

  for (const item of inventoryItems) {
    await prisma.inventoryItem.upsert({
      where: { id_cabang_item: { id_cabang: item.id_cabang, item: item.item } },
      update: {},
      create: item,
    });
    console.log(`✅ ${item.id_cabang} - ${item.item}`);
  }

  console.log('\n🎉 Database seeded successfully!\n');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
