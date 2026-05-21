import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    // Cambio de color de fondo
    <main className="flex min-h-screen items-center justify-center bg-[var(--bg-retro)] p-4">
      
      {/* Personalizcion del componente *de Clerk*/}
      <SignUp 
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

    </main>
  );
}