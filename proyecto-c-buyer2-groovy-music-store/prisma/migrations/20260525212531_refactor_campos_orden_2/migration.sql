/*
  Warnings:

  - A unique constraint covering the columns `[nro_orden_usuario]` on the table `Orden` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Orden" ADD COLUMN     "nro_orden_usuario" SERIAL NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Orden_nro_orden_usuario_key" ON "Orden"("nro_orden_usuario");
