'use client'

import { useState, useRef, useEffect } from 'react'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline'

export default function SearchBar() {
  const searchParams = useSearchParams()
  const { replace } = useRouter()
  const pathname = usePathname()
  
  const [isOpen, setIsOpen] = useState(false)
  // Agregamos un estado para saber qué escribiste y mostrar/ocultar la cruz
  const [term, setTerm] = useState(searchParams.get('q')?.toString() || '')
  
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  function handleSearch(value: string) {
    setTerm(value)
    const params = new URLSearchParams(searchParams)
    params.set('page', '1')
    if (value) params.set('q', value)
    else params.delete('q')
    replace(`${pathname}?${params.toString()}`)
  }

  // Función para borrar todo con un solo clic
  function clearSearch() {
    setTerm('')
    handleSearch('')
    inputRef.current?.focus() // Mantiene el cursor titilando para que sigas buscando
  }

  const navItemClass = "group flex items-center p-2 bg-transparent hover:bg-white/10 rounded-full transition-all duration-300 ease-in-out cursor-pointer text-white border border-transparent";
  const textClass = "hidden md:block max-w-0 opacity-0 overflow-hidden whitespace-nowrap group-hover:max-w-[120px] group-hover:opacity-100 group-hover:ml-2 transition-all duration-300 ease-in-out text-[11px] font-bold tracking-widest uppercase";

  // VISTA ABIERTA
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
          onChange={(e) => handleSearch(e.target.value)}
          onBlur={() => {
            // Se cierra sola si hacés clic afuera y está vacía
            if (!term) setIsOpen(false)
          }}
        />
        
        {/*  Si hay texto, muestra la CRUZ para borrar. Si no, muestra la LUPA. */}
        {term ? (
            <XMarkIcon 
                className="w-5 h-5 absolute right-3 text-white cursor-pointer hover:scale-110 hover:text-white/80 transition-all duration-200" 
                aria-hidden="true" 
                onMouseDown={(e) => {
                    // Previene que se cierre la barra al hacer clic en la cruz
                    e.preventDefault(); 
                    clearSearch();
                }}
            />
        ) : (
            <MagnifyingGlassIcon 
                className="w-5 h-5 absolute right-3 text-white cursor-pointer hover:opacity-70 transition-opacity" 
                aria-hidden="true" 
                onClick={() => setIsOpen(false)}
            />
        )}
      </div>
    )
  }

  // VISTA CERRADA
  return (
    <button onClick={() => setIsOpen(true)} className={navItemClass} aria-label="Abrir búsqueda">
        <MagnifyingGlassIcon className="w-5 h-5" aria-hidden="true" />
        <span className={textClass}>Buscar</span>
    </button>
  )
}