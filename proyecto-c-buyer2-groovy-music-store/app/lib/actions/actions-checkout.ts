'use server'

import { redirect } from 'next/navigation';
import prisma from '@/app/lib/prisma';
import { z } from 'zod'; 
import { reservarStock } from '@/app/lib/services/seller-api'; 
import { EstadoOrden } from '../definitions';

const CheckoutSchema = z.object({
    sellerId: z.string().min(1, "Falta el ID del vendedor"),
    clerkId: z.string().min(1, "Falta el ID del comprador"),
    total: z.coerce.number().gt(0, "El total debe ser mayor a 0"),
    id_direccion: z.string().min(1, "Debes seleccionar una dirección de envío para continuar"),
    items: z.string().refine((val) => {
        try { 
            const parsed = JSON.parse(val);
            return Array.isArray(parsed) && parsed.length > 0; 
        } catch { 
            return false; 
        }
    }, { message: "Formato de items inválido" })
});

export async function procesarCheckout(prevState: any, formData: FormData) {
    // VALIDACIÓN DE DATOS
    const validacion = CheckoutSchema.safeParse({
        sellerId: formData.get('sellerId'),
        clerkId: formData.get('clerkId'),
        total: formData.get('total'),
        id_direccion: formData.get('id_direccion'),
        items: formData.get('items'),
    });

    if (!validacion.success) {
        return {
            success: false,
            errors: validacion.error.flatten().fieldErrors,
            message: 'Faltan campos obligatorios. Revisá tu orden antes de continuar.'
        };
    }

    const { sellerId, clerkId, total, id_direccion, items } = validacion.data;
    const itemsComprados = JSON.parse(items);

    //  CREAR LA ORDEN BASE EN LA BASE DE DATOS LOCAL
    let nuevaOrden;
    try {
        nuevaOrden = await prisma.orden.create({
            data: {
                monto: total,
                estado: EstadoOrden.PROCESANDO,
                empresa_envio: 'Logística Standard',
                id_seller: sellerId, 
                buyer: { connect: { clerk_id: clerkId } },
                direccion: { connect: { id: id_direccion } },
                items: {
                    create: itemsComprados.map((item: any) => ({
                        producto_id: item.id,
                        cantidad: item.cantidad,
                        precio_unit: item.precio
                    }))
                }
            }
        });
    } catch (error) {
        console.error("Error al crear la orden base:", error);
        return { success: false, errors: {}, message: 'Error interno al generar la orden.' };
    }

    const uuid_orden_creada = nuevaOrden.nro_orden;

    // INTENTAR RESERVAR EL STOCK EN LA API EXTERNA
    const payloadReserva = {
        order_id: uuid_orden_creada, 
        buyer_id: clerkId,
        seller_id: sellerId,
        items: itemsComprados.map((item: any) => ({
            producto_id: item.id, 
            cantidad: item.cantidad,
            precio_unit: item.precio
        }))
    };

    try {
        await reservarStock(payloadReserva);
    } catch (error: any) {
        const mensajeError = error.message || "";

        // ROLLBACK: Borramos la orden local porque falló la reserva externa
        await prisma.itemOrden.deleteMany({
            where: { nro_orden: nuevaOrden.nro_orden }
        });

        await prisma.orden.delete({
            where: { nro_orden: nuevaOrden.nro_orden }
        });

        // LIMPIEZA PARCIAL: Si el error fue por stock, sacamos solo esos productos del carrito
        if (mensajeError.includes("stock_insuficiente") || mensajeError.includes("producto_no_encontrado")) {
            const idsProductos = payloadReserva.items.map((i: any) => i.producto_id);
            
            await prisma.itemCarrito.deleteMany({
                where: { 
                    id_seller: sellerId,
                    carrito: { clerk_id: clerkId },
                    producto_id: { in: idsProductos } 
                }
            });

            return {
                success: false,
                errors: {},
                message: "Lo sentimos, uno o más productos se agotaron recién. Tu carrito se ha actualizado."
            };
        }
        
        return { success: false, errors: {}, message: mensajeError || 'Error al reservar el stock.' };
    }

    // La reserva fue exitosa, vaciamos todo el carrito del vendedor
    try {
        await prisma.itemCarrito.deleteMany({
            where: { id_seller: sellerId, carrito: { clerk_id: clerkId } }
        });
    } catch (error) {
        console.error("Error no crítico: no se pudo vaciar el carrito post-reserva", error);
    }

    // REDIRIGIR AL PAGO 
    redirect(`/checkout/pago/${uuid_orden_creada}`);
}