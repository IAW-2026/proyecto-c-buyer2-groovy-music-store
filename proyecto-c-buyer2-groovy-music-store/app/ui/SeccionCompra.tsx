'use client'

import { useState } from 'react'
import BotonAgregarCarrito from '@/app/ui/BotonAgregarCarrito'

interface SeccionCompraProps {
    product: any
    stockDisponibleInicial: number
}

// Función para limpiar los guiones bajos y poner la primera en mayúscula
function formatToSentenceCase(str: string | null | undefined): string {
    if (!str) return '';
    const lowerWithSpaces = str.replace(/_/g, ' ').toLowerCase();
    return lowerWithSpaces.charAt(0).toUpperCase() + lowerWithSpaces.slice(1);
}

export default function SeccionCompra({ product, stockDisponibleInicial }: SeccionCompraProps) {

    const [stockDisponible, setStockDisponible] = useState(stockDisponibleInicial)

    return (
        <>
            {/* Bloque de especificaciones */}
            <div className="flex flex-col gap-4 mb-8 bg-background p-6 rounded-lg border border-border font-dm">
                <div className="flex justify-between border-b border-border pb-2">
                    <span className="text-foreground font-medium">Formato</span>
                    <span className="font-bold text-foreground">{product.formato}</span>
                </div>
                <div className="flex justify-between border-b border-border pb-2">
                    <span className="text-foreground font-medium">Condición</span>
                    
                    <span className="font-bold text-foreground">{formatToSentenceCase(product.condicion)}</span>
                </div>
                <div className="flex justify-between border-b border-border pb-2">
                    <span className="text-foreground font-medium">Género</span>
                    
                    <span className="font-bold text-foreground">{product.genero}</span>
                </div>
                
                
                <div className="flex justify-between">
                    <span className="text-foreground font-medium">Disponibilidad</span>
                    <span className={`font-bold tracking-wide ${stockDisponible > 0 ? 'text-green-800' : 'text-[#B83A15]'}`}>
                        {stockDisponible > 0 
                            ? `${stockDisponible} ${stockDisponible === 1 ? 'unidad' : 'unidades'}` 
                            : 'Agotado'}
                    </span>
                </div>
            </div>

            {/* Contenedor del botón al final */}
            <div className="mt-auto">
                <BotonAgregarCarrito 
                    productoId={product.id} 
                    stockTotal={product.stock} 
                    stockDisponible={stockDisponible}
                    setStockDisponible={setStockDisponible} 
                    sellerId={product.seller_id.id}
                />
            </div>
        </>
    )
}