-- CreateTable
CREATE TABLE "Usuario" (
    "clerk_id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "mail" TEXT NOT NULL,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("clerk_id")
);

-- CreateTable
CREATE TABLE "Direccion" (
    "id" SERIAL NOT NULL,
    "calle" TEXT NOT NULL,
    "ciudad" TEXT NOT NULL,
    "provincia" TEXT NOT NULL,
    "cod_postal" TEXT NOT NULL,
    "pais" TEXT NOT NULL,
    "clerk_id" TEXT NOT NULL,

    CONSTRAINT "Direccion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Carrito" (
    "id_carrito" SERIAL NOT NULL,
    "clerk_id" TEXT NOT NULL,
    "producto_id" INTEGER,

    CONSTRAINT "Carrito_pkey" PRIMARY KEY ("id_carrito")
);

-- CreateTable
CREATE TABLE "ItemCarrito" (
    "producto_id" INTEGER NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "id_carrito" INTEGER NOT NULL,

    CONSTRAINT "ItemCarrito_pkey" PRIMARY KEY ("id_carrito","producto_id")
);

-- CreateTable
CREATE TABLE "Orden" (
    "nro_orden" SERIAL NOT NULL,
    "monto" DOUBLE PRECISION NOT NULL,
    "estado" TEXT NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "empresa_envio" TEXT NOT NULL,
    "id_buyer" TEXT NOT NULL,
    "id_seller" TEXT NOT NULL,
    "id_direccion" INTEGER NOT NULL,
    "id_carrito" INTEGER NOT NULL,
    "producto_id" INTEGER NOT NULL,

    CONSTRAINT "Orden_pkey" PRIMARY KEY ("nro_orden")
);

-- AddForeignKey
ALTER TABLE "Direccion" ADD CONSTRAINT "Direccion_clerk_id_fkey" FOREIGN KEY ("clerk_id") REFERENCES "Usuario"("clerk_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Carrito" ADD CONSTRAINT "Carrito_clerk_id_fkey" FOREIGN KEY ("clerk_id") REFERENCES "Usuario"("clerk_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItemCarrito" ADD CONSTRAINT "ItemCarrito_id_carrito_fkey" FOREIGN KEY ("id_carrito") REFERENCES "Carrito"("id_carrito") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Orden" ADD CONSTRAINT "Orden_id_buyer_fkey" FOREIGN KEY ("id_buyer") REFERENCES "Usuario"("clerk_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Orden" ADD CONSTRAINT "Orden_id_seller_fkey" FOREIGN KEY ("id_seller") REFERENCES "Usuario"("clerk_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Orden" ADD CONSTRAINT "Orden_id_direccion_fkey" FOREIGN KEY ("id_direccion") REFERENCES "Direccion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Orden" ADD CONSTRAINT "Orden_id_carrito_producto_id_fkey" FOREIGN KEY ("id_carrito", "producto_id") REFERENCES "ItemCarrito"("id_carrito", "producto_id") ON DELETE RESTRICT ON UPDATE CASCADE;
