'use client';

import { useActionState } from 'react';
import { procesarCheckout } from '@/app/lib/actions/actions-checkout';
import ListaArticulos from './ListaArticulos';
import SelectorDireccion from './SelectorDireccion';
import TicketResumen from './TicketResumen';

// Definimos los tipos para que TypeScript no se queje
type CheckoutFormState = {
    success: boolean;
    message: string;
    errors: {
        id_direccion?: string[];
        sellerId?: string[];
        total?: string[];
        items?: string[];
    };
};

export default function FormularioCheckout({
    itemsParaCheckout, direccionesDb, clerkId, sellerId, subtotal, envio, totalAPagar
}: any) {
    
    const initialState: CheckoutFormState = { 
        success: false, 
        message: "", 
        errors: {} 
    };

    const [state, formAction] = useActionState(procesarCheckout, initialState);

    return (
        <form action={formAction} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Campos ocultos necesarios para la validación del servidor */}
            <input type="hidden" name="sellerId" value={sellerId} />
            <input type="hidden" name="clerkId" value={clerkId} />
            <input type="hidden" name="total" value={totalAPagar} />
            <input type="hidden" name="items" value={JSON.stringify(itemsParaCheckout)} />

            <div className="lg:col-span-2 space-y-8">
                {/* Mensaje de error general si la transacción falla */}
                {state?.message && !state?.success && (
                    <div className="p-4 text-sm text-red-800 bg-red-100 rounded-lg border border-red-200">
                        {state.message}
                    </div>
                )}

                <div>
                    <h2 className="text-2xl font-syne font-semibold mb-4">Artículos en la orden</h2>
                    <ListaArticulos items={itemsParaCheckout} />
                </div>

                <div>
                    <SelectorDireccion direcciones={direccionesDb} clerkId={clerkId} />
                    
                    {state?.errors?.id_direccion && (
                        <p className="mt-2 text-sm font-bold text-red-500">
                             {state.errors.id_direccion[0]}
                        </p>
                    )}
                </div>
            </div>

            <TicketResumen 
                subtotal={subtotal} 
                envio={envio} 
                total={totalAPagar} 
                sellerId={sellerId} 
                clerkId={clerkId} 
                items={itemsParaCheckout} 
            />
        </form>
    );
}