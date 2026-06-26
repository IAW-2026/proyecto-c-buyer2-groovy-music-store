'use client'

import { useState, useRef, useEffect, useTransition } from 'react'
import { guardarNuevaDireccion, actualizarDireccion, eliminarDireccion } from '@/app/lib/actions/actions-direccion'
import { MapPinIcon, PencilIcon, TrashIcon, PlusIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { Direccion } from '@/app/lib/definitions'

interface FormErrors {
    calle?: string[];
    ciudad?: string[];
    provincia?: string[];
    cod_postal?: string[];
}

export default function GestionDirecciones({ 
    direccionesIniciales, 
    clerkId 
}: { 
    direccionesIniciales: Direccion[], 
    clerkId: string 
}) {
    const formRef = useRef<HTMLFormElement>(null);
    const [listaDirecciones, setListaDirecciones] = useState<Direccion[]>(direccionesIniciales);
    const [direccionAEditar, setDireccionAEditar] = useState<Direccion | null>(null);
    
    const [isPending, startTransition] = useTransition();
    const [errors, setErrors] = useState<FormErrors>({});
    const [globalMessage, setGlobalMessage] = useState<{ text: string; success: boolean } | null>(null);

    // --- Georef API ---
    const [provincias, setProvincias] = useState<{nombre: string}[]>([]);
    const [localidades, setLocalidades] = useState<{nombre: string}[]>([]);
    const [loadingLocalidades, setLoadingLocalidades] = useState(false);
    
    const [provinciaSeleccionada, setProvinciaSeleccionada] = useState('');
    const [ciudadSeleccionada, setCiudadSeleccionada] = useState('');
    const [calleInput, setCalleInput] = useState('');
    const [codPostalInput, setCodPostalInput] = useState('');

    // Cargar provincias iniciales
    useEffect(() => {
        fetch('https://apis.datos.gob.ar/georef/api/provincias?campos=nombre')
            .then(res => res.json())
            .then(data => setProvincias(data.provincias.sort((a: any, b: any) => a.nombre.localeCompare(b.nombre))));
    }, []);

    // Cargar localidades cuando cambie la provincia de forma manual o por edición
    const cargarLocalidades = async (provNombre: string, ciudadPredeterminada?: string) => {
        if (!provNombre) {
            setLocalidades([]);
            return;
        }
        setLoadingLocalidades(true);
        try {
            const res = await fetch(`https://apis.datos.gob.ar/georef/api/municipios?provincia=${provNombre}&max=5000&campos=nombre`);
            const data = await res.json();
            setLocalidades(data.municipios.sort((a: any, b: any) => a.nombre.localeCompare(b.nombre)));
            if (ciudadPredeterminada) {
                setCiudadSeleccionada(ciudadPredeterminada);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoadingLocalidades(false);
        }
    };

    
    useEffect(() => {
        if (direccionAEditar) {
            setCalleInput(direccionAEditar.calle);
            setCodPostalInput(direccionAEditar.cod_postal);
            setProvinciaSeleccionada(direccionAEditar.provincia);
            setCiudadSeleccionada(''); // Reset temporal mientras carga
            cargarLocalidades(direccionAEditar.provincia, direccionAEditar.ciudad);
        } else {
            resetFormulario();
        }
        setErrors({});
        setGlobalMessage(null);
    }, [direccionAEditar]);

    const handleProvinciaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const prov = e.target.value;
        setProvinciaSeleccionada(prov);
        setCiudadSeleccionada('');
        cargarLocalidades(prov);
    };

    const resetFormulario = () => {
        setDireccionAEditar(null);
        setCalleInput('');
        setCodPostalInput('');
        setProvinciaSeleccionada('');
        setCiudadSeleccionada('');
        setLocalidades([]);
        formRef.current?.reset();
    };

    // --- Manejo de Submit (Crear o Editar) ---
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setErrors({});
        setGlobalMessage(null);

        const formData = new FormData(event.currentTarget);
        formData.append('clerk_id', clerkId);
        formData.append('pais', 'Argentina');
        
        if (direccionAEditar) {
            formData.append('id', direccionAEditar.id);
        }

        startTransition(async () => {
            const res = direccionAEditar 
                ? await actualizarDireccion(formData)
                : await guardarNuevaDireccion(formData);

            
            if (!res.success || !res.data) {
                if (res.errors) setErrors(res.errors);
                setGlobalMessage({ text: res.message || 'Error en los datos.', success: false });
            } else {
                
                const direccionGuardada = res.data;

                if (direccionAEditar) {
                    setListaDirecciones(listaDirecciones.map(d => d.id === direccionGuardada.id ? direccionGuardada : d));
                    setGlobalMessage({ text: 'Dirección actualizada con éxito.', success: true });
                } else {
                    setListaDirecciones([direccionGuardada, ...listaDirecciones]);
                    setGlobalMessage({ text: 'Dirección agregada con éxito.', success: true });
                }
                resetFormulario();
            }
        });
    };

    // --- Acción de Borrar ---
    const handleEliminar = async (id: string) => {
        if (!confirm('¿Estás seguro de que deseas eliminar esta dirección?')) return;

        startTransition(async () => {
            const res = await eliminarDireccion(id, clerkId);
            if (res.success) {
                setListaDirecciones(listaDirecciones.filter(d => d.id !== id));
                if (direccionAEditar?.id === id) resetFormulario();
            } else {
                alert(res.message || 'No se pudo eliminar.');
            }
        });
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            
            {/* Columna Izquierda: Direcciones Guardadas */}
            <div className="lg:col-span-2 flex flex-col gap-4">
                <h2 className="font-syne text-xl font-semibold text-foreground mb-2">Direcciones guardadas</h2>
                
                {listaDirecciones.length === 0 ? (
                    <div className="bg-card border border-border rounded-xl p-12 text-center shadow-sm flex flex-col items-center justify-center min-h-[300px]">
                        <div className="p-4 bg-primary/10 text-primary rounded-full mb-4">
                            <MapPinIcon className="w-8 h-8" />
                        </div>
                        <h3 className="font-syne text-xl font-semibold text-foreground mb-2">No tienes direcciones registradas</h3>
                        <p className="font-dm text-foreground/70 text-sm max-w-sm">
                            Agrega una dirección utilizando el formulario para tus compras de música.
                        </p>
                    </div>
                ) : (
                    <div className="flex flex-col gap-4">
                        {listaDirecciones.map((dir) => (
                            <div 
                                key={dir.id} 
                                className={`bg-card border rounded-xl p-6 shadow-sm flex items-center justify-between gap-6 transition-all ${
                                    direccionAEditar?.id === dir.id ? 'border-primary ring-1 ring-primary' : 'border-border hover:shadow-md'
                                }`}
                            >
                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-primary/10 text-primary rounded-xl mt-1 hidden sm:block">
                                        <MapPinIcon className="w-5 h-5" />
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <h3 className="font-syne font-bold text-lg text-foreground m-0">{dir.calle}</h3>
                                        <p className="font-dm text-foreground/80 text-sm m-0">
                                            {dir.ciudad}, {dir.provincia} (CP: {dir.cod_postal})
                                        </p>
                                        <p className="font-dm text-foreground/40 text-xs uppercase tracking-widest m-0 mt-1 font-semibold">
                                            {dir.pais}
                                        </p>
                                    </div>
                                </div>

                                {/* Botones de Acción */}
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => setDireccionAEditar(dir)}
                                        className="p-2.5 text-foreground/60 hover:text-primary hover:bg-foreground/5 rounded-lg transition-colors"
                                        title="Editar dirección"
                                        disabled={isPending}
                                    >
                                        <PencilIcon className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleEliminar(dir.id)}
                                        className="p-2.5 text-foreground/60 hover:text-red-500 hover:bg-red-500/5 rounded-lg transition-colors"
                                        title="Eliminar dirección"
                                        disabled={isPending}
                                    >
                                        <TrashIcon className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Columna Derecha: Formulario Adaptable */}
            <div className="bg-card border border-border rounded-xl p-6 shadow-sm lg:sticky lg:top-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="font-syne text-xl font-semibold text-foreground">
                        {direccionAEditar ? 'Editar dirección' : 'Agregar nueva dirección'}
                    </h2>
                    {direccionAEditar && (
                        <button 
                            onClick={resetFormulario}
                            className="text-xs flex items-center gap-1 text-foreground/50 hover:text-foreground font-dm font-medium"
                        >
                            <XMarkIcon className="w-3.5 h-3.5" /> Cancelar
                        </button>
                    )}
                </div>

                <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-4 font-dm text-sm">
                    {/* Calle */}
                    <div className="flex flex-col gap-1.5">
                        <label htmlFor="calle" className="text-foreground/80 font-medium">Calle y Altura</label>
                        <input
                            id="calle"
                            name="calle"
                            type="text"
                            required
                            value={calleInput}
                            onChange={(e) => setCalleInput(e.target.value)}
                            placeholder="Ej: Av. Corrientes 1234"
                            className="w-full bg-transparent border border-border rounded-lg px-4 py-2.5 text-foreground focus:outline-none focus:border-primary transition-colors placeholder:text-foreground/30"
                        />
                        {errors.calle && <p className="text-red-500 text-xs mt-0.5 font-medium">{errors.calle[0]}</p>}
                    </div>

                    {/* Provincia y Ciudad */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1.5">
                            <label htmlFor="provincia" className="text-foreground/80 font-medium">Provincia</label>
                            <select
                                id="provincia"
                                name="provincia"
                                required
                                value={provinciaSeleccionada}
                                onChange={handleProvinciaChange}
                                className="w-full bg-transparent border border-border rounded-lg px-4 py-2.5 text-foreground focus:outline-none focus:border-primary transition-colors appearance-none"
                            >
                                <option value="" className="text-black">Provincia</option>
                                {provincias.map((p, index) => (
                                    <option key={`${p.nombre}-${index}`} value={p.nombre} className="text-black">{p.nombre}</option>
                                ))}
                            </select>
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label htmlFor="ciudad" className="text-foreground/80 font-medium">Ciudad</label>
                            <select
                                id="ciudad"
                                name="ciudad"
                                required
                                value={ciudadSeleccionada}
                                onChange={(e) => setCiudadSeleccionada(e.target.value)}
                                disabled={!provinciaSeleccionada || loadingLocalidades}
                                className="w-full bg-transparent border border-border rounded-lg px-4 py-2.5 text-foreground focus:outline-none focus:border-primary transition-colors appearance-none disabled:opacity-50"
                            >
                                <option value="" className="text-black">
                                    {loadingLocalidades ? 'Cargando...' : 'Ciudad'}
                                </option>
                                {/* AQUÍ ESTÁ LA CORRECCIÓN DE LA KEY EN LOCALIDADES */}
                                {localidades.map((l, index) => (
                                    <option key={`${l.nombre}-${index}`} value={l.nombre} className="text-black">{l.nombre}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Código Postal */}
                    <div className="flex flex-col gap-1.5">
                        <label htmlFor="cod_postal" className="text-foreground/80 font-medium">Código Postal</label>
                        <input
                            id="cod_postal"
                            name="cod_postal"
                            type="text"
                            required
                            maxLength={4}
                            value={codPostalInput}
                            onChange={(e) => setCodPostalInput(e.target.value)}
                            placeholder="Ej: 1425"
                            className="w-full bg-transparent border border-border rounded-lg px-4 py-2.5 text-foreground focus:outline-none focus:border-primary transition-colors placeholder:text-foreground/30"
                        />
                        {errors.cod_postal && <p className="text-red-500 text-xs mt-0.5 font-medium">{errors.cod_postal[0]}</p>}
                    </div>

                    {globalMessage && (
                        <div className={`p-3 rounded-lg border text-xs font-medium mt-2 ${
                            globalMessage.success ? 'bg-green-100 text-green-900 border-green-300' : 'bg-red-100 text-red-900 border-red-300'
                        }`}>
                            {globalMessage.text}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isPending}
                        className="bg-primary text-white font-dm px-6 py-2.5 rounded-full hover:opacity-90 transition-opacity font-medium w-full text-center mt-3 flex items-center justify-center gap-2 disabled:opacity-50 shadow-sm"
                    >
                        {direccionAEditar ? <PencilIcon className="w-4 h-4" /> : <PlusIcon className="w-4 h-4" />}
                        {isPending ? 'Procesando...' : direccionAEditar ? 'Guardar cambios' : 'Guardar dirección'}
                    </button>
                </form>
            </div>
        </div>
    )
}