'use client';

import { useActionState, useState, useEffect } from 'react';
import { procesarCheckout } from '@/app/lib/actions/actions-checkout';
import { getShippingEstimate } from '@/app/lib/services/shipping-api'; 
import ListaArticulos from './ListaArticulos';
import SelectorDireccion from './SelectorDireccion';
import TicketResumen from './TicketResumen';

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
    itemsParaCheckout, 
    direccionesDb, 
    clerkId, 
    sellerId, 
    subtotal, 
    pesoTotal, 
    origen_cp, 
    tokenDelUsuario 
}: any) {
    
    const initialState: CheckoutFormState = { 
        success: false, 
        message: "", 
        errors: {} 
    };

    const [state, formAction] = useActionState(procesarCheckout, initialState);

    
    const [cpDestino, setCpDestino] = useState<string | null>(
        direccionesDb.length > 0 ? direccionesDb[0].cod_postal : null
    );

    // 1. Tipamos explícitamente el estado para que acepte string o null
    const [envioDinamico, setEnvioDinamico] = useState<{
        costo: number;
        fechaEntregaEstimada: string | null;
    }>({ 
        costo: 0, 
        fechaEntregaEstimada: null 
    });

    const [cargandoEnvio, setCargandoEnvio] = useState<boolean>(false); 
    const [errorEnvio, setErrorEnvio] = useState<string | null>(null);

    // Efecto que reacciona SOLO al cambio del código postal
    useEffect(() => {
        const calcularEnvio = async () => {
            if (!cpDestino) {
                setEnvioDinamico({ costo: 0, fechaEntregaEstimada: null });
                return;
            }

            setCargandoEnvio(true);
            setErrorEnvio(null);

            try {
                const result = await getShippingEstimate(
                    origen_cp,
                    cpDestino,
                    pesoTotal,
                    tokenDelUsuario
                );
                setEnvioDinamico({ 
                    costo: result.costo, 
                    fechaEntregaEstimada: result.fechaEntregaEstimada 
                });
            } catch (error) {
                console.error("Error calculando envío:", error);
                setErrorEnvio("No se pudo calcular el envío");
                // 2. CORREGIDO: Cambiado de 0 a null para mantener la consistencia del tipo
                setEnvioDinamico({ costo: 0, fechaEntregaEstimada: null }); 
            } finally {
                setCargandoEnvio(false);
            }
        };

        calcularEnvio();
    }, [cpDestino, origen_cp, pesoTotal, tokenDelUsuario]);

    const totalDinamico = subtotal + envioDinamico.costo;

    return (
        <form action={formAction} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <input type="hidden" name="sellerId" value={sellerId} />
            <input type="hidden" name="clerkId" value={clerkId} />
            <input type="hidden" name="total" value={totalDinamico.toString()} />
            <input type="hidden" name="items" value={JSON.stringify(itemsParaCheckout)} />
            


            <div className="lg:col-span-2 space-y-8">
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
                    {/* Le pasamos el callback al Selector */}
                    <SelectorDireccion 
                        direcciones={direccionesDb} 
                        clerkId={clerkId} 
                        onPostalCodeChange={(nuevoCp) => setCpDestino(nuevoCp)}
                    />
                    
                    {state?.errors?.id_direccion && (
                        <p className="mt-2 text-sm font-bold text-red-500">
                             {state.errors.id_direccion[0]}
                        </p>
                    )}
                </div>
            </div>

            <TicketResumen 
                subtotal={subtotal} 
                envio={envioDinamico} 
                total={totalDinamico} 
                sellerId={sellerId} 
                clerkId={clerkId} 
                items={itemsParaCheckout} 
                cargandoEnvio={cargandoEnvio || cpDestino === null} 
                errorEnvio={errorEnvio}
            />
        </form>
    );
}