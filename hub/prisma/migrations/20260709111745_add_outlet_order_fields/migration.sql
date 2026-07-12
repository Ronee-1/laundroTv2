-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "qty" DOUBLE PRECISION,
ADD COLUMN     "satuan" TEXT,
ADD COLUMN     "service_name" TEXT;

-- CreateIndex
CREATE INDEX "orders_source_idx" ON "orders"("source");
