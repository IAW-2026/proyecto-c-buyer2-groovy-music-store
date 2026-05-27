import NavBar from '@/app/ui/NavBar'
import AccountNav from '@/app/ui/AccountNav'

export default function AccountLayout({ children }: { children: React.ReactNode }) {
    return (
        <main className="min-h-screen bg-background font-dm pb-20">
            {/* Barra principal superior */}
            <NavBar />

            {/* Barra secundaria idéntica a la del catálogo */}
            <AccountNav />

            {/* Contenedor central para Perfil y Pedidos */}
            <div className="max-w-7xl mx-auto px-8 mt-10">
                {children}
            </div>
        </main>
    )
}