'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function AccountNav() {
    const pathname = usePathname();

    return (
        <div className="flex items-center justify-between px-8 py-3 bg-foreground text-white/50 text-xs font-medium tracking-[0.12em] uppercase border-b border-[#3a3a3a]">
            <div className="flex items-center gap-8">
                <Link 
                    href="/account/profile" 
                    className={pathname.includes('/account/profile') ? "bg-primary text-white px-5 py-1.5 rounded-full" : "hover:text-white transition-colors"}
                >
                    MI PERFIL
                </Link>
                <Link 
                    href="/account/orders" 
                    className={pathname.includes('/account/orders') ? "bg-primary text-white px-5 py-1.5 rounded-full" : "hover:text-white transition-colors"}
                >
                    MIS PEDIDOS
                </Link>
            </div>
        </div>
    )
}