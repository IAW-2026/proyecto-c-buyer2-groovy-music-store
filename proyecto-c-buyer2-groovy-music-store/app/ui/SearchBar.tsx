'use client'

import { useState, useRef, useEffect } from 'react'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline'

export default function SearchBar() {
  const searchParams = useSearchParams()
  const { replace, push } = useRouter() 
  const pathname = usePathname()
  
  
  const CATALOG_PATH = '/catalogo' 

  const [isOpen, setIsOpen] = useState(false)
  const [term, setTerm] = useState(searchParams.get('q')?.toString() || '')
  
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  // Maneja lo que pasa mientra el usuario tipea
  function handleChange(value: string) {
    setTerm(value)
    
    // Si YA estamos en el catálogo, actualizamos la URL en vivo para filtrar al instante
    if (pathname === CATALOG_PATH) {
      const params = new URLSearchParams(searchParams)
      params.set('page', '1')
      if (value) params.set('q', value)
      else params.delete('q')
      replace(`${pathname}?${params.toString()}`)
    }
  }

  // Maneja lo que pasa cuando el usuario aprieta Enter
  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      // Prevenimos comportamiento por defecto 
      e.preventDefault() 
      
      // Si aprieta Enter y NO está en el catálogo, lo redirigimos para allá
      if (pathname !== CATALOG_PATH) {
        const params = new URLSearchParams()
        params.set('page', '1')
        if (term) params.set('q', term)
        
        push(`${CATALOG_PATH}?${params.toString()}`)
      }
    }
  }

  function clearSearch() {
    setTerm('')
    handleChange('')
    inputRef.current?.focus()
  }

  const navItemClass = "group flex items-center p-2 bg-transparent hover:bg-white/10 rounded-full transition-all duration-300 ease-in-out cursor-pointer text-white border border-transparent";
  const textClass = "hidden md:block max-w-0 opacity-0 overflow-hidden whitespace-nowrap group-hover:max-w-[120px] group-hover:opacity-100 group-hover:ml-2 transition-all duration-300 ease-in-out text-[11px] font-bold tracking-widest uppercase";

  if (isOpen) {
    return (
      <div className="relative flex items-center animate-in fade-in zoom-in duration-200">
        <label htmlFor="search-input" className="sr-only">Buscar por título o artista</label>
        <input
          ref={inputRef}
          id="search-input"
          type="text" 
          placeholder="Buscar por título o artista..."
          className="bg-white/10 border border-white/20 text-white placeholder:text-white/70 px-4 py-2 rounded-full text-sm focus:outline-none focus:border-white focus:bg-white/20 w-[260px] md:w-[320px] transition-all pr-10"
          value={term}
          onChange={(e) => handleChange(e.target.value)}
          onKeyDown={handleKeyDown} // escucha de la tecla Enter
          onBlur={() => {
            if (!term) setIsOpen(false)
          }}
        />
        
        {term ? (
            <button
                type="button"
                className="absolute right-3 p-1"
                aria-label="Borrar texto de búsqueda"
                onMouseDown={(e) => {
                    e.preventDefault(); 
                    clearSearch();
                }}
            >
                <XMarkIcon className="w-5 h-5 text-white hover:scale-110 hover:text-white/80 transition-all duration-200" aria-hidden="true" />
            </button>
        ) : (
            <button
                type="button"
                className="absolute right-3 p-1"
                aria-label="Cerrar barra de búsqueda"
                onClick={() => setIsOpen(false)}
            >
                <MagnifyingGlassIcon className="w-5 h-5 text-white hover:opacity-70 transition-opacity" aria-hidden="true" />
            </button>
        )}
      </div>
    )
  }

  return (
    <button onClick={() => setIsOpen(true)} className={navItemClass} aria-label="Abrir barra de búsqueda">
        <MagnifyingGlassIcon className="w-5 h-5" aria-hidden="true" />
        <span className={textClass}>Buscar</span>
    </button>
  )
}