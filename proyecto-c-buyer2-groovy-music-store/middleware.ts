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
  // AGREGAR ESTO TEMPORALMENTE
  console.log("=== DEBUG MIDDLEWARE ===");
  console.log("Ruta solicitada:", req.nextUrl.pathname);
  console.log("Session Claims:", JSON.stringify(sessionClaims, null, 2));

 if (isAdminRoute(req)) {
  const roles = sessionClaims?.roles as string[] | undefined;
  const esAdmin = roles?.some(r => ['admin', 'super_admin', 'admin_buyer'].includes(r));
  if (!esAdmin) {
    return NextResponse.redirect(new URL('/', req.url));
  }
}

  if (!isPublicRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    '/((?!api/orders/cleanup|_next|.*\\..*).*)',
  ],
};