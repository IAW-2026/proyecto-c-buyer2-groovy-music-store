/**
 * PUENTE DE AUTENTICACIÓN: Registra al usuario de Clerk en Prisma para poder asociarle carritos/compras.
 * Al terminar, lo redirige inteligentemente al producto exacto donde interrumpió su compra (o al catálogo).
 */
import { currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import prisma from "@/app/lib/prisma"
import ForceRedirect from "@/app/ui/ForceRedirect"

interface AuthSyncProps {
    searchParams: Promise<{ returnTo?: string }>;
}

export default async function AuthSyncPage({ searchParams }: AuthSyncProps) {
    
    const user = await currentUser();

    if (!user) {
        redirect('/');
    }

    
    const dbUser = await prisma.usuario.upsert({
        where: { clerk_id: user.id },
        update: {
            mail: user.emailAddresses[0]?.emailAddress ?? "",
            nombre: user.firstName ?? "Usuario",
        },
        create: {
            clerk_id: user.id,
            mail: user.emailAddresses[0]?.emailAddress ?? "",
            nombre: user.firstName ?? "Usuario",
        }
    });

    // BARRERA DE ACCESO: Si el usuario existe pero está desactivado, redirige a acceso denegado
    if (dbUser.activo === false) {
        redirect('/acceso-denegado');
    }

    //  Si el usuario está activo, seguimos con la lógica normal 
    const resolvedSearchParams = await searchParams;
  
    
  const userRoles = (user.publicMetadata?.roles as string[]) || [];

    // Verificamos si el array incluye alguno de los roles de administrador
    const isAdmin = userRoles.includes('admin') || userRoles.includes('super_admin') || userRoles.includes('admin_buyer');

    const rutaPorDefecto = isAdmin ? '/admin' : '/catalogo';
    
    const destinoFinal = resolvedSearchParams.returnTo || rutaPorDefecto;

    return <ForceRedirect destino={destinoFinal} />;
}