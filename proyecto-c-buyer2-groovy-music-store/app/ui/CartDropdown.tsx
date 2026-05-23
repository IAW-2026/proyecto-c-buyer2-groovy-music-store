'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ShoppingCartIcon } from '@heroicons/react/24/outline';

// Estructura del producto como va a ser devuelta de la API de la sellerapp
type SellerProduct = {
    id: number;
    titulo: string;
    artista: string;
    precio: number;
    imagenes: string[];
    id_seller: string; // clerk_id del vendedor
};

// Tipo de dato para la entidad item
type CartItem = {
    producto_id: number;
    cantidad: number;
    id_carrito: number;
    producto: SellerProduct;
};

interface CartDropdownProps {
    items: CartItem[];
}

export default function CartDropdown({ items }: CartDropdownProps) {
    const [isOpen, setIsOpen] = useState(false);

    // Carrito agrupado por vendedor
    const groupedCart = items.reduce((acc, item) => {
        const sellerId = item.producto.id_seller || 'Vendedor Desconocido';
        if (!acc[sellerId]) {
            acc[sellerId] = [];
        }
        acc[sellerId].push(item);
        return acc;
    }, {} as Record<string, CartItem[]>);

    // Cantidad total para el circulito del contador del botón
    const totalItems = items.reduce((acc, item) => acc + item.cantidad, 0);

    return (
        <div className="relative font-dm">
            {/* Botón Carrito con Heroicons Component */}
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

            {/* Rectángulo Desplegable */}
            {isOpen && (
                <div className="absolute right-0 mt-4 w-[300px] sm:w-[360px] bg-card border border-border rounded-xl shadow-lg z-50 flex flex-col max-h-[70vh]">
                    
                    <div className="p-4 border-b border-border bg-black/5 rounded-t-xl">
                        <h3 className="m-0 text-base font-semibold text-foreground font-syne">
                            Productos en tu carrito
                        </h3>
                    </div>

                    <div className="overflow-y-auto p-4 flex flex-col gap-6">
                        {items.length === 0 ? (
                            <p className="text-center text-foreground/60 my-4 text-sm">
                                Tu carrito está vacío
                            </p>
                        ) : (
                            Object.entries(groupedCart).map(([vendedorId, itemsDelVendedor]) => {
                                const subtotal = itemsDelVendedor.reduce((acc, item) => acc + (item.producto.precio * item.cantidad), 0);

                                return (
                                    <div key={vendedorId} className="border border-border rounded-lg p-3 bg-white shadow-sm">
                                        <h4 className="m-0 mb-3 text-[13px] font-semibold text-foreground border-b border-border pb-1.5 font-dm">
                                            Vendedor: <span className="text-primary">{vendedorId}</span>
                                        </h4>
                                        
                                        <ul className="list-none p-0 m-0 mb-3 flex flex-col gap-2.5">
                                            {itemsDelVendedor.map((item) => (
                                                <li key={item.producto_id} className="flex gap-3 items-center">
                                                    <div className="w-11 h-11 relative bg-gray-200 rounded shrink-0 overflow-hidden">
                                                        <Image 
                                                            src={item.producto.imagenes[0] || '/placeholder-record.png'} 
                                                            alt={item.producto.titulo} 
                                                            fill 
                                                            className="object-cover"
                                                        />
                                                    </div>
                                                    <div className="grow min-w-0">
                                                        <p className="m-0 text-[13px] font-medium text-foreground truncate font-syne">
                                                            {item.producto.titulo}
                                                        </p>
                                                        <p className="mt-0.5 mb-0 text-[11px] text-foreground/60 font-dm">
                                                            Cantidad: {item.cantidad}
                                                        </p>
                                                    </div>
                                                    <div className="text-[13px] font-semibold text-foreground font-syne">
                                                        ${(item.producto.precio * item.cantidad).toFixed(2)}
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>

                                        <div className="border-t border-border pt-3 flex flex-col gap-2">
                                            <div className="flex justify-between items-center">
                                                <span className="text-xs text-foreground/60 font-dm">Subtotal:</span>
                                                <span className="text-sm font-semibold text-foreground font-syne">${subtotal.toFixed(2)}</span>
                                            </div>
                                            <button className="w-full bg-foreground text-background border-none rounded-md py-2 text-[13px] font-medium cursor-pointer hover:opacity-90 transition-opacity font-dm">
                                                Iniciar compra
                                            </button>
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