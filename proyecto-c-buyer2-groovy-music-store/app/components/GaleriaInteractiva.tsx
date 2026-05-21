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
        <div className="relative w-full aspect-square bg-[#e9e9e9] rounded-xl overflow-hidden border border-[var(--divider)] group">
            <Image 
                src={imagenes[currentImageIndex] || '/placeholder-record.png'} 
                alt="Imagen del producto"
                fill 
                className="object-cover transition-opacity duration-300"
                priority={currentImageIndex === 0}
            />

            {/* FLECHAS: Solo se muestran si hay más de 1 imagen */}
            {totalImages > 1 && (
                <>
                    <button onClick={prevImage} className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-[var(--text-dark)] p-3 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-all z-10">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"></polyline></svg>
                    </button>
                    <button onClick={nextImage} className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-[var(--text-dark)] p-3 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-all z-10">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"></polyline></svg>
                    </button>
                </>
            )}

            {/* INDICADOR NUMÉRICO: se muestra SIEMPRE */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-[var(--text-dark)]/70 text-white text-xs font-mono px-3 py-1 rounded-full backdrop-blur-sm z-10">
                {currentImageIndex + 1} / {totalImages}
            </div>
        </div>
    )
}