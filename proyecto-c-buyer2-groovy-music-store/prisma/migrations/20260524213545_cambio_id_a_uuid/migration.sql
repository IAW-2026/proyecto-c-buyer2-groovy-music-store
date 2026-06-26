/*
  Warnings:

  - The primary key for the `Carrito` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `producto_id` column on the `Carrito` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `Direccion` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `ItemCarrito` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Orden` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Changed the type of `id_carrito` on the `Carrito` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `id` on the `Direccion` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `producto_id` on the `ItemCarrito` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `id_carrito` on the `ItemCarrito` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `nro_orden` on the `Orden` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `id_direccion` on the `Orden` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `id_carrito` on the `Orden` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `producto_id` on the `Orden` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "ItemCarrito" DROP CONSTRAINT "ItemCarrito_id_carrito_fkey";

-- DropForeignKey
ALTER TABLE "Orden" DROP CONSTRAINT "Orden_id_carrito_producto_id_fkey";

-- DropForeignKey
ALTER TABLE "Orden" DROP CONSTRAINT "Orden_id_direccion_fkey";

-- AlterTable
ALTER TABLE "Carrito" DROP CONSTRAINT "Carrito_pkey",
DROP COLUMN "id_carrito",
ADD COLUMN     "id_carrito" UUID NOT NULL,
DROP COLUMN "producto_id",
ADD COLUMN     "producto_id" UUID,
ADD CONSTRAINT "Carrito_pkey" PRIMARY KEY ("id_carrito");

-- AlterTable
ALTER TABLE "Direccion" DROP CONSTRAINT "Direccion_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL,
ADD CONSTRAINT "Direccion_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "ItemCarrito" DROP CONSTRAINT "ItemCarrito_pkey",
DROP COLUMN "producto_id",
ADD COLUMN     "producto_id" UUID NOT NULL,
DROP COLUMN "id_carrito",
ADD COLUMN     "id_carrito" UUID NOT NULL,
ADD CONSTRAINT "ItemCarrito_pkey" PRIMARY KEY ("id_carrito", "producto_id");

-- AlterTable
ALTER TABLE "Orden" DROP CONSTRAINT "Orden_pkey",
DROP COLUMN "nro_orden",
ADD COLUMN     "nro_orden" UUID NOT NULL,
DROP COLUMN "id_direccion",
ADD COLUMN     "id_direccion" UUID NOT NULL,
DROP COLUMN "id_carrito",
ADD COLUMN     "id_carrito" UUID NOT NULL,
DROP COLUMN "producto_id",
ADD COLUMN     "producto_id" UUID NOT NULL,
ADD CONSTRAINT "Orden_pkey" PRIMARY KEY ("nro_orden");

-- AddForeignKey
ALTER TABLE "ItemCarrito" ADD CONSTRAINT "ItemCarrito_id_carrito_fkey" FOREIGN KEY ("id_carrito") REFERENCES "Carrito"("id_carrito") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Orden" ADD CONSTRAINT "Orden_id_direccion_fkey" FOREIGN KEY ("id_direccion") REFERENCES "Direccion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Orden" ADD CONSTRAINT "Orden_id_carrito_producto_id_fkey" FOREIGN KEY ("id_carrito", "producto_id") REFERENCES "ItemCarrito"("id_carrito", "producto_id") ON DELETE RESTRICT ON UPDATE CASCADE;
