"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { 
    UserPlusIcon, 
    BuildingStorefrontIcon, 
    ShoppingBagIcon 
} from '@heroicons/react/24/outline';

interface SignUpDropdownProps {
    navItemClass: string;
    textClass: string;
}

export default function SignUpDropdown({ navItemClass, textClass }: SignUpDropdownProps) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    
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
                aria-label="Opciones de registro"
            >
                <UserPlusIcon className="w-5 h-5" aria-hidden="true" />
                <span className={textClass}>Registrarse</span>
            </button>

            {isOpen && (
                <div 
                    className="absolute right-0 mt-3 w-72 bg-[var(--panel-bg)] rounded-xl shadow-2xl border border-[var(--divider)] overflow-hidden z-50 flex flex-col gap-3 p-4 origin-top-right transition-all"
                    role="menu"
                    aria-label="Menú de registro"
                >
                    {/* Opción Comprador */}
                    <Link 
                        href="/sign-up"
                        className="flex items-center justify-center gap-2 px-4 py-2.5 w-full text-sm font-semibold text-white bg-[var(--accent-terracotta-dark)] rounded-lg hover:bg-[var(--accent-terracotta)] transition-colors focus:ring-2 focus:ring-[var(--accent-terracotta-dark)] focus:ring-offset-1 focus:outline-none shadow-sm"
                        role="menuitem"
                        onClick={() => setIsOpen(false)}
                    >
                        <ShoppingBagIcon className="w-5 h-5" aria-hidden="true" />
                        <span>Registrarse como Comprador</span>
                    </Link>

                    {/* Opción Vendedor  */}
                    <a 
                        href="https://proyecto-c-seller2-groovy-music-sto.vercel.app/sign-up"
                        className="flex items-center justify-center gap-2 px-4 py-2.5 w-full text-sm font-semibold text-[var(--accent-terracotta-dark)] bg-[var(--panel-bg)] border border-[var(--accent-terracotta-dark)] rounded-lg hover:bg-[var(--accent-terracotta-dark)]/5 transition-colors focus:ring-2 focus:ring-[var(--accent-terracotta-dark)] focus:ring-offset-1 focus:outline-none"
                        role="menuitem"
                        onClick={() => setIsOpen(false)}
                    >
                        <BuildingStorefrontIcon className="w-5 h-5" aria-hidden="true" />
                        <span>Registrarse como Vendedor</span>
                    </a>
                </div>
            )}
        </div>
    );
}