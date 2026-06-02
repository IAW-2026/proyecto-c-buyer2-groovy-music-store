'use client';

import { useTransition, useState, useEffect, useRef } from 'react';
import { PlusIcon, MinusIcon } from '@heroicons/react/24/outline';
import { agregarAlCarrito } from '@/app/lib/actions/actions-cart';
import { useAuth } from '@clerk/nextjs';
import Link from 'next/link';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';

interface BotonProps {
    productoId: string;
    stockTotal: number;
    stockDisponible: number;
    sellerId: string;
}

export default function BotonAgregarCarrito({ productoId, stockTotal, stockDisponible, sellerId }: BotonProps) {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const router = useRouter();
    
    const { isSignedIn, isLoaded } = useAuth(); 

    const [showModal, setShowModal] = useState(false);
    const [isPending, startTransition] = useTransition();
    const [fueAgregado, setFueAgregado] = useState(false);
    const [cantidad, setCantidad] = useState(1);

    const procesadoRef = useRef(false);

    useEffect(() => {
        if (isLoaded && isSignedIn && searchParams.get('autoAdd') === 'true' && !procesadoRef.current) {
            procesadoRef.current = true; 
            
            const cantidadGuardada = Number(searchParams.get('qty')) || 1;

            startTransition(async () => {
                const resultado = await agregarAlCarrito(productoId, sellerId, cantidadGuardada);
                
                if (resultado?.success) {
                    setFueAgregado(true);
                    setTimeout(() => {
                        setFueAgregado(false);
                    }, 2000);
                }
            });

            router.replace(pathname, { scroll: false });
        }
    }, [isLoaded, isSignedIn, searchParams, pathname, router, productoId, sellerId]);

    const sinStockDisponible = stockDisponible <= 0;

    const handleIncrementar = () => {
        if (cantidad < stockDisponible) setCantidad(prev => prev + 1);
    };

    const handleDecrementar = () => {
        if (cantidad > 1) setCantidad(prev => prev - 1);
    };

    const handleAgregar = () => {
        if (sinStockDisponible || cantidad > stockDisponible) return;

        if (!isSignedIn) {
            setShowModal(true);
            return;
        }

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

    let botonColor = 'bg-[#B83A15] border-[#9C2E0F] shadow-md text-shadow-contrast hover:bg-[#A33313] hover:scale-[1.02] hover:shadow-lg';
    let botonTexto = 'Agregar al carrito';
    let clasesExtra = ''; 

    if (stockTotal === 0) {
        botonTexto = 'Sin stock';
        botonColor = 'bg-gray-500 border-gray-600 shadow-none';
        clasesExtra = 'opacity-50 cursor-not-allowed hover:scale-100 hover:bg-gray-500';
    } else if (sinStockDisponible && stockTotal > 0) {
        botonTexto = 'Límite de stock en carrito';
        botonColor = 'bg-gray-500 border-gray-600 shadow-none';
        clasesExtra = 'opacity-50 cursor-not-allowed hover:scale-100 hover:bg-gray-500';
    } else if (isPending) {
        botonTexto = 'Procesando...';
        botonColor = 'bg-gray-500 border-gray-600 shadow-none';
        clasesExtra = 'opacity-80 cursor-wait hover:scale-100 hover:bg-gray-500';
    } else if (fueAgregado) {
        botonTexto = '¡Producto agregado!';
        botonColor = 'bg-green-700 border-green-800 shadow-none'; 
        clasesExtra = 'opacity-100 cursor-default hover:scale-100 hover:bg-green-700'; 
    }

    const rutaConOrden = `${pathname}?autoAdd=true&qty=${cantidad}`;

    return (
        <>
            <div className="flex items-center gap-4 w-full">
                {!sinStockDisponible && !isPending && !fueAgregado && (
                    <div className="flex items-center border border-border rounded-lg bg-background h-[60px]">
                        
                        <button 
                            onClick={handleDecrementar} 
                            disabled={cantidad <= 1} 
                            aria-label="Disminuir cantidad"
                            className="px-4 h-full hover:bg-gray-50 disabled:opacity-40 text-foreground transition-colors rounded-l-lg"
                        >
                            <MinusIcon className="w-4 h-4" aria-hidden="true" />
                        </button>
                        
                        <span aria-live="polite" className="px-2 text-lg font-bold min-w-[40px] text-center text-foreground select-none font-syne">
                            {cantidad}
                        </span>
                        
                        <button 
                            onClick={handleIncrementar} 
                            disabled={cantidad >= stockDisponible} 
                            aria-label="Aumentar cantidad"
                            title={cantidad >= stockDisponible ? "Límite de stock alcanzado" : ""}
                            className="px-4 h-full hover:bg-gray-50 disabled:opacity-40 text-foreground transition-colors rounded-r-lg" 
                        >
                            <PlusIcon className="w-4 h-4" aria-hidden="true" />
                        </button>
                    </div>
                )}
                
                <button 
                    onClick={handleAgregar} 
                    disabled={sinStockDisponible || isPending || fueAgregado} 
                    aria-label={botonTexto}
                    className={`flex-grow flex items-center justify-center border-2 transition-all duration-200 text-white font-bold h-[60px] rounded-lg text-lg font-dm ${botonColor} ${clasesExtra}`}
                >
                    {botonTexto}
                </button>
            </div>

            {showModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#1a1008]/80 backdrop-blur-md transition-opacity">
                    <div className="bg-card border border-border rounded-2xl p-8 max-w-sm w-full text-center shadow-2xl relative animate-in fade-in zoom-in duration-200">
                        <h3 className="font-syne text-2xl font-bold text-foreground mb-3">Acceso Requerido</h3>
                        <p className="font-dm text-foreground/70 mb-8 text-sm leading-relaxed">
                            Para poder sumar este producto a tu colección y procesar tu compra, necesitás ingresar a tu cuenta.
                        </p>
                        <div className="flex flex-col gap-3">
                            <Link 
                                href={`/sign-in?returnTo=${encodeURIComponent(rutaConOrden)}`}
                                className="w-full bg-[#B83A15] border-2 border-[#9C2E0F] text-shadow-contrast shadow-sm text-white rounded-full py-3.5 text-[13px] font-bold tracking-[0.1em] uppercase hover:bg-[#A33313] hover:scale-[1.02] transition-all flex justify-center items-center"
                            >
                                Iniciar Sesión
                            </Link>
                            <button onClick={() => setShowModal(false)} className="w-full bg-transparent border border-border text-foreground rounded-full py-3.5 text-[13px] font-bold tracking-[0.1em] uppercase hover:bg-foreground/5 transition-all">
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}