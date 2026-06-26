import prisma from '@/app/lib/prisma';
import { redirect } from 'next/navigation';
import SimpleNavBar from '@/app/ui/SimpleNavBar';
import Link from 'next/link';
import { Metadata } from 'next';
import { EstadoOrden } from '@/app/lib/definitions';

export const metadata: Metadata = {
  title: "Estado de la Orden - Groovy Music Store",
  description: "Verificá el estado del pago de tu compra."
};

export default async function EstadoOrdenPage({ params }: { params: Promise<{ ordenId: string }> }) {
    const resolvedParams = await params;
    const uuidOrden = resolvedParams.ordenId;

    // Buscamos la orden usando  UUID (nro_orden)
    const orden = await prisma.orden.findUnique({
        where: { nro_orden: uuidOrden },
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
            
            <div className="max-w-3xl mx-auto mt-20 px-8 text-center">
                {/* CASO 1: PAGO APROBADO */}
                {orden.estado === EstadoOrden.PAGO_APROBADO && (
                    <div className="bg-green-50 border border-green-200 p-8 rounded-xl shadow-sm">
                        <h1 className="font-syne text-4xl font-bold text-green-700 mb-4">¡Pago Confirmado!</h1>
                        <p className="text-lg text-foreground/80 mb-2">
                            Tu orden <b>#{orden.nro_orden_usuario}</b> se procesó con éxito.
                        </p>
                        <p className="text-md text-foreground/60">Estamos preparando tus productos de música para el envío.</p>
                        <Link href="/" className="mt-8 inline-block bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition">
                            Volver al Inicio
                        </Link>
                    </div>
                )}

                {/* CASO 2: PAGO RECHAZADO O CANCELADO */}
                {(orden.estado === EstadoOrden.PAGO_RECHAZADO || orden.estado === EstadoOrden.CANCELADO) && (
                    <div className="bg-red-50 border border-red-200 p-8 rounded-xl shadow-sm">
                        <h1 className="font-syne text-4xl font-bold text-red-700 mb-4">La operación no pudo completarse</h1>
                        <p className="text-lg text-foreground/80 mb-2">
                            El pago para la orden <b>#{orden.nro_orden_usuario}</b> fue rechazado o cancelado.
                        </p>
                        <p className="text-md text-foreground/60 mb-6">
                            No te preocupes, no se realizó ningún cargo técnico y conservamos tus productos de vuelta en el carrito.
                        </p>
                        <Link href="/catalogo" className="inline-block bg-red-600 text-white px-8 py-3 rounded-lg hover:bg-red-700 transition">
                            Volver al Carrito
                        </Link>
                    </div>
                )}

                {/* CASO 3: EN PROCESO / PENDIENTE */}
                {(orden.estado === EstadoOrden.PROCESANDO || orden.estado === 'pendiente') && (
                    <div className="bg-yellow-50 border border-yellow-200 p-8 rounded-xl shadow-sm">
                        <h1 className="font-syne text-4xl font-bold text-yellow-700 mb-4">Procesando tu pago</h1>
                        <p className="text-lg text-foreground/80 mb-2">
                            Estamos esperando la confirmación final por parte de la plataforma de pagos para la orden <b>#{orden.nro_orden_usuario}</b>.
                        </p>
                        <p className="text-md text-foreground/60">Podés refrescar esta página en unos instantes.</p>
                    </div>
                )}
            </div>
        </main>
    );
}