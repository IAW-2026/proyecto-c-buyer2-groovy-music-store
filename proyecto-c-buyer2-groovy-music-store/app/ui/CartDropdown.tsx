'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { ShoppingCartIcon, TrashIcon, PlusIcon, MinusIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

// Importamos Server Actions reales
import { actualizarCantidadItemBD, eliminarItemBD } from '@/app/lib/actions/actions-cart';
//Tipos
import type { HydratedCartItem } from '@/app/lib/definitions';

interface CartDropdownProps {
    items: HydratedCartItem[];
}

export default function CartDropdown({ items }: CartDropdownProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [cartItems, setCartItems] = useState<HydratedCartItem[]>(items);

    // Si el servidor manda datos nuevos (por un revalidatePath), actualizamos el estado local
    useEffect(() => {
        setCartItems(items);
    }, [items]);

    const handleUpdateQuantity = async (id_carrito: string, producto_id: string, delta: number) => {
        const item = cartItems.find(i => i.producto_id === producto_id);
        if (!item) return;

        const stockMaximo = item.producto.stock; 
        let nuevaCantidad = item.cantidad + delta;

        if (nuevaCantidad < 1) nuevaCantidad = 1;
        if (nuevaCantidad > stockMaximo) nuevaCantidad = stockMaximo;

        if (nuevaCantidad === item.cantidad) return; 

        // 1. Actualización visual instantánea
        setCartItems(prev => prev.map(i => 
            i.producto_id === producto_id ? { ...i, cantidad: nuevaCantidad } : i
        ));

        // 2. Ejecutar Action en BD
        const result = await actualizarCantidadItemBD(id_carrito, producto_id, nuevaCantidad);
        
        // 3. Revertir si hubo error en BD
        if (!result.success) {
            console.error(result.error);
            setCartItems(prev => prev.map(i => 
                i.producto_id === producto_id ? { ...i, cantidad: item.cantidad } : i
            ));
        }
    };

    const handleRemoveItem = async (id_carrito: string, producto_id: string) => {
        const itemAEliminar = cartItems.find(i => i.producto_id === producto_id);
        
        // 1. Borrado visual instantáneo
        setCartItems(prev => prev.filter(i => i.producto_id !== producto_id));

        // 2. Ejecutar Action en BD
        const result = await eliminarItemBD(id_carrito, producto_id);
        
        // 3. Revertir si hubo error en BD
        if (!result.success && itemAEliminar) {
            console.error(result.error);
            setCartItems(prev => [...prev, itemAEliminar]);
        }
    };

    // Agrupación por Vendedor
    const groupedCart = cartItems.reduce((acc, item) => {
        const sellerId = item.producto.seller_id || 'Vendedor Desconocido';
        if (!acc[sellerId]) acc[sellerId] = [];
        acc[sellerId].push(item);
        return acc;
    }, {} as Record<string, HydratedCartItem[]>);

    const totalItems = cartItems.reduce((acc, item) => acc + item.cantidad, 0);

    return (
        <div className="relative font-dm">
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center justify-center p-2 hover:opacity-80 transition-opacity text-white relative bg-transparent border-none cursor-pointer"
                title="Carrito"
            >
                <ShoppingCartIcon className="w-5 h-5" />
                {totalItems > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#2E2E2E] text-[10px] font-bold text-white">
                        {totalItems}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-4 w-[300px] sm:w-[360px] bg-card border border-border rounded-xl shadow-lg z-50 flex flex-col max-h-[70vh]">
                    <div className="p-4 border-b border-border bg-black/5 rounded-t-xl">
                        <h3 className="m-0 text-base font-semibold text-foreground font-syne">
                            Productos en tu carrito
                        </h3>
                    </div>

                    <div className="overflow-y-auto p-4 flex flex-col gap-6">
                        {cartItems.length === 0 ? (
                            <p className="text-center text-foreground/60 my-4 text-sm">Tu carrito está vacío</p>
                        ) : (
                            Object.entries(groupedCart).map(([vendedorId, itemsDelVendedor]) => {
                                const idSellerReal = itemsDelVendedor[0].producto.seller_id;
                                const subtotal = itemsDelVendedor.reduce((acc, item) => acc + (item.producto.precio * item.cantidad), 0);

                                return (
                                    <div key={vendedorId} className="border border-border rounded-lg p-3 bg-white shadow-sm">
                                        <h4 className="m-0 mb-3 text-[13px] font-semibold text-foreground border-b border-border pb-1.5 font-dm">
                                            Vendedor: <span className="text-primary">{vendedorId}</span>
                                        </h4>
                                        
                                        <ul className="list-none p-0 m-0 mb-3 flex flex-col gap-4">
                                            {itemsDelVendedor.map((item) => {
                                                const reachedMax = item.cantidad >= item.producto.stock;

                                                return (
                                                    <li key={item.producto_id} className="flex gap-3 items-center border-b border-border pb-3 last:border-0 last:pb-0">
                                                        {/* 1. Imagen */}
                                                        <div className="w-12 h-12 relative bg-gray-200 rounded shrink-0 overflow-hidden">
                                                            <Image 
                                                                src={item.producto.imagenes[0] || '/placeholder-record.png'} 
                                                                alt={item.producto.titulo} 
                                                                fill 
                                                                className="object-cover"
                                                            />
                                                        </div>
                                                        
                                                        {/* 2. Título del producto  */}
                                                        <div className="grow min-w-0">
                                                            <p className="m-0 text-[13px] font-medium text-foreground truncate font-syne">
                                                                {item.producto.titulo}
                                                            </p>
                                                        </div>
                                                        
                                                        {/* 3. Columna de Precio y Acciones */}
                                                        <div className="flex flex-col items-end gap-1.5 shrink-0">
                                                            {/* Precio total de este item */}
                                                            <div className="text-[13px] font-semibold text-foreground font-syne">
                                                                ${(item.producto.precio * item.cantidad).toFixed(2)}
                                                            </div>
                                                            
                                                            {/* Acciones: selector de cantidad y tacho de basura */}
                                                            <div className="flex items-center gap-2">
                                                                {/* Selector de cantidad  */}
                                                                <div className="w-fit flex items-center border border-border rounded-md">
                                                                    <button 
                                                                        onClick={() => handleUpdateQuantity(item.id_carrito, item.producto_id, -1)}
                                                                        disabled={item.cantidad <= 1}
                                                                        className="p-1 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed text-gray-600 hover:text-gray-900 transition-colors"
                                                                    >
                                                                        <MinusIcon className="w-3 h-3" />
                                                                    </button>
                                                                    <span className="px-2 text-[11px] font-medium min-w-[20px] text-center text-gray-900">
                                                                        {item.cantidad}
                                                                    </span>
                                                                    <button 
                                                                        onClick={() => handleUpdateQuantity(item.id_carrito, item.producto_id, 1)}
                                                                        disabled={reachedMax}
                                                                        className="p-1 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed text-gray-600 hover:text-gray-900 transition-colors"
                                                                        title={reachedMax ? "Stock máximo alcanzado" : ""}
                                                                    >
                                                                        <PlusIcon className="w-3 h-3" />
                                                                    </button>
                                                                </div>
                                                                
                                                                {/* Tacho de Basura  */}
                                                                <button 
                                                                    onClick={() => handleRemoveItem(item.id_carrito, item.producto_id)}
                                                                    className="text-gray-400 hover:text-red-500 transition-colors"
                                                                    title="Eliminar producto"
                                                                >
                                                                    <TrashIcon className="w-4 h-4" />
                                                                </button>
                                                            </div>
                                                            
                                                            {/* Mensaje de stock máximo */}
                                                            {reachedMax && item.producto.stock > 0 && (
                                                                <span className="text-[10px] text-orange-500 block text-right">
                                                                    Solo quedan {item.producto.stock} unidades
                                                                </span>
                                                            )}
                                                        </div>

                                                        </li>
                                                );
                                            })}
                                        </ul>

                                        <div className="border-t border-border pt-3 flex flex-col gap-2">
                                            <div className="flex justify-between items-center">
                                                <span className="text-xs text-foreground/60 font-dm">Subtotal:</span>
                                                <span className="text-sm font-semibold text-foreground font-syne">${subtotal.toFixed(2)}</span>
                                            </div>
                                            <Link 
                                                href={`/checkout?seller=${encodeURIComponent(idSellerReal)}`}
                                                className="block text-center w-full bg-foreground text-background border-none rounded-md py-2 text-[13px] font-medium cursor-pointer hover:opacity-90 transition-opacity font-dm"
                                                onClick={() => setIsOpen(false)}
                                            >
                                                Iniciar compra
                                            </Link>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}