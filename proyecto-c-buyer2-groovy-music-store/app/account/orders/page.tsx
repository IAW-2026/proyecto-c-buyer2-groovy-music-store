import { currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import { getUserOrders } from "@/app/lib/actions/actions-order"
import TrackOrderButton from "@/app/ui/TrackOrderButton"
import { EstadoOrden } from "@/app/lib/definitions"

import { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Mis pedidos - Groovy Music Store",
  description: "Panel de pedidos de usuario de Groovy Music Store." 
}

const getStatusBadgeStyles = (estado: string) => {
  switch (estado) {
    case EstadoOrden.ENTREGADO:
      return 'bg-green-100 text-green-900 border-green-300';
    case EstadoOrden.PAGO_RECHAZADO:
    case EstadoOrden.CANCELADO:
      return 'bg-red-100 text-red-900 border-red-300';
    case EstadoOrden.PAGO_APROBADO:
      return 'bg-emerald-100 text-emerald-900 border-emerald-300';
    case EstadoOrden.EN_CAMINO:
      return 'bg-blue-100 text-blue-900 border-blue-300';
    case EstadoOrden.EN_PREPARACION:
      return 'bg-indigo-100 text-indigo-900 border-indigo-300';
    case EstadoOrden.PROCESANDO:
    default:
      return 'bg-amber-100 text-amber-900 border-amber-300';
  }
};

export default async function OrdersPage() {
    const user = await currentUser();

    if (!user) {
        redirect('/sign-in');
    }

    const orders = await getUserOrders(user.id);

    return (
        <div className="max-w-5xl w-full mx-auto px-4 md:px-0">
            <header className="mb-10">
                <h1 className="font-syne m-0 text-4xl font-semibold text-foreground">Mis Pedidos</h1>
                <p className="font-dm mt-2 mb-0 text-foreground/70 text-base">
                    Historial de compras de {user.firstName || 'tu cuenta'}
                </p>
                <div className="w-20 h-1 bg-primary mt-4 rounded-full"></div>
            </header>
            
            {orders.length === 0 ? (
                <div className="bg-card border border-border rounded-xl p-12 text-center shadow-sm flex flex-col items-center justify-center min-h-[400px]">
                    <h2 className="font-syne text-2xl font-semibold text-foreground mb-3">Aún no hay pedidos</h2>
                    <p className="font-dm text-foreground/70 text-lg mb-6">
                        Cuando adquieras tus primeros vinilos, cassettes o CDs, aparecerán aquí.
                    </p>
                    <Link 
                        href="/" 
                        className="bg-primary text-white font-dm px-6 py-2.5 rounded-full hover:opacity-90 transition-opacity font-medium"
                    >
                        Explorar catálogo
                    </Link>
                </div>
            ) : (
                <div className="flex flex-col gap-4">
                    {orders.map((order) => {
                        const estadoActual = order.estado as EstadoOrden || EstadoOrden.PROCESANDO;
                        
                        
                        const mostrarSeguimiento = [
                          EstadoOrden.EN_PREPARACION, 
                          EstadoOrden.EN_CAMINO,
                        ].includes(estadoActual);

                        return (
                            <div 
                                key={order.nro_orden_usuario} 
                                className="bg-card border border-border rounded-xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 hover:shadow-md transition-shadow"
                            >
                                <div className="flex flex-col gap-2">
                                    <div className="flex flex-wrap items-center gap-3">
                                        <h2 className="font-syne font-semibold text-lg text-foreground m-0">
                                            Orden #{order.nro_orden_usuario}
                                        </h2>
                                        
                                        <span 
                                            className={`font-dm px-3 py-1 text-xs md:text-sm font-bold border rounded-full uppercase tracking-wider ${getStatusBadgeStyles(estadoActual)}`}
                                            role="status"
                                            aria-label={`Estado del pedido: ${estadoActual}`}
                                        >
                                            {estadoActual}
                                        </span>
                                    </div>
                                    <p className="font-dm text-foreground/70 text-sm m-0">
                                        Realizada el {new Date(order.fecha).toLocaleDateString('es-AR')}
                                    </p>
                                </div>
                                
                                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 justify-between md:justify-end w-full md:w-auto">
                                    <div className="text-left sm:text-right w-full sm:w-auto border-t sm:border-none pt-4 sm:pt-0 border-border">
                                        <p className="font-dm text-foreground/70 text-xs tracking-widest uppercase mb-1">Total</p>
                                        <p className="font-syne font-bold text-xl text-foreground m-0">
                                            ${(order.monto || 0).toLocaleString('es-AR', { maximumFractionDigits: 0 })}
                                        </p>
                                    </div>

                                    <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto mt-2 sm:mt-0">
                                        <Link 
                                            href={`/account/orders/${order.nro_orden_usuario}`}
                                            className="font-dm text-sm font-medium border border-primary text-primary px-5 py-2.5 rounded-full hover:bg-primary hover:text-white transition-colors text-center w-full sm:w-auto flex-1 sm:flex-none"
                                            aria-label={`Ver detalles de la orden ${order.nro_orden_usuario}`}
                                        >
                                            Ver detalles
                                        </Link>
                                        
                                        {mostrarSeguimiento && (
                                            <div className="w-full sm:w-auto flex-1 sm:flex-none">
                                                <TrackOrderButton orderId={order.nro_orden_usuario} direccion={order.direccion} />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}