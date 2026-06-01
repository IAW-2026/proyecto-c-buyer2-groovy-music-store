import { auth } from "@clerk/nextjs/server";
import { SignInButton, SignUpButton } from "@clerk/nextjs";
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
                    src="https://images.unsplash.com/photo-1761098281103-51bf33e39d7f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aW55bCUyMHJlY29yZHMlMjBjb2xsZWN0aW9uJTIwbW9vZHklMjBkYXJrJTIwbXVzaWN8ZW58MXx8fHwxNzgwMDkzMjc1fDA&ixlib=rb-4.1.0&q=80&w=1600"
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
                        className="text-white/60 max-w-md mb-3"
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
                                className="text-white/50 text-sm mb-6 tracking-wider"
                                style={{ letterSpacing: "0.1em" }}
                            >
                                Iniciá sesión o registrate para comenzar a comprar
                            </p>

                            {/* Auth buttons */}
                            <div className="flex flex-col sm:flex-row items-center gap-4 mb-16">
                                
                                {/* Iniciar sesión */}
                                <SignInButton forceRedirectUrl="/auth-sync">
                                    <button 
                                        className="group flex items-center gap-3 px-8 py-3.5 bg-primary text-white rounded-full hover:opacity-90 transition-all hover:scale-105 shadow-lg shadow-primary/20"
                                        style={{ letterSpacing: "0.08em" }}
                                    >
                                        <UserIcon className="w-4 h-4" />
                                        <span className="text-sm font-medium tracking-widest uppercase" style={{ letterSpacing: "0.12em" }}>
                                            Iniciar sesión
                                        </span>
                                        <ArrowRightIcon className="w-3.5 h-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                                    </button>
                                </SignInButton>

                                {/* Registrarse */}
                                <SignUpButton forceRedirectUrl="/auth-sync">
                                    <button 
                                        className="group flex items-center gap-3 px-8 py-3.5 bg-transparent border border-white/30 text-white rounded-full hover:border-white/70 hover:bg-white/10 transition-all hover:scale-105 backdrop-blur-sm"
                                        style={{ letterSpacing: "0.08em" }}
                                    >
                                        <UserPlusIcon className="w-4 h-4" />
                                        <span className="text-sm font-medium tracking-widest uppercase" style={{ letterSpacing: "0.12em" }}>
                                            Registrarse
                                        </span>
                                        <ArrowRightIcon className="w-3.5 h-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                                    </button>
                                </SignUpButton>

                            </div>

                            {/* Continuar sin cuenta */}
                            <Link 
                                href="/catalogo" 
                                className="group flex items-center gap-2 mt-auto px-6 py-3 bg-white/5 hover:bg-white/15 border border-white/10 hover:border-white/30 text-white/80 hover:text-white rounded-full transition-all backdrop-blur-sm"
                            >
                                <span className="text-[11px] font-semibold tracking-[0.15em] uppercase">
                                    Continuar sin cuenta
                                </span>
                                <ArrowRightIcon className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </>
                    ) : (
                        <>
                            {/* ESTADO LOGUEADO:  no le pedimos registrarse */}
                            <Link
                                href="/catalogo"
                                className="group flex items-center gap-3 px-10 py-4 bg-primary text-white rounded-full hover:opacity-90 transition-all hover:scale-105 shadow-lg shadow-primary/20 mt-4"
                                style={{ letterSpacing: "0.08em" }}
                            >
                                <span className="text-sm font-medium tracking-widest uppercase" style={{ letterSpacing: "0.12em" }}>
                                    Ir al Catálogo
                                </span>
                                <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </>
                    )}

                </div>
            </div>
        </main>
    );
}