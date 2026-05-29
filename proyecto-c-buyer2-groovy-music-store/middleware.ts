import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Tus rutas públicas
const isPublicRoute = createRouteMatcher([
  '/sign-in(.*)', 
  '/sign-up(.*)', 
  '/'
]);

// Nueva regla para las rutas de administrador
const isAdminRoute = createRouteMatcher(['/admin(.*)']);

export default clerkMiddleware(async (auth, request) => {
  // 1. Si la ruta NO es pública, forzamos que el usuario esté logueado
  if (!isPublicRoute(request)) {
    await auth.protect();
  }

  // 2. Si la ruta es de administración, verificamos el rol específico
  if (isAdminRoute(request)) {
    const { sessionClaims } = await auth();
    
    // Validamos la propiedad 'roles' que configuraste en el dashboard
    if (sessionClaims?.roles !== 'admin') {
      // Si está logueado pero no es admin, lo devolvemos al inicio
      const url = new URL('/', request.url);
      return NextResponse.redirect(url);
    }
  }
});

export const config = {
  matcher: [ '/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};