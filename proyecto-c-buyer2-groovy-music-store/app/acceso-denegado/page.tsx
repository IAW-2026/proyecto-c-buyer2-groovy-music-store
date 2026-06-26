import { SignOutButton } from "@clerk/nextjs";
import { Metadata } from "next";

import SimpleNavBar from "@/app/ui/SimpleNavBar"; 


export const metadata: Metadata = {
    title: "Acceso Denegado | Groovy Music Store",
    description: "Tu cuenta ha sido suspendida y no tienes permiso para acceder.",
};

export default function AccesoDenegado() {
    return (
       
        <div className="flex flex-col min-h-screen bg-background text-foreground">
            
    
            <SimpleNavBar />


            <main className="flex-1 flex flex-col items-center justify-center p-4 text-center">
                <h1 className="font-syne text-4xl font-bold text-red-600 mb-4">
                    Acceso Denegado
                </h1>
                
                <p className="font-dm text-lg text-foreground/80 mb-8 max-w-md">
                    Tu cuenta ha sido suspendida por un administrador y no tienes permiso para acceder a la aplicación.
                </p>
                
                <SignOutButton>
                    
                    <button 
                        aria-label="Cerrar la sesión actual"
                        className="px-6 py-3 bg-foreground text-background font-semibold rounded-lg hover:opacity-90 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-foreground"
                    >
                        Cerrar sesión
                    </button>
                </SignOutButton>
            </main>
        </div>
    );
}