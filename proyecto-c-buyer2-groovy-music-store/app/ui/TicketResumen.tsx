'use client';

import { useFormStatus } from 'react-dom';
import { ItemCheckout } from '@/app/lib/definitions'; 

interface TicketResumenProps {
    subtotal: number;
    envio: {
        costo: number;
        fechaEntregaEstimada: string | null; 
    };
    total: number;
    sellerId: string;
    clerkId: string;
    items: (ItemCheckout | null)[]; 
    cargandoEnvio: boolean;         
    errorEnvio: string | null;      
}


function formatearFechaEstimada(fechaIso: string | null): string {
    if (!fechaIso) return ''; 
    try {
        const fecha = new Date(fechaIso);
        return fecha.toLocaleDateString('es-AR', { 
            day: 'numeric', 
            month: 'long' 
        });
    } catch (error) {
        console.error("Error al formatear la fecha:", error);
        return fechaIso; 
    }
}

export default function TicketResumen({
    subtotal,
    envio,
    total,
    sellerId,
    clerkId,
    items,
    cargandoEnvio,
    errorEnvio
}: TicketResumenProps) {
    const { pending } = useFormStatus();

    return (
        <div className="h-fit sticky top-6">
            <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
                <h2 className="text-xl font-syne font-semibold border-b border-border pb-3 mb-5">Total a pagar</h2>
                
                <div className="flex justify-between items-center mb-3 text-foreground/80">
                    <span>Subtotal (productos)</span>
                    <span className="font-medium">${(subtotal || 0).toLocaleString('es-AR', { maximumFractionDigits: 0 })} </span>
                </div>
                
                <div className="flex justify-between items-center mb-6 text-foreground/80">
                    {/* CAMBIADO: Ahora muestra "Llega el 25 de junio" en vez de los días aprox. */}
                    <span>
                        Envío {cargandoEnvio ? '' : errorEnvio ? '' : `(Llega el ${formatearFechaEstimada(envio.fechaEntregaEstimada)})`}
                    </span>
                    
                    {cargandoEnvio ? (
                        <span className="text-primary animate-pulse text-sm font-medium">Cargando envío...</span>
                    ) : errorEnvio ? (
                        <span className="text-red-500 text-xs">{errorEnvio}</span>
                    ) : (
                        <span className="font-medium">${(envio.costo || 0).toLocaleString('es-AR', { maximumFractionDigits: 0 })}</span>
                    )}
                </div>

                <div className="flex justify-between items-center border-t border-border pt-5 mb-8">
                    <span className="font-syne font-bold text-lg">Total</span>
                    <span className="font-syne font-bold text-3xl text-primary">
                        {cargandoEnvio ? (
                           <span className="text-lg text-foreground/50 font-normal">Calculando...</span>
                        ) : (
                           `$${(total || 0).toLocaleString('es-AR', { maximumFractionDigits: 0 })}`
                        )}
                    </span>
                </div>

                <input type="hidden" name="sellerId" value={sellerId} />
                <input type="hidden" name="clerkId" value={clerkId} />
                <input type="hidden" name="total" value={total.toString()} />
                <input type="hidden" name="envio" value={envio.costo.toString()} />
                <input type="hidden" name="items" value={JSON.stringify(items)} />
                
                <button 
                    type="submit" 
                    disabled={pending || cargandoEnvio || !!errorEnvio}
                    className="w-full bg-primary text-background font-dm font-semibold py-3.5 px-4 rounded-lg hover:opacity-90 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                    {pending ? (
                        <>
                            <svg className="animate-spin h-5 w-5 text-background" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                            </svg>
                            Procesando...
                        </>
                    ) : (
                        'Iniciar pago'
                    )}
                </button>
            </div>
        </div>
    );
}