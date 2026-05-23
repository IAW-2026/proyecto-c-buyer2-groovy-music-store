import Link from 'next/link'
import { notFound } from 'next/navigation'
import { SignOutButton } from "@clerk/nextjs"
import { ArrowLeftIcon, MagnifyingGlassIcon, ArrowRightEndOnRectangleIcon } from '@heroicons/react/24/outline'

// Tus componentes
import GaleriaInteractiva from '@/app/ui/GaleriaInteractiva'
import BotonAgregarCarrito from '@/app/ui/BotonAgregarCarrito'
import CartServer from '@/app/ui/CartServer'

type Product = {
    id: number;
    titulo: string;
    artista: string;
    precio: number;
    stock: number; 
    formato: string; 
    condicion: string; 
    genero: string; 
    imagenes: string[]; 
    seller_id: { id: string }
}

// Productos de prueba
const sampleProducts: Product[] = [
    { 
        id: 1, titulo: 'Groovy Vinyl 1', artista: 'Artist A', precio: 19.99, stock: 5, 
        formato: 'Vinilo LP', condicion: 'Nuevo', genero: 'Rock', 
        imagenes: ['/placeholder-record.png', '/placeholder-record.png'], 
        seller_id: { id: 'clerk_123' } 
    },
    { 
        id: 2, titulo: 'Groovy Vinyl 2', artista: 'Artist B', precio: 24.50, stock: 2, 
        formato: 'Vinilo 7"', condicion: 'Usado', genero: 'Jazz', 
        imagenes: ['/placeholder-record.png'], 
        seller_id: { id: 'clerk_123' } 
    },
    { 
        id: 3, titulo: 'Groovy Vinyl 3', artista: 'Artist C', precio: 15.00, stock: 0, 
        formato: 'Cassette', condicion: 'Nuevo', genero: 'Pop', 
        imagenes: ['/placeholder-record.png'], 
        seller_id: { id: 'clerk_456' } 
    }
]

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
    
    // Resolvemos la URL
    const resolvedParams = await params;
    
    // Buscamos en nuestra lista de los 3 productos
    const product = sampleProducts.find((p) => p.id === parseInt(resolvedParams.id))

    if (!product) notFound()

    return (
        <main className="min-h-screen bg-background font-dm pb-20">
            
            {/* BARRA DE NAVEGACIÓN SUPERIOR  */}
            <nav className="flex items-center justify-between px-5 md:px-8 py-4 md:py-5 bg-primary text-white relative">
                

                {/* Logo Central  */}
                <div className="md:absolute md:left-1/2 md:-translate-x-1/2">
                    <Link href="/" className="font-cormorant text-2xl md:text-3xl font-light tracking-[0.25em] md:tracking-[0.55em] select-none">
                        GROOVY
                    </Link>
                </div>

                {/* Íconos Derechos */}
                <div className="flex items-center gap-4 md:gap-6 ml-auto">
                    {/* Búsqueda */}
                    <button className="hover:opacity-80 transition-opacity">
                        <MagnifyingGlassIcon className="w-5 h-5 md:w-5 md:h-5" />
                    </button>

                    {/* Botón Salir con Clerk */}
                    <SignOutButton redirectUrl="/">
                        <button className="flex items-center gap-2 hover:opacity-80 transition-opacity text-sm font-medium tracking-wide cursor-pointer bg-transparent border-none text-white" title="Salir">
                            <ArrowRightEndOnRectangleIcon className="w-5 h-5 md:w-5 md:h-5" />
                        </button>
                    </SignOutButton>

                    {/* Componente del Carrito Original */}
                    <CartServer />
                </div>
            </nav>

            {/* BARRA DE NAVEGACIÓN SECUNDARIA  */}
            <div className="flex items-center px-8 py-3 bg-foreground text-white/50 text-xs font-medium tracking-[0.12em] uppercase border-b border-[#3a3a3a]">
                <Link href="/catalogo" className="flex items-center gap-2 hover:text-white transition-colors">
                    <ArrowLeftIcon className="w-4 h-4" />
                    <span>Volver al catálogo</span>
                </Link>
            </div>

            {/* CONTENIDO DEL PRODUCTO */}
            <div className="max-w-5xl mx-auto mt-10 px-6 md:px-12">
                <div className="bg-card border border-border rounded-xl shadow-sm p-6 md:p-10 flex flex-col md:flex-row gap-10">
                    
                    {/* COLUMNA IZQUIERDA (Galería) */}
                    <div className="w-full md:w-1/2">
                        <GaleriaInteractiva imagenes={product.imagenes} />
                    </div>

                    {/* COLUMNA DERECHA (Info del producto) */}
                    <div className="w-full md:w-1/2 flex flex-col">
                        <h1 className="font-syne text-3xl md:text-4xl font-bold text-foreground mb-2">
                            {product.titulo}
                        </h1>
                        
                        {product.artista && (
                            <p className="font-dm text-xl text-foreground/70 mb-6">
                                {product.artista}
                            </p>
                        )}
                        
                        <div className="font-syne text-3xl font-semibold text-foreground mb-8">
                            ${product.precio.toFixed(2)}
                        </div>
                        
                        <div className="flex flex-col gap-4 mb-8 bg-background p-6 rounded-lg border border-border font-dm">
                            <div className="flex justify-between border-b border-border pb-2">
                                <span className="text-foreground/70">Formato</span>
                                <span className="font-medium text-foreground">{product.formato}</span>
                            </div>
                            <div className="flex justify-between border-b border-border pb-2">
                                <span className="text-foreground/70">Condición</span>
                                <span className="font-medium text-foreground">{product.condicion}</span>
                            </div>
                            <div className="flex justify-between border-b border-border pb-2">
                                <span className="text-foreground/70">Género</span>
                                <span className="font-medium text-foreground">{product.genero}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-foreground/70">Disponibilidad</span>
                                <span className={`font-semibold tracking-wide ${product.stock > 0 ? 'text-green-700' : 'text-[#E25938]'}`}>
                                    {product.stock > 0 ? `${product.stock} unidades` : 'Agotado'}
                                </span>
                            </div>
                        </div>

                        <div className="mt-auto">
                            <BotonAgregarCarrito 
                                productoId={product.id} 
                                stock={product.stock} 
                            />
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}