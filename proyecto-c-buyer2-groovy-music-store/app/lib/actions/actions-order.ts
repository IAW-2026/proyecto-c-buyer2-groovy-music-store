
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