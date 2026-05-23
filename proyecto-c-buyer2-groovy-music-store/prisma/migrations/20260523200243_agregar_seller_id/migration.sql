/*
  Warnings:

  - Added the required column `id_seller` to the `ItemCarrito` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ItemCarrito" ADD COLUMN     "id_seller" TEXT NOT NULL;
