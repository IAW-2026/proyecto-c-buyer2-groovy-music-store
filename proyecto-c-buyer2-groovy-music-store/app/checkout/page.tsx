import { redirect } from 'next/navigation';
import Image from 'next/image';
import { auth } from '@clerk/nextjs/server';
import  prisma  from '@/app/lib/prisma'; 
import SimpleNavBar from '../ui/SimpleNavBar';
import Link from 'next/link'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'


// Un mock ultra reducido: solo la información visual indexada por ID de producto
const detallesProductosMock: Record<string, { titulo: string; artista: string; precio: number; imagen: string }> = {
  '123e4567-e89b-12d3-a456-426614174001': { titulo: 'Groovy Vinyl 1', artista: 'Artist A', precio: 19.99, imagen: '/placeholder-record.png' },
  '123e4567-e89b-12d3-a456-426614174002': { titulo: 'Groovy Vinyl 2', artista: 'Artist B', precio: 24.50, imagen: '/placeholder-record.png' },
  '123e4567-e89b-12d3-a456-426614174003': { titulo: 'Groovy Vinyl 3', artista: 'Artist C', precio: 15.00, imagen: '/placeholder-record.png' },
};

export default async function CheckoutPage({ searchParams}: {searchParams: Promise<{ seller?: string }>; }) {
    const params = await searchParams;          
    const sellerId = params.seller;
    const { userId: clerkId } = await auth(); 

    if (!sellerId || !clerkId) {
        redirect('/');
    }

    // Consulta a mi DB
    const itemsDb = await prisma.itemCarrito.findMany({
    where: {
        id_seller: sellerId, 
        carrito: {
            clerk_id: clerkId
        }
    }
});

    if (itemsDb.length === 0) {
        redirect('/');
    }

    // PASO 2: Acoplar solo los detalles visuales mínimos que faltan
    const itemsParaCheckout = itemsDb.map((item) => {
        const detalle = detallesProductosMock[item.producto_id];
        if (!detalle) return null;
        
        return {
            id: item.producto_id,
            cantidad: item.cantidad, // Real de la DB
            ...detalle // Título, artista, precio, imagen del mock mínimo
        };
    }).filter(Boolean);

    const subtotal = itemsParaCheckout.reduce((acc, item) => acc + (item!.precio * item!.cantidad), 0);

    return (
          <main className="min-h-screen bg-background font-dm pb-20">
            
            <SimpleNavBar/>
            
            {/* BARRA DE NAVEGACIÓN SECUNDARIA  */}
            <div className="flex items-center justify-between px-8 py-3 bg-foreground text-white/50 text-xs font-medium tracking-[0.12em] uppercase border-b border-[#3a3a3a]">
                <div className="flex items-center gap-8">
                    <Link href="/catalogo" className="flex items-center gap-2 hover:text-white transition-colors">
                    <ArrowLeftIcon className="w-4 h-4" />
                    <span>Volver al catálogo</span>
                </Link>
                </div>
            </div>



            <div className="max-w-7xl mx-auto px-8 mt-10">
            <header className="mb-10">
                <h1 className="text-3xl md:text-4xl font-bold font-syne mb-2">
                    Resumen de tu Orden
                </h1>
                <p className="text-foreground/70 text-lg">
                    Comprando los productos del vendedor: <span className="font-semibold text-primary">{sellerId}</span>
                </p>
            </header>
            

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Lista de productos */}
                <div className="lg:col-span-2 space-y-5">
                    <h2 className="text-2xl font-syne font-semibold mb-4">Artículos en la orden</h2>
                    
                    {itemsParaCheckout.map((item) => item && (
                        <div key={item.id} className="flex gap-5 items-center bg-card p-5 rounded-xl border border-border shadow-sm">
                            <div className="w-24 h-24 relative bg-border/30 rounded-md shrink-0 overflow-hidden">
                                <Image src={item.imagen} alt={item.titulo} fill className="object-cover" />
                            </div>
                            
                            <div className="grow min-w-0">
                                <h3 className="font-syne font-semibold text-xl truncate">{item.titulo}</h3>
                                <p className="text-sm text-foreground/70 font-medium">{item.artista}</p>
                                <p className="text-sm text-foreground/70 mt-1">Cantidad: {item.cantidad}</p>
                            </div>
                            
                            <div className="text-right shrink-0">
                                <p className="font-syne font-bold text-xl">${(item.precio * item.cantidad).toFixed(2)}</p>
                                {item.cantidad > 1 && (
                                    <p className="text-xs text-foreground/60 mt-1">${item.precio.toFixed(2)} c/u</p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Panel de Totales */}
                <div className="h-fit sticky top-6">
                    <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
                        <h2 className="text-xl font-syne font-semibold border-b border-border pb-3 mb-5">
                            Total a pagar
                        </h2>
                        
                        <div className="flex justify-between items-center mb-3 text-foreground/80">
                            <span>Subtotal</span>
                            <span className="font-medium">${subtotal.toFixed(2)}</span>
                        </div>
                        
                        <div className="flex justify-between items-center mb-6 text-foreground/80">
                            <span>Envío</span>
                            <span className="text-sm italic opacity-70">A calcular</span>
                        </div>

                        <div className="flex justify-between items-center border-t border-border pt-5 mb-8">
                            <span className="font-syne font-bold text-lg">Total</span>
                            <span className="font-syne font-bold text-3xl text-primary">${subtotal.toFixed(2)}</span>
                        </div>

                        <button className="w-full bg-primary text-background font-dm font-semibold py-3.5 px-4 rounded-lg hover:opacity-90 hover:-translate-y-0.5 transition-all active:translate-y-0 shadow-md text-[15px]">
                            Confirmar Orden
                        </button>
                    </div>
                </div>
                </div>

            </div>
        </main>
    );
}

