'use client';

import { useTransition, useState } from 'react';
import { PlusIcon, MinusIcon } from '@heroicons/react/24/outline';
import { agregarAlCarrito } from '@/app/lib/actions/actions-cart';

interface BotonProps {
    productoId: string;
    stockTotal: number;
    stockDisponible: number;
    sellerId: string;
}

export default function BotonAgregarCarrito({ productoId, stockTotal, stockDisponible, sellerId }: BotonProps) {
    const [isPending, startTransition] = useTransition();
    const [fueAgregado, setFueAgregado] = useState(false);
    const [cantidad, setCantidad] = useState(1);

    const sinStockDisponible = stockDisponible <= 0;

    const handleIncrementar = () => {
        if (cantidad < stockDisponible) {
            setCantidad(prev => prev + 1);
        }
    };

    const handleDecrementar = () => {
        if (cantidad > 1) {
            setCantidad(prev => prev - 1);
        }
    };

    const handleAgregar = () => {
        if (sinStockDisponible || cantidad > stockDisponible) return;

        startTransition(async () => {
        
            const resultado = await agregarAlCarrito(productoId, sellerId, cantidad);
            
            if (resultado?.success) {
                setFueAgregado(true);
                setCantidad(1); 
                setTimeout(() => {
                    setFueAgregado(false);
                }, 2000);
            }
        });
    };

    
    let botonColor = 'bg-[var(--accent-terracotta)] hover:opacity-90';
    let botonTexto = 'Agregar al carrito';
    let clasesExtra = ''; 

    if (stockTotal === 0) {
        botonTexto = 'Sin stock';
        botonColor = 'bg-gray-500';
        clasesExtra = 'opacity-40 cursor-not-allowed';
    } else if (sinStockDisponible && stockTotal > 0) {
        botonTexto = 'Límite de stock en carrito';
        botonColor = 'bg-gray-500';
        clasesExtra = 'opacity-50 cursor-not-allowed';
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
        <div className="flex items-center gap-4 w-full">
            
            {/* Selector de cantidad numérico 
                Se oculta si no hay stock disponible, si se está procesando o si recién se agregó
            */}
            {!sinStockDisponible && !isPending && !fueAgregado && (
                <div className="flex items-center border border-border rounded-lg bg-background h-[60px]">
                    <button 
                        onClick={handleDecrementar} 
                        disabled={cantidad <= 1}
                        className="px-4 h-full hover:bg-gray-50 disabled:opacity-40 text-foreground transition-colors rounded-l-lg"
                    >
                        <MinusIcon className="w-4 h-4" />
                    </button>
                    
                    <span className="px-2 text-lg font-bold min-w-[40px] text-center text-foreground select-none font-syne">
                        {cantidad}
                    </span>
                    
                    <button 
                        onClick={handleIncrementar} 
                        disabled={cantidad >= stockDisponible}
                        className="px-4 h-full hover:bg-gray-50 disabled:opacity-40 text-foreground transition-colors rounded-r-lg"
                        title={cantidad >= stockDisponible ? "Límite de stock alcanzado" : ""}
                    >
                        <PlusIcon className="w-4 h-4" />
                    </button>
                </div>
            )}

            {/* Botón Principal (ahora ocupa el espacio restante con flex-grow) */}
            <button 
                onClick={handleAgregar}
                disabled={sinStockDisponible || isPending || fueAgregado}
                className={`flex-grow transition-all text-white font-bold h-[60px] rounded-lg text-lg font-syne ${botonColor} ${clasesExtra}`}
            >
                {botonTexto}
            </button>
            
        </div>
    );
}