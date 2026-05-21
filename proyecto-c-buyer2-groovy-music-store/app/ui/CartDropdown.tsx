'use client';

import { useState } from 'react';
import Image from 'next/image';

// Estructura del producto tal como te la va a devolver la API de tu Seller App
type SellerProduct = {
    id: number;
    titulo: string;
    artista: string;
    precio: number;
    imagenes: string[];
    id_seller: string; // El clerk_id del vendedor
};

// Tipo de dato para el ítem 
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

    // Agrupamos los ítems por id_seller en el cliente
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
        <div style={{ position: 'relative', fontFamily: 'Inter, system-ui, sans-serif' }}>
            {/* Botón Carrito */}
            <button 
                onClick={() => setIsOpen(!isOpen)}
                style={{ 
                    background: 'none', border: 'none', cursor: 'pointer', 
                    display: 'flex', alignItems: 'center', gap: 8, 
                    color: 'var(--text-dark)', fontSize: 16, fontWeight: 500,
                    position: 'relative'
                }}
            >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="9" cy="21" r="1"></circle>
                    <circle cx="20" cy="21" r="1"></circle>
                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                </svg>
                Carrito
                {totalItems > 0 && (
                    <span style={{
                        position: 'absolute', top: -8, right: -12,
                        background: 'var(--accent-terracotta)', color: 'white',
                        borderRadius: '50%', width: 20, height: 20,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 11, fontWeight: 'bold'
                    }}>
                        {totalItems}
                    </span>
                )}
            </button>

            {/* Rectángulo Desplegable */}
            {isOpen && (
                <div style={{ 
                    position: 'absolute', right: 0, marginTop: 16, 
                    width: 360, background: 'var(--panel-bg)', 
                    border: '1px solid var(--divider)', borderRadius: 12, 
                    boxShadow: '0 10px 25px rgba(0,0,0,0.1)', zIndex: 50,
                    display: 'flex', flexDirection: 'column', maxHeight: '70vh'
                }}>
                    <div style={{ padding: 16, borderBottom: '1px solid var(--divider)', background: 'rgba(0,0,0,0.02)', borderTopLeftRadius: 12, borderTopRightRadius: 12 }}>
                        <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600, color: 'var(--text-dark)' }}>Productos en tu carrito</h3>
                    </div>

                    <div style={{ overflowY: 'auto', padding: 16, display: 'flex', flexDirection: 'column', gap: 24 }}>
                        {items.length === 0 ? (
                            <p style={{ textAlign: 'center', color: 'var(--text-medium)', margin: '16px 0', fontSize: 14 }}>Tu carrito está vacío</p>
                        ) : (
                            Object.entries(groupedCart).map(([vendedorId, itemsDelVendedor]) => {
                                const subtotal = itemsDelVendedor.reduce((acc, item) => acc + (item.producto.precio * item.cantidad), 0);

                                return (
                                    <div key={vendedorId} style={{ border: '1px solid var(--divider)', borderRadius: 8, padding: 12, background: 'white' }}>
                                        <h4 style={{ margin: '0 0 12px 0', fontSize: 13, fontWeight: 600, color: 'var(--text-dark)', borderBottom: '1px solid var(--divider)', paddingBottom: 6 }}>
                                            Vendedor: <span style={{ color: 'var(--accent-terracotta)' }}>{vendedorId}</span>
                                        </h4>
                                        
                                        <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 12px 0', display: 'flex', flexDirection: 'column', gap: 10 }}>
                                            {itemsDelVendedor.map((item) => (
                                                <li key={item.producto_id} style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                                                    <div style={{ width: 44, height: 44, position: 'relative', background: '#e9e9e9', borderRadius: 4, overflow: 'hidden', flexShrink: 0 }}>
                                                        <Image 
                                                            src={item.producto.imagenes[0] || '/placeholder-record.png'} 
                                                            alt={item.producto.titulo} 
                                                            fill 
                                                            style={{ objectFit: 'cover' }} 
                                                        />
                                                    </div>
                                                    <div style={{ flexGrow: 1, minWidth: 0 }}>
                                                        <p style={{ margin: 0, fontSize: 13, fontWeight: 500, color: 'var(--text-dark)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.producto.titulo}</p>
                                                        <p style={{ margin: '2px 0 0 0', fontSize: 11, color: 'var(--text-medium)' }}>Cantidad: {item.cantidad}</p>
                                                    </div>
                                                    <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-dark)' }}>
                                                        ${(item.producto.precio * item.cantidad).toFixed(2)}
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>

                                        <div style={{ borderTop: '1px solid var(--divider)', paddingTop: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <span style={{ fontSize: 12, color: 'var(--text-medium)' }}>Subtotal:</span>
                                                <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-dark)' }}>${subtotal.toFixed(2)}</span>
                                            </div>
                                            <button style={{ width: '100%', background: 'var(--text-dark)', color: 'white', border: 'none', borderRadius: 6, padding: '8px 0', fontSize: 13, fontWeight: 500, cursor: 'pointer' }}>
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