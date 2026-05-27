import { currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import { getUserOrders } from "@/app/lib/actions/actions-order"
import TrackOrderButton from "@/app/ui/TrackOrderButton"

export default async function OrdersPage() {
    // 1. Obtener la sesión del usuario desde el servidor
    const user = await currentUser();

    // 2. Si no hay sesión activa, redirigir al login
    if (!user) {
        redirect('/sign-in');
    }

    // 3. Traer los pedidos usando la Server Action
    const orders = await getUserOrders(user.id);

    return (
        <div className="max-w-5xl w-full mx-auto">
            {/* ENCABEZADO DE LA SECCIÓN */}
            <header className="mb-10">
                <h1 className="font-syne m-0 text-4xl font-semibold text-foreground">Mis Pedidos</h1>
                <p className="font-dm mt-2 mb-0 text-foreground/70 text-base">
                    Historial de compras de {user.firstName || 'tu cuenta'}
                </p>
                <div className="w-20 h-1 bg-primary mt-4 rounded-full"></div>
            </header>
            
            {/* ESTADO VACÍO: SI EL USUARIO NO TIENE PEDIDOS */}
            {orders.length === 0 ? (
                <div className="bg-card border border-border rounded-xl p-12 text-center shadow-sm flex flex-col items-center justify-center min-h-[400px]">
                    <h3 className="font-syne text-2xl font-semibold text-foreground mb-3">Aún no hay pedidos</h3>
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
                // LISTADO DE ORDENES EXISTENTES
                <div className="flex flex-col gap-4">
                    {orders.map((order) => (
                        <div 
                            key={order.nro_orden_usuario} 
                            className="bg-card border border-border rounded-xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 hover:shadow-md transition-shadow"
                        >
                            {/* Información de Identificación de la orden */}
                            <div>
                                <h3 className="font-syne font-semibold text-lg text-foreground mb-1">
                                    Orden #{order.nro_orden_usuario}
                                </h3>
                                <p className="font-dm text-foreground/70 text-sm">
                                    Realizada el {new Date(order.fecha).toLocaleDateString('es-AR')}
                                </p>
                            </div>
                            
                            {/* Detalles de Facturación y Acciones */}
                            <div className="flex items-center gap-6 justify-between md:justify-end flex-wrap md:flex-nowrap">
                                <div className="text-right">
                                    <p className="font-dm text-foreground/70 text-xs tracking-widest uppercase mb-1">Total</p>
                                    <p className="font-syne font-bold text-xl text-foreground">
                                        ${(order.monto || 0).toLocaleString('es-AR', { maximumFractionDigits: 0 })}
                                    </p>
                                </div>

                                {/* BOTONES DE ACCIÓN: Detalles y Envío */}
                                <div className="flex items-center gap-3 mt-4 md:mt-0">
                                    <Link 
                                        href={`/account/orders/${order.nro_orden_usuario}`}
                                        className="font-dm text-sm font-medium border border-primary text-primary px-5 py-2 rounded-full hover:bg-primary hover:text-white transition-colors"
                                    >
                                        Ver detalles
                                    </Link>
                                    
                                    <TrackOrderButton orderId={order.nro_orden_usuario} direccion={order.direccion} />  
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}