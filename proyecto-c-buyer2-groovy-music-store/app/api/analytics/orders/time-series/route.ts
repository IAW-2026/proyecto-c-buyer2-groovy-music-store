import { NextResponse } from 'next/server';
import prisma from '@/app/lib/prisma';
import { z } from 'zod';
import { EstadoOrden } from '@/app/lib/definitions';

const querySchema = z.object({
  fecha_desde: z.string().optional(),
  fecha_hasta: z.string().optional(),
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
      
      // Agregamos la hora exacta para cubrir el día entero.
      // Si mandan "2026-06-24", se convierte en "2026-06-24T00:00:00.000Z"
      if (fecha_desde) {
        whereClause.fecha.gte = new Date(`${fecha_desde}T00:00:00.000Z`);
      }
      
      // Si mandan "2026-06-24", se convierte en "2026-06-24T23:59:59.999Z" (final del día)
      if (fecha_hasta) {
        whereClause.fecha.lte = new Date(`${fecha_hasta}T23:59:59.999Z`);
      }
    }

    // Traemos las órdenes. Solo sumamos aquellas que generan ingresos reales.
    const ordenes = await prisma.orden.findMany({
      where: {
        ...whereClause,
        estado: { in: [EstadoOrden.PAGO_APROBADO, EstadoOrden.ENTREGADO] }
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
    return NextResponse.json(
      { error: "internal_error", mensaje: "Error al generar la serie temporal" },
      { status: 500 }
    );
  }
}