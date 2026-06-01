"use client";

import { useEffect } from "react";

export default function ForceRedirect({ destino }: { destino: string }) {
    
    useEffect(() => {
        // Redirección dura nativa del navegador. 
        // Bypassea completamente el enrutador de Next.js.
        window.location.href = destino;
    }, [destino]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-background text-white font-dm">
            <div className="flex flex-col items-center gap-4">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                <p className="tracking-widest uppercase text-sm">Preparando tu catálogo...</p>
            </div>
        </div>
    );
}