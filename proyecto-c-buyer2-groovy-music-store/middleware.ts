import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const isPublicRoute = createRouteMatcher(['/', '/sign-in(.*)', '/sign-up(.*)', '/catalogo(.*)', '/auth-sync(.*)','/api/orders/cleanup']);
const isAdminRoute = createRouteMatcher(['/admin(.*)']);
const isIntegrationApiRoute = createRouteMatcher([
  //para que usen payments y shipping
  '/api/orders/payment-status', 
  '/api/orders/shipping-status',
  //analytics
  '/api/analytics(.*)',
  //control plane 
  '/api/orders(.*)',
  '/api/users(.*)'
]);

export default clerkMiddleware(async (auth, req) => {
  // 1. Validar tokens de integración 
  if (isIntegrationApiRoute(req)) {
    const authHeader = req.headers.get('Authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'unauthorized', mensaje: 'Token ausente o inválido' }, { status: 401 });
    }

    try {
      const token = authHeader.split(' ')[1];
      const secret = new TextEncoder().encode(process.env.BUYER_JWT_SECRET);
      await jwtVerify(token, secret);
      return NextResponse.next();
    } catch {
      return NextResponse.json({ error: 'unauthorized', mensaje: 'Token inválido' }, { status: 401 });
    }
  }

  // 2. Lógica de Clerk
  const { sessionClaims } = await auth();



  if (isAdminRoute(req)) {
  const userRoles = (sessionClaims?.roles as string[]) || [];
  
  const hasAccess = userRoles.some(role => ['admin', 'super_admin'].includes(role));

  if (!hasAccess) {
    return NextResponse.redirect(new URL('/', req.url));
  }
}

  if (!isPublicRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    /*
     * Excluye:
     * - api/orders/cleanup 
     * - _next (Archivos internos de Next.js)
     * - Archivos estáticos (imágenes, favicons, etc)
     */
    '/((?!api/orders/cleanup|_next|.*\\..*).*)',
  ],
};