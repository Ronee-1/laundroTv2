import { PrismaClient } from '../src/generated/prisma/client.js';
import { PrismaPg } from '@prisma/adapter-pg';
import bcrypt from 'bcrypt';
import 'dotenv/config';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

// ============================================================
// SEED CONSTANTS
// ============================================================

const BCRYPT_SALT_ROUNDS = 12;

// Owner test credentials
const OWNER_EMAIL = 'budi@gmail.com';
const OWNER_PASSWORD = 'haihh';

// Admin test credentials
const ADMIN_EMAIL = 'admin@laundrot.com';
const ADMIN_PASSWORD = 'haihh';

// Kurir test credentials
const KURIR_EMAIL = 'kurir@laundrot.com';
const KURIR_PASSWORD = 'haihh';

async function main() {
  console.log('Seeding database...\n');

  // ============================================================
  // SEED USERS (Authentication System)
  // ============================================================

  console.log('📋 Seeding Users...');

  // Hash the owner password using bcrypt
  const hashedOwnerPassword = await bcrypt.hash(OWNER_PASSWORD, BCRYPT_SALT_ROUNDS);
  console.log(`   Owner password hashed: ${OWNER_PASSWORD} -> bcrypt hash`);

  const ownerUser = await prisma.user.upsert({
    where: { email: OWNER_EMAIL },
    update: {},
    create: {
      id_user: 'OWN-001',
      nama: 'Budi Santoso',
      email: OWNER_EMAIL,
      password: hashedOwnerPassword,
      role: 'Owner',
      id_cabang: null, // Owner has no specific branch
      is_active: true,
    },
  });
  console.log(`   ✓ Owner: ${ownerUser.nama} (${ownerUser.email})`);
  console.log(`     Role: ${ownerUser.role}`);
  console.log(`     Test Login: POST /api/auth/login with { email: "${OWNER_EMAIL}", password: "${OWNER_PASSWORD}" }\n`);

  // Seed Admin user
  const hashedAdminPassword = await bcrypt.hash(ADMIN_PASSWORD, BCRYPT_SALT_ROUNDS);
  const adminUser = await prisma.user.upsert({
    where: { email: ADMIN_EMAIL },
    update: {},
    create: {
      id_user: 'ADM-001',
      nama: 'Siti Aminah',
      email: ADMIN_EMAIL,
      password: hashedAdminPassword,
      role: 'Admin',
      id_cabang: 'CBG-002', // Jakarta Selatan
      is_active: true,
    },
  });
  console.log(`   ✓ Admin: ${adminUser.nama} (${adminUser.email})`);
  console.log(`     Role: ${adminUser.role}`);
  console.log(`     Branch: CBG-002 (Jakarta Selatan)`);
  console.log(`     Test Login: POST /api/auth/login with { email: "${ADMIN_EMAIL}", password: "${ADMIN_PASSWORD}" }\n`);

  // Seed Kurir user - use KUR-003 to match existing Courier record at CBG-002
  const hashedKurirPassword = await bcrypt.hash(KURIR_PASSWORD, BCRYPT_SALT_ROUNDS);
  const kurirUser = await prisma.user.upsert({
    where: { email: KURIR_EMAIL },
    update: {},
    create: {
      id_user: 'KUR-003',
      nama: 'Dedi Kurniawan',
      email: KURIR_EMAIL,
      password: hashedKurirPassword,
      role: 'Kurir',
      id_cabang: 'CBG-002', // Jakarta Selatan
      is_active: true,
    },
  });

  console.log(`   ✓ Kurir: ${kurirUser.nama} (${kurirUser.email})`);
  console.log(`     Role: ${kurirUser.role}`);
  console.log(`     Branch: CBG-002 (Jakarta Selatan)`);
  console.log(`     Courier ID: KUR-003`);
  console.log(`     Test Login: POST /api/auth/login with { email: "${KURIR_EMAIL}", password: "${KURIR_PASSWORD}" }\n`);

  // ============================================================
  // SEED BRANCHES (5 Cabangs in Jabodetabek)
  // ============================================================

  console.log('📍 Seeding Branches...');

  const branches = await Promise.all([
    prisma.branch.upsert({
      where: { id_cabang: 'CBG-001' },
      update: {},
      create: {
        id_cabang: 'CBG-001',
        nama_cabang: 'Cabang Depok (Pusat)',
        alamat: 'Jl. Margonda Raya No. 88, Depok',
        latitude: -6.3894,
        longitude: 106.8302,
        kuota_harian: 30,
        kuota_terpakai: 0,
        is_active: true,
        omzet: 24500000,
        wilayah: 'Depok',
      },
    }),
    prisma.branch.upsert({
      where: { id_cabang: 'CBG-002' },
      update: {},
      create: {
        id_cabang: 'CBG-002',
        nama_cabang: 'Cabang Jakarta Selatan',
        alamat: 'Jl. Kemang Raya No. 10, Jakarta Selatan',
        latitude: -6.2615,
        longitude: 106.8106,
        kuota_harian: 30,
        kuota_terpakai: 0,
        is_active: true,
        omzet: 18200000,
        wilayah: 'Jakarta Selatan',
      },
    }),
    prisma.branch.upsert({
      where: { id_cabang: 'CBG-003' },
      update: {},
      create: {
        id_cabang: 'CBG-003',
        nama_cabang: 'Cabang Bekasi Timur',
        alamat: 'Jl. Rawamangun No. 22, Bekasi Timur',
        latitude: -6.1903,
        longitude: 106.8872,
        kuota_harian: 30,
        kuota_terpakai: 0,
        is_active: true,
        omzet: 15400000,
        wilayah: 'Bekasi Timur',
      },
    }),
    prisma.branch.upsert({
      where: { id_cabang: 'CBG-004' },
      update: {},
      create: {
        id_cabang: 'CBG-004',
        nama_cabang: 'Cabang Tangerang Kota',
        alamat: 'Jl. BSD Raya No. 15, Tangerang',
        latitude: -6.3014,
        longitude: 106.6527,
        kuota_harian: 30,
        kuota_terpakai: 0,
        is_active: true,
        omzet: 21000000,
        wilayah: 'Tangerang',
      },
    }),
    prisma.branch.upsert({
      where: { id_cabang: 'CBG-005' },
      update: {},
      create: {
        id_cabang: 'CBG-005',
        nama_cabang: 'Cabang Bogor Raya',
        alamat: 'Jl. Pajajaran No. 25, Bogor',
        latitude: -6.5971,
        longitude: 106.8060,
        kuota_harian: 30,
        kuota_terpakai: 0,
        is_active: true,
        omzet: 12100000,
        wilayah: 'Bogor Raya',
      },
    }),
  ]);
  console.log(`   ✓ Seeded ${branches.length} branches`);
  branches.forEach((b) => console.log(`     - ${b.id_cabang}: ${b.nama_cabang} (${b.wilayah})`));
  console.log('');

  // ============================================================
  // SEED COURIERS
  // ============================================================

  console.log('🚴 Seeding Couriers...');

  const couriers = await Promise.all([
    prisma.courier.upsert({
      where: { id_kurir: 'KUR-001' },
      update: {},
      create: { id_kurir: 'KUR-001', id_cabang: 'CBG-001', nama_kurir: 'Budi Santoso', nomor_telepon: '+6281234567890', is_available: true },
    }),
    prisma.courier.upsert({
      where: { id_kurir: 'KUR-002' },
      update: {},
      create: { id_kurir: 'KUR-002', id_cabang: 'CBG-001', nama_kurir: 'Agus Wijaya', nomor_telepon: '+6281234567891', is_available: true },
    }),
    prisma.courier.upsert({
      where: { id_kurir: 'KUR-003' },
      update: {},
      create: { id_kurir: 'KUR-003', id_cabang: 'CBG-002', nama_kurir: 'Dedi Kurniawan', nomor_telepon: '+6281234567892', is_available: true },
    }),
    prisma.courier.upsert({
      where: { id_kurir: 'KUR-004' },
      update: {},
      create: { id_kurir: 'KUR-004', id_cabang: 'CBG-003', nama_kurir: 'Rina Susanti', nomor_telepon: '+6281234567893', is_available: true },
    }),
    prisma.courier.upsert({
      where: { id_kurir: 'KUR-005' },
      update: {},
      create: { id_kurir: 'KUR-005', id_cabang: 'CBG-004', nama_kurir: 'Eko Prasetyo', nomor_telepon: '+6281234567894', is_available: true },
    }),
  ]);
  console.log(`   ✓ Seeded ${couriers.length} couriers\n`);

  // ============================================================
  // SEED ORDERS
  // ============================================================

  console.log('📦 Seeding Orders...');

  const orders = await Promise.all([
    prisma.order.upsert({
      where: { id_order: 'ORD-001' },
      update: {},
      create: {
        id_order: 'ORD-001', id_cabang: 'CBG-001', id_pelanggan: 'PLG-001', id_kurir: 'KUR-001',
        alamat_penjemputan: 'Jl. Kemang Selatan No. 5, Jakarta Selatan',
        alamat_pengantaran: 'Jl. Kemang Selatan No. 5, Jakarta Selatan',
        latitude_penjemputan: -6.2650, longitude_penjemputan: 106.8130,
        latitude_pengantaran: -6.2650, longitude_pengantaran: 106.8130,
        status: 'Pending', berat_kg: 3.5, total_harga: 70000,
      },
    }),
    prisma.order.upsert({
      where: { id_order: 'ORD-002' },
      update: {},
      create: {
        id_order: 'ORD-002', id_cabang: 'CBG-001', id_pelanggan: 'PLG-002', id_kurir: 'KUR-001',
        alamat_penjemputan: 'Jl. Bangka Raya No. 12, Jakarta Selatan',
        alamat_pengantaran: 'Jl. Bangka Raya No. 12, Jakarta Selatan',
        latitude_penjemputan: -6.2710, longitude_penjemputan: 106.8200,
        latitude_pengantaran: -6.2710, longitude_pengantaran: 106.8200,
        status: 'On Route', berat_kg: 2.0, total_harga: 40000,
      },
    }),
    prisma.order.upsert({
      where: { id_order: 'ORD-003' },
      update: {},
      create: {
        id_order: 'ORD-003', id_cabang: 'CBG-002', id_pelanggan: 'PLG-003', id_kurir: 'KUR-003',
        alamat_penjemputan: 'Jl. Puri Indah Blok A No. 8, Jakarta Barat',
        alamat_pengantaran: 'Jl. Puri Indah Blok A No. 8, Jakarta Barat',
        latitude_penjemputan: -6.1850, longitude_penjemputan: 106.7400,
        latitude_pengantaran: -6.1850, longitude_pengantaran: 106.7400,
        status: 'Pending', berat_kg: 5.0, total_harga: 100000,
      },
    }),
    prisma.order.upsert({
      where: { id_order: 'ORD-004' },
      update: {},
      create: {
        id_order: 'ORD-004', id_cabang: 'CBG-003', id_pelanggan: 'PLG-004', id_kurir: 'KUR-004',
        alamat_penjemputan: 'Jl. Pemuda No. 30, Jakarta Timur',
        alamat_pengantaran: 'Jl. Pemuda No. 30, Jakarta Timur',
        latitude_penjemputan: -6.1920, longitude_penjemputan: 106.8900,
        latitude_pengantaran: -6.1920, longitude_pengantaran: 106.8900,
        status: 'Pending', berat_kg: 4.0, total_harga: 80000,
      },
    }),
  ]);
  console.log(`   ✓ Seeded ${orders.length} orders\n`);

  // ============================================================
  // SEED MONTHLY BUDGETS
  // ============================================================

  console.log('💰 Seeding Monthly Budgets...');

  const budgets = await Promise.all([
    prisma.monthlyBudget.upsert({
      where: { id_cabang_bulan_tahun: { id_cabang: 'CBG-001', bulan: 'Juli', tahun: 2026 } },
      update: {},
      create: { id_cabang: 'CBG-001', bulan: 'Juli', tahun: 2026, pagu_anggaran: 5000000, terpakai: 350000 },
    }),
    prisma.monthlyBudget.upsert({
      where: { id_cabang_bulan_tahun: { id_cabang: 'CBG-002', bulan: 'Juli', tahun: 2026 } },
      update: {},
      create: { id_cabang: 'CBG-002', bulan: 'Juli', tahun: 2026, pagu_anggaran: 5000000, terpakai: 2300000 },
    }),
    prisma.monthlyBudget.upsert({
      where: { id_cabang_bulan_tahun: { id_cabang: 'CBG-003', bulan: 'Juli', tahun: 2026 } },
      update: {},
      create: { id_cabang: 'CBG-003', bulan: 'Juli', tahun: 2026, pagu_anggaran: 4000000, terpakai: 1200000 },
    }),
    prisma.monthlyBudget.upsert({
      where: { id_cabang_bulan_tahun: { id_cabang: 'CBG-004', bulan: 'Juli', tahun: 2026 } },
      update: {},
      create: { id_cabang: 'CBG-004', bulan: 'Juli', tahun: 2026, pagu_anggaran: 4500000, terpakai: 2800000 },
    }),
    prisma.monthlyBudget.upsert({
      where: { id_cabang_bulan_tahun: { id_cabang: 'CBG-005', bulan: 'Juli', tahun: 2026 } },
      update: {},
      create: { id_cabang: 'CBG-005', bulan: 'Juli', tahun: 2026, pagu_anggaran: 4000000, terpakai: 3850000 },
    }),
  ]);
  console.log(`   ✓ Seeded ${budgets.length} monthly budgets\n`);

  // ============================================================
  // SEED INVENTORY ITEMS
  // ============================================================

  console.log('📊 Seeding Inventory Items...');

  const inventoryData = [
    { id_cabang: 'CBG-001', items: [
      { item: 'Detergen', satuan: 'pcs', stok_saat_ini: 45, safety_threshold: 50, max_capacity: 100 },
      { item: 'Pelembut', satuan: 'pcs', stok_saat_ini: 30, safety_threshold: 50, max_capacity: 80 },
      { item: 'Plastik', satuan: 'pcs', stok_saat_ini: 120, safety_threshold: 100, max_capacity: 200 },
    ]},
    { id_cabang: 'CBG-002', items: [
      { item: 'Detergen', satuan: 'pcs', stok_saat_ini: 12, safety_threshold: 50, max_capacity: 100 },
      { item: 'Pelembut', satuan: 'pcs', stok_saat_ini: 25, safety_threshold: 50, max_capacity: 80 },
      { item: 'Plastik', satuan: 'pcs', stok_saat_ini: 18, safety_threshold: 100, max_capacity: 200 },
    ]},
    { id_cabang: 'CBG-003', items: [
      { item: 'Detergen', satuan: 'pcs', stok_saat_ini: 22, safety_threshold: 50, max_capacity: 100 },
      { item: 'Pelembut', satuan: 'pcs', stok_saat_ini: 14, safety_threshold: 50, max_capacity: 80 },
      { item: 'Plastik', satuan: 'pcs', stok_saat_ini: 85, safety_threshold: 100, max_capacity: 200 },
    ]},
    { id_cabang: 'CBG-004', items: [
      { item: 'Detergen', satuan: 'pcs', stok_saat_ini: 40, safety_threshold: 50, max_capacity: 100 },
      { item: 'Pelembut', satuan: 'pcs', stok_saat_ini: 35, safety_threshold: 50, max_capacity: 80 },
      { item: 'Plastik', satuan: 'pcs', stok_saat_ini: 110, safety_threshold: 100, max_capacity: 200 },
    ]},
    { id_cabang: 'CBG-005', items: [
      { item: 'Detergen', satuan: 'pcs', stok_saat_ini: 8, safety_threshold: 50, max_capacity: 100 },
      { item: 'Pelembut', satuan: 'pcs', stok_saat_ini: 9, safety_threshold: 50, max_capacity: 80 },
      { item: 'Plastik', satuan: 'pcs', stok_saat_ini: 45, safety_threshold: 100, max_capacity: 200 },
    ]},
  ];

  let inventoryCount = 0;
  for (const branch of inventoryData) {
    for (const item of branch.items) {
      await prisma.inventoryItem.upsert({
        where: { id_cabang_item: { id_cabang: branch.id_cabang, item: item.item } },
        update: {},
        create: { id_cabang: branch.id_cabang, ...item },
      });
      inventoryCount++;
    }
  }
  console.log(`   ✓ Seeded ${inventoryCount} inventory items\n`);

  // ============================================================
  // SEED EXPENSES
  // ============================================================

  console.log('💸 Seeding Expenses...');

  const expenses = await Promise.all([
    prisma.expense.upsert({
      where: { id_expense: 'EXP-SEED-001' },
      update: {},
      create: {
        id_expense: 'EXP-SEED-001', id_cabang: 'CBG-001',
        tanggal: new Date('2026-06-25'), nominal: 350000,
        deskripsi: 'Pengisian bensin truk rute lingkar luar Depok',
        kategori: 'BBM', status: 'Approve',
        tanggal_pengajuan: new Date('2026-06-25'), tanggal_approval: new Date('2026-06-25'),
      },
    }),
    prisma.expense.upsert({
      where: { id_expense: 'EXP-SEED-002' },
      update: {},
      create: {
        id_expense: 'EXP-SEED-002', id_cabang: 'CBG-002',
        tanggal: new Date('2026-06-26'), nominal: 1500000,
        deskripsi: 'Pembayaran tagihan listrik laundry kilat',
        kategori: 'Sewa & Utilitas', status: 'Approve',
        tanggal_pengajuan: new Date('2026-06-26'), tanggal_approval: new Date('2026-06-26'),
      },
    }),
    prisma.expense.upsert({
      where: { id_expense: 'EXP-SEED-003' },
      update: {},
      create: {
        id_expense: 'EXP-SEED-003', id_cabang: 'CBG-003',
        tanggal: new Date('2026-06-27'), nominal: 1200000,
        deskripsi: 'Uang lembur kurir akhir pekan',
        kategori: 'Gaji', status: 'Approve',
        tanggal_pengajuan: new Date('2026-06-27'), tanggal_approval: new Date('2026-06-27'),
      },
    }),
    prisma.expense.upsert({
      where: { id_expense: 'EXP-SEED-004' },
      update: {},
      create: {
        id_expense: 'EXP-SEED-004', id_cabang: 'CBG-002',
        tanggal: new Date('2026-06-28'), nominal: 800000,
        deskripsi: 'Pembelian darurat 4 jerigen detergen di agen lokal',
        kategori: 'Belanja Darurat', status: 'Approve',
        tanggal_pengajuan: new Date('2026-06-28'), tanggal_approval: new Date('2026-06-28'),
      },
    }),
  ]);
  console.log(`   ✓ Seeded ${expenses.length} expenses\n`);

  // ============================================================
  // SEED SERVICE TARIFFS
  // ============================================================

  console.log('🏷️ Seeding Service Tariffs...');

  const tariffs = await Promise.all([
    prisma.serviceTariff.upsert({
      where: { id_layanan: 'SRV-001' }, update: {},
      create: { id_layanan: 'SRV-001', nama_layanan: 'Cuci Kering Setrika Reguler', kategori: 'kiloan', satuan: 'kg', harga_per_satuan: 8000, estimasi_hari: 2, is_active: true },
    }),
    prisma.serviceTariff.upsert({
      where: { id_layanan: 'SRV-002' }, update: {},
      create: { id_layanan: 'SRV-002', nama_layanan: 'Cuci Kering Setrika Ekspres', kategori: 'kiloan', satuan: 'kg', harga_per_satuan: 12000, estimasi_hari: 1, is_active: true },
    }),
    prisma.serviceTariff.upsert({
      where: { id_layanan: 'SRV-003' }, update: {},
      create: { id_layanan: 'SRV-003', nama_layanan: 'Bedcover Reguler', kategori: 'bedcover', satuan: 'pcs', harga_per_satuan: 25000, estimasi_hari: 3, is_active: true },
    }),
    prisma.serviceTariff.upsert({
      where: { id_layanan: 'SRV-004' }, update: {},
      create: { id_layanan: 'SRV-004', nama_layanan: 'Bedcover Ekspres', kategori: 'bedcover', satuan: 'pcs', harga_per_satuan: 35000, estimasi_hari: 1, is_active: true },
    }),
    prisma.serviceTariff.upsert({
      where: { id_layanan: 'SRV-005' }, update: {},
      create: { id_layanan: 'SRV-005', nama_layanan: 'Setrika Only', kategori: 'satuan', satuan: 'kg', harga_per_satuan: 4000, estimasi_hari: 1, is_active: true },
    }),
    prisma.serviceTariff.upsert({
      where: { id_layanan: 'SRV-006' }, update: {},
      create: { id_layanan: 'SRV-006', nama_layanan: 'Cuci Only', kategori: 'satuan', satuan: 'kg', harga_per_satuan: 5000, estimasi_hari: 1, is_active: true },
    }),
  ]);
  console.log(`   ✓ Seeded ${tariffs.length} service tariffs\n`);

  // ============================================================
  // SEED EXPENSE CATEGORIES
  // ============================================================

  console.log('📁 Seeding Expense Categories...');

  const categories = ['BBM', 'Sewa & Utilitas', 'Gaji', 'Belanja Darurat', 'Pemeliharaan', 'Lain-lain'];
  for (const name of categories) {
    await prisma.expenseCategory.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }
  console.log(`   ✓ Seeded ${categories.length} expense categories\n`);

  // ============================================================
  // SEED CUSTOMERS
  // ============================================================

  console.log('👥 Seeding Customers...');

  const customers = [
    {
      id_cabang: 'CBG-001',
      nama: 'Budi Santoso',
      whatsapp: '081234567890',
      alamat_maps: 'https://maps.google.com/maps?q=-6.4025,106.7942',
    },
    {
      id_cabang: 'CBG-001',
      nama: 'Ani Wijaya',
      whatsapp: '081234567891',
      alamat_maps: 'https://maps.google.com/maps?q=-6.4010,106.7950',
    },
    {
      id_cabang: 'CBG-002',
      nama: 'Dedi Kurniawan',
      whatsapp: '081234567892',
      alamat_maps: 'https://maps.app.goo.gl/abc123',
    },
    {
      id_cabang: 'CBG-002',
      nama: 'Siti Rahayu',
      whatsapp: '081234567893',
      alamat_maps: 'https://maps.app.goo.gl/def456',
    },
    {
      id_cabang: 'CBG-003',
      nama: 'Ahmad Fauzi',
      whatsapp: '081234567894',
      alamat_maps: 'https://maps.google.com/maps?q=-6.2300,107.0000',
    },
  ];

  for (const customer of customers) {
    await prisma.customer.create({
      data: customer,
    });
  }
  console.log(`   ✓ Seeded ${customers.length} customers\n`);

  // ============================================================
  // SUMMARY
  // ============================================================

  console.log('═══════════════════════════════════════════════════════');
  console.log('                    SEEDING COMPLETE!                   ');
  console.log('═══════════════════════════════════════════════════════');
  console.log('');
  console.log('📋 Owner Login Credentials:');
  console.log(`   Email:    ${OWNER_EMAIL}`);
  console.log(`   Password: ${OWNER_PASSWORD}`);
  console.log('');
  console.log('📍 5 Branches in Jabodetabek:');
  console.log('   CBG-001: Depok (Pusat)');
  console.log('   CBG-002: Jakarta Selatan');
  console.log('   CBG-003: Bekasi Timur');
  console.log('   CBG-004: Tangerang Kota');
  console.log('   CBG-005: Bogor Raya');
  console.log('');
  console.log('👥 5 Sample Customers seeded (can be selected in Outlet Reception)');
  console.log('   CBG-001: Budi Santoso, Ani Wijaya');
  console.log('   CBG-002: Dedi Kurniawan, Siti Rahayu');
  console.log('   CBG-003: Ahmad Fauzi');
  console.log('');
  console.log('═══════════════════════════════════════════════════════\n');
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
