'use client';

import { useState, useTransition, useEffect } from 'react';
import { guardarNuevaDireccion } from '@/app/lib/actions/actions-direccion';
import { Direccion } from '@/app/lib/definitions';

export default function SelectorDireccion({ 
    direcciones, 
    clerkId,
    onPostalCodeChange 
}: { 
    direcciones: Direccion[], 
    clerkId: string,
    onPostalCodeChange?: (cp: string | null) => void 
}) {
    const [listaDirecciones, setListaDirecciones] = useState<Direccion[]>(direcciones);
    const [seleccion, setSeleccion] = useState<string>(
        direcciones.length > 0 ? direcciones[0].id : 'nueva'
    );
    const [isPending, startTransition] = useTransition();
    const [errores, setErrores] = useState<any>({});
    
    // Estados para la API Georef
    const [provincias, setProvincias] = useState<{nombre: string}[]>([]);
    const [localidades, setLocalidades] = useState<{nombre: string}[]>([]);
    const [loadingLocalidades, setLoadingLocalidades] = useState(false);

    const [nuevaDir, setNuevaDir] = useState({
        calle: '', ciudad: '', provincia: '', cod_postal: '', pais: 'Argentina'
    });

    // Cargar provincias al iniciar
    useEffect(() => {
        fetch('https://apis.datos.gob.ar/georef/api/provincias?campos=nombre')
            .then(res => res.json())
            .then(data => setProvincias(data.provincias.sort((a: any, b: any) => a.nombre.localeCompare(b.nombre))));
    }, []);

    // Cargar municipios/localidades al cambiar provincia
    const handleProvinciaChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const provNombre = e.target.value;
        setNuevaDir({ ...nuevaDir, provincia: provNombre, ciudad: '' });
        
        if (!provNombre) {
            setLocalidades([]);
            return;
        }

        setLoadingLocalidades(true);
        fetch(`https://apis.datos.gob.ar/georef/api/municipios?provincia=${provNombre}&max=5000&campos=nombre`)
            .then(res => res.json())
            .then(data => {
                setLocalidades(data.municipios.sort((a: any, b: any) => a.nombre.localeCompare(b.nombre)));
                setLoadingLocalidades(false);
            });
    };

    useEffect(() => {
        if (onPostalCodeChange) {
            if (seleccion === 'nueva') {
                onPostalCodeChange(null);
            } else {
                const dirSeleccionada = listaDirecciones.find(d => d.id === seleccion);
                if (dirSeleccionada) {
                    onPostalCodeChange(dirSeleccionada.cod_postal);
                }
            }
        }
    }, [seleccion, listaDirecciones, onPostalCodeChange]);
    

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setNuevaDir({ ...nuevaDir, [e.target.name]: e.target.value });
        if (errores[e.target.name]) {
            setErrores({ ...errores, [e.target.name]: undefined });
        }
    };

    const handleGuardarDireccion = async () => {
        setErrores({}); 
        const formData = new FormData();
        Object.entries(nuevaDir).forEach(([key, value]) => formData.append(key, value));
        formData.append('clerk_id', clerkId);
        
        startTransition(async () => {
            const resultado = await guardarNuevaDireccion(formData);
            if (resultado.success && resultado.data) { 
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

            <input type="hidden" name="id_direccion" value={seleccion} />

            {listaDirecciones.length > 0 && (
                <div className="space-y-3 mb-5">
                    {listaDirecciones.map((dir) => (
                        <label key={dir.id} className={`flex items-center gap-3 p-4 border rounded-lg cursor-pointer transition-colors ${seleccion === dir.id ? 'border-primary bg-primary/5' : 'border-border'}`}>
                            <input type="radio" checked={seleccion === dir.id} onChange={() => setSeleccion(dir.id)} className="w-4 h-4 text-primary" />
                            <div>
                                <p className="font-medium">{dir.calle}</p>
                                <p className="text-sm text-foreground/70">{dir.ciudad}, {dir.provincia} - CP: {dir.cod_postal}</p>
                            </div>
                        </label>
                    ))}
                    
                    <label className={`flex items-center gap-3 p-4 border rounded-lg cursor-pointer transition-colors ${seleccion === 'nueva' ? 'border-primary bg-primary/5' : 'border-border'}`}>
                        <input type="radio" checked={seleccion === 'nueva'} onChange={() => setSeleccion('nueva')} className="w-4 h-4 text-primary" />
                        <span className="font-medium">Agregar nueva dirección...</span>
                    </label>
                </div>
            )}

            {seleccion === 'nueva' && (
                <div 
                    className="flex flex-col gap-4 mt-2 p-4 border border-border rounded-lg bg-foreground/5"
                    onKeyDown={(e) => e.key === 'Enter' && e.preventDefault()}
                >
                    {/* Calle */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Calle y número</label>
                        <input type="text" name="calle" value={nuevaDir.calle} onChange={handleChange} className="w-full p-2.5 border border-border rounded-md bg-background" />
                        {errores.calle && <p className="text-red-500 text-xs mt-1 font-bold">{errores.calle[0]}</p>}
                    </div>

                    {/* Fila: Provincia y Ciudad */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Provincia</label>
                            <select name="provincia" value={nuevaDir.provincia} onChange={handleProvinciaChange} className="w-full p-2.5 border border-border rounded-md bg-background">
                                <option value="">Provincia</option>
                                {provincias.map(p => <option key={p.nombre} value={p.nombre}>{p.nombre}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Ciudad</label>
                            <select name="ciudad" value={nuevaDir.ciudad} onChange={handleChange} className="w-full p-2.5 border border-border rounded-md bg-background" disabled={!nuevaDir.provincia || loadingLocalidades}>
                                <option value="">{loadingLocalidades ? 'Cargando...' : 'Ciudad'}</option>
                                {localidades.map(l => <option key={l.nombre} value={l.nombre}>{l.nombre}</option>)}
                            </select>
                        </div>
                    </div>

                    {/* Fila: CP y País */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Código Postal</label>
                            <input type="text" name="cod_postal" value={nuevaDir.cod_postal} onChange={handleChange} className="w-full p-2.5 border border-border rounded-md bg-background" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">País</label>
                            <input type="text" name="pais" value="Argentina" disabled className="w-full p-2.5 border border-border rounded-md bg-muted text-muted-foreground cursor-not-allowed" />
                        </div>
                    </div>

                    {/* Botón */}
                    <button 
                        type="button" 
                        onClick={handleGuardarDireccion} 
                        disabled={isPending} 
                        className="w-full mt-2 bg-primary text-background font-semibold py-3 px-4 rounded-lg hover:opacity-90 transition-all disabled:opacity-50"
                    >
                        {isPending ? 'Guardando...' : 'Guardar y usar esta dirección'}
                    </button>
                </div>
            )}
        </div>
    );
}