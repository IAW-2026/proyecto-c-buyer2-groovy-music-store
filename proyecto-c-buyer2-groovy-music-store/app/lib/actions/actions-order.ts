
"use server"; 


// import prisma from '@/lib/prisma'; 

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