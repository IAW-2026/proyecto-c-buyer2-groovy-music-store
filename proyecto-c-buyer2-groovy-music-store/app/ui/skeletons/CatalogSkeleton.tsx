export default function CatalogSkeleton() {
  // Creamos un array de 12 elementos para simular los 12 productos
  const skeletons = Array.from({ length: 12 });

  return (
    <div className="max-w-7xl mx-auto px-8 mt-10 animate-pulse">
      {/* Título y descripción */}
      <div className="h-10 bg-gray-200 w-1/4 mb-4 rounded" />
      <div className="h-6 bg-gray-200 w-1/3 mb-10 rounded" />

      {/* Grid de productos */}
      <div className="grid gap-6 grid-cols-[repeat(auto-fill,minmax(240px,1fr))]">
        {skeletons.map((_, i) => (
          <div key={i} className="bg-gray-100 border border-gray-200 rounded-xl p-4 h-[350px] flex flex-col gap-4">
            <div className="w-full aspect-square bg-gray-200 rounded-lg" />
            <div className="h-4 bg-gray-200 w-3/4 rounded" />
            <div className="h-4 bg-gray-200 w-1/2 rounded" />
            <div className="mt-auto h-8 bg-gray-200 w-full rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}