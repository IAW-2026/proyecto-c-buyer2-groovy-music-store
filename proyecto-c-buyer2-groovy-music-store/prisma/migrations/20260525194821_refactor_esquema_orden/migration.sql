/*
  Warnings:

  - You are about to drop the column `id_carrito` on the `Orden` table. All the data in the column will be lost.
  - You are about to drop the column `producto_id` on the `Orden` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Orden" DROP CONSTRAINT "Orden_id_carrito_producto_id_fkey";

-- DropForeignKey
ALTER TABLE "Orden" DROP CONSTRAINT "Orden_id_seller_fkey";

-- AlterTable
ALTER TABLE "Orden" DROP COLUMN "id_carrito",
DROP COLUMN "producto_id";

-- CreateTable
CREATE TABLE "ItemOrden" (
    "id_item_orden" UUID NOT NULL,
    "nro_orden" UUID NOT NULL,
    "producto_id" UUID NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "precio_unit" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "ItemOrden_pkey" PRIMARY KEY ("id_item_orden")
);

-- AddForeignKey
ALTER TABLE "ItemOrden" ADD CONSTRAINT "ItemOrden_nro_orden_fkey" FOREIGN KEY ("nro_orden") REFERENCES "Orden"("nro_orden") ON DELETE RESTRICT ON UPDATE CASCADE;
