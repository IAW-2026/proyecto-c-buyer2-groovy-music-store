import prisma from '@/app/lib/prisma';
import { redirect } from 'next/navigation';
import SimpleNavBar from '@/app/ui/SimpleNavBar';
import Link from 'next/link';

import {Metadata } from 'next'

export const metadata: Metadata = {
  title: "Orden confirmada- Groovy Music Store",
  description: "Confirmacion de orden de compra de Groovy Music Store." }

export default async function OrdenConfirmadaPage({ params }: { params: Promise<{ ordenId: string }> }) {
    const resolvedParams = await params;
    const nroOrdenUsuario = parseInt(resolvedParams.ordenId);

    if (isNaN(nroOrdenUsuario)) redirect('/');

    const orden = await prisma.orden.findUnique({
        where: { nro_orden_usuario: nroOrdenUsuario },
        include: {
            direccion: true,
            items: true,
        }
    });

    if (!orden) {
        redirect('/');
    }

    return (
        <main className="min-h-screen bg-background font-dm pb-20">
            <SimpleNavBar />
            
            <div className="max-w-3xl mx-auto px-8 mt-20 text-center">
                <div className="bg-green-100/10 border border-green-500/30 p-10 rounded-2xl">
                    <h1 className="text-4xl font-bold font-syne mb-4 text-green-500">
                        ¡Orden Confirmada!
                    </h1>

                    <div className="bg-card text-left p-6 rounded-xl border border-border inline-block w-full">
                        <h2 className="font-syne font-semibold text-xl border-b border-border pb-3 mb-4">
                            Detalles de la compra
                        </h2>
                        
                        <div className="space-y-3 text-foreground/80">
                            {/* Mostramos el campo Int amigable */}
                            <p><span className="font-semibold text-foreground">Nro de Orden:</span> #{orden.nro_orden_usuario}</p>
                            <p><span className="font-semibold text-foreground">Fecha:</span> {orden.fecha.toLocaleDateString()}</p>
                            <p><span className="font-semibold text-foreground">Estado:</span> {orden.estado}</p>
                            <p><span className="font-semibold text-foreground">Enviar a:</span> {orden.direccion.calle}, {orden.direccion.ciudad}</p>
                        </div>
                    </div>

                    <div className="mt-10">
                        <Link href="/catalogo" className="bg-foreground text-background font-dm font-semibold py-3 px-8 rounded-lg hover:opacity-90 transition-all">
                            Seguir Comprando
                        </Link>
                    </div>
                </div>
            </div>
        </main>
    );
}