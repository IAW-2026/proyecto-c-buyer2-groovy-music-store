import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    // Centramos el formulario de Clerk en el medio de la pantalla con Tailwind
    <main className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-zinc-950 p-4">
      <SignIn />
    </main>
  );
}