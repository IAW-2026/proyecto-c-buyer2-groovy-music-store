import { redirect } from 'next/navigation';
import { auth } from '@clerk/nextjs/server';
import prisma from '@/app/lib/prisma'; 
import SimpleNavBar from '../ui/SimpleNavBar';
import Link from 'next/link';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { getProductsBatch, getSellerInfo } from '../lib/services/seller-api';
import FormularioCheckout from '../ui/FormularioCheckout'; 

export const metadata = {
    title: 'Checkout - Groovy Music Store',
    description: 'Página de checkout para revisar tu orden antes de confirmar la compra',
}

//PESOS ESTIMADOS POR FORMATO DE PRODUCTO EN KG
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
    
    const { userId: clerkId } = await auth(); 

    if (!sellerId || !clerkId) {
        redirect('/');
    }

    // items del carrito actual
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

    const productIds = itemsDb.map(item => item.producto_id);
    const productosDetalle = await getProductsBatch(productIds);

    // productos no disponibles (sin stock o eliminados de la API)
    const itemsValidos: any[] = [];
    const idsProductosAEliminar: string[] = [];

    itemsDb.forEach((item) => {
        const detalle = productosDetalle.find(p => p.id === item.producto_id);
        
        // Criterio de eliminación: No viene en la API o su stock es 0
        if (!detalle || detalle.stock === 0) {
            idsProductosAEliminar.push(item.producto_id);
        } else {
            // Si el producto es válido, lo preparamos para el checkout
            itemsValidos.push({
                cantidad: item.cantidad,
                ...detalle
            });
        }
    });

    // Limpieza de la Base de Datos si hay productos inválidos
    if (idsProductosAEliminar.length > 0) {
        await prisma.itemCarrito.deleteMany({
            where: {
                producto_id: { in: idsProductosAEliminar },
                id_seller: sellerId,
                carrito: { clerk_id: clerkId }
            }
        });

        // Si después de la limpieza no quedo ningun producto, redirigimos al catálogo
        if (itemsValidos.length === 0) {
            redirect('/');
        }
    }

    const subtotal = itemsValidos.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);
    const pesoTotal = calcularPesoTotal(itemsValidos);



   
    const sellerInfo = await getSellerInfo(sellerId);

    const origen_cp = sellerInfo?.codigo_postal || '';
    const nombre_seller = sellerInfo?.nombre_fantasia || 'Vendedor Desconocido';

   

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
                        Comprando los productos del vendedor: <span className="font-semibold text-primary">{nombre_seller}</span>
                    </p>
                </header>
            
                
                <FormularioCheckout 
                    itemsParaCheckout={itemsValidos}
                    direccionesDb={direccionesDb}
                    clerkId={clerkId}
                    sellerId={sellerId}
                    subtotal={subtotal}
                    pesoTotal={pesoTotal}
                    origen_cp={origen_cp}
                />
            </div>
        </main>
    );
}