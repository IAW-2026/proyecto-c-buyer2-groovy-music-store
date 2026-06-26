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
  let ordenId: string | undefined;

  try {
    const body = await request.json();
    const validation = UpdateOrderSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ error: 'bad_request', detalles: validation.error.format() }, { status: 400 });
    }

    ordenId = validation.data.ordenId;
    const { estado } = validation.data;

    let nuevoEstadoInterno: EstadoOrden;
    if (estado === 'aprobado') nuevoEstadoInterno = EstadoOrden.PAGO_APROBADO;
    else if (estado === 'rechazado') nuevoEstadoInterno = EstadoOrden.PAGO_RECHAZADO;
    else if (estado === 'cancelado') nuevoEstadoInterno = EstadoOrden.CANCELADO;
    else nuevoEstadoInterno = EstadoOrden.PROCESANDO;

    // Update atómico: evita concurrencia actualizando solo si sigue en PROCESANDO
    const transaccion = await prisma.orden.updateMany({
      where: { 
        nro_orden: ordenId,
        estado: EstadoOrden.PROCESANDO 
      },
      data: { 
        estado: nuevoEstadoInterno 
      }
    });

    // Idempotencia: corta la ejecución si otro webhook ya actualizó la orden
    if (transaccion.count === 0) {
      console.log(`Idempotencia: Webhook ignorado para orden ${ordenId}.`);
      return NextResponse.json({ 
        estado: 'ya_procesada', 
        mensaje: 'La orden ya está siendo procesada por otro evento' 
      }, { status: 200 }); 
    }

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

    // 1. CASO: PAGO APROBADO -> Llamamos a la función de seller-api
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
    console.error("Error en API de actualización de orden:", error);
    
    // Rollback: si falla la API del Seller, revertimos a PROCESANDO para permitir reintentos
    if (ordenId) {
      try {
        await prisma.orden.update({
          where: { nro_orden: ordenId },
          data: { estado: EstadoOrden.PROCESANDO }
        });
      } catch (rollbackError) {
        console.error("Error al intentar revertir el estado:", rollbackError);
      }
    }

    return NextResponse.json({ error: 'internal_error', mensaje: error.message || 'Error interno del servidor' }, { status: 500 });
  }
}