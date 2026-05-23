'use client';

import { useTransition, useState } from 'react';
import { agregarAlCarrito } from '@/app/lib/actions/actions-cart';

interface BotonProps {
    productoId: number;
    stock: number;
    sellerId: string;
}

export default function BotonAgregarCarrito({ productoId, stock, sellerId }: BotonProps) {
    const [isPending, startTransition] = useTransition();
    const [fueAgregado, setFueAgregado] = useState(false);

    const handleAgregar = () => {
        startTransition(async () => {
            const resultado = await agregarAlCarrito(productoId, sellerId);
            
            if (resultado?.success) {
                setFueAgregado(true);
                setTimeout(() => {
                    setFueAgregado(false);
                }, 2000);
            }
        });
    };

    // Estilos por defecto
    let botonColor = 'bg-[var(--accent-terracotta)] hover:opacity-90';
    let botonTexto = 'Agregar al carrito';
    let clasesExtra = ''; 

    if (stock === 0) {
        botonTexto = 'Sin stock';
        clasesExtra = 'opacity-40 cursor-not-allowed';
    } else if (isPending) {
        botonTexto = 'Procesando...';
        botonColor = 'bg-gray-500';
        clasesExtra = 'opacity-80 cursor-wait';
    } else if (fueAgregado) {
        botonTexto = '¡Producto agregado!';
        botonColor = 'bg-green-600'; 
        clasesExtra = 'opacity-100 cursor-default'; 
    }

    return (
        <button 
            onClick={handleAgregar}
            disabled={stock === 0 || isPending || fueAgregado}
            className={`w-full transition-all text-white font-bold py-4 rounded-lg text-lg ${botonColor} ${clasesExtra}`}
        >
            {botonTexto}
        </button>
    );
}