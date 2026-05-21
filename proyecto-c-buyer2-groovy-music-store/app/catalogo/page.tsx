import Image from 'next/image'
import Link from 'next/link'
import { SignOutButton } from "@clerk/nextjs"
// Importamos el componente de servidor del carrito
import CartServer from '@/app/ui/CartServer' 

// Tipo de datos liviano para no traer info de la BD de mas
type ProductSummary = {
    id: number
    titulo: string
    artista: string
    precio: number
    carpeta_imagenes: string
}

// Arreglo simulado (Coincide con los IDs de nuestro fakeApiProducts en CartServer)
const sampleProducts: ProductSummary[] = [
    { 
        id: 1, 
        titulo: 'Groovy Vinyl 1', 
        artista: 'Artist A', 
        precio: 19.99, 
        carpeta_imagenes: '/placeholder-record.png' 
    },
    { 
        id: 2, 
        titulo: 'Groovy Vinyl 2', 
        artista: 'Artist B', 
        precio: 24.50, 
        carpeta_imagenes: '/placeholder-record.png' 
    },
    { 
        id: 3, 
        titulo: 'Groovy Vinyl 3', 
        artista: 'Artist C', 
        precio: 15.00, 
        carpeta_imagenes: '/placeholder-record.png' 
    },
]

export const metadata = {
    title: 'Catálogo - Groovy Music Store',
    description: 'Página principal del catálogo de productos',
}

export default function CatalogPage() {
    const products = sampleProducts

    return (
        <main style={{ padding: 40, fontFamily: 'Inter, system-ui, sans-serif', background: 'var(--bg-retro)', minHeight: '100vh' }}>
            
            {/* BARRA DE NAVEGACIÓN SUPERIOR */}
            <nav style={{ 
                display: 'flex', 
                justifyContent: 'flex-end', 
                alignItems: 'center', 
                gap: 24, 
                paddingBottom: 20, 
                borderBottom: '1px solid var(--divider)', 
                marginBottom: 32 
            }}>
                {/* INTEGRACIÓN: Aquí anidamos el Server Component del carrito. 
                  Next.js resolverá esta consulta a Neon y la "hidratación" asincrónica de forma nativa.
                */}
                <CartServer />

                {/* Botón Salir con Clerk */}
                <SignOutButton redirectUrl="/">
                    <button style={{ 
                        background: 'none', border: 'none', cursor: 'pointer', 
                        display: 'flex', alignItems: 'center', gap: 8, 
                        color: 'var(--text-dark)', fontSize: 16, fontWeight: 500 
                    }}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                            <polyline points="16 17 21 12 16 7"></polyline>
                            <line x1="21" y1="12" x2="9" y2="12"></line>
                        </svg>
                        Salir
                    </button>
                </SignOutButton>
            </nav>
            {/* FIN DE LA BARRA DE NAVEGACIÓN */}

            <header style={{ marginBottom: 40 }}>
                <h1 style={{ margin: 0, fontSize: 36, fontWeight: 500, color: 'var(--text-dark)' }}>Catálogo</h1>
                <p style={{ margin: '8px 0 0', color: 'var(--text-medium)', fontSize: 16 }}>Mira nuestros productos más populares</p>
                <div style={{ width: 80, height: 3, background: 'var(--accent-terracotta)', marginTop: 16, borderRadius: 2 }}></div>
            </header>

            <section style={{ display: 'grid', gap: 24, gridTemplateColumns: 'repeat(auto-fill,minmax(240px,1fr))' }}>
                {products.map((p) => (
                    <article key={p.id} style={{ 
                        background: 'var(--panel-bg)', 
                        border: '1px solid var(--divider)', 
                        borderRadius: 12, 
                        padding: 16,
                        boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                        display: 'flex',
                        flexDirection: 'column'
                    }}>
                        <Link href={`/catalogo/${p.id}`} style={{ textDecoration: 'none', color: 'inherit', flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                            <div style={{ width: '100%', height: 200, position: 'relative', marginBottom: 16, background: '#e9e9e9', borderRadius: 8, overflow: 'hidden' }}>
                                <Image 
                                    src={p.carpeta_imagenes || '/placeholder-record.png'} 
                                    alt={p.titulo} 
                                    fill 
                                    style={{ objectFit: 'cover' }} 
                                />
                            </div>
                            
                            <h2 style={{ fontSize: 18, fontWeight: 600, margin: '0 0 8px', color: 'var(--text-dark)' }}>{p.titulo}</h2>
                            {p.artista && <div style={{ color: 'var(--text-medium)', fontSize: 14, marginBottom: 16 }}>{p.artista}</div>}
                            
                            <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--divider)', paddingTop: 16 }}>
                                <div style={{ fontWeight: 600, fontSize: 18, color: 'var(--text-dark)' }}>
                                    ${p.precio.toFixed(2)}
                                </div>
                                <span style={{ background: 'var(--accent-terracotta)', color: 'white', padding: '6px 14px', borderRadius: 6, fontSize: 13, fontWeight: 600 }}>
                                    Ver detalles
                                </span>
                            </div>
                        </Link>
                    </article>
                ))}
            </section>
        </main>
    )
}