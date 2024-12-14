-- CreateEnum
CREATE TYPE "DeliveryType" AS ENUM ('INCOMING', 'OUTGOING');

-- CreateEnum
CREATE TYPE "DeliveryStatus" AS ENUM ('SCHEDULED', 'LOADING', 'IN_TRANSIT', 'DELIVERED', 'SHIPPED', 'CANCELED', 'UNRESOLVED');

-- CreateTable
CREATE TABLE "batch_deliveries" (
    "delivery_id" TEXT NOT NULL,
    "batch_id" TEXT NOT NULL,

    CONSTRAINT "batch_deliveries_pkey" PRIMARY KEY ("delivery_id","batch_id")
);

-- CreateTable
CREATE TABLE "deliveries" (
    "id" TEXT NOT NULL,
    "type" "DeliveryType" NOT NULL,
    "status" "DeliveryStatus" NOT NULL,
    "scheduledAt" TIMESTAMP(3) NOT NULL,
    "completedAt" TIMESTAMP(3),
    "description" VARCHAR(1000),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "deliveries_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "batch_deliveries_batch_id_key" ON "batch_deliveries"("batch_id");

-- CreateIndex
CREATE UNIQUE INDEX "batch_deliveries_delivery_id_batch_id_key" ON "batch_deliveries"("delivery_id", "batch_id");

-- AddForeignKey
ALTER TABLE "batch_deliveries" ADD CONSTRAINT "batch_deliveries_delivery_id_fkey" FOREIGN KEY ("delivery_id") REFERENCES "deliveries"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "batch_deliveries" ADD CONSTRAINT "batch_deliveries_batch_id_fkey" FOREIGN KEY ("batch_id") REFERENCES "batches"("id") ON DELETE CASCADE ON UPDATE CASCADE;
