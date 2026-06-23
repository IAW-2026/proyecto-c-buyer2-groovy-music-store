export default function CheckoutSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-8 mt-10 animate-pulse">
      {/* Esqueleto del Título */}
      <div className="h-10 bg-gray-200 w-1/3 mb-4 rounded" />
      {/* Esqueleto del subtítulo */}
      <div className="h-6 bg-gray-200 w-1/2 mb-10 rounded" />
      
      {/* Esqueleto del formulario */}
      <div className="w-full h-96 bg-gray-200 rounded-xl" />
    </div>
  );
}