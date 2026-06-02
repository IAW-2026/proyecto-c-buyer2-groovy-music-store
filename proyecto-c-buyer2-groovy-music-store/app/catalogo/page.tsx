import Image from 'next/image'
import Link from 'next/link' 
import NavBar from '@/app/ui/NavBar'
import Pagination from '@/app/ui/Pagination'
import { currentUser } from "@clerk/nextjs/server"
import { getCatalog } from '@/app/lib/services/seller-api'

export const metadata = {
    title: 'Catálogo - Groovy Music Store',
    description: 'Página principal del catálogo de productos',
}

export default async function CatalogPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    
    const params = await searchParams;
    const currentPage = Number(params?.page) || 1;
    const query = typeof params?.q === 'string' ? params.q : "";
    
    // Capturamos el formato actual de la URL (por defecto "TODO")
    const currentFormato = typeof params?.formato === 'string' ? params.formato : "TODO";

    // Pasamos el formato correcto a la API
    const { data: products, meta } = await getCatalog({ 
        page: currentPage, 
        limit: 12, 
        query,
        formato: currentFormato !== "TODO" ? currentFormato : undefined
    });

    const user = await currentUser();
    const displayName = user?.firstName ?? 'coleccionista';

    const categories = ['TODO', 'VINILOS', 'CDS', 'CASSETTES'];

    return (
        <main className="min-h-screen bg-background font-dm pb-20">
            <NavBar />

            {/* BARRA DE NAVEGACIÓN SECUNDARIA (FILTROS) */}
            <div className="flex items-center justify-between px-8 py-3 bg-foreground text-white/90 text-xs font-medium tracking-[0.12em] uppercase border-b border-[#3a3a3a]">
                <div className="flex items-center gap-2">
                    {categories.map((cat) => {
                        const isActive = currentFormato === cat;
                        
                        const newParams = new URLSearchParams();
                        if (query) newParams.set('q', query);
                        if (cat !== 'TODO') newParams.set('formato', cat);
                        
                        const href = `/catalogo${newParams.toString() ? `?${newParams.toString()}` : ''}`;

                        return (
                            <Link 
                                key={cat}
                                href={href}
                                aria-label={`Filtrar por ${cat}`}
                                className={`px-4 py-1.5 rounded-full font-bold border-2 transition-all duration-300 ${
                                    isActive 
                                        // 1. CORRECCIÓN BOTÓN ACTIVO: Terracota oscuro
                                        ? "bg-[#B83A15] text-white border-[#9C2E0F] shadow-sm text-shadow-contrast"
                                        : "bg-transparent text-white/90 border-transparent hover:text-white hover:border-white/30"
                                }`}
                            >
                                {cat}
                            </Link>
                        );
                    })}
                </div>
            </div>

            {/* VISTA DE PRODUCTOS */}
            <div className="max-w-7xl mx-auto px-8 mt-10">
                <header className="mb-10">
                    <h1 className="font-syne m-0 text-4xl font-semibold text-foreground">Catálogo</h1>
                    <p className="font-dm mt-2 mb-0 text-foreground/80 text-base">
                        {query 
                            ? `Resultados para: "${query}" ${currentFormato !== "TODO" ? `en ${currentFormato}` : ''}` 
                            : `¡Hola ${displayName}! Mira nuestros ${currentFormato !== "TODO" ? currentFormato.toLowerCase() : 'productos más populares'}`}
                    </p>
                    <div className="w-20 h-1 bg-primary mt-4 rounded-full"></div>
                </header>

                <section className="grid gap-6 grid-cols-[repeat(auto-fill,minmax(240px,1fr))]">
                    {products.length > 0 ? (
                        products.map((p) => {
                            const isOutOfStock = p.stock === 0; 
                            return (
                                <article key={p.id} className="bg-card border border-border rounded-xl p-4 shadow-sm flex flex-col hover:shadow-md transition-shadow">
                                    <Link href={`/catalogo/${p.id}`} className="no-underline text-inherit flex-grow flex flex-col" aria-label={`Ver detalles de ${p.titulo}`}>
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
                                        <h2 className="font-syne text-lg font-bold m-0 mb-2 text-foreground">
                                            {p.titulo}
                                        </h2>
                                        {p.artista && (
                                            <div className="font-dm text-foreground/80 text-sm mb-4 font-medium">
                                                {p.artista}
                                            </div>
                                        )}
                                        <div className="mt-auto flex items-center justify-between border-t border-border pt-4">
                                            <div className="font-syne font-bold text-lg text-foreground">
                                                ${(p.precio || 0).toLocaleString('es-AR', { maximumFractionDigits: 0 })}
                                            </div>
                                            {/* 2. CORRECCIÓN BOTÓN DETALLES: Terracota oscuro */}
                                            <span className="font-dm bg-[#B83A15] text-white px-3.5 py-1.5 rounded-md text-sm font-bold border border-[#9C2E0F] shadow-md text-shadow-contrast hover:bg-[#A33313] hover:scale-105 hover:shadow-lg transition-all duration-200 cursor-pointer">
                                                Ver detalles
                                            </span>
                                        </div>
                                    </Link>
                                </article>
                            );
                        })
                    ) : (
                        <div className="col-span-full py-20 text-center text-foreground/80 font-medium">
                            No se encontraron productos en este formato.
                        </div>
                    )}
                </section>

                {meta.totalPages > 1 && (
                    <Pagination totalPages={meta.totalPages} />
                )}
            </div>
        </main>
    )
}