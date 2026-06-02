import { auth } from "@clerk/nextjs/server";
import { ArrowRightIcon, UserIcon, UserPlusIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import Image from "next/image";
import SimpleNavBar from "./ui/SimpleNavBar";

export default async function Home() {
    const { userId } = await auth();

    return (
        <main className="min-h-screen flex flex-col bg-[#1a1008]">
            <SimpleNavBar />

            {/* Hero — full bleed */}
            <div className="relative flex-1 flex flex-col min-h-[calc(100vh-84px)]">
                {/* Background image */}
                <Image
                    src="https://images.unsplash.com/photo-1761098281103-51bf33e39d7f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aW55bCUyMHJlY29yZHMlMjBjb2xsZWN0aW9uJTIwbW9vZHklMjBkYXJrJTIwbXVzaWN|ZW58MXx8fHwxNzgwMDkzMjc1fDA&ixlib=rb-4.1.0&q=80&w=1600"
                    alt="Tienda de discos de vinilo"
                    fill
                    className="object-cover object-center z-0"
                    priority
                />

                {/* Dark overlay — heavier at bottom */}
                <div className="absolute inset-0 bg-gradient-to-b from-[#1a1008]/60 via-[#1a1008]/50 to-[#1a1008]/90 z-10" />

                {/* Content */}
                <div className="relative z-20 flex flex-col items-center justify-center flex-1 px-6 text-center pb-12 pt-10">

                    {/* Eyebrow */}
                    <p
                        className="text-xs tracking-[0.35em] text-primary mb-6 uppercase"
                        style={{ fontFamily: "'DM Sans', sans-serif" }}
                    >
                        Música física · Coleccionismo · Pasión
                    </p>

                    {/* Main headline */}
                    <h1
                        className="text-white mb-4 leading-none"
                        style={{
                            fontFamily: "'Cormorant Garamond', serif",
                            fontWeight: 300,
                            fontSize: "clamp(4rem, 12vw, 9rem)",
                            letterSpacing: "0.08em",
                        }}
                    >
                        GROOVY
                    </h1>

                    {/* Subheadline */}
                    <p
                        className="text-white/70 max-w-md mb-3"
                        style={{ fontFamily: "'Syne', sans-serif", fontSize: "1.05rem", letterSpacing: "0.03em" }}
                    >
                        La tienda de música física para quienes saben que el sonido analógico no tiene sustituto.
                    </p>

                    {/* Thin divider */}
                    <div className="w-16 h-px bg-primary/60 mb-10" />

                    {/* RENDERIZADO CONDICIONAL SEGÚN SESIÓN */}
                    {!userId ? (
                        <>
                            <p
                                className="text-white/60 text-sm mb-6 tracking-wider"
                                style={{ letterSpacing: "0.12em" }} 
                            >
                                Iniciá sesión o registrate para comenzar a comprar
                            </p>

                            {/* Auth buttons*/}
                            <div className="flex flex-col sm:flex-row items-center gap-4 mb-16">
                                
                                {/* Iniciar sesión - TEXTO BLANCO SOBRE TERRACOTA OSCURO (Pasa contraste) */}
                                <Link 
                                    href="/sign-in" 
                                    aria-label="Iniciar sesión en tu cuenta"
                                    className="group flex items-center gap-3 px-8 py-3.5 bg-[#B83A15] text-white border-2 border-[#9C2E0F] text-shadow-contrast shadow-md rounded-full hover:bg-[#A33313] transition-all hover:scale-105"
                                >
                                    <UserIcon className="w-5 h-5 text-white" aria-hidden="true" />
                                    <span className="text-sm font-bold tracking-widest uppercase">
                                        Iniciar sesión
                                    </span>
                                    <ArrowRightIcon className="w-4 h-4 text-white opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" aria-hidden="true" />
                                </Link>

                                {/* Registrarse */}
                                <Link 
                                    href="/sign-up" 
                                    aria-label="Registrar una cuenta nueva"
                                    className="group flex items-center gap-3 px-8 py-3.5 bg-transparent border-2 border-white/60 text-white rounded-full hover:border-white hover:bg-white/10 transition-all hover:scale-105 backdrop-blur-sm"
                                >
                                    <UserPlusIcon className="w-5 h-5" aria-hidden="true" />
                                    <span className="text-sm font-bold tracking-widest uppercase">
                                        Registrarse
                                    </span>
                                    <ArrowRightIcon className="w-4 h-4 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" aria-hidden="true" />
                                </Link>
                            </div>

                            {/* Continuar sin cuenta */}
                            <Link 
                                href="/catalogo" 
                                aria-label="Continuar al catálogo sin crear cuenta"
                                className="group flex items-center gap-2 mt-auto px-6 py-3 bg-white/5 hover:bg-white/15 border border-white/30 hover:border-white/60 text-white rounded-full transition-all backdrop-blur-sm"
                            >
                                <span className="text-[11px] font-bold tracking-[0.15em] uppercase">
                                    Continuar sin cuenta
                                </span>
                                <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
                            </Link>
                        </>
                    ) : (
                        <>
                            {/* ESTADO LOGUEADO - TEXTO BLANCO SOBRE TERRACOTA OSCURO */}
                            <Link
                                href="/catalogo"
                                aria-label="Ir al Catálogo de productos"
                                className="group flex items-center gap-3 px-10 py-4 bg-[#B83A15] text-white border-2 border-[#9C2E0F] text-shadow-contrast shadow-md rounded-full hover:bg-[#A33313] transition-all hover:scale-105 mt-4"
                            >
                                <span className="text-sm font-bold tracking-widest uppercase" style={{ letterSpacing: "0.12em" }}>
                                    Ir al Catálogo
                                </span>
                                <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
                            </Link>
                        </>
                    )}

                </div>
            </div>
        </main>
    );
}