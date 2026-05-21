import Image from 'next/image'
import Link from 'next/link'
import { SignOutButton } from "@clerk/nextjs"

type Product = {
    id: number
    seller_id: string
    titulo: string
    artista: string
    formato: string
    condicion: string
    stock: number
    genero: string
    precio: number
    carpeta_imagenes: string
}

const sampleProducts: Product[] = [
    { 
        id: 1, 
        seller_id: 'seller_123',
        titulo: 'Groovy Vinyl 1', 
        artista: 'Artist A', 
        formato: 'Vinilo LP',
        condicion: 'Nuevo',
        stock: 5,
        genero: 'Rock',
        precio: 19.99, 
        carpeta_imagenes: '/placeholder-record.png' 
    },
    { 
        id: 2, 
        seller_id: 'seller_123',
        titulo: 'Groovy Vinyl 2', 
        artista: 'Artist B', 
        formato: 'Vinilo 7"',
        condicion: 'Usado',
        stock: 2,
        genero: 'Jazz',
        precio: 24.50, 
        carpeta_imagenes: '/placeholder-record.png' 
    },
    { 
        id: 3, 
        seller_id: 'seller_456',
        titulo: 'Groovy Vinyl 3', 
        artista: 'Artist C', 
        formato: 'Cassette',
        condicion: 'Nuevo',
        stock: 10,
        genero: 'Pop',
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
            
            {/* BARRA DE NAVEGACIÓN SUPERIOR AGREGADA */}
            <nav style={{ 
                display: 'flex', 
                justifyContent: 'flex-end', 
                alignItems: 'center', 
                gap: 24, 
                paddingBottom: 20, 
                borderBottom: '1px solid var(--divider)', 
                marginBottom: 32 
            }}>
                {/* Botón Carrito con ícono SVG */}
                <button style={{ 
                    background: 'none', border: 'none', cursor: 'pointer', 
                    display: 'flex', alignItems: 'center', gap: 8, 
                    color: 'var(--text-dark)', fontSize: 16, fontWeight: 500 
                }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="9" cy="21" r="1"></circle>
                        <circle cx="20" cy="21" r="1"></circle>
                        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                    </svg>
                    Carrito
                </button>

                {/* Botón Salir con Clerk y su ícono SVG */}
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
                                    Agregar al carrito
                                </span>
                            </div>
                        </Link>
                    </article>
                ))}
            </section>
        </main>
    )
}