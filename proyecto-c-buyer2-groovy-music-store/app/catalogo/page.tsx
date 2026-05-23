import Image from 'next/image'
import Link from 'next/link'
import { SignOutButton } from "@clerk/nextjs"
import { MagnifyingGlassIcon, ArrowRightEndOnRectangleIcon } from '@heroicons/react/24/outline'
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
        <main className="min-h-screen bg-background font-dm pb-20">
            
            {/* BARRA DE NAVEGACIÓN SUPERIOR */}
           <nav className="flex items-center justify-between w-full px-4 md:px-8 py-4 bg-primary text-white">
                
                {/* COLUMNA IZQUIERDA: En desktop da balance (flex-1) con elementos invisibles. En móvil desaparece para dar espacio. */}
                <div className="hidden md:flex flex-1 gap-8 opacity-0 pointer-events-none">
                    <span className="text-xs">Vinilos</span>
                </div>

                {/* COLUMNA CENTRAL: El logo. shrink-0 para que el texto no se aplaste */}
                <div className="flex shrink-0">
                    <Link href="/" className="font-cormorant text-2xl md:text-3xl font-light tracking-[0.15em] md:tracking-[0.55em] select-none">
                        GROOVY
                    </Link>
                </div>

                {/* COLUMNA DERECHA: tira el contenido a la derecha (justify-end) */}
                <div className="flex flex-1 items-center justify-end gap-3 md:gap-6">
                    
                    {/* Búsqueda */}
                    <button className="hover:opacity-80 transition-opacity p-1">
                        <MagnifyingGlassIcon className="w-5 h-5" />
                    </button>

                    {/* Botón Salir con Clerk */}
                    <SignOutButton redirectUrl="/">
                        <button className="flex items-center hover:opacity-80 transition-opacity text-sm font-medium tracking-wide cursor-pointer bg-transparent border-none text-white p-1" title="Salir">
                            <ArrowRightEndOnRectangleIcon className="w-5 h-5" />
                        </button>
                    </SignOutButton>

                    {/* Componente del Carrito */}
                    <div className="p-1">
                        <CartServer />
                    </div>
                    
                </div>
            </nav>

            {/* BARRA DE NAVEGACIÓN SECUNDARIA  */}
            <div className="flex items-center justify-between px-8 py-3 bg-foreground text-white/50 text-xs font-medium tracking-[0.12em] uppercase border-b border-[#3a3a3a]">
                <div className="flex items-center gap-8">
                    <button className="bg-primary text-white px-5 py-1.5 rounded-full">ALL</button>
                    <button className="hover:text-white transition-colors">VINYL</button>
                    <button className="hover:text-white transition-colors">CD</button>
                    <button className="hover:text-white transition-colors">CASSETTE</button>
                </div>
            </div>

            {/* VISTA DE PRODUCTOS */}
            <div className="max-w-7xl mx-auto px-8 mt-10">
                <header className="mb-10">
                    <h1 className="font-syne m-0 text-4xl font-semibold text-foreground">Catálogo</h1>
                    <p className="font-dm mt-2 mb-0 text-foreground/70 text-base">Mira nuestros productos más populares</p>
                    <div className="w-20 h-1 bg-primary mt-4 rounded-full"></div>
                </header>

                <section className="grid gap-6 grid-cols-[repeat(auto-fill,minmax(240px,1fr))]">
                    {products.map((p) => (
                        <article key={p.id} className="bg-card border border-border rounded-xl p-4 shadow-sm flex flex-col hover:shadow-md transition-shadow">
                            <Link href={`/catalogo/${p.id}`} className="no-underline text-inherit flex-grow flex flex-col">
                                
                                <div className="w-full h-48 relative mb-4 bg-[#e9e9e9] rounded-lg overflow-hidden">
                                    <Image 
                                        src={p.carpeta_imagenes || '/placeholder-record.png'} 
                                        alt={p.titulo} 
                                        fill 
                                        className="object-cover"
                                    />
                                </div>
                                
                                <h2 className="font-syne text-lg font-semibold m-0 mb-2 text-foreground">{p.titulo}</h2>
                                {p.artista && <div className="font-dm text-foreground/70 text-sm mb-4">{p.artista}</div>}
                                
                                <div className="mt-auto flex items-center justify-between border-t border-border pt-4">
                                    <div className="font-syne font-bold text-lg text-foreground">
                                        ${p.precio.toFixed(2)}
                                    </div>
                                    <span className="font-dm bg-primary text-white px-3.5 py-1.5 rounded-md text-sm font-medium hover:opacity-90 transition-opacity">
                                        Ver detalles
                                    </span>
                                </div>
                                
                            </Link>
                        </article>
                    ))}
                </section>
            </div>
        </main>
    )
}