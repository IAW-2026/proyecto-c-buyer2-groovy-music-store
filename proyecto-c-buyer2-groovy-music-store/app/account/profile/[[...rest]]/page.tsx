import { UserProfile } from "@clerk/nextjs"

export default function ProfilePage() {
    return (
        <>
            <header className="mb-10">
                <h1 className="font-syne m-0 text-4xl font-semibold text-foreground">Perfil Personal</h1>
                <p className="font-dm mt-2 mb-0 text-foreground/70 text-base">
                    Gestiona tus datos de acceso y seguridad.
                </p>
                <div className="w-20 h-1 bg-primary mt-4 rounded-full"></div>
            </header>

            <div className="flex justify-start w-full">
                <UserProfile path="/account/profile" routing="path" />
            </div>
        </>
    )
}