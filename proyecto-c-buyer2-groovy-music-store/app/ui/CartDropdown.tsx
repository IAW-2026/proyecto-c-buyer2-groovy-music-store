'use client';

import { useState } from 'react';
import Image from 'next/image';

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
        <div className="relative font-sans">
            {/* Botón Carrito */}
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 text-text-dark text-base font-medium bg-transparent border-none cursor-pointer relative"
            >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="9" cy="21" r="1"></circle>
                    <circle cx="20" cy="21" r="1"></circle>
                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                </svg>
                Carrito
                {totalItems > 0 && (
                    <span className="absolute -top-2 -right-3 bg-terracotta text-white rounded-full w-5 h-5 flex items-center justify-center text-[11px] font-bold">
                        {totalItems}
                    </span>
                )}
            </button>

            {/* Rectángulo Desplegable */}
            {isOpen && (
                <div className="absolute right-0 mt-4 w-[300px] sm:w-[360px] bg-panel border border-divider rounded-xl shadow-[0_10px_25px_rgba(0,0,0,0.1)] z-50 flex flex-col max-h-[70vh]">
                    
                    <div className="p-4 border-b border-divider bg-black/5 rounded-t-xl">
                        <h3 className="m-0 text-base font-semibold text-text-dark">
                            Productos en tu carrito
                        </h3>
                    </div>

                    <div className="overflow-y-auto p-4 flex flex-col gap-6">
                        {items.length === 0 ? (
                            <p className="text-center text-text-medium my-4 text-sm">
                                Tu carrito está vacío
                            </p>
                        ) : (
                            Object.entries(groupedCart).map(([vendedorId, itemsDelVendedor]) => {
                                const subtotal = itemsDelVendedor.reduce((acc, item) => acc + (item.producto.precio * item.cantidad), 0);

                                return (
                                    <div key={vendedorId} className="border border-divider rounded-lg p-3 bg-white">
                                        <h4 className="m-0 mb-3 text-[13px] font-semibold text-text-dark border-b border-divider pb-1.5">
                                            Vendedor: <span className="text-terracotta">{vendedorId}</span>
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
                                                        <p className="m-0 text-[13px] font-medium text-text-dark truncate">
                                                            {item.producto.titulo}
                                                        </p>
                                                        <p className="mt-0.5 mb-0 text-[11px] text-text-medium">
                                                            Cantidad: {item.cantidad}
                                                        </p>
                                                    </div>
                                                    <div className="text-[13px] font-semibold text-text-dark">
                                                        ${(item.producto.precio * item.cantidad).toFixed(2)}
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>

                                        <div className="border-t border-divider pt-3 flex flex-col gap-2">
                                            <div className="flex justify-between items-center">
                                                <span className="text-xs text-text-medium">Subtotal:</span>
                                                <span className="text-sm font-semibold text-text-dark">${subtotal.toFixed(2)}</span>
                                            </div>
                                            <button className="w-full bg-text-dark text-white border-none rounded-md py-2 text-[13px] font-medium cursor-pointer hover:opacity-90 transition-opacity">
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