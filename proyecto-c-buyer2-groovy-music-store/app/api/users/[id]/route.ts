//API Control Plane
//Modificación de Estado (Activar/Desactivar Comprador)
import { NextResponse } from 'next/server';
import { z } from 'zod';
import prisma from '@/app/lib/prisma';


const UserStatusSchema = z.object({
    activo: z.boolean({
        message: "El campo 'activo' es obligatorio y debe ser true o false"
    })
});


export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        
        const body = await request.json();
        const datosValidados = UserStatusSchema.parse(body);

        const usuarioActualizado = await prisma.usuario.update({
            where: { clerk_id: id },
            data: { 
                activo: datosValidados.activo 
            }
        });

        return NextResponse.json({
            mensaje: datosValidados.activo ? "Usuario activado con éxito" : "Usuario desactivado con éxito",
            datos: usuarioActualizado
        });
    } catch (error: any) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ 
                error: "Datos inválidos", 
                detalles: error.flatten().fieldErrors 
            }, { status: 400 });
        }
        console.error("Error al actualizar comprador:", error);
        return NextResponse.json({ error: "Error interno al actualizar estado del comprador" }, { status: 500 });
    }
}