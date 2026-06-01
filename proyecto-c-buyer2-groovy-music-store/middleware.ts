import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Agregamos /auth-sync a las rutas públicas para que no se bloquee
const isPublicRoute = createRouteMatcher(['/', '/sign-in(.*)', '/sign-up(.*)', '/catalogo(.*)', '/auth-sync(.*)']);
const isAdminRoute = createRouteMatcher(['/admin(.*)']);

export default clerkMiddleware(async (auth, req) => {
  const { sessionClaims } = await auth();
  

  // Protección de rutas de Admin
  if (isAdminRoute(req)) {
    if (sessionClaims?.roles !== 'admin') {
      return NextResponse.redirect(new URL('/', req.url));
    }
  }

  // Protección global para el resto de la app
  if (!isPublicRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};