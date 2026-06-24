import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/app/lib/prisma';
import { z } from 'zod';
import { EstadoOrden } from '@/app/lib/definitions';
import { confirmarOrden, liberarStock } from '@/app/lib/services/seller-api'; 

const UpdateOrderSchema = z.object({
  ordenId: z.string().uuid("El ID debe ser un UUID válido"),
  estado: z.enum(['pendiente', 'aprobado', 'rechazado', 'cancelado']), 
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = UpdateOrderSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ error: 'bad_request', detalles: validation.error.format() }, { status: 400 });
    }

    const { ordenId, estado } = validation.data;

    // Buscamos la orden 
    const orden = await prisma.orden.findUnique({
      where: { nro_orden: ordenId },
      include: { 
        items: true,
        direccion: true 
      }
    });

    if (!orden) {
      return NextResponse.json({ error: 'not_found', mensaje: 'La orden no existe' }, { status: 404 });
    }

    // Mapeo de estados internos del Enum
    let nuevoEstadoInterno: EstadoOrden;
    if (estado === 'aprobado') nuevoEstadoInterno = EstadoOrden.PAGO_APROBADO;
    else if (estado === 'rechazado') nuevoEstadoInterno = EstadoOrden.PAGO_RECHAZADO;
    else if (estado === 'cancelado') nuevoEstadoInterno = EstadoOrden.CANCELADO;
    else nuevoEstadoInterno = EstadoOrden.PROCESANDO;

    // 1. CASO: PAGO APROBADO -> Llamamos a la función de  seller-api
    if (estado === 'aprobado') {
      await confirmarOrden({
        order_id: orden.nro_orden,
        buyer_id: orden.id_buyer,
        seller_id: orden.id_seller,
        items: orden.items.map(item => ({
          producto_id: item.producto_id,
          cantidad: item.cantidad,
          precio_unit: item.precio_unit
        })),
        direccion_envio: {
          calle: orden.direccion.calle,
          ciudad: orden.direccion.ciudad,
          provincia: orden.direccion.provincia,
          cod_postal: orden.direccion.cod_postal,
          pais: orden.direccion.pais
        }
      });

      // Si la función no lanzó error, actualizamos el estado local de la orden
      await prisma.orden.update({
        where: { nro_orden: ordenId },
        data: { estado: nuevoEstadoInterno },
      });
    }

    // 2. CASO: PAGO RECHAZADO O CANCELADO -> Liberamos stock externo y restauramos carrito
    if (estado === 'rechazado' || estado === 'cancelado') {
      await liberarStock({
        order_id: orden.nro_orden,
        items: orden.items.map(item => ({
          producto_id: item.producto_id,
          cantidad: item.cantidad
        }))
      });

      // Modificamos el estado en tu base de datos
      await prisma.orden.update({
        where: { nro_orden: ordenId },
        data: { estado: nuevoEstadoInterno },
      });

      // Restauramos los ítems en el carrito usando prisma
      const carritoUsuario = await prisma.carrito.findFirst({
        where: { clerk_id: orden.id_buyer }
      });

      if (carritoUsuario) {
        const itemsParaRestaurar = orden.items.map(item => ({
          id_carrito: carritoUsuario.id_carrito,
          producto_id: item.producto_id,
          cantidad: item.cantidad,
          id_seller: orden.id_seller
        }));

        await prisma.itemCarrito.createMany({
          data: itemsParaRestaurar,
          skipDuplicates: true
        });
      }
    }

    return NextResponse.json({ 
      estado: 'orden_actualizada', 
      mensaje: `Estado de orden actualizado a ${estado}` 
    });

  } catch (error: any) {
    console.error("Error en  API de actualización de orden:", error);
    return NextResponse.json({ error: 'internal_error', mensaje: error.message || 'Error interno del servidor' }, { status: 500 });
  }
}