import { redirect } from 'next/navigation';
import { auth } from '@clerk/nextjs/server';
import prisma from '@/app/lib/prisma'; 
import SimpleNavBar from '../ui/SimpleNavBar';
import Link from 'next/link';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { getProductQuickDetail } from '../lib/services/seller-api';
import { getShippingEstimate } from '../lib/services/shipping-api'; 
import FormularioCheckout from '../ui/FormularioCheckout'; // Importamos el componente nuevo

export const metadata = {
    title: 'Checkout - Groovy Music Store',
    description: 'Página de checkout para revisar tu orden antes de confirmar la compra',
}

export default async function CheckoutPage({ searchParams }: { searchParams: Promise<{ seller?: string }>; }) {
    const params = await searchParams;            
    const sellerId = params.seller;
    const { userId: clerkId } = await auth(); 

    if (!sellerId || !clerkId) {
        redirect('/');
    }

    const [itemsDb, direccionesDb] = await Promise.all([
        prisma.itemCarrito.findMany({
            where: { id_seller: sellerId, carrito: { clerk_id: clerkId } }
        }),
        prisma.direccion.findMany({
            where: { clerk_id: clerkId }
        })
    ]);

    if (itemsDb.length === 0) {
        redirect('/');
    }

    const itemsBorrador = await Promise.all(
        itemsDb.map(async (item) => {
            const detalle = await getProductQuickDetail(item.producto_id);
            return detalle ? { cantidad: item.cantidad, ...detalle } : null;
        })
    );
    const itemsParaCheckout = itemsBorrador.filter(Boolean);

    const subtotal = itemsParaCheckout.reduce((acc, item) => acc + (item!.precio * item!.cantidad), 0);
    const envio = await getShippingEstimate("8000", "1000", 0.5); 
    const totalAPagar = subtotal + envio.costo;

    return (
        <main className="min-h-screen bg-background font-dm pb-20">
            <SimpleNavBar/>
            
            <div className="flex items-center justify-between px-8 py-3 bg-foreground text-white/50 text-xs font-medium tracking-[0.12em] uppercase border-b border-[#3a3a3a]">
                <Link href="/catalogo" className="flex items-center gap-2 hover:text-white transition-colors">
                    <ArrowLeftIcon className="w-4 h-4" />
                    <span>Volver al catálogo</span>
                </Link>
            </div>

            <div className="max-w-7xl mx-auto px-8 mt-10">
                <header className="mb-10">
                    <h1 className="text-3xl md:text-4xl font-bold font-syne mb-2">Resumen de tu Orden</h1>
                    <p className="text-foreground/70 text-lg">
                        Comprando los productos del vendedor: <span className="font-semibold text-primary">{sellerId}</span>
                    </p>
                </header>
            
                <FormularioCheckout 
                    itemsParaCheckout={itemsParaCheckout}
                    direccionesDb={direccionesDb}
                    clerkId={clerkId}
                    sellerId={sellerId}
                    subtotal={subtotal}
                    envio={envio}
                    totalAPagar={totalAPagar}
                />
            </div>
        </main>
    );
}