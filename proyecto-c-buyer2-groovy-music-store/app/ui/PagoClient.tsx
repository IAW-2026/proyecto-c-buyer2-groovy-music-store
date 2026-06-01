"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import SimpleNavBar from "@/app/ui/SimpleNavBar";

export default function PagoClient({ ordenId }: { ordenId: string }) {
    const router = useRouter();

    useEffect(() => {
        // --- MOCK TEMPORAL hasta conectar las apps ---
        const timer = setTimeout(() => {
            // Actualmente simula éxito. Para simular error temporalmente, 
            // comentá la línea de abajo y descomentá la de pago-fallido
            router.push(`/checkout/orden-confirmada/${ordenId}`);
            // router.push(`/checkout/pago-fallido/${ordenId}`);
        }, 3000);

        return () => clearTimeout(timer);


        // El flujo exacto cuando esten las apps conectadas:

        // El usuario está mirando la pantalla PagoClient esperando.

        // Por atrás, en otro servidor, la App de Payments procesa la tarjeta.

        // La App de Payments hace un POST apuntando a la URL  en tu App Buyer.

        // el  backend recibe ese POST, actualiza la orden a "rechazado" o "aprobado" en tu base de datos (y si es rechazado, hace el POST a la Seller App para liberar stock).

        // Tu PagoClient (que estaba preguntando cada 3 segundos a tu base de datos) lee el nuevo estado y cambia de pantalla.
        // // ---------------------

        /* // --- CÓDIGO REAL CON SERVER ACTION para cuando estén las apps conectadas ---
        const verifyPayment = async () => {
            const estado = await checkOrderStatus(ordenId); 

            if (estado === "aprobado") {
                clearInterval(intervalId); // Frenamos el polling
                router.push(`/checkout/orden-confirmada/${ordenId}`); 
            } 
            // logica para estados de falla
            else if (estado === "cancelada" || estado === "pago_fallido" || estado === "rechazado") {
                clearInterval(intervalId); // Frenamos el polling
                
                // Redirigimos a una nueva pantalla de error (que vas a tener que crear)
                router.push(`/checkout/pago-fallido/${ordenId}`); 
            }
        };

        const intervalId = setInterval(verifyPayment, 3000);
        return () => clearInterval(intervalId);
        // -------------------------------- */
    }, [ordenId, router]);

    return (
        <main className="min-h-screen bg-background font-dm pb-20">
            <SimpleNavBar/>
            <div className="max-w-7xl mx-auto px-8 mt-10">
                <h1 className="font-syne m-0 text-4xl font-semibold text-foreground">
                    Pagos
                </h1>
                <p className="text-foreground/60 text-lg">
                    Procesando tu pago para la orden #{ordenId}. Por favor, no cierres ni recargues la página...
                </p>
            </div>
        </main>
    );
}