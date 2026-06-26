import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/app/lib/prisma';
import { liberarStock } from '@/app/lib/services/seller-api';

export async function GET(request: NextRequest) {
  // Protección de la ruta: verificamos que el token coincida con el guardado en Vercel
  const authHeader = request.headers.get('authorization');
  if (process.env.NODE_ENV === 'production' && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Definimos el tiempo límite razonable (15 minutos atrás)
    const tiempoLimite = new Date(Date.now() - 15 * 60 * 1000);

    // Buscamos órdenes colgadas creadas hace más de 15 minutos en estado "Procesando"
    const ordenesAbandonadas = await prisma.orden.findMany({
      where: {
        estado: 'Procesando',
        fecha: { lt: tiempoLimite } // lt: "less than" (creadas antes de esa hora)
      },
      include: { items: true }
    });

    // Procesamos cada orden olvidada una por una
    for (const orden of ordenesAbandonadas) {
      try {
        // 1. Notificamos la liberación de stock a la  Seller App
        await liberarStock({
          order_id: orden.nro_orden,
          items: orden.items.map(item => ({
            producto_id: item.producto_id,
            cantidad: item.cantidad
          }))
        });

        // 2. Buscamos el carrito del comprador local para restaurar los productos
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

          // createMany con skipDuplicates evita errores si el usuario volvió a meter el ítem a mano
          await prisma.itemCarrito.createMany({
            data: itemsParaRestaurar,
            skipDuplicates: true
          });
        }

        // 3. Modificamos el estado local de la orden a Cancelado
        await prisma.orden.update({
          where: { nro_orden: orden.nro_orden },
          data: { estado: 'Cancelado' }
        });

        console.log(`[Cleanup] Orden abandonada #${orden.nro_orden_usuario} cancelada y stock restaurado con éxito.`);
      } catch (errOrden) {
        console.error(`[Cleanup] Error procesando la limpieza de la orden ${orden.nro_orden}:`, errOrden);
      }
    }

    return NextResponse.json({ 
      success: true, 
      procesadas: ordenesAbandonadas.length, 
      mensaje: "Limpieza de fondo completada correctamente." 
    });

  } catch (error) {
    console.error("Error general en la API de limpieza:", error);
    return NextResponse.json({ error: "internal_error" }, { status: 500 });
  }
}