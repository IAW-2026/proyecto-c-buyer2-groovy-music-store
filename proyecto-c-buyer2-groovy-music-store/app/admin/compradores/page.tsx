import AdminNavBar from '@/app/ui/AdminNavBar'
import Link from 'next/link'
import prisma from "@/app/lib/prisma"

export const metadata = { title: 'Compradores - Admin Groovy' }

export default async function AdminCompradoresPage() {
    const usuarios = await prisma.usuario.findMany({
        orderBy: { nombre: 'asc' },
        include: { 
            direcciones: true, 
            ordenesComoComprador: true 
        }
    });

    return (
        <main className="min-h-screen bg-background font-dm pb-20">
            <AdminNavBar />

            <div className="flex items-center justify-between px-8 py-3 bg-foreground text-white/50 text-xs font-medium tracking-[0.12em] uppercase border-b border-[#3a3a3a]">
                <div className="flex items-center gap-8">
                    <Link href="/admin"><button className="hover:text-white transition-colors">RESUMEN</button></Link>
                    <Link href="/admin/ordenes"><button className="hover:text-white transition-colors">ÓRDENES</button></Link>
                    <button className="bg-primary text-white px-5 py-1.5 rounded-full">COMPRADORES</button>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-8 mt-10">
                <header className="mb-10">
                    <h1 className="font-syne m-0 text-4xl font-semibold text-foreground">Auditoría de Compradores</h1>
                    <div className="w-20 h-1 bg-primary mt-4 rounded-full"></div>
                </header>

                <div className="grid gap-6 grid-cols-[repeat(auto-fill,minmax(320px,1fr))]">
                    {usuarios.map((usr) => (
                        <article key={usr.clerk_id} className="bg-card border border-border rounded-xl p-6 shadow-sm flex flex-col hover:shadow-md transition-shadow">
                            <h2 className="font-syne text-xl font-semibold m-0 mb-1 text-foreground">{usr.nombre}</h2>
                            <p className="font-dm text-foreground/70 text-sm mb-4">{usr.mail}</p>
                            
                            <div className="bg-background rounded-lg p-4 mb-4 border border-border/50 text-sm space-y-3">
                                {/* Bloque dinámico para listar textualmente las ubicaciones del cliente */}
                                <div>
                                    <span className="text-foreground/50 text-xs font-bold uppercase tracking-wider block mb-2">
                                        Direcciones Guardadas ({usr.direcciones?.length || 0}):
                                    </span>
                                    {usr.direcciones && usr.direcciones.length > 0 ? (
                                        <ul className="space-y-2 text-xs text-foreground/90 max-h-28 overflow-y-auto pr-1">
                                            {usr.direcciones.map((dir) => (
                                                <li key={dir.id} className="bg-card border border-border/40 p-2 rounded text-foreground/80 leading-relaxed">
                                                    🏠 {dir.calle}, {dir.ciudad}, {dir.provincia} ({dir.cod_postal}), {dir.pais}
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p className="text-xs text-foreground/40 italic m-0">Sin domicilios declarados</p>
                                    )}
                                </div>
                                
                                <div className="flex justify-between border-t border-border/30 pt-2 items-center">
                                    <span className="text-foreground/70 text-xs">Órdenes totales:</span>
                                    <span className="font-bold text-primary bg-primary/10 px-2.5 py-0.5 rounded-full text-xs">
                                        {usr.ordenesComoComprador?.length || 0}
                                    </span>
                                </div>
                            </div>
                            
                            <div className="mt-auto border-t border-border pt-4 text-center">
                                <span className="font-dm text-foreground/40 text-[10px] uppercase tracking-widest">
                                    Clerk ID: {usr.clerk_id.substring(0, 14)}...
                                </span>
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </main>
    )
}