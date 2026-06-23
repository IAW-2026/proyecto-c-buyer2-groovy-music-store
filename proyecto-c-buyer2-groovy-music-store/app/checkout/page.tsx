import { redirect } from 'next/navigation';
import { auth } from '@clerk/nextjs/server';
import prisma from '@/app/lib/prisma'; 
import SimpleNavBar from '../ui/SimpleNavBar';
import Link from 'next/link';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { getProductQuickDetail, getSellerPostalCode } from '../lib/services/seller-api';
import FormularioCheckout from '../ui/FormularioCheckout'; 
import { cookies } from 'next/headers'; 

export const metadata = {
    title: 'Checkout - Groovy Music Store',
    description: 'Página de checkout para revisar tu orden antes de confirmar la compra',
}

const PESOS_ESTIMADOS: Record<string, number> = {
  vinilo: 0.40,   
  cd: 0.12,      
  cassette: 0.08, 
};

const PESO_POR_DEFECTO = 0.20; 

function calcularPesoTotal(items: any[]): number {
  return items.reduce((pesoAcumulado, item) => {
    const formatoDelProducto = item.formato?.toLowerCase() || '';
    const pesoUnitario = PESOS_ESTIMADOS[formatoDelProducto] || PESO_POR_DEFECTO;
    return pesoAcumulado + (pesoUnitario * item.cantidad);
  }, 0);
}

export default async function CheckoutPage({ searchParams }: { searchParams: Promise<{ seller?: string }>; }) {
    const params = await searchParams;            
    const sellerId = params.seller;
    const { userId: clerkId, getToken } = await auth(); 

    if (!sellerId || !clerkId) {
        redirect('/');
    }

   
    const token = await getToken();

    
    if (!token) {
        throw new Error("No se pudo obtener el token de autenticación");
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
    const pesoTotal = calcularPesoTotal(itemsParaCheckout);

    if (direccionesDb.length === 0) {
        throw new Error("El usuario no tiene direcciones cargadas para el envío.");
    }

    // Obtenemos el CP del Vendedor 
    const origen_cp = await getSellerPostalCode(sellerId,token);


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
                    pesoTotal={pesoTotal}
                    origen_cp={origen_cp}
                    tokenDelUsuario={token}
                />
            </div>
        </main>
    );
}