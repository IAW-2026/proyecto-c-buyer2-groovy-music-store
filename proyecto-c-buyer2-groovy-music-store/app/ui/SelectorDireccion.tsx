'use client';

import { useState, useTransition } from 'react';
import { guardarNuevaDireccion } from '@/app/lib/actions/actions-direccion';
import { Direccion } from '@/app/lib/definitions';

export default function SelectorDireccion({ direcciones, clerkId }: { direcciones: Direccion[], clerkId: string }) {
    const [listaDirecciones, setListaDirecciones] = useState<Direccion[]>(direcciones);
    const [seleccion, setSeleccion] = useState<string>(
        direcciones.length > 0 ? direcciones[0].id : 'nueva'
    );
    const [isPending, startTransition] = useTransition();
    
    // Estado para guardar los errores que devuelve Zod desde el servidor
    const [errores, setErrores] = useState<any>({});

    const [nuevaDir, setNuevaDir] = useState({
        calle: '', ciudad: '', provincia: '', cod_postal: '', pais: 'Argentina'
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNuevaDir({ ...nuevaDir, [e.target.name]: e.target.value });
        // Limpiamos el error específico del campo al escribir
        if (errores[e.target.name]) {
            setErrores({ ...errores, [e.target.name]: undefined });
        }
    };

    const handleGuardarDireccion = async () => {
        setErrores({}); // Limpiamos errores previos antes de intentar guardar
        
        const formData = new FormData();
        Object.entries(nuevaDir).forEach(([key, value]) => formData.append(key, value));
        formData.append('clerk_id', clerkId);
        
        startTransition(async () => {
            const resultado = await guardarNuevaDireccion(formData);
            
            if (resultado.success && resultado.data) { // <--- Agregamos && resultado.data
                setListaDirecciones([...listaDirecciones, resultado.data]);
                setSeleccion(resultado.data.id);
                setNuevaDir({ calle: '', ciudad: '', provincia: '', cod_postal: '', pais: 'Argentina' });
            } else if (!resultado.success) {
                setErrores(resultado.errors || {});
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

            {seleccion === 'nueva' && (
                <div 
                    className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2 p-4 border border-border rounded-lg bg-foreground/5"
                    onKeyDown={(e) => e.key === 'Enter' && e.preventDefault()}
                >
                    <div className="col-span-2">
                        <label className="block text-sm font-medium mb-1">Calle y número</label>
                        <input type="text" name="calle" value={nuevaDir.calle} onChange={handleChange} className="w-full p-2.5 border border-border rounded-md bg-background" />
                        {errores.calle && <p className="text-red-500 text-xs mt-1 font-bold">{errores.calle[0]}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Ciudad</label>
                        <input type="text" name="ciudad" value={nuevaDir.ciudad} onChange={handleChange} className="w-full p-2.5 border border-border rounded-md bg-background" />
                        {errores.ciudad && <p className="text-red-500 text-xs mt-1 font-bold">{errores.ciudad[0]}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Provincia</label>
                        <input type="text" name="provincia" value={nuevaDir.provincia} onChange={handleChange} className="w-full p-2.5 border border-border rounded-md bg-background" />
                        {errores.provincia && <p className="text-red-500 text-xs mt-1 font-bold">{errores.provincia[0]}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Código Postal</label>
                        <input type="text" name="cod_postal" value={nuevaDir.cod_postal} onChange={handleChange} className="w-full p-2.5 border border-border rounded-md bg-background" />
                        {errores.cod_postal && <p className="text-red-500 text-xs mt-1 font-bold">{errores.cod_postal[0]}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">País</label>
                        <input type="text" name="pais" value={nuevaDir.pais} onChange={handleChange} className="w-full p-2.5 border border-border rounded-md bg-background" />
                        {errores.pais && <p className="text-red-500 text-xs mt-1 font-bold">{errores.pais[0]}</p>}
                    </div>
                    
                    <div className="col-span-2 mt-2">
                        <button 
                            type="button" 
                            onClick={handleGuardarDireccion}
                            disabled={isPending}
                            className="w-full bg-primary text-background font-semibold py-3 px-4 rounded-lg hover:opacity-90 transition-all disabled:opacity-50"
                        >
                            {isPending ? 'Guardando...' : 'Guardar y usar esta dirección'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}