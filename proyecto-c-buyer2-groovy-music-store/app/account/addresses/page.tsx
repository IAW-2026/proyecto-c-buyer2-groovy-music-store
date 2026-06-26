import { currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import prisma from '@/app/lib/prisma'
import GestionDirecciones from "@/app/ui/GestionDirecciones"
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Mis direcciones - Groovy Music Store",
  description: "Panel de gestión de direcciones de Groovy Music Store." 
}

export default async function AddressesPage() {
    const user = await currentUser();

    if (!user) {
        redirect('/sign-in');
    }

    const direcciones = await prisma.direccion.findMany({
        where: {
            clerk_id: user.id
        },
        orderBy: {
            id: 'desc' 
        }
    });

    return (
        <div className="max-w-5xl w-full mx-auto px-4 md:px-0">
            <header className="mb-10">
                <h1 className="font-syne m-0 text-4xl font-semibold text-foreground">Mis Direcciones</h1>
                <p className="font-dm mt-2 mb-0 text-foreground/70 text-base">
                    Administra tus lugares de entrega, {user.firstName || 'tu cuenta'}
                </p>
                <div className="w-20 h-1 bg-primary mt-4 rounded-full"></div>
            </header>
            
            {/* Llamada al componente unificado */}
            <GestionDirecciones direccionesIniciales={direcciones} clerkId={user.id} />
        </div>
    )
}