//API Control Plane
//Listado Global de Órdenes

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/app/lib/prisma';

export async function GET(request: NextRequest) {
    try {
        
        const searchParams = request.nextUrl.searchParams;
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '20');

       
        const skip = (page - 1) * limit;

        
        const [ordenes, totalOrdenes] = await Promise.all([
            prisma.orden.findMany({
                skip: skip,
                take: limit,
                orderBy: {
                    fecha: 'desc' 
                }
            }),
            prisma.orden.count() // Cuenta cuántas órdenes hay en total
        ]);

        return NextResponse.json({
            datos: ordenes,
            paginacion: { 
                total: totalOrdenes,
                pagina: page,
                limite: limit,
                totalPaginas: Math.ceil(totalOrdenes / limit)
            }
        });
    } catch (error) {
        console.error("Error obteniendo órdenes:", error);
        return NextResponse.json({ error: "Error interno al obtener órdenes" }, { status: 500 });
    }
}