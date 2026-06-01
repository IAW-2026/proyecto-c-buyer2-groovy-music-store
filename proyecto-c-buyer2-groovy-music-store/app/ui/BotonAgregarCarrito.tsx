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
    
    // Agregamos isLoaded para saber si Clerk ya terminó de revisar la sesión
    const { isSignedIn, isLoaded } = useAuth(); 

    const [showModal, setShowModal] = useState(false);
    const [isPending, startTransition] = useTransition();
    const [fueAgregado, setFueAgregado] = useState(false);
    const [cantidad, setCantidad] = useState(1);

    // Ref para evitar que React dispare el agregado dos veces seguidas por accidente
    const procesadoRef = useRef(false);

    useEffect(() => {
        // Si Clerk terminó de cargar, estamos logueados, y la URL tiene la orden "autoAdd"
        if (isLoaded && isSignedIn && searchParams.get('autoAdd') === 'true' && !procesadoRef.current) {
            procesadoRef.current = true; // Marcamos para que no se repita
            
            // Leemos la cantidad que el usuario había elegido antes de loguearse
            const cantidadGuardada = Number(searchParams.get('qty')) || 1;

            // Disparamos la acción de agregar al carrito automáticamente
            startTransition(async () => {
                const resultado = await agregarAlCarrito(productoId, sellerId, cantidadGuardada);
                
                if (resultado?.success) {
                    setFueAgregado(true);
                    setTimeout(() => {
                        setFueAgregado(false);
                    }, 2000);
                }
            });

            // Limpiamos la URL (borramos el ?autoAdd) para que si recarga la página no se vuelva a agregar
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

    // Armamos la mochila para el login: Ruta actual + orden de autoAdd + cantidad elegida
    const rutaConOrden = `${pathname}?autoAdd=true&qty=${cantidad}`;

    return (
        <>
            <div className="flex items-center gap-4 w-full">
                {!sinStockDisponible && !isPending && !fueAgregado && (
                    <div className="flex items-center border border-border rounded-lg bg-background h-[60px]">
                        <button onClick={handleDecrementar} disabled={cantidad <= 1} className="px-4 h-full hover:bg-gray-50 disabled:opacity-40 text-foreground transition-colors rounded-l-lg">
                            <MinusIcon className="w-4 h-4" />
                        </button>
                        <span className="px-2 text-lg font-bold min-w-[40px] text-center text-foreground select-none font-syne">{cantidad}</span>
                        <button onClick={handleIncrementar} disabled={cantidad >= stockDisponible} className="px-4 h-full hover:bg-gray-50 disabled:opacity-40 text-foreground transition-colors rounded-r-lg" title={cantidad >= stockDisponible ? "Límite de stock alcanzado" : ""}>
                            <PlusIcon className="w-4 h-4" />
                        </button>
                    </div>
                )}
                <button onClick={handleAgregar} disabled={sinStockDisponible || isPending || fueAgregado} className={`flex-grow transition-all text-white font-bold h-[60px] rounded-lg text-lg font-syne ${botonColor} ${clasesExtra}`}>
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
                                className="w-full bg-[var(--accent-terracotta)] text-white rounded-full py-3.5 text-[13px] font-bold tracking-[0.1em] uppercase hover:opacity-90 transition-all flex justify-center items-center"
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