import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'

// componentes
import GaleriaInteractiva from '@/app/ui/GaleriaInteractiva'
import BotonAgregarCarrito from '@/app/ui/BotonAgregarCarrito'
import NavBar from '@/app/ui/NavBar'

//  datos de prueba
import {mockProducts} from '@/app/lib/placeholder-data'

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
    
    // Resolvemos la URL
    const resolvedParams = await params;
    
    // Buscamos en nuestra lista de los productos
    const product = mockProducts.find((p) => p.id === resolvedParams.id)

    if (!product) notFound()

    return (
        <main className="min-h-screen bg-background font-dm pb-20">
            
            {/* BARRA DE NAVEGACIÓN SUPERIOR  */}
            <NavBar />

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
                                sellerId={product.seller_id}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}