'use client';

import { useState, useTransition } from 'react';
import { guardarNuevaDireccion } from '@/app/lib/actions/actions-direccion';

import {Direccion} from '@/app/lib/definitions';

export default function SelectorDireccion({ direcciones, clerkId }: { direcciones: Direccion[], clerkId: string }) {
    const [listaDirecciones, setListaDirecciones] = useState<Direccion[]>(direcciones);
    const [seleccion, setSeleccion] = useState<string>(
        direcciones.length > 0 ? direcciones[0].id : 'nueva'
    );
    const [isPending, startTransition] = useTransition();


    const [nuevaDir, setNuevaDir] = useState({
        calle: '', ciudad: '', provincia: '', cod_postal: '', pais: 'Argentina'
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNuevaDir({ ...nuevaDir, [e.target.name]: e.target.value });
    };

    
    const handleGuardarDireccion = async () => {
        // Validación manual básica
        if (!nuevaDir.calle || !nuevaDir.ciudad || !nuevaDir.provincia || !nuevaDir.cod_postal) {
            alert("Por favor, completá todos los campos de la dirección.");
            return;
        }

        
        const formData = new FormData();
        Object.entries(nuevaDir).forEach(([key, value]) => formData.append(key, value));
        formData.append('clerk_id', clerkId);
        
        startTransition(async () => {
            try {
                const dirGuardada = await guardarNuevaDireccion(formData);
                setListaDirecciones([...listaDirecciones, dirGuardada]);
                setSeleccion(dirGuardada.id);
                // Limpiamos los campos
                setNuevaDir({ calle: '', ciudad: '', provincia: '', cod_postal: '', pais: 'Argentina' });
            } catch (error) {
                console.error("Error al guardar la dirección:", error);
                alert("Hubo un error al guardar la dirección.");
            }
        });
    };

    return (
        <div className="bg-card p-6 rounded-xl border border-border shadow-sm mb-8">
            <h2 className="text-xl font-syne font-semibold border-b border-border pb-3 mb-5">
                Dirección de Envío
            </h2>

            {/* Input oculto que el formulario principal de Checkout va a leer */}
            <input type="hidden" name="id_direccion" value={seleccion} />

            {listaDirecciones.length > 0 && (
                <div className="space-y-3 mb-5">
                    {listaDirecciones.map((dir) => (
                        <label 
                            key={dir.id} 
                            className={`flex items-center gap-3 p-4 border rounded-lg cursor-pointer transition-colors ${
                                seleccion === dir.id ? 'border-primary bg-primary/5' : 'border-border'
                            }`}
                        >
                            <input 
                                type="radio" 
                                checked={seleccion === dir.id} 
                                onChange={() => setSeleccion(dir.id)} 
                                className="w-4 h-4 text-primary"
                            />
                            <div>
                                <p className="font-medium">{dir.calle}</p>
                                <p className="text-sm text-foreground/70">
                                    {dir.ciudad}, {dir.provincia} - CP: {dir.cod_postal}
                                </p>
                            </div>
                        </label>
                    ))}
                    
                    <label className={`flex items-center gap-3 p-4 border rounded-lg cursor-pointer transition-colors ${
                            seleccion === 'nueva' ? 'border-primary bg-primary/5' : 'border-border'
                        }`}
                    >
                        <input 
                            type="radio" 
                            checked={seleccion === 'nueva'} 
                            onChange={() => setSeleccion('nueva')} 
                            className="w-4 h-4 text-primary"
                        />
                        <span className="font-medium">Agregar nueva dirección...</span>
                    </label>
                </div>
            )}

            {/* Sub-formulario */}
            {seleccion === 'nueva' && (
                <div 
                    className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2 p-4 border border-border rounded-lg bg-foreground/5"
                    // Evitamos que al apretar "Enter" en los inputs se envíe el formulario principal de checkout
                    onKeyDown={(e) => e.key === 'Enter' && e.preventDefault()}
                >
                    <div className="col-span-2">
                        <label className="block text-sm font-medium mb-1">Calle y número</label>
                        <input type="text" name="calle" value={nuevaDir.calle} onChange={handleChange} required className="w-full p-2.5 border border-border rounded-md bg-background" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Ciudad</label>
                        <input type="text" name="ciudad" value={nuevaDir.ciudad} onChange={handleChange} required className="w-full p-2.5 border border-border rounded-md bg-background" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Provincia</label>
                        <input type="text" name="provincia" value={nuevaDir.provincia} onChange={handleChange} required className="w-full p-2.5 border border-border rounded-md bg-background" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Código Postal</label>
                        <input type="text" name="cod_postal" value={nuevaDir.cod_postal} onChange={handleChange} required className="w-full p-2.5 border border-border rounded-md bg-background" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">País</label>
                        <input type="text" name="pais" value={nuevaDir.pais} onChange={handleChange} required className="w-full p-2.5 border border-border rounded-md bg-background" />
                    </div>
                    
                    <div className="col-span-2 mt-2">
                        <button 
                            type="button" // CLAVE: Type button para que no envíe el Checkout
                            onClick={handleGuardarDireccion}
                            disabled={isPending}
                            className="w-full bg-primary text-background font-dm font-semibold py-3.5 px-4 rounded-lg hover:opacity-90 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed mt-4"
                        >
                            {isPending ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                    </svg>
                                    Guardando...
                                </span>
                            ) : (
                                'Guardar y usar esta dirección'
                            )}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}