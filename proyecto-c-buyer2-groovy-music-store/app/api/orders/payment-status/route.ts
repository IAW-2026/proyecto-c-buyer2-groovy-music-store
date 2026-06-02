import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/app/lib/prisma';
import { z } from 'zod';

// Definimos el esquema de validación
const UpdateOrderSchema = z.object({
  ordenId: z.string().uuid("El ID debe ser un UUID válido"),
  estado: z.enum([
    'Pendiente de envio', 
    'En camino', 
    'Entregado', 
    'Cancelado', 
    'Pagado'
  ]),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    
    const validation = UpdateOrderSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: 'bad_request', detalles: validation.error.format() }, 
        { status: 400 }
      );
    }

    const { ordenId, estado } = validation.data;

    
    await prisma.orden.update({
      where: { nro_orden: ordenId },
      data: { estado: estado },
    });

    return NextResponse.json({ 
      estado: 'orden_actualizada', 
      mensaje: `Estado de orden actualizado a ${estado}` 
    });

  } catch (error: any) {
    // Error P2025: Prisma no encontró el registro
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'not_found', mensaje: 'La orden no existe' }, 
        { status: 404 }
      );
    }
    
    console.error("Error en API de actualización de orden:", error);
    return NextResponse.json(
      { error: 'internal_error', mensaje: 'Error interno del servidor' }, 
      { status: 500 }
    );
  }
}