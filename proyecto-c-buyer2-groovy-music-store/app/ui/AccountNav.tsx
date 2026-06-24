'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'

export default function AccountNav() {
    const pathname = usePathname();

    return (
        <div className="flex items-center justify-between px-8 py-3 bg-foreground text-white/90 text-xs font-medium tracking-[0.12em] uppercase border-b border-[#3a3a3a]">
            <div className="flex items-center gap-3">
                <Link
                    href="/catalogo"
                    className="group flex items-center gap-2 px-5 py-1.5 rounded-full font-bold border-2 bg-[#B83A15] text-white border-[#9C2E0F] shadow-sm hover:bg-[#A33313] hover:scale-105 transition-all duration-300 normal-case tracking-normal mr-2"
                    aria-label="Volver al catálogo"
                >
                    <ArrowLeftIcon className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1" aria-hidden="true" />
                    <span>Volver al catálogo</span>
                </Link>

                <Link 
                    href="/account/profile" 
                    aria-label="Ir a Mi Perfil"
                    className={`px-4 py-1.5 rounded-full font-bold border-2 transition-all duration-300 ${
                        pathname.includes('/account/profile') 
                            ? "bg-[#B83A15] text-white border-[#9C2E0F] shadow-sm text-shadow-contrast" 
                            : "bg-transparent text-white/90 border-transparent hover:text-white hover:border-white/30"
                    }`}
                >
                    MI PERFIL
                </Link>
                
                <Link 
                    href="/account/orders" 
                    aria-label="Ir a Mis Pedidos"
                    className={`px-4 py-1.5 rounded-full font-bold border-2 transition-all duration-300 ${
                        pathname.includes('/account/orders') 
                            ? "bg-[#B83A15] text-white border-[#9C2E0F] shadow-sm text-shadow-contrast" 
                            : "bg-transparent text-white/90 border-transparent hover:text-white hover:border-white/30"
                    }`}
                >
                    MIS PEDIDOS
                </Link>
            </div>
        </div>
    )
}