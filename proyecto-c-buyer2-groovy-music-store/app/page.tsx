import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import SimpleNavBar from "./ui/SimpleNavBar";

export default async function Home() {

  // Si no está logueado:
  return (
    <main className="min-h-screen bg-background font-dm flex flex-col">
      
      {/* BARRA DE NAVEGACIÓN SUPERIOR  */}
     <SimpleNavBar />

      {/* CONTENIDO PRINCIPAL  */}
      <div className="flex flex-grow items-center justify-center p-6">
        
        <div className="bg-card border border-border rounded-2xl shadow-sm p-10 md:p-14 max-w-lg w-full flex flex-col items-center text-center relative overflow-hidden">
          
          {/* detalle decorativo arriba del cuadro */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-primary"></div>

          <h1 className="font-syne text-3xl md:text-4xl font-bold text-foreground mb-3">
            Bienvenido
          </h1>
          
          <p className="font-dm text-foreground/70 mb-10 text-base">
            Música física para coleccionistas apasionados. Por favor, iniciá sesión para explorar nuestro catálogo.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full">
            <Link
              href="/sign-in"
              className="flex-1 bg-primary text-white rounded-full py-3.5 px-6 text-[13px] font-semibold tracking-[0.1em] uppercase transition-opacity hover:opacity-90 flex justify-center items-center"
            >
              Iniciar sesión
            </Link>
            
            <Link
              href="/sign-up"
              className="flex-1 bg-foreground text-background rounded-full py-3.5 px-6 text-[13px] font-semibold tracking-[0.1em] uppercase transition-opacity hover:opacity-90 flex justify-center items-center"
            >
              Registrarse
            </Link>
          </div>

        </div>
      </div>
      
    </main>
  );
}