import Link from 'next/link'
import { SignOutButton } from "@clerk/nextjs"

export default function AdminNavBar() {
    return (
        <header className="flex items-center justify-between px-8 py-4 bg-background border-b border-border">
            <Link href="/admin" className="font-syne text-2xl font-bold text-foreground no-underline">
                Groovy<span className="text-primary">Admin</span>
            </Link>
            
            <div className="flex items-center gap-6">
                {/* Cartelito de Admin */}
                <div className="bg-primary/20 text-primary border border-primary/30 px-3 py-1 rounded-md text-xs font-bold tracking-widest uppercase">
                    Admin
                </div>
                
                {/* Botón de Salir de Clerk */}
                <SignOutButton>
                    <button className="font-dm text-sm font-medium text-foreground/70 hover:text-foreground transition-colors">
                        Cerrar Sesión
                    </button>
                </SignOutButton>
            </div>
        </header>
    )
}