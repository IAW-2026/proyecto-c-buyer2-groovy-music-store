import { SignOutButton } from "@clerk/nextjs"
import { auth } from "@clerk/nextjs/server"
import { ArrowRightEndOnRectangleIcon, UserCircleIcon } from '@heroicons/react/24/outline'
import CartServer from '@/app/ui/CartServer'
import SearchBar from '@/app/ui/SearchBar'
import Link from 'next/link'
import SignInDropdown from '@/app/ui/SignInDropdown' 
import SignUpDropdown from '@/app/ui/SignUpDropdown'

export default async function NavBar() {
    const { userId } = await auth();


    const navItemClass = "group flex items-center p-2 bg-transparent hover:bg-white/10 rounded-full transition-all duration-300 ease-in-out cursor-pointer text-white border border-transparent";
    const textClass = "hidden md:block max-w-0 opacity-0 overflow-hidden whitespace-nowrap group-hover:max-w-[120px] group-hover:opacity-100 group-hover:ml-2 transition-all duration-300 ease-in-out text-[11px] font-bold tracking-widest uppercase";

    return (
        <nav className="w-full min-h-[70px] md:min-h-[84px] flex items-center justify-between px-5 md:px-8 py-4 bg-primary text-white" role="navigation" aria-label="Navegación principal">
            
            <div className="md:absolute md:left-1/2 md:-translate-x-1/2">
                <Link href="/catalogo" className="font-cormorant text-2xl md:text-3xl font-light tracking-[0.25em] md:tracking-[0.55em] select-none block px-2 py-1 text-white" aria-label="Ir al inicio - Groovy">
                    GROOVY
                </Link>
            </div>

            <div className="flex items-center gap-1 md:gap-2 ml-auto">
                {/* Búsqueda  */}
                <SearchBar />

                {userId ? (
                    <>
                        <Link href="/account/profile" className={navItemClass} aria-label="Mi Perfil">
                            <UserCircleIcon className="w-5 h-5" aria-hidden="true" />
                            <span className={textClass}>Mi Perfil</span>
                        </Link>
                        
                        <CartServer />
                        
                        <SignOutButton redirectUrl="/">
                            <button className={navItemClass} aria-label="Cerrar sesión">
                                <ArrowRightEndOnRectangleIcon className="w-5 h-5" aria-hidden="true" />
                                <span className={textClass}>Salir</span>
                            </button>
                        </SignOutButton>
                    </>
                ) : (
                    <>
                        {/* DROPDOWNS*/}
                        <SignInDropdown navItemClass={navItemClass} textClass={textClass} />
                        <SignUpDropdown navItemClass={navItemClass} textClass={textClass} />
                    </>
                )}
            </div>
        </nav>
    )
}