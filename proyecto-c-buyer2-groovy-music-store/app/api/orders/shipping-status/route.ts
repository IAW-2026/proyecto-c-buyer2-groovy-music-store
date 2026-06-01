import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/app/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const { ordenId, estado } = await request.json();

    if (!ordenId || !estado) {
      return NextResponse.json({ error: 'bad_request', mensaje: 'Faltan campos obligatorios' }, { status: 400 });
    }

    await prisma.orden.update({
      where: { nro_orden: ordenId },
      data: { estado: estado },
    });

    return NextResponse.json({ estado: 'orden_actualizada', mensaje: 'Estado de envío actualizado en la orden' });
  } catch (error: any) {
    if (error.code === 'P2025') {
      return NextResponse.json({ error: 'not_found', mensaje: 'La orden no existe' }, { status: 404 });
    }
    return NextResponse.json({ error: 'internal_error', mensaje: 'Error interno del servidor' }, { status: 500 });
  }
}