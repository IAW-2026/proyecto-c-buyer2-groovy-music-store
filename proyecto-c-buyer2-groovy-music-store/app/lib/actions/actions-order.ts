
"use server"; 


import prisma from '@/app/lib/prisma'; 

export async function checkOrderStatus(ordenId: string) {
    try {
        /* // Código real usando Prisma:
        const orden = await prisma.orden.findUnique({
            where: { nro_orden_usuario: ordenId },
            select: { estado: true }
        });
        return orden?.estado; 
        */

        // Por ahora devolvemos un mock
        return "Pagado"; 
    } catch (error) {
        console.error("Error consultando Prisma:", error);
        return null;
    }
}

export async function getUserOrders(clerkId: string) {
    try {
        const orders = await prisma.orden.findMany({
            where: {
                id_buyer: clerkId
            },
            include : {
                direccion:true
            },
            orderBy: {
                fecha: 'desc'
            }
        });
        return orders;
    } catch (error) {
        console.error("Error al buscar las ordenes:", error);
        return [];
    }
}


export async function getOrderByUUID(ordenId: string) {
    try {
        const orden = await prisma.orden.findUnique({
            where: { nro_orden: ordenId }, 
            select: {
                id_buyer: true,  
                id_seller: true,
                monto: true,
                nro_orden_usuario: true, 
            }
        });

        return orden;
    } catch (error) {
        console.error("Error al buscar la orden en Prisma:", error);
        return null;
    }
}

export async function getUuidDeOrden(displayId: string | number) {
    const orden = await prisma.orden.findUnique({
        where: { nro_orden_usuario: Number(displayId) }, 
        select: { nro_orden: true } 
    });
    
    return orden?.nro_orden || null;
}