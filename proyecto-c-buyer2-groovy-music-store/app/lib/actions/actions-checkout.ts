'use server'

import { redirect } from 'next/navigation';
import prisma from '@/app/lib/prisma';

export async function procesarCheckout(formData: FormData) {
    const sellerId = formData.get('sellerId') as string;
    const clerkId = formData.get('clerkId') as string;
    const total = parseFloat(formData.get('total') as string);
    const idDireccion = formData.get('id_direccion') as string;
    const itemsComprados = JSON.parse(formData.get('items') as string);


    //se usa transaction para integridad de los datos
    const nuevaOrden = await prisma.$transaction(async (tx) => {
        const orden = await tx.orden.create({
            data: {
                //datos mockeados, acomodarlos
                monto: total,
                estado: 'PENDIENTE',
                empresa_envio: 'Logística Standard',
                
                id_seller: sellerId, 
                
                buyer: {
                    connect: { clerk_id: clerkId }
                },
                
                direccion: {
                    connect: { id: idDireccion }
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

    // Redirigimos usando el número amigable (nro_orden_usuario)
    redirect('/checkout/pago');
}