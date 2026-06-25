//API Control Plane
//Detalle y Modificación de una Orden

import { NextResponse } from 'next/server';
import { z } from 'zod';
import prisma from '@/app/lib/prisma';
import { EstadoOrden } from '@/app/lib/definitions'; 


const OrderUpdateSchema = z.object({
    estado: z.nativeEnum(EstadoOrden, {
        message: "El estado proporcionado no es válido"
    })
});

// GET /api/orders/:id -> Detalle de una orden
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params; 

        const orden = await prisma.orden.findUnique({
            where: { nro_orden: id },
            include: {
                items: true,
                direccion: true,
                buyer: true
            }
        });

        if (!orden) {
            return NextResponse.json({ error: "Orden no encontrada" }, { status: 404 });
        }

        return NextResponse.json({ datos: orden });
    } catch (error) {
        console.error("Error al obtener la orden:", error);
        return NextResponse.json({ error: "Error al obtener la orden" }, { status: 500 });
    }
}

// PATCH /api/orders/:id -> Cambiar estado manualmente
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const body = await request.json();
        
        const datosValidados = OrderUpdateSchema.parse(body);

        const ordenActualizada = await prisma.orden.update({
            where: { nro_orden: id },
            data: { estado: datosValidados.estado }
        });

        return NextResponse.json({
            mensaje: "Estado de orden actualizado exitosamente",
            datos: ordenActualizada
        });
    } catch (error: any) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ 
                error: "Datos inválidos", 
                detalles: error.flatten().fieldErrors 
            }, { status: 400 });
        }
        console.error("Error al actualizar la orden:", error);
        return NextResponse.json({ error: "Error interno al actualizar la orden" }, { status: 500 });
    }
}