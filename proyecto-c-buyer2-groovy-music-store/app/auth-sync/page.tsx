/**
  * PUENTE DE AUTENTICACIÓN: Registra al usuario de Clerk en Prisma para poder asociarle carritos/compras.
  * Al terminar, lo redirige inteligentemente al producto exacto donde interrumpió su compra (o al catálogo).
 */
import { currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import prisma from "@/app/lib/prisma"
import ForceRedirect from "@/app/ui/ForceRedirect" // <-- Importamos nuestro nuevo componente

interface AuthSyncProps {
    searchParams: Promise<{ returnTo?: string }>;
}

export default async function AuthSyncPage({ searchParams }: AuthSyncProps) {
    // 1. Verificamos el usuario
    const user = await currentUser();

    if (!user) {
        redirect('/');
    }

    // 2. Sincronizamos con el modelo "Usuario" de Prisma UNA SOLA VEZ
    await prisma.usuario.upsert({
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

    const resolvedSearchParams = await searchParams;
    const isAdmin = user.publicMetadata?.roles === 'admin';
    const rutaPorDefecto = isAdmin ? '/admin' : '/catalogo';
    
    const destinoFinal = resolvedSearchParams.returnTo || rutaPorDefecto;

    return <ForceRedirect destino={destinoFinal} />;
}