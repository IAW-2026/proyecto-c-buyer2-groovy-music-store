import { auth } from "@clerk/nextjs/server";
import Link from "next/link";

export default async function Home() {
  const { userId } = await auth(); 

  return (
    <main className="flex min-h-screen flex-col p-6">
      <div className="flex h-20 shrink-0 items-end rounded-lg bg-blue-500 p-4 md:h-52">
         <h1 className="text-3xl font-bold text-white">Buyer App</h1>
      </div>
      
      <div className="mt-4 flex grow flex-col gap-4 md:flex-row">
        {/* Contenedor gris del contenido */}
        <div className="flex flex-col justify-center gap-6 rounded-lg bg-gray-50 px-6 py-10 md:w-2/5 md:px-20">
          
          {userId ? (
             <div className="space-y-2">
               <p className="text-green-600 font-medium text-xl">✓ Sesión iniciada</p>
               <p className="text-sm text-gray-500 font-mono break-all">ID: {userId}</p>
             </div>
          ) : (
            <>
              <p className="text-gray-800 text-xl md:text-2xl">
                Bienvenido. Por favor, iniciá sesión para continuar.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mt-4">
              
                <Link
                  href="/sign-in"
                  className="flex items-center gap-5 self-start rounded-lg bg-blue-500 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-400 md:text-base"
                >
                  Iniciar sesión
                </Link>
                
                
                <Link
                  href="/sign-up"
                  className="flex items-center gap-5 self-start rounded-lg bg-gray-800 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-gray-700 md:text-base"
                >
                  Registrarse
                </Link>
              </div>
            </>
          )}

        </div>
      </div>
    </main>
  );
}