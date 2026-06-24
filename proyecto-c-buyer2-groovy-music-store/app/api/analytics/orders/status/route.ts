import { NextResponse } from 'next/server';
import prisma from '@/app/lib/prisma';
import { z } from 'zod';

const querySchema = z.object({
  desde: z.string().datetime().optional(),
  hasta: z.string().datetime().optional(),
});

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const queryValidation = querySchema.safeParse({
      desde: searchParams.get('desde') || undefined,
      hasta: searchParams.get('hasta') || undefined,
    });

    if (!queryValidation.success) {
      return NextResponse.json(
        { error: "bad_request", mensaje: "Parámetros inválidos", detalles: queryValidation.error.format() },
        { status: 400 }
      );
    }

    const { desde, hasta } = queryValidation.data;

    const whereClause: any = {};
    if (desde || hasta) {
      whereClause.fecha = {};
      if (desde) whereClause.fecha.gte = new Date(desde);
      if (hasta) whereClause.fecha.lte = new Date(hasta);
    }

    //  COUNT agrupando por la columna 'estado'
    const ordenesPorEstado = await prisma.orden.groupBy({
      by: ['estado'],
      _count: { estado: true },
      where: whereClause,
    });

    
    const resultado = ordenesPorEstado.reduce((acc, curr) => {
      acc[curr.estado] = curr._count.estado;
      return acc;
    }, {} as Record<string, number>);

    return NextResponse.json(resultado);

  } catch (error) {
    console.error("Error en /api/analytics/orders/status:", error);
    return NextResponse.json(
      { error: "internal_error", mensaje: "Error al agrupar estados de órdenes" },
      { status: 500 }
    );
  }
}