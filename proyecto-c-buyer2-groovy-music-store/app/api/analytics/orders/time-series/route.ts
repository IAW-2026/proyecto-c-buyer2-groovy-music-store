import { NextResponse } from 'next/server';
import prisma from '@/app/lib/prisma';
import { z } from 'zod';

const querySchema = z.object({
  fecha_desde: z.string().datetime().optional(),
  fecha_hasta: z.string().datetime().optional(),
  // Validamos que el intervalo solo pueda ser 'dia' o 'mes', por defecto 'dia'
  intervalo: z.enum(['dia', 'mes']).default('dia'), 
});

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const queryValidation = querySchema.safeParse({
      fecha_desde: searchParams.get('fecha_desde') || undefined,
      fecha_hasta: searchParams.get('fecha_hasta') || undefined,
      intervalo: searchParams.get('intervalo') || undefined,
    });

    if (!queryValidation.success) {
      return NextResponse.json(
        { error: "bad_request", mensaje: "Parámetros inválidos", detalles: queryValidation.error.format() },
        { status: 400 }
      );
    }

    const { fecha_desde, fecha_hasta, intervalo } = queryValidation.data;

    const whereClause: any = {};
    if (fecha_desde || fecha_hasta) {
      whereClause.fecha = {};
      if (fecha_desde) whereClause.fecha.gte = new Date(fecha_desde);
      if (fecha_hasta) whereClause.fecha.lte = new Date(fecha_hasta);
    }

    // Traemos las órdenes. Solo sumamos aquellas que generan ingresos reales.
    const ordenes = await prisma.orden.findMany({
      where: {
        ...whereClause,
        estado: { in: ['pagada', 'entregada'] }
      },
      select: {
        fecha: true,
        monto: true,
      },
      orderBy: { fecha: 'asc' }
    });

    type Agrupacion = Record<string, { fecha: string; volumen_transacciones: number; ingresos: number }>;

    const agrupado = ordenes.reduce((acc: Agrupacion, orden) => {
      const fechaISO = orden.fecha.toISOString();
      
      
      // Si es 'dia', tomamos los primeros 10 caracteres: "2026-04-15"
      // Si es 'mes', tomamos los primeros 7 caracteres: "2026-04"
      const claveFecha = intervalo === 'dia' 
        ? fechaISO.substring(0, 10) 
        : fechaISO.substring(0, 7);

      if (!acc[claveFecha]) {
        acc[claveFecha] = { fecha: claveFecha, volumen_transacciones: 0, ingresos: 0 };
      }

      acc[claveFecha].volumen_transacciones += 1;
      acc[claveFecha].ingresos += orden.monto;

      return acc;
    }, {});

    return NextResponse.json(Object.values(agrupado));

  } catch (error) {
    console.error("Error en /api/analytics/orders/time-series:", error);
    return NextResponse.json(
      { error: "internal_error", mensaje: "Error al generar la serie temporal" },
      { status: 500 }
    );
  }
}