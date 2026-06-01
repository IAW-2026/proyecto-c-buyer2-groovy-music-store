import { currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import prisma from "@/app/lib/prisma"
import { ArrowLeftIcon } from "@heroicons/react/24/outline"
import { getProductQuickDetail } from "@/app/lib/services/seller-api" 

import {Metadata } from 'next'

export const metadata: Metadata = {
  title: "Mis pedidos - Groovy Music Store",
  description: "Panel de pedidos de usuario de Groovy Music Store." }

export default async function OrderDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    
    const user = await currentUser();

    if (!user) {
        redirect('/sign-in');
    }

    const { id } = await params;

    const orderId = parseInt(id);

    if (isNaN(orderId)) {
        redirect('/account/orders'); 
    }

    
    const order = await prisma.orden.findUnique({
        where: { nro_orden_usuario: orderId },
        include: {
            direccion: true,
            items: true,
        }
    });

    //  Validamos que exista y que le pertenezca a este usuario. Si no, redirigimos.
    if (!order || order.id_buyer !== user.id) {
        redirect('/account/orders');
    }

    const itemsConDetalles = await Promise.all(
        order.items.map(async (item) => { 
            const detalles = await getProductQuickDetail(item.producto_id);
            return {
                ...item,
                producto: detalles
            };
        })
    );

    // Calculamos el subtotal sumando (cantidad * precio_unit) de cada ítem
    const subtotal = order.items.reduce((acumulador, item) => {
        return acumulador + (item.cantidad * item.precio_unit);
    }, 0);

    return (
        <div className="max-w-5xl w-full mx-auto">
            {/* ENCABEZADO Y BOTÓN DE VOLVER */}
            <header className="mb-10">
                <Link href="/account/orders" className="inline-flex items-center gap-2 font-dm text-sm text-foreground/70 hover:text-primary transition-colors mb-6">
                    <ArrowLeftIcon className="w-4 h-4" />
                    Volver a mis pedidos
                </Link>
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <h1 className="font-syne m-0 text-4xl font-semibold text-foreground">
                            Orden #{order.nro_orden_usuario}
                        </h1>
                        <p className="font-dm mt-2 mb-0 text-foreground/70 text-base">
                            Realizada el {new Date(order.fecha).toLocaleDateString('es-AR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                        </p>
                    </div>
                    <div className="bg-primary/10 text-primary border border-primary/20 px-4 py-2 rounded-full font-dm font-medium text-sm inline-block w-fit">
                        {order.estado.toUpperCase()}
                    </div>
                </div>
                <div className="w-20 h-1 bg-primary mt-6 rounded-full"></div>
            </header>
            
            {/* GRILLA DE INFORMACIÓN (Resumen y Envío) */}
            <div className="grid grid-cols-1 md:grid-cols-1 gap-6 mb-6">
                <div className="bg-card border border-border rounded-xl p-8 shadow-sm">
                    <h3 className="font-syne text-xl font-semibold text-foreground mb-4 border-b border-border pb-2">
                        Resumen de la compra
                    </h3>
                    
                    <div className="flex justify-between items-center mb-2 font-dm">
                        <span className="text-foreground/70">Subtotal</span>
                        <span className="text-foreground font-medium">
                            ${subtotal.toLocaleString('es-AR', { maximumFractionDigits: 0 })}
                        </span>
                    </div>

                    {/* Fila extra para que quede claro que el envío está en el Total */}
                    {order.monto > subtotal && (
                        <div className="flex justify-between items-center mb-2 font-dm">
                            <span className="text-foreground/70">Envío</span>
                            <span className="text-foreground font-medium">
                                ${(order.monto - subtotal).toLocaleString('es-AR', { maximumFractionDigits: 0 })}
                            </span>
                        </div>
                    )}

                    <div className="flex justify-between items-center mt-6 pt-4 border-t border-border font-syne text-lg">
                        <span className="font-semibold text-foreground">Total Pagado</span>
                        <span className="font-bold text-primary">
                            ${(order.monto || 0).toLocaleString('es-AR', { maximumFractionDigits: 0 })}
                        </span>
                    </div>
                </div>
            </div>

            {/* LISTADO DE ARTÍCULOS */}
            <div className="bg-card border border-border rounded-xl p-8 shadow-sm">
                <h3 className="font-syne text-xl font-semibold text-foreground mb-6 border-b border-border pb-2">
                    Artículos en tu orden
                </h3>
                
                <div className="flex flex-col gap-6">
                    {itemsConDetalles.map((item) => (
                        <div key={item.id_item_orden} className="flex items-center gap-6 pb-6 border-b border-border/50 last:border-0 last:pb-0">
                            
                            {/* Imagen del producto (usamos un placeholder si la API no trae imagen) */}
                            <div className="w-20 h-20 relative bg-[#e9e9e9] rounded-md overflow-hidden flex-shrink-0">
                                <Image 
                                    src={item.producto?.imagen_principal || '/placeholder-record.png'} 
                                    alt={item.producto?.titulo || 'Producto'} 
                                    fill 
                                    className="object-cover"
                                />
                            </div>

                            {/* Detalles del producto */}
                            <div className="flex-grow">
                                <h4 className="font-syne font-semibold text-lg text-foreground">
                                    {item.producto?.titulo || 'Producto no disponible'}
                                </h4>
                                {item.producto?.artista && (
                                    <p className="font-dm text-foreground/70 text-sm">
                                        {item.producto.artista}
                                    </p>
                                )}
                            </div>

                            {/* Cantidad y Precio */}
                            <div className="text-right font-dm">
                                <p className="text-foreground/70 text-sm mb-1">
                                    {item.cantidad} x ${(item.precio_unit).toLocaleString('es-AR', { maximumFractionDigits: 0 })}
                                </p>
                                <p className="font-syne font-bold text-foreground text-lg">
                                    ${(item.cantidad * item.precio_unit).toLocaleString('es-AR', { maximumFractionDigits: 0 })}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}