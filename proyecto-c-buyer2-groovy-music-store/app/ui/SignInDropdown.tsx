"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { 
    UserCircleIcon, 
    BuildingStorefrontIcon, 
    ShoppingBagIcon 
} from '@heroicons/react/24/outline';

interface SignInDropdownProps {
    navItemClass: string;
    textClass: string;
}

export default function SignInDropdown({ navItemClass, textClass }: SignInDropdownProps) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Accesibilidad y UX: Cierra el menú al hacer clic fuera de él
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Accesibilidad: Cerrar menú con la tecla Escape
    useEffect(() => {
        function handleKeyDown(event: KeyboardEvent) {
            if (event.key === "Escape") setIsOpen(false);
        }
        if (isOpen) document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [isOpen]);

    return (
        <div className="relative" ref={dropdownRef}>
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className={navItemClass}
                aria-haspopup="menu"
                aria-expanded={isOpen}
                aria-label="Opciones de inicio de sesión"
            >
                <UserCircleIcon className="w-5 h-5" aria-hidden="true" />
                <span className={textClass}>Ingresar</span>
            </button>

            {isOpen && (
                <div 
                    className="absolute right-0 mt-3 w-64 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-50 flex flex-col origin-top-right transition-all"
                    role="menu"
                    aria-label="Menú de inicio de sesión"
                >
                    {/* Opción Vendedor*/}
                    <Link 
                        href="/sign-in"
                        className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors focus:bg-blue-50 focus:outline-none"
                        role="menuitem"
                        onClick={() => setIsOpen(false)}
                    >
                        <BuildingStorefrontIcon className="w-6 h-6 text-blue-600" aria-hidden="true" />
                        <div className="flex flex-col">
                            <span className="font-semibold">Ingresar como Vendedor</span>
                            <span className="text-xs text-gray-500 line-clamp-1">Gestiona tu tienda y productos</span>
                        </div>
                    </Link>
                    
                    <div className="h-[1px] bg-gray-100 w-full" role="separator"></div>

                    {/* Opción Comprador: Redirige a la URL externa */}
                    <a 
                        href="https://proyecto-c-seller2-groovy-music-sto.vercel.app/"
                        className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700 transition-colors focus:bg-green-50 focus:outline-none"
                        role="menuitem"
                        onClick={() => setIsOpen(false)}
                    >
                        <ShoppingBagIcon className="w-6 h-6 text-green-600" aria-hidden="true" />
                        <div className="flex flex-col">
                            <span className="font-semibold">Ingresar como Comprador</span>
                            <span className="text-xs text-gray-500 line-clamp-1">Explora y compra música</span>
                        </div>
                    </a>
                </div>
            )}
        </div>
    );
}