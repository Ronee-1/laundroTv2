-- CreateTable
CREATE TABLE "branches" (
    "id_cabang" TEXT NOT NULL,
    "nama_cabang" TEXT NOT NULL,
    "alamat" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "kuota_harian" INTEGER NOT NULL DEFAULT 30,
    "kuota_terpakai" INTEGER NOT NULL DEFAULT 0,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "omzet" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "wilayah" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "branches_pkey" PRIMARY KEY ("id_cabang")
);

-- CreateTable
CREATE TABLE "cash_book_entries" (
    "id_jurnal" TEXT NOT NULL,
    "id_cabang" TEXT NOT NULL,
    "id_transaksi" TEXT NOT NULL,
    "nominal" DOUBLE PRECISION NOT NULL,
    "tipe" TEXT NOT NULL,
    "deskripsi" TEXT NOT NULL,
    "tanggal_jurnal" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "cash_book_entries_pkey" PRIMARY KEY ("id_jurnal")
);

-- CreateTable
CREATE TABLE "couriers" (
    "id_kurir" TEXT NOT NULL,
    "id_cabang" TEXT NOT NULL,
    "nama_kurir" TEXT NOT NULL,
    "nomor_telepon" TEXT NOT NULL,
    "is_available" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "couriers_pkey" PRIMARY KEY ("id_kurir")
);

-- CreateTable
CREATE TABLE "orders" (
    "id_order" TEXT NOT NULL,
    "id_cabang" TEXT NOT NULL,
    "id_pelanggan" TEXT NOT NULL,
    "id_kurir" TEXT,
    "alamat_penjemputan" TEXT NOT NULL,
    "alamat_pengantaran" TEXT NOT NULL,
    "latitude_penjemputan" DOUBLE PRECISION NOT NULL,
    "longitude_penjemputan" DOUBLE PRECISION NOT NULL,
    "latitude_pengantaran" DOUBLE PRECISION NOT NULL,
    "longitude_pengantaran" DOUBLE PRECISION NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Pending',
    "catatan" TEXT,
    "berat_kg" DOUBLE PRECISION,
    "total_harga" DOUBLE PRECISION,
    "tanggal_order" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "tanggal_selesai" TIMESTAMP(3),
    "customer_name" TEXT,
    "customer_whatsapp" TEXT,
    "service_type" TEXT,
    "wilayah" TEXT,
    "google_maps_url" TEXT,
    "source" TEXT,
    "assigned_by" TEXT,
    "assigned_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "orders_pkey" PRIMARY KEY ("id_order")
);

-- CreateTable
CREATE TABLE "expenses" (
    "id_expense" TEXT NOT NULL,
    "id_cabang" TEXT NOT NULL,
    "tanggal" TIMESTAMP(3) NOT NULL,
    "nominal" DOUBLE PRECISION NOT NULL,
    "deskripsi" TEXT NOT NULL,
    "kategori" TEXT NOT NULL,
    "bukti_nota_url" TEXT NOT NULL DEFAULT '',
    "status" TEXT NOT NULL DEFAULT 'Pending',
    "tanggal_pengajuan" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "tanggal_approval" TIMESTAMP(3),
    "catatan_approval" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "expenses_pkey" PRIMARY KEY ("id_expense")
);

-- CreateTable
CREATE TABLE "monthly_budgets" (
    "id" TEXT NOT NULL,
    "id_cabang" TEXT NOT NULL,
    "bulan" TEXT NOT NULL,
    "tahun" INTEGER NOT NULL,
    "pagu_anggaran" DOUBLE PRECISION NOT NULL,
    "terpakai" DOUBLE PRECISION NOT NULL DEFAULT 0,

    CONSTRAINT "monthly_budgets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inventory_items" (
    "id" TEXT NOT NULL,
    "id_cabang" TEXT NOT NULL,
    "item" TEXT NOT NULL,
    "satuan" TEXT NOT NULL,
    "stok_saat_ini" INTEGER NOT NULL,
    "safety_threshold" INTEGER NOT NULL,
    "max_capacity" INTEGER NOT NULL,

    CONSTRAINT "inventory_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reconciliation_logs" (
    "id_rekonsiliasi" TEXT NOT NULL,
    "id_cabang" TEXT NOT NULL,
    "tanggal" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "kas_digital" DOUBLE PRECISION NOT NULL,
    "kas_fisik" DOUBLE PRECISION NOT NULL,
    "selisih" DOUBLE PRECISION NOT NULL,
    "status" TEXT NOT NULL,
    "approval_status" TEXT NOT NULL DEFAULT 'Pending',
    "catatan" TEXT,
    "catatan_owner" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "reconciliation_logs_pkey" PRIMARY KEY ("id_rekonsiliasi")
);

-- CreateTable
CREATE TABLE "restock_requests" (
    "id_request" TEXT NOT NULL,
    "id_cabang" TEXT NOT NULL,
    "nama_cabang" TEXT NOT NULL,
    "created_by" TEXT NOT NULL,
    "requested_items" JSONB NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Pending',
    "catatan" TEXT,
    "reviewed_by" TEXT,
    "reviewed_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "restock_requests_pkey" PRIMARY KEY ("id_request")
);

-- CreateTable
CREATE TABLE "logistics_logs" (
    "id" TEXT NOT NULL,
    "id_cabang" TEXT NOT NULL,
    "sent_items" JSONB NOT NULL,
    "received_items" JSONB,
    "discrepancy" JSONB,
    "status" TEXT NOT NULL DEFAULT 'In-Transit',
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "logistics_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "service_tariffs" (
    "id_layanan" TEXT NOT NULL,
    "nama_layanan" TEXT NOT NULL,
    "kategori" TEXT NOT NULL,
    "satuan" TEXT NOT NULL,
    "harga_per_satuan" DOUBLE PRECISION NOT NULL,
    "estimasi_hari" INTEGER NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "service_tariffs_pkey" PRIMARY KEY ("id_layanan")
);

-- CreateTable
CREATE TABLE "expense_categories" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "expense_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "courier_task_sequences" (
    "id" TEXT NOT NULL,
    "id_kurir" TEXT NOT NULL,
    "id_order" TEXT NOT NULL,
    "urutan" INTEGER NOT NULL,

    CONSTRAINT "courier_task_sequences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inventory_anomalies" (
    "id" TEXT NOT NULL,
    "id_cabang" TEXT NOT NULL,
    "nama_cabang" TEXT NOT NULL,
    "item" TEXT NOT NULL,
    "stok_lama" INTEGER NOT NULL,
    "stok_baru" INTEGER NOT NULL,
    "alasan" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "inventory_anomalies_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "cash_book_entries_id_cabang_idx" ON "cash_book_entries"("id_cabang");

-- CreateIndex
CREATE INDEX "couriers_id_cabang_idx" ON "couriers"("id_cabang");

-- CreateIndex
CREATE INDEX "orders_id_cabang_idx" ON "orders"("id_cabang");

-- CreateIndex
CREATE INDEX "orders_id_kurir_idx" ON "orders"("id_kurir");

-- CreateIndex
CREATE INDEX "expenses_id_cabang_idx" ON "expenses"("id_cabang");

-- CreateIndex
CREATE INDEX "monthly_budgets_id_cabang_idx" ON "monthly_budgets"("id_cabang");

-- CreateIndex
CREATE UNIQUE INDEX "monthly_budgets_id_cabang_bulan_tahun_key" ON "monthly_budgets"("id_cabang", "bulan", "tahun");

-- CreateIndex
CREATE INDEX "inventory_items_id_cabang_idx" ON "inventory_items"("id_cabang");

-- CreateIndex
CREATE UNIQUE INDEX "inventory_items_id_cabang_item_key" ON "inventory_items"("id_cabang", "item");

-- CreateIndex
CREATE INDEX "reconciliation_logs_id_cabang_idx" ON "reconciliation_logs"("id_cabang");

-- CreateIndex
CREATE INDEX "restock_requests_id_cabang_idx" ON "restock_requests"("id_cabang");

-- CreateIndex
CREATE INDEX "logistics_logs_id_cabang_idx" ON "logistics_logs"("id_cabang");

-- CreateIndex
CREATE UNIQUE INDEX "expense_categories_name_key" ON "expense_categories"("name");

-- CreateIndex
CREATE INDEX "courier_task_sequences_id_kurir_idx" ON "courier_task_sequences"("id_kurir");

-- CreateIndex
CREATE UNIQUE INDEX "courier_task_sequences_id_kurir_id_order_key" ON "courier_task_sequences"("id_kurir", "id_order");

-- AddForeignKey
ALTER TABLE "cash_book_entries" ADD CONSTRAINT "cash_book_entries_id_cabang_fkey" FOREIGN KEY ("id_cabang") REFERENCES "branches"("id_cabang") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "couriers" ADD CONSTRAINT "couriers_id_cabang_fkey" FOREIGN KEY ("id_cabang") REFERENCES "branches"("id_cabang") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_id_cabang_fkey" FOREIGN KEY ("id_cabang") REFERENCES "branches"("id_cabang") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_id_kurir_fkey" FOREIGN KEY ("id_kurir") REFERENCES "couriers"("id_kurir") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "expenses" ADD CONSTRAINT "expenses_id_cabang_fkey" FOREIGN KEY ("id_cabang") REFERENCES "branches"("id_cabang") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "monthly_budgets" ADD CONSTRAINT "monthly_budgets_id_cabang_fkey" FOREIGN KEY ("id_cabang") REFERENCES "branches"("id_cabang") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_items" ADD CONSTRAINT "inventory_items_id_cabang_fkey" FOREIGN KEY ("id_cabang") REFERENCES "branches"("id_cabang") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reconciliation_logs" ADD CONSTRAINT "reconciliation_logs_id_cabang_fkey" FOREIGN KEY ("id_cabang") REFERENCES "branches"("id_cabang") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "restock_requests" ADD CONSTRAINT "restock_requests_id_cabang_fkey" FOREIGN KEY ("id_cabang") REFERENCES "branches"("id_cabang") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "logistics_logs" ADD CONSTRAINT "logistics_logs_id_cabang_fkey" FOREIGN KEY ("id_cabang") REFERENCES "branches"("id_cabang") ON DELETE RESTRICT ON UPDATE CASCADE;
