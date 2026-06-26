'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'

const generatePagination = (currentPage: number, totalPages: number) => {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  if (currentPage <= 3) {
    return [1, 2, 3, 4, '...', totalPages];
  }

  if (currentPage >= totalPages - 2) {
    return [1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
  }

  return [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
};

export default function Pagination({ totalPages }: { totalPages: number }) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { replace } = useRouter()
  const currentPage = Number(searchParams.get('page')) || 1

  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams)
    params.set('page', pageNumber.toString())
    return `${pathname}?${params.toString()}`
  }

  if (totalPages <= 1) return null;

  const allPages = generatePagination(currentPage, totalPages);

  return (
    <nav aria-label="Navegación de páginas del catálogo" className="flex items-center justify-center gap-4 mt-12 font-dm">
      
      {/* FLECHA ANTERIOR */}
      {currentPage > 1 ? (
        <button
          onClick={() => replace(createPageURL(currentPage - 1))}
          className="p-2 text-foreground/70 hover:text-[#B83A15] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B83A15] rounded-md"
        >
          <span className="sr-only">Anterior</span>
          <ChevronLeftIcon className="w-5 h-5" aria-hidden="true" />
        </button>
      ) : (
        <div className="w-9 h-9" aria-hidden="true" />
      )}

      {/* NÚMEROS Y PUNTOS SUSPENSIVOS */}
      <div className="flex items-center gap-2">
        {allPages.map((page, index) => {
          if (page === '...') {
            return (
              <span key={`ellipsis-${index}`} className="px-2 text-foreground/50 tracking-widest font-medium" aria-hidden="true">
                ...
              </span>
            );
          }

          const isCurrent = currentPage === page;

          return (
            <button
              key={page}
              onClick={() => replace(createPageURL(page))}
              aria-current={isCurrent ? 'page' : undefined}
              className={`w-9 h-9 flex items-center justify-center rounded-full text-sm font-bold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B83A15] focus-visible:ring-offset-2 ${
                isCurrent
                  ? 'bg-[#B83A15] text-white shadow-md hover:bg-[#A33313] hover:scale-105' 
                  : 'bg-transparent text-foreground/70 hover:text-foreground hover:bg-foreground/5 border border-transparent'
              }`}
            >
              <span className="sr-only">Página </span>
              {page}
            </button>
          );
        })}
      </div>

      {/* FLECHA SIGUIENTE */}
      {currentPage < totalPages ? (
        <button
          onClick={() => replace(createPageURL(currentPage + 1))}
          className="p-2 text-foreground/70 hover:text-[#B83A15] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B83A15] rounded-md"
        >
          <span className="sr-only">Siguiente</span>
          <ChevronRightIcon className="w-5 h-5" aria-hidden="true" />
        </button>
      ) : (
        <div className="w-9 h-9" aria-hidden="true" />
      )}
      
    </nav>
  )
}