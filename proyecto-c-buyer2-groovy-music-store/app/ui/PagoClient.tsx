"use client";

import { useEffect, useState } from "react";
import SimpleNavBar from "@/app/ui/SimpleNavBar";
import { getOrderByUUID } from "@/app/lib/actions/actions-order"; 

import { createPaymentCheckout } from "@/app/lib/services/payments-api"; 

export default function PagoClient({ orden_UUID }: { orden_UUID: string }) {
    const [error, setError] = useState<string | null>(null);
    const [nroOrdenUsuario, setNroOrdenUsuario] = useState<number | null>(null);

    useEffect(() => {
        const iniciarPago = async () => {
            try {
                const orden = await getOrderByUUID(orden_UUID);

                if (!orden) {
                    setError("No se pudo encontrar la información de la orden.");
                    return;
                }

                
                setNroOrdenUsuario(orden.nro_orden_usuario);

                const resultado = await createPaymentCheckout({
                    order_id: orden_UUID,
                    buyer_id: orden.id_buyer,
                    seller_id: orden.id_seller,
                    costoEnvio: 0, 
                    monto_total: orden.monto
                });

                if (resultado.success && resultado.data?.init_point) {
                    window.location.href = resultado.data.init_point;
                } else {
                    setError(resultado.error || "Hubo un problema al generar el link de pago.");
                }

            } catch (err) {
                console.error("Error en el flujo de pago:", err);
                setError("Ocurrió un error inesperado. Por favor, intenta nuevamente.");
            }
        };

        iniciarPago();
        
    }, [orden_UUID]);

    return (
        <main className="min-h-screen bg-background font-dm pb-20">
            <SimpleNavBar/>
            <div className="max-w-7xl mx-auto px-8 mt-10">
                <h1 className="font-syne m-0 text-4xl font-semibold text-foreground">
                    Pagos
                </h1>
                
                {error ? (
                    <div className="mt-4">
                        <p className="text-red-500 text-lg font-medium">{error}</p>
                    </div>
                ) : (
                    <p className="text-foreground/60 text-lg mt-4">
                        Generando tu link de pago para la orden {nroOrdenUsuario ? `#${nroOrdenUsuario}` : "..."}. Serás redirigido en un momento, por favor no cierres ni recargues la página...
                    </p>
                )}
            </div>
        </main>
    );
}