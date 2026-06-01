import AdminNavBar from '@/app/ui/AdminNavBar'
import Link from 'next/link'
import prisma from "@/app/lib/prisma"



export default async function AdminDashboardPage() {
    // Consultas de métricas rápidas a la base de datos
    const totalUsuarios = await prisma.usuario.count();
    const totalOrdenes = await prisma.orden.count();
    
    // Suma de los montos de las órdenes
    const sumatoria = await prisma.orden.aggregate({
        _sum: { monto: true }
    });
    const ingresosTotales = sumatoria._sum.monto || 0;

    return (
        <main className="min-h-screen bg-background font-dm pb-20">
            <AdminNavBar />

            {/* BARRA DE NAVEGACIÓN SECUNDARIA ADMIN */}
            <div className="flex items-center justify-between px-8 py-3 bg-foreground text-white/50 text-xs font-medium tracking-[0.12em] uppercase border-b border-[#3a3a3a]">
                <div className="flex items-center gap-8">
                    <Link href="/admin"><button className="bg-primary text-white px-5 py-1.5 rounded-full">RESUMEN</button></Link>
                    <Link href="/admin/ordenes"><button className="hover:text-white transition-colors">ÓRDENES</button></Link>
                    <Link href="/admin/compradores"><button className="hover:text-white transition-colors">COMPRADORES</button></Link>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-8 mt-10">
                <header className="mb-10">
                    <h1 className="font-syne m-0 text-4xl font-semibold text-foreground">Panel de Control</h1>
                    <p className="font-dm mt-2 mb-0 text-foreground/70 text-base">
                        Métricas generales de la Buyer App
                    </p>
                    <div className="w-20 h-1 bg-primary mt-4 rounded-full"></div>
                </header>

                <section className="grid gap-6 grid-cols-1 md:grid-cols-3">
                    {/* Tarjeta Métricas */}
                    <article className="bg-card border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                        <h2 className="font-syne text-lg font-semibold m-0 mb-2 text-foreground/70">Compradores Registrados</h2>
                        <div className="font-syne font-bold text-4xl text-foreground">{totalUsuarios}</div>
                    </article>

                    <article className="bg-card border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                        <h2 className="font-syne text-lg font-semibold m-0 mb-2 text-foreground/70">Órdenes Totales</h2>
                        <div className="font-syne font-bold text-4xl text-foreground">{totalOrdenes}</div>
                    </article>

                    <article className="bg-card border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                        <h2 className="font-syne text-lg font-semibold m-0 mb-2 text-foreground/70">Ingresos Totales</h2>
                        <div className="font-syne font-bold text-4xl text-primary">
                            ${ingresosTotales.toLocaleString('es-AR', { maximumFractionDigits: 0 })}
                        </div>
                    </article>
                </section>
            </div>
        </main>
    )
}