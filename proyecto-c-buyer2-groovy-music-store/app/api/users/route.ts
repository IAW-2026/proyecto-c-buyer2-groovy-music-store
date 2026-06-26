//API Control Plane
//Listado de Compradores
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/app/lib/prisma';


export async function GET(request: NextRequest) {
    try {
        
        const searchParams = request.nextUrl.searchParams;
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '20');

        const skip = (page - 1) * limit;

        
        const [usuarios, totalUsuarios] = await Promise.all([
            prisma.usuario.findMany({
                skip: skip,
                take: limit,
                orderBy: {
                    clerk_id: 'asc'
                }
            }),
            prisma.usuario.count() 
        ]);

        return NextResponse.json({
            datos: usuarios,
            paginacion: { 
                total: totalUsuarios,
                pagina: page,
                limite: limit,
                totalPaginas: Math.ceil(totalUsuarios / limit)
            }
        });
    } catch (error) {
        console.error("Error al obtener compradores:", error);
        return NextResponse.json({ error: "Error interno al obtener compradores" }, { status: 500 });
    }
}