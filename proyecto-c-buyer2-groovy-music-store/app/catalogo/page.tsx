import Image from 'next/image'
import Link from 'next/link' 
import NavBar from '@/app/ui/NavBar'
import { currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import prisma from "@/app/lib/prisma"

import {getCatalog} from '@/app/lib/services/seller-api'



export const metadata = {
    title: 'Catálogo - Groovy Music Store',
    description: 'Página principal del catálogo de productos',
}


export default async function CatalogPage() {
    const products = await getCatalog();

    // 1. Obtenemos la info del usuario desde Clerk
    const user = await currentUser();
    const displayName = user?.firstName ?? 'coleccionista';


    return (
        <main className="min-h-screen bg-background font-dm pb-20">
            
           <NavBar />

            {/* BARRA DE NAVEGACIÓN SECUNDARIA  */}
            <div className="flex items-center justify-between px-8 py-3 bg-foreground text-white/50 text-xs font-medium tracking-[0.12em] uppercase border-b border-[#3a3a3a]">
                <div className="flex items-center gap-8">
                    <button className="bg-primary text-white px-5 py-1.5 rounded-full">TODO</button>
                    <button className="hover:text-white transition-colors">VINILOS</button>
                    <button className="hover:text-white transition-colors">CDS</button>
                    <button className="hover:text-white transition-colors">CASSETTES</button>
                </div>
            </div>

            {/* VISTA DE PRODUCTOS */}
            <div className="max-w-7xl mx-auto px-8 mt-10">
                <header className="mb-10">
                    <h1 className="font-syne m-0 text-4xl font-semibold text-foreground">Catálogo</h1>
                    {/* Mensaje de bienvenida personalizado con el nombre del usuario */}
                    <p className="font-dm mt-2 mb-0 text-foreground/70 text-base">
                        ¡Hola {displayName}! Mira nuestros productos más populares
                    </p>
                    <div className="w-20 h-1 bg-primary mt-4 rounded-full"></div>
                </header>

                <section className="grid gap-6 grid-cols-[repeat(auto-fill,minmax(240px,1fr))]">
                    {products.map((p) => {
                        const isOutOfStock = p.stock === 0; 
                    
                        return (
                            <article key={p.id} className="bg-card border border-border rounded-xl p-4 shadow-sm flex flex-col hover:shadow-md transition-shadow">
                                <Link href={`/catalogo/${p.id}`} className="no-underline text-inherit flex-grow flex flex-col">
                                    
                                    
                                    <div className="w-full aspect-square relative mb-4 bg-[#f8f8f8] border border-gray-200 rounded-lg overflow-hidden p-4 flex items-center justify-center group">
                                        <Image 
                                            src={p.imagen_principal || '/placeholder-record.png'} 
                                            alt={p.titulo} 
                                            fill 
                                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                            
                                            className={`object-contain p-4 transition-transform duration-300 group-hover:scale-105 ${
                                                isOutOfStock ? 'grayscale opacity-60 mix-blend-multiply' : ''
                                            }`}
                                        />
                                        
                                        {isOutOfStock && (
                                            <div className="absolute top-2 right-2 bg-black/80 text-white text-xs font-bold px-2.5 py-1 rounded uppercase tracking-wider backdrop-blur-sm z-10">
                                                Agotado
                                            </div>
                                        )}
                                    </div>
                                    
                                   
                                    <h2 className="font-syne text-lg font-semibold m-0 mb-2 text-foreground">
                                        {p.titulo}
                                    </h2>
                                    
                                    {p.artista && (
                                        <div className="font-dm text-foreground/70 text-sm mb-4">
                                            {p.artista}
                                        </div>
                                    )}
                                    
                                    <div className="mt-auto flex items-center justify-between border-t border-border pt-4">
                                        <div className="font-syne font-bold text-lg text-foreground">
                                            ${(p.precio || 0).toLocaleString('es-AR', { maximumFractionDigits: 0 })}
                                        </div>
                                        
                                        
                                        <span className="font-dm bg-primary text-white px-3.5 py-1.5 rounded-md text-sm font-medium hover:opacity-90 transition-opacity">
                                            Ver detalles
                                        </span>
                                    </div>
                                    
                                </Link>
                            </article>
                        );
                    })}
                </section>
            </div>
        </main>
    )
}