import { SignOutButton } from "@clerk/nextjs"
import { auth } from "@clerk/nextjs/server"
import { MagnifyingGlassIcon, ArrowRightEndOnRectangleIcon, UserCircleIcon, UserPlusIcon } from '@heroicons/react/24/outline'
import CartServer from '@/app/ui/CartServer'
import Link from 'next/link'

export default async function NavBar() {
    const { userId } = await auth();

    return (
        <nav className="w-full min-h-[70px] md:min-h-[84px] flex items-center justify-between px-5 md:px-8 py-4 md:py-5 bg-primary text-white relative">
            
            {/* Logo Central */}
            <div className="md:absolute md:left-1/2 md:-translate-x-1/2">
                <Link 
                    href="/catalogo" 
                    className="group font-cormorant text-2xl md:text-3xl font-light tracking-[0.25em] md:tracking-[0.55em] select-none block px-2 py-1"
                >
                    {"GROOVY".split("").map((letter, index) => (
                        <span 
                            key={index} 
                            className="inline-block transition-transform duration-300 ease-out group-hover:-translate-y-2"
                            style={{ transitionDelay: `${index * 50}ms` }}
                        >
                            {letter}
                        </span>
                    ))}
                </Link>
            </div>

            {/* Íconos Derechos */}
            <div className="flex items-center gap-1 md:gap-2 ml-auto">
                
                {/* 1. Búsqueda  */}
                <button className="group flex items-center p-2 bg-transparent hover:bg-white/15 rounded-full transition-all duration-300 ease-in-out cursor-pointer border-none text-white">
                    <MagnifyingGlassIcon className="w-5 h-5 text-white/90 group-hover:text-white transition-colors" />
                    <span className="hidden md:block max-w-0 opacity-0 overflow-hidden whitespace-nowrap group-hover:max-w-[80px] group-hover:opacity-100 group-hover:ml-2 transition-all duration-300 ease-in-out text-[11px] font-bold tracking-widest uppercase">
                        Buscar
                    </span>
                </button>

                {/* RENDERIZADO CONDICIONAL SEGÚN SESIÓN */}
                {userId ? (
                    <>
                        {/* 2. Ícono de Perfil / Cuenta */}
                        <Link href="/account/profile" className="group flex items-center p-2 bg-transparent hover:bg-white/15 rounded-full transition-all duration-300 ease-in-out cursor-pointer">
                            <UserCircleIcon className="w-5 h-5 text-white/90 group-hover:text-white transition-colors" />
                            <span className="max-w-0 opacity-0 overflow-hidden whitespace-nowrap group-hover:max-w-[100px] group-hover:opacity-100 group-hover:ml-2 transition-all duration-300 ease-in-out text-[11px] font-bold tracking-widest uppercase">
                                Mi Perfil
                            </span>
                        </Link>

                        {/* 3. Carrito */}
                        <CartServer />

                        {/* 4. Botón Salir */}
                        <SignOutButton redirectUrl="/">
                            <button className="group flex items-center p-2 bg-transparent hover:bg-white/15 rounded-full transition-all duration-300 ease-in-out cursor-pointer border-none text-white">
                                <ArrowRightEndOnRectangleIcon className="w-5 h-5 text-white/90 group-hover:text-white transition-colors" />
                                <span className="hidden md:block max-w-0 opacity-0 overflow-hidden whitespace-nowrap group-hover:max-w-[60px] group-hover:opacity-100 group-hover:ml-2 transition-all duration-300 ease-in-out text-[11px] font-bold tracking-widest uppercase">
                                    Salir
                                </span>
                            </button>
                        </SignOutButton>
                    </>
                ) : (
                    <>
                        {/* Ícono de Ingresar */}
                        <Link href="/sign-in" className="group flex items-center p-2 bg-transparent hover:bg-white/15 rounded-full transition-all duration-300 ease-in-out cursor-pointer">
                            <UserCircleIcon className="w-5 h-5 text-white/90 group-hover:text-white transition-colors" />
                            <span className="hidden md:block max-w-0 opacity-0 overflow-hidden whitespace-nowrap group-hover:max-w-[90px] group-hover:opacity-100 group-hover:ml-2 transition-all duration-300 ease-in-out text-[11px] font-bold tracking-widest uppercase">
                                Ingresar
                            </span>
                        </Link>

                        {/* Ícono de Registrarse */}
                        <Link href="/sign-up" className="group flex items-center p-2 bg-transparent hover:bg-white/15 rounded-full transition-all duration-300 ease-in-out cursor-pointer">
                            <UserPlusIcon className="w-5 h-5 text-white/90 group-hover:text-white transition-colors" />
                            <span className="hidden md:block max-w-0 opacity-0 overflow-hidden whitespace-nowrap group-hover:max-w-[120px] group-hover:opacity-100 group-hover:ml-2 transition-all duration-300 ease-in-out text-[11px] font-bold tracking-widest uppercase">
                                Registrarse
                            </span>
                        </Link>
                    </>
                )}

            </div>
        </nav>
    )
}