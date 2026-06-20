import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const isPublicRoute = createRouteMatcher(['/', '/sign-in(.*)', '/sign-up(.*)', '/catalogo(.*)', '/auth-sync(.*)']);
const isAdminRoute = createRouteMatcher(['/admin(.*)']);
const isIntegrationApiRoute = createRouteMatcher(['/api/orders/payment-status', '/api/orders/shipping-status']);

export default clerkMiddleware(async (auth, req) => {
  // 1. Validar tokens de integración (Payments y Shipping)
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
    if (sessionClaims?.roles !== 'admin') {
      return NextResponse.redirect(new URL('/', req.url));
    }
  }

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