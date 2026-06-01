'use server'

import { redirect } from 'next/navigation';
import prisma from '@/app/lib/prisma';
import { z } from 'zod';


const CheckoutSchema = z.object({
    sellerId: z.string().min(1, "Falta el ID del vendedor"),
    clerkId: z.string().min(1, "Falta el ID del comprador"),
    total: z.coerce.number().gt(0, "El total debe ser mayor a 0"),
    id_direccion: z.string().min(1, "Debes seleccionar una dirección de envío para continuar"),
    
    // Verificamos que el JSON de items no venga roto ni vacío
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
    
    let idRedirect = "";

    try {
        // Transacción intacta para mantener la integridad
        const nuevaOrden = await prisma.$transaction(async (tx) => {
            const orden = await tx.orden.create({
                data: {
                    monto: total,
                    estado: 'Pendiente de envio',
                    empresa_envio: 'Logística Standard',
                    
                    id_seller: sellerId, 
                    
                    buyer: {
                        connect: { clerk_id: clerkId }
                    },
                    
                    direccion: {
                        connect: { id: id_direccion }
                    },
                    
                    items: {
                        create: itemsComprados.map((item: any) => ({
                            producto_id: item.id,
                            cantidad: item.cantidad,
                            precio_unit: item.precio
                        }))
                    }
                }
            });

            await tx.itemCarrito.deleteMany({
                where: { id_seller: sellerId, carrito: { clerk_id: clerkId } }
            });

            return orden;
        });

        // Guardamos el ID para usarlo fuera del try/catch
        idRedirect = nuevaOrden.nro_orden_usuario.toString();

    } catch (error) {
        console.error("Error al procesar el checkout en Prisma:", error);
        return { 
            success: false, 
            errors: {}, 
            message: 'Hubo un error interno al crear la orden. Intentá nuevamente.' 
        };
    }

    //  Redirigimos de forma segura fuera del bloque try/catch
    redirect(`/checkout/pago/${idRedirect}`);
}