import NavBar from '@/app/ui/NavBar'

export default function LoadingProductDetail() {
    return (
        <main className="min-h-screen bg-background font-dm pb-20">
           
            <NavBar />

            {/* Barra superior "Volver al catálogo" */}
            <div className="flex items-center justify-between px-8 py-3 bg-foreground text-white/80 border-b border-[#3a3a3a]">
                <div className="w-48 h-9 rounded-full bg-[#B83A15]/50 animate-pulse border-2 border-[#9C2E0F]/50 shadow-sm" />
            </div>

            {/* Contenedor principal del esqueleto */}
            <div className="max-w-5xl mx-auto mt-10 px-6 md:px-12">
                <div className="bg-card border border-border rounded-xl shadow-sm p-6 md:p-10 flex flex-col md:flex-row gap-10">
                    
                    {/* Esqueleto de la Galería Interactiva (Mitad Izquierda) */}
                    <div className="w-full md:w-1/2 flex flex-col gap-4">
                        {/* Cuadro de la imagen principal */}
                        <div className="w-full aspect-square bg-gray-300 dark:bg-gray-700 animate-pulse rounded-lg" />
                        
                        {/* Cuadros de las miniaturas */}
                        <div className="flex gap-4">
                            <div className="w-20 h-20 bg-gray-300 dark:bg-gray-700 animate-pulse rounded-md" />
                            <div className="w-20 h-20 bg-gray-300 dark:bg-gray-700 animate-pulse rounded-md" />
                            <div className="w-20 h-20 bg-gray-300 dark:bg-gray-700 animate-pulse rounded-md" />
                        </div>
                    </div>

                    {/* Esqueleto de la Información del Producto (Mitad Derecha) */}
                    <div className="w-full md:w-1/2 flex flex-col">
                        {/* Título */}
                        <div className="h-10 w-3/4 bg-gray-300 dark:bg-gray-700 animate-pulse rounded mb-4" />
                        
                        {/* Artista */}
                        <div className="h-7 w-1/2 bg-gray-300 dark:bg-gray-700 animate-pulse rounded mb-6" />
                        
                        {/* Precio */}
                        <div className="h-9 w-1/3 bg-gray-300 dark:bg-gray-700 animate-pulse rounded mb-8" />
                        
                        {/* Esqueleto de la Sección de Compra (Botones y controles) */}
                        <div className="mt-4 flex flex-col gap-4">
                            <div className="h-12 w-full bg-gray-300 dark:bg-gray-700 animate-pulse rounded-full" />
                            <div className="h-12 w-full bg-gray-300 dark:bg-gray-700 animate-pulse rounded-full" />
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}