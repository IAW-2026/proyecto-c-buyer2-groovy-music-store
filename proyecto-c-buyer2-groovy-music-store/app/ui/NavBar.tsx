import { SignOutButton } from "@clerk/nextjs"
import { MagnifyingGlassIcon, ArrowRightEndOnRectangleIcon } from '@heroicons/react/24/outline'
import CartServer from '@/app/ui/CartServer'
import Link from 'next/link'

 export default function NavBar () {
    return (
        <>
            {/* BARRA DE NAVEGACIÓN SUPERIOR */}
            <nav className="flex items-center justify-between px-5 md:px-8 py-4 md:py-5 bg-primary text-white relative">
    
                {/* Logo Central  */}
                <div className="md:absolute md:left-1/2 md:-translate-x-1/2">
                    <Link href="/" className="font-cormorant text-2xl md:text-3xl font-light tracking-[0.25em] md:tracking-[0.55em] select-none">
                        GROOVY
                    </Link>
                </div>

                {/* Íconos Derechos */}
                <div className="flex items-center gap-4 md:gap-6 ml-auto">
                    {/* Búsqueda */}
                    <button className="hover:opacity-80 transition-opacity">
                        <MagnifyingGlassIcon className="w-5 h-5 md:w-5 md:h-5" />
                    </button>

                    {/* Botón Salir con Clerk */}
                    <SignOutButton redirectUrl="/">
                        <button className="flex items-center gap-2 hover:opacity-80 transition-opacity text-sm font-medium tracking-wide cursor-pointer bg-transparent border-none text-white" title="Salir">
                            <ArrowRightEndOnRectangleIcon className="w-5 h-5 md:w-5 md:h-5" />
                        </button>
                    </SignOutButton>

                    {/* Componente del Carrito Original */}
                    <CartServer />
                </div>
            </nav>
        </>
    )
}