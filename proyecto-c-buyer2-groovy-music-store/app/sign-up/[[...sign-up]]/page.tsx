import SimpleNavBar from "@/app/ui/SimpleNavBar";
import { SignUp } from "@clerk/nextjs";

import {Metadata } from 'next'

export const metadata: Metadata = {
  title: "Registrarse - Groovy Music Store",
  description: "Crea una nueva cuenta en Groovy Music Store.",
};

interface SignUpPageProps {
  searchParams: Promise<{ returnTo?: string }>;
}

export default async function SignUpPage({ searchParams }: SignUpPageProps) {
  const resolvedSearchParams = await searchParams;
  const returnTo = resolvedSearchParams?.returnTo;
  
  // Si hay ruta, la sumamos. Si no, vamos a auth-sync solo
  const urlDestino = returnTo 
    ? `/auth-sync?returnTo=${encodeURIComponent(returnTo)}` 
    : `/auth-sync`;


  return (
    <main className="min-h-screen bg-background font-dm flex flex-col">
          
      {/* BARRA DE NAVEGACIÓN SUPERIOR  */}
      <SimpleNavBar />

      {/* CONTENIDO PRINCIPAL  */}
      <div className="flex flex-grow items-center justify-center p-6">
        
        {/* Personalizacion del componente de Clerk */}
        <SignUp 
          forceRedirectUrl={urlDestino}
          fallbackRedirectUrl={urlDestino}
          // ---------------------------
          appearance={{
            variables: {
              colorPrimary: '#E4572E', 
              colorBackground: '#FAF8F5', 
              colorText: '#2E2E2E', 
              colorTextSecondary: '#6D4C41', 
              borderRadius: '0.75rem', 
            },
            elements: {
              card: "border border-[#DCDCDC] shadow-md", 
              formButtonPrimary: "font-medium hover:opacity-90 transition-opacity shadow-none",
              footerActionLink: "text-[#E4572E] hover:text-[#c44321] font-semibold", 
            }
          }}
        />
      </div>
    </main>
  );
}