import Image from 'next/image'
import Link from 'next/link' 
import NavBar from '@/app/ui/NavBar'
import { currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import prisma from "@/app/lib/prisma"


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

// Transformamos el componente en async para poder usar await
export default async function CatalogPage() {
    const products = sampleProducts

    // 1. Obtenemos la info del usuario desde Clerk
    const user = await currentUser();

    // 2. Si no está logueado, lo redirigimos
    if (!user) {
        redirect('/sign-in');
    }

    // 3. Sincronizamos con el modelo "Usuario" de prisma
    await prisma.usuario.upsert({
        where: { 
            clerk_id: user.id 
        },
        update: {
            mail: user.emailAddresses[0]?.emailAddress ?? "",
            nombre: user.firstName ?? "Usuario",
        },
        create: {
            clerk_id: user.id,
            mail: user.emailAddresses[0]?.emailAddress ?? "",
            nombre: user.firstName ?? "Usuario",
        }
    });

    return (
        <main className="min-h-screen bg-background font-dm pb-20">
            
           <NavBar />

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
                    {/* Mensaje de bienvenida personalizado con el nombre del usuario */}
                    <p className="font-dm mt-2 mb-0 text-foreground/70 text-base">
                        ¡Hola {user.firstName || 'coleccionista'}! Mira nuestros productos más populares
                    </p>
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