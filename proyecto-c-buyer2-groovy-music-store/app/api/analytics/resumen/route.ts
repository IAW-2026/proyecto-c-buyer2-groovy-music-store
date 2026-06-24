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
        { 
          error: "bad_request", 
          mensaje: "Parámetros inválidos", 
          detalles: queryValidation.error.format() 
        },
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

    
    const [totalOrdenes, ordenesPorEstado, totalUsuarios, sumatoriaMonto] = await Promise.all([
      prisma.orden.count({ 
        where: whereClause 
      }),
      prisma.orden.groupBy({
        by: ['estado'],
        _count: { estado: true },
        where: whereClause,
      }),
      
      prisma.usuario.count(), 
      prisma.orden.aggregate({
        _sum: { monto: true },
        where: { 
          ...whereClause,
          estado: { in: ['pagada', 'entregada'] } //  plata de órdenes concretadas
        },
      }),
    ]);

    const totalIngresos = sumatoriaMonto._sum.monto || 0;
    const ticketPromedio = totalOrdenes > 0 ? (totalIngresos / totalOrdenes).toFixed(2) : 0;

    
    return NextResponse.json({
      total_ordenes: totalOrdenes,
      ingresos_totales: totalIngresos,
      ticket_promedio: parseFloat(ticketPromedio as string),
      usuarios_activos: totalUsuarios,
      desglose_estados: ordenesPorEstado.reduce((acc, curr) => {
        acc[curr.estado] = curr._count.estado;
        return acc;
      }, {} as Record<string, number>)
    });

  } catch (error) {
    console.error("Error en /api/analytics/resumen:", error);
    return NextResponse.json(
      { error: "internal_error", mensaje: "Error al generar el resumen de analytics" },
      { status: 500 }
    );
  }
}