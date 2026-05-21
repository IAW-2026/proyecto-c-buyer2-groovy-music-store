import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function Home() {
  const { userId } = await auth(); 

  //Si el usuario ya está logueado, lo mandamos directo al catálogo
  if (userId) {
    redirect('/catalogo'); 
  }

  // Si no está logueado:
  return (
    <main className="flex min-h-screen flex-col p-6 bg-[var(--bg-retro)]">
      
      <div className="flex h-20 shrink-0 items-end rounded-lg bg-[var(--accent-terracotta)] p-4 md:h-52 shadow-sm">
         <h1 className="text-3xl font-bold text-white">Buyer App</h1>
      </div>
      
      <div className="mt-4 flex grow flex-col gap-4 md:flex-row">
        
        <div className="flex flex-col justify-center gap-6 rounded-lg bg-[var(--panel-bg)] border border-[var(--divider)] shadow-sm px-6 py-10 md:w-2/5 md:px-20">
          
          <p className="text-[var(--text-dark)] text-xl md:text-2xl font-medium">
            Bienvenido. Por favor, iniciá sesión para continuar.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <Link
              href="/sign-in"
              className="flex items-center gap-5 self-start rounded-lg bg-[var(--accent-terracotta)] px-6 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90 md:text-base"
            >
              Iniciar sesión
            </Link>
            
            <Link
              href="/sign-up"
              className="flex items-center gap-5 self-start rounded-lg bg-[var(--text-medium)] px-6 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90 md:text-base"
            >
              Registrarse
            </Link>
          </div>

        </div>
      </div>
    </main>
  );
}