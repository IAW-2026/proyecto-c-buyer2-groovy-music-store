

import SimpleNavBar from "@/app/ui/SimpleNavBar";

export default function PagoPage() {
    return (
        
        <main className="min-h-screen bg-background font-dm pb-20">
            <SimpleNavBar/>
            <div className="max-w-7xl mx-auto px-8 mt-10">
                <h1 className="font-syne m-0 text-4xl font-semibold text-foreground">
                    Pagos
                </h1>
                <p className="text-foreground/60 text-lg">
                    Pantalla de procesamiento de pago (Próximamente).
                </p>
            </div>
        </main>
    );
}