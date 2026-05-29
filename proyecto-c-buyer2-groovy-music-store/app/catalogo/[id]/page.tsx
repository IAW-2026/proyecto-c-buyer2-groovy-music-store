import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'

// Componentes
import GaleriaInteractiva from '@/app/ui/GaleriaInteractiva'
import BotonAgregarCarrito from '@/app/ui/BotonAgregarCarrito'
import NavBar from '@/app/ui/NavBar'

// Servicio externo
import { getFullProduct } from '@/app/lib/services/seller-api'

// Autenticación
import { auth } from '@clerk/nextjs/server'

// Conexión única de Prisma
import  prisma from '@/app/lib/prisma'

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
    
    const resolvedParams = await params;
    
    const product = await getFullProduct(resolvedParams.id);

    if (!product) notFound()

    const { userId } = await auth();
    let cantidadYaEnCarrito = 0;

    // Consulta a la base de datos local usando la conexión única de Prisma
    if (userId) {
        try {
            const itemExistente = await prisma.itemCarrito.findFirst({
                where: {
                    producto_id: product.id,
                    carrito: {
                        clerk_id: userId
                    }
                }
            });

            if (itemExistente) {
                cantidadYaEnCarrito = itemExistente.cantidad;
            }
        } catch (error) {
            console.error("Error al consultar la cantidad en el carrito local:", error);
        }
    }

    // Calculamos el stock que el usuario todavía puede añadir
    const stockDisponible = Math.max(0, product.stock - cantidadYaEnCarrito);

    return (
        <main className="min-h-screen bg-background font-dm pb-20">
            
            {/* BARRA DE NAVEGACIÓN SUPERIOR */}
            <NavBar />

            {/* BARRA DE NAVEGACIÓN SECUNDARIA */}
            <div className="flex items-center justify-between px-8 py-3 bg-foreground text-white/50 text-xs font-medium tracking-[0.12em] uppercase border-b border-[#3a3a3a]">
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
                            ${(product.precio || 0).toLocaleString('es-AR', { maximumFractionDigits: 0 })}
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
                                    {product.stock > 0 
                                        ? `${product.stock} ${product.stock === 1 ? 'unidad' : 'unidades'}` 
                                        : 'Agotado'}
                                </span>
                            </div>
                        </div>

                        <div className="mt-auto">
                            <BotonAgregarCarrito 
                                productoId={product.id} 
                                stockTotal={product.stock} 
                                stockDisponible={stockDisponible}
                                sellerId={product.seller_id.id}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}