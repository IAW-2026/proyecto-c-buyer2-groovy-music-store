//client component
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import SimpleNavBar from "@/app/ui/SimpleNavBar";

export default function PagoClient({ ordenId }: { ordenId: string }) {
    const router = useRouter();

    useEffect(() => {
        // --- MOCK TEMPORAL hasta conectar las apps ---
        const timer = setTimeout(() => {
            
            router.push(`/checkout/orden-confirmada/${ordenId}`);
        }, 3000);

        return () => clearTimeout(timer);
        // ---------------------

        /* // --- CÓDIGO REAL CON SERVER ACTION  para cuando esten las apps conectadas---
        const verifyPayment = async () => {
            const estado = await checkOrderStatus(ordenId); 

            if (estado === "aprobado") {
                router.push(`/checkout/orden-confirmada/${ordenId}`); 
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