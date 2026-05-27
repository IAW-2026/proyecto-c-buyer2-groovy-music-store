import { currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import prisma from "@/app/lib/prisma"

export default async function OrdersPage() {
    const user = await currentUser();

    if (!user) {
        redirect('/sign-in');
    }

    return (
        <>
            <header className="mb-10">
                <h1 className="font-syne m-0 text-4xl font-semibold text-foreground">Mis Pedidos</h1>
                <p className="font-dm mt-2 mb-0 text-foreground/70 text-base">
                    Historial de compras de {user.firstName || 'tu cuenta'}
                </p>
                <div className="w-20 h-1 bg-primary mt-4 rounded-full"></div>
            </header>
            
            <div className="bg-card border border-border rounded-xl p-12 text-center shadow-sm flex flex-col items-center justify-center min-h-[400px]">
                <h3 className="font-syne text-2xl font-semibold text-foreground mb-3">Aún no hay pedidos</h3>
                <p className="font-dm text-foreground/70 text-lg">
                    Cuando adquieras tus primeros vinilos, cassettes o CDs, aparecerán aquí.
                </p>
            </div>
        </>
    )
}