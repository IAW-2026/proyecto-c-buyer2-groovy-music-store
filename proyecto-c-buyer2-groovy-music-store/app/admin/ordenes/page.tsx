import AdminNavBar from '@/app/ui/AdminNavBar'
import Link from 'next/link'
import prisma from "@/app/lib/prisma"
import { actualizarOrden } from '@/app/lib/actions/actions-admin'
import { getProductQuickDetail } from '@/app/lib/services/seller-api'
import FormularioActualizarOrden from '@/app/ui/FormularioActualizarOrden'

export const metadata = { title: 'Órdenes - Admin Groovy' }

// Server Component auxiliar para resolver el título de forma asíncrona
async function TituloProducto({ id }: { id: string }) {
    const producto = await getProductQuickDetail(id);
    const tituloMostrar = producto ? producto.titulo : `ID: ${id.substring(0, 8)}`;

    return (
        <div className="font-semibold text-foreground truncate max-w-[220px]" title={tituloMostrar}>
            {tituloMostrar}
        </div>
    );
}

export default async function AdminOrdenesPage({ searchParams }: { searchParams: Promise<{ filtro?: string }> }) {
    
    const params = await searchParams;
    const filtroActual = params.filtro;

    const ordenes = await prisma.orden.findMany({
        where: filtroActual ? { estado: filtroActual } : {},
        orderBy: { fecha: 'desc' },
        include: { 
            buyer: true, 
            items: true,
            direccion: true 
        } 
    });

    return (
        <main className="min-h-screen bg-background font-dm pb-20">
            <AdminNavBar />

            <div className="flex items-center justify-between px-8 py-3 bg-foreground text-white/50 text-xs font-medium tracking-[0.12em] uppercase border-b border-[#3a3a3a]">
                <div className="flex items-center gap-8">
                    <Link href="/admin"><button className="hover:text-white transition-colors">RESUMEN</button></Link>
                    <button className="bg-primary text-white px-5 py-1.5 rounded-full">ÓRDENES</button>
                    <Link href="/admin/compradores"><button className="hover:text-white transition-colors">COMPRADORES</button></Link>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-8 mt-10">
                <header className="mb-10 flex justify-between items-end gap-4 flex-wrap">
                    <div>
                        <h1 className="font-syne m-0 text-4xl font-semibold text-foreground">Gestión de Órdenes</h1>
                        <div className="w-20 h-1 bg-primary mt-4 rounded-full"></div>
                    </div>
                    
                    {/* Filtro desplegable mediante formulario GET nativo */}
                    <form method="GET" action="/admin/ordenes" className="flex items-center gap-3 bg-card border border-border px-4 py-2 rounded-xl shadow-sm">
                        <label className="text-xs text-foreground/70 font-bold uppercase tracking-wider">Estado:</label>
                        <select 
                            name="filtro" 
                            defaultValue={filtroActual || ""}
                            className="bg-background border border-border text-foreground text-sm rounded-md p-1.5 outline-none focus:border-primary font-medium"
                        >
                            <option value="">Todas las órdenes</option>
                            <option value="Pendiente">Pendiente</option>
                            <option value="Pagado">Pagado</option>
                            <option value="Enviado">Enviado</option>
                            <option value="Cancelado">Cancelado</option>
                        </select>
                        
                        <button type="submit" className="bg-primary text-white px-3 py-1.5 rounded-md text-xs font-bold transition-opacity hover:opacity-90">
                            Filtrar
                        </button>
                    </form>
                </header>

                <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-foreground text-white text-xs tracking-widest uppercase font-syne">
                                <th className="p-4 font-medium">Orden / Fecha</th>
                                <th className="p-4 font-medium">Comprador y Destino</th>
                                <th className="p-4 font-medium">Desglose de Ítems</th>
                                <th className="p-4 font-medium text-right">Monto</th>
                                <th className="p-4 font-medium text-center">Supervisión y Cambios</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm">
                            {ordenes.map((orden) => (
                                <tr key={orden.nro_orden} className="border-b border-border hover:bg-background transition-colors text-foreground alignment-top">
                                    <td className="p-4 align-top">
                                        <div className="font-bold text-primary">#{orden.nro_orden_usuario}</div>
                                        <div className="text-xs text-foreground/60 mt-1">{new Date(orden.fecha).toLocaleDateString('es-AR')}</div>
                                    </td>
                                    
                                    <td className="p-4 align-top">
                                        <div className="font-medium">{orden.buyer?.nombre || 'Usuario'}</div>
                                        <div className="text-xs text-foreground/60 truncate max-w-[180px]">{orden.buyer?.mail}</div>
                                        {orden.direccion && (
                                            <div className="text-xs text-primary/80 mt-2 bg-foreground/5 p-1.5 rounded border border-border/40">
                                                📍 {orden.direccion.calle}, {orden.direccion.ciudad}
                                            </div>
                                        )}
                                    </td>
                                    
                                    <td className="p-4 align-top">
                                        <div className="space-y-1.5">
                                            {orden.items?.map((item) => (
                                                <div key={item.id_item_orden} className="text-xs bg-background/60 p-1.5 rounded border border-border/30">
                                                    <div className="font-semibold text-foreground truncate max-w-[220px]">
                                                        ID: {item.producto_id}
                                                    </div>
                                                    <TituloProducto id={item.producto_id} />
                                                    <div className="text-foreground/60 flex justify-between mt-0.5">
                                                        <span>Cant: {item.cantidad}</span>
                                                        <span className="font-bold text-foreground">${item.precio_unit}</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </td>
                                    
                                    <td className="p-4 align-top text-right font-bold text-base">
                                        ${orden.monto.toLocaleString('es-AR', { maximumFractionDigits: 0 })}
                                    </td>
                                    
                                    <td className="p-4 align-top">
                                        <FormularioActualizarOrden orden={orden} />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </main>
    )
}