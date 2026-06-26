'use client';

import Image from 'next/image'
import { useState } from 'react'

export default function GaleriaInteractiva({ imagenes }: { imagenes: string[] }) {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    // Nos aseguramos de que haya al menos 1 para que no se rompa la cuenta
    const totalImages = imagenes.length > 0 ? imagenes.length : 1;

    const nextImage = () => setCurrentImageIndex((prev) => (prev + 1) % totalImages);
    const prevImage = () => setCurrentImageIndex((prev) => (prev - 1 + totalImages) % totalImages);

    return (
        <div className="w-full aspect-square relative bg-[#f8f8f8] border border-gray-200 rounded-xl overflow-hidden p-4 flex items-center justify-center group">
            
            <Image 
                src={imagenes[currentImageIndex] || '/placeholder-record.png'} 
                alt={`Imagen ${currentImageIndex + 1} del producto`} 
                fill 
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-contain p-4 transition-transform duration-300 hover:scale-105"
            />

            {/* FLECHAS: Solo se muestran si hay más de 1 imagen */}
            {totalImages > 1 && (
                <>
                    {/* Botón Anterior */}
                    <button 
                        onClick={prevImage} 
                        aria-label="Ver imagen anterior"
                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-foreground p-3 rounded-full shadow-md opacity-0 group-hover:opacity-100 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-primary transition-all z-10"
                    >
                        <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <polyline points="15 18 9 12 15 6"></polyline>
                        </svg>
                    </button>
                    
                    {/* Botón Siguiente */}
                    <button 
                        onClick={nextImage} 
                        aria-label="Ver imagen siguiente"
                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-foreground p-3 rounded-full shadow-md opacity-0 group-hover:opacity-100 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-primary transition-all z-10"
                    >
                        <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <polyline points="9 18 15 12 9 6"></polyline>
                        </svg>
                    </button>
                </>
            )}

            {/* INDICADOR NUMÉRICO: se muestra SIEMPRE */}
            <div 
                aria-live="polite"
                aria-atomic="true"
                className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-foreground/70 text-white text-xs font-mono px-3 py-1 rounded-full backdrop-blur-sm z-10"
            >
                {/* sr-only es texto que solo leen los lectores de pantalla (no se ve) */}
                <span className="sr-only">Imagen </span>
                {currentImageIndex + 1} de {totalImages}
            </div>
        </div>
    )
}