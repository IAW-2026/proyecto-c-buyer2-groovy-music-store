'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ArrowLeftIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'

export default function AccountNav() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);

    const navLinks = [
        { href: '/account/profile', label: 'MI PERFIL' },
        { href: '/account/orders', label: 'MIS PEDIDOS' },
        { href: '/account/addresses', label: 'MIS DIRECCIONES' },
    ];

    return (
        <div className="bg-foreground text-white/90 text-xs font-medium tracking-[0.12em] uppercase border-b border-[#3a3a3a] px-4 md:px-8 py-3">
            
            {/* --- VISTA ESCRITORIO (md en adelante) --- */}
            <div className="hidden md:flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Link
                        href="/catalogo"
                        className="group flex items-center gap-2 px-5 py-1.5 rounded-full font-bold border-2 bg-[#B83A15] text-white border-[#9C2E0F] shadow-sm hover:bg-[#A33313] hover:scale-105 transition-all duration-300 normal-case tracking-normal mr-2"
                        aria-label="Volver al catálogo"
                    >
                        <ArrowLeftIcon className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1" aria-hidden="true" />
                        <span>Volver al catálogo</span>
                    </Link>

                    {navLinks.map((link) => {
                        const isActive = pathname.includes(link.href);
                        return (
                            <Link 
                                key={link.href}
                                href={link.href} 
                                aria-label={`Ir a ${link.label}`}
                                className={`px-4 py-1.5 rounded-full font-bold border-2 transition-all duration-300 ${
                                    isActive 
                                        ? "bg-[#B83A15] text-white border-[#9C2E0F] shadow-sm text-shadow-contrast" 
                                        : "bg-transparent text-white/90 border-transparent hover:text-white hover:border-white/30"
                                }`}
                            >
                                {link.label}
                            </Link>
                        );
                    })}
                </div>
            </div>

            {/* --- VISTA MÓVIL (Celulares) --- */}
            <div className="flex md:hidden items-center justify-between w-full">
                <Link
                    href="/catalogo"
                    className="flex items-center gap-1 px-3 py-1.5 rounded-full font-bold border border-[#9C2E0F] bg-[#B83A15] text-white text-[10px] normal-case tracking-normal"
                    aria-label="Volver al catálogo"
                >
                    <ArrowLeftIcon className="w-3.5 h-3.5" />
                    <span>Catálogo</span>
                </Link>

                <button
                    onClick={() => setIsOpen(true)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/20 bg-white/5 text-white active:bg-white/10 transition-colors"
                    aria-label="Abrir menú de cuenta"
                >
                    <Bars3Icon className="w-4 h-4" />
                    <span className="text-[10px] font-bold">Menú Cuenta</span>
                </button>
            </div>

            {/* --- MENÚ LATERAL DESPLEGABLE (DRAWER) --- */}
            <div 
                className={`fixed inset-0 bg-black/60 z-50 transition-opacity duration-300 md:hidden ${
                    isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                }`}
                onClick={() => setIsOpen(false)}
            />

            <div 
                className={`fixed top-0 right-0 h-full w-72 bg-foreground border-l border-[#3a3a3a] p-6 z-50 shadow-2xl transform transition-transform duration-300 md:hidden flex flex-col ${
                    isOpen ? 'translate-x-0' : 'translate-x-full'
                }`}
            >
                <div className="flex items-center justify-between pb-4 border-b border-[#3a3a3a] mb-6">
                    <span className="font-semibold tracking-wider text-sm text-white">Mi Cuenta</span>
                    <button 
                        onClick={() => setIsOpen(false)}
                        className="p-1 text-white/60 hover:text-white"
                        aria-label="Cerrar menú"
                    >
                        <XMarkIcon className="w-5 h-5" />
                    </button>
                </div>

                <nav className="flex flex-col gap-3">
                    {navLinks.map((link) => {
                        const isActive = pathname.includes(link.href);
                        return (
                            <Link 
                                key={link.href}
                                href={link.href} 
                                onClick={() => setIsOpen(false)}
                                className={`w-full px-4 py-3 rounded-xl font-bold border text-left transition-all text-xs tracking-widest ${
                                    isActive 
                                        ? "bg-[#B83A15] text-white border-[#9C2E0F] shadow-md" 
                                        : "bg-transparent text-white/70 border-transparent hover:bg-white/5 hover:text-white"
                                }`}
                            >
                                {link.label}
                            </Link>
                        );
                    })}
                </nav>

                <div className="mt-auto pt-4 border-t border-[#3a3a3a]">
                    <Link
                        href="/catalogo"
                        onClick={() => setIsOpen(false)}
                        className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl font-bold border border-white/20 text-white/60 hover:text-white text-xs normal-case tracking-normal"
                    >
                        <ArrowLeftIcon className="w-4 h-4" />
                        <span>Volver al Catálogo</span>
                    </Link>
                </div>
            </div>

        </div>
    )
}