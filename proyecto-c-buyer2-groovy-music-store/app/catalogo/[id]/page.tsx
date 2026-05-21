import Link from 'next/link'
import { notFound } from 'next/navigation'
import GaleriaInteractiva from '@/app/components/GaleriaInteractiva'

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
        <main className="min-h-screen p-6 md:p-12 bg-[var(--bg-retro)] font-sans">
            <div className="max-w-5xl mx-auto mb-6">
                <Link href="/catalogo" className="text-[var(--text-medium)] hover:text-[var(--accent-terracotta)] flex items-center gap-2 transition-colors">
                    &larr; Volver al catálogo
                </Link>
            </div>

            <div className="max-w-5xl mx-auto bg-[var(--panel-bg)] border border-[var(--divider)] rounded-xl shadow-sm p-6 md:p-10 flex flex-col md:flex-row gap-10">
                
                {/* COLUMNA IZQUIERDA: Inyectamos el Client Component y le pasamos el arreglo de fotos */}
                <div className="w-full md:w-1/2">
                    <GaleriaInteractiva imagenes={product.imagenes} />
                </div>

                {/* COLUMNA DERECHA: Todo tu diseño técnico original intacto */}
                <div className="w-full md:w-1/2 flex flex-col">
                    <h1 className="text-3xl md:text-4xl font-bold text-[var(--text-dark)] mb-2">{product.titulo}</h1>
                    {product.artista && <p className="text-xl text-[var(--text-medium)] mb-6">{product.artista}</p>}
                    
                    <div className="text-3xl font-semibold text-[var(--text-dark)] mb-8">
                        ${product.precio.toFixed(2)}
                    </div>
                    
                    <div className="flex flex-col gap-4 mb-8 bg-[var(--bg-retro)] p-6 rounded-lg border border-[var(--divider)]">
                        <div className="flex justify-between border-b border-[var(--divider)] pb-2">
                            <span className="text-[var(--text-medium)]">Formato</span>
                            <span className="font-medium text-[var(--text-dark)]">{product.formato}</span>
                        </div>
                        <div className="flex justify-between border-b border-[var(--divider)] pb-2">
                            <span className="text-[var(--text-medium)]">Condición</span>
                            <span className="font-medium text-[var(--text-dark)]">{product.condicion}</span>
                        </div>
                        <div className="flex justify-between border-b border-[var(--divider)] pb-2">
                            <span className="text-[var(--text-medium)]">Género</span>
                            <span className="font-medium text-[var(--text-dark)]">{product.genero}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-[var(--text-medium)]">Disponibilidad</span>
                            <span className={`font-semibold ${product.stock > 0 ? 'text-green-700' : 'text-red-600'}`}>
                                {product.stock > 0 ? `${product.stock} unidades` : 'Agotado'}
                            </span>
                        </div>
                    </div>

                    <div className="mt-auto">
                        <button 
                            className="w-full bg-[var(--accent-terracotta)] hover:opacity-90 transition-opacity text-white font-bold py-4 rounded-lg text-lg disabled:opacity-40 disabled:cursor-not-allowed"
                            disabled={product.stock === 0}
                        >
                            {product.stock > 0 ? 'Agregar al carrito' : 'Sin stock'}
                        </button>
                    </div>
                </div>
            </div>
        </main>
    )
}