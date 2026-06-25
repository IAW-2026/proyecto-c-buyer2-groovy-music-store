'use client';

import { useState, useEffect } from 'react';
import { ShoppingCartIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';

import { actualizarCantidadItemBD, eliminarItemBD } from '@/app/lib/actions/actions-cart';
import type { HydratedCartItem } from '@/app/lib/definitions';
import { CartSellerGroup } from './CartSellerGroup';

interface CartDropdownProps {
    items: HydratedCartItem[];
}

export default function CartDropdown({ items }: CartDropdownProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [cartItems, setCartItems] = useState<HydratedCartItem[]>(items);
    const [mostrarAviso, setMostrarAviso] = useState(true);
    const router = useRouter();

    useEffect(() => setCartItems(items), [items]);

    const handleUpdateQuantity = async (id_carrito: string, producto_id: string, delta: number) => {
        const item = cartItems.find(i => i.producto_id === producto_id);
        if (!item) return;

        let nuevaCantidad = Math.max(1, Math.min(item.cantidad + delta, item.producto.stock));
        if (nuevaCantidad === item.cantidad) return; 

        setCartItems(prev => prev.map(i => i.producto_id === producto_id ? { ...i, cantidad: nuevaCantidad } : i));

        const result = await actualizarCantidadItemBD(id_carrito, producto_id, nuevaCantidad);
        if (!result.success) {
            setCartItems(prev => prev.map(i => i.producto_id === producto_id ? { ...i, cantidad: item.cantidad } : i));
        }
    };

    const handleRemoveItem = async (id_carrito: string, producto_id: string) => {
        const itemAEliminar = cartItems.find(i => i.producto_id === producto_id);
        setCartItems(prev => prev.filter(i => i.producto_id !== producto_id));

        const result = await eliminarItemBD(id_carrito, producto_id);
        if (!result.success && itemAEliminar) {
            setCartItems(prev => [...prev, itemAEliminar]);
        }
    };

    const handleCheckout = async (vendedorId: string, itemsDelVendedor: HydratedCartItem[]) => {
        const itemsSinStock = itemsDelVendedor.filter(item => item.producto.stock <= 0);
        const itemsConStock = itemsDelVendedor.filter(item => item.producto.stock > 0);

        if (itemsSinStock.length > 0) {
            const idsAEliminar = itemsSinStock.map(i => i.producto_id);
            setCartItems(prev => prev.filter(i => !idsAEliminar.includes(i.producto_id)));
            await Promise.all(itemsSinStock.map(item => eliminarItemBD(item.id_carrito, item.producto_id)));
        }

        if (itemsConStock.length === 0) return; 

        setIsOpen(false);
        router.push(`/checkout?seller=${encodeURIComponent(vendedorId)}`);
    };

    const groupedCart = cartItems.reduce((acc, item) => {
        const sellerId = item.producto.seller_id?.id || 'Vendedor Desconocido';
        if (!acc[sellerId]) acc[sellerId] = [];
        acc[sellerId].push(item);
        return acc;
    }, {} as Record<string, HydratedCartItem[]>);

    const totalItems = cartItems.reduce((acc, item) => acc + item.cantidad, 0);

    return (
        <div className="relative font-dm">
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="group flex items-center p-2 bg-transparent hover:bg-white/15 active:bg-white/20 rounded-full transition-all duration-300 ease-in-out border-none text-white cursor-pointer"
                aria-label="Abrir carrito de compras"
                aria-expanded={isOpen}
            >
                <div className="relative flex items-center justify-center text-white/90 group-hover:text-white">
                    <ShoppingCartIcon className="w-5 h-5" aria-hidden="true" />
                    {totalItems > 0 && (
                        <span className="absolute -top-1.5 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-[#2E2E2E] text-[10px] font-bold text-white border border-primary/50">
                            {totalItems}
                        </span>
                    )}
                </div>
                <span className="hidden md:block max-w-0 opacity-0 overflow-hidden whitespace-nowrap group-hover:max-w-[80px] group-hover:opacity-100 group-hover:ml-2 transition-all duration-300 ease-in-out text-[11px] font-bold tracking-widest uppercase">
                    Carrito
                </span>
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-4 w-[300px] sm:w-[360px] bg-card border border-border rounded-xl shadow-lg z-50 flex flex-col max-h-[70vh]">
                    <div className="p-4 border-b border-border bg-black/5 rounded-t-xl shrink-0">
                        <h3 className="m-0 text-base font-semibold text-foreground font-syne">Productos en tu carrito</h3>
                    </div>

                    <div className="overflow-y-auto p-4 flex flex-col gap-5 relative">
                        {mostrarAviso && cartItems.length > 0 && Object.keys(groupedCart).length > 1 && (
                            <div className="relative bg-[#f8f9fa] border border-border rounded-lg p-3 pr-8 text-[12px] text-foreground/80 font-dm shadow-sm">
                                    onClick={() => setMostrarAviso(false)} 
                                    className="absolute top-2 right-2 text-foreground/40 hover:text-foreground p-1"
                                    aria-label="Cerrar aviso de múltiples vendedores"
                                >
                                    <XMarkIcon className="w-4 h-4" aria-hidden="true" />
                                </button>
                                <strong>Nota:</strong> Los productos están agrupados porque pertenecen a distintos vendedores. Deberás iniciar la compra de cada grupo por separado.
                            </div>
                        )}

                        {cartItems.length === 0 ? (
                            <p className="text-center text-foreground/60 my-4 text-sm">Tu carrito está vacío</p>
                        ) : (
                            Object.entries(groupedCart).map(([vendedorId, itemsDelVendedor]) => (
                                <CartSellerGroup 
                                    key={vendedorId}
                                    vendedorId={vendedorId}
                                    items={itemsDelVendedor}
                                    onUpdateQuantity={handleUpdateQuantity}
                                    onRemoveItem={handleRemoveItem}
                                    onCheckout={handleCheckout}
                                />
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}