'use client';

import { useFormStatus } from 'react-dom';
import { ItemCheckout } from '@/app/lib/definitions'; // Asegurate de que la ruta sea la correcta

interface TicketResumenProps {
    subtotal: number;
    envio: {
        costo: number;
        fechaEntregaEstimada: number; 
    };
    total: number;
    sellerId: string;
    clerkId: string;
    items: (ItemCheckout | null)[]; // Reemplazamos el any[] por nuestro tipo estricto
}

export default function TicketResumen({
    subtotal,
    envio,
    total,
    sellerId,
    clerkId,
    items
}: TicketResumenProps) {
    // Extraemos el estado 'pending' que nos dice si el formulario se está enviando
    const { pending } = useFormStatus();

    return (
        <div className="h-fit sticky top-6">
            <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
                <h2 className="text-xl font-syne font-semibold border-b border-border pb-3 mb-5">Total a pagar</h2>
                
                <div className="flex justify-between items-center mb-3 text-foreground/80">
                    <span>Subtotal (productos)</span>
                    <span className="font-medium">${subtotal.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between items-center mb-6 text-foreground/80">
                    <span>Envío ({envio.fechaEntregaEstimada} días aprox.)</span>
                    <span className="font-medium">${envio.costo.toFixed(2)}</span>
                </div>

                <div className="flex justify-between items-center border-t border-border pt-5 mb-8">
                    <span className="font-syne font-bold text-lg">Total</span>
                    <span className="font-syne font-bold text-3xl text-primary">${total.toFixed(2)}</span>
                </div>

                {/* Inputs ocultos que van a viajar en el FormData al confirmar */}
                <input type="hidden" name="sellerId" value={sellerId} />
                <input type="hidden" name="clerkId" value={clerkId} />
                <input type="hidden" name="total" value={total.toString()} />
                <input type="hidden" name="envio" value={envio.costo.toString()} />
                <input type="hidden" name="items" value={JSON.stringify(items)} />
                
                <button 
                    type="submit" 
                    disabled={pending}
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