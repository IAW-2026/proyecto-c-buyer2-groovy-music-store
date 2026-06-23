'use server'

import { redirect } from 'next/navigation';
import prisma from '@/app/lib/prisma';
import { z } from 'zod';
import { auth } from '@clerk/nextjs/server'; 
import { reservarStock } from '@/app/lib/services/seller-api'; 

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
    // 1. Autenticación y Validación 
    const { getToken } = await auth();
    const token = await getToken();

    if (!token) {
        return { success: false, errors: {}, message: 'Error de autenticación.' };
    }
    
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

    // 2. CREAR LA ORDEN PRIMERO 
    let nuevaOrden;
    try {
        nuevaOrden = await prisma.orden.create({
            data: {
                monto: total,
                estado: 'Procesando', // Estado inicial
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

    const idOrdenReal = nuevaOrden.nro_orden_usuario.toString();

    // 3. PREPARAR PAYLOAD CON EL ID Y LLAMAR A LA API
    const payloadReserva = {
        order_id: idOrdenReal, 
        buyer_id: clerkId,
        seller_id: sellerId,
        items: itemsComprados.map((item: any) => ({
            producto_id: item.id, 
            cantidad: item.cantidad
        }))
    };

    try {
        await reservarStock(payloadReserva, token);
    } catch (error: any) {
        const mensajeError = error.message || "";

        // Si la reserva falla (por cualquier motivo), deshacemos la creación de la orden
        await prisma.orden.delete({
            where: { nro_orden: nuevaOrden.nro_orden }
        });

        // Si el fallo fue por falta de stock, además limpiamos el carrito
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

    // 4.  Limpiamos el carrito 
    try {
        await prisma.itemCarrito.deleteMany({
            where: { id_seller: sellerId, carrito: { clerk_id: clerkId } }
        });
    } catch (error) {
        console.error("Error no crítico: no se pudo vaciar el carrito post-reserva", error);
    }

    // 5. REDIRIGIR AL PAGO
    redirect(`/checkout/pago/${idOrdenReal}`);
}