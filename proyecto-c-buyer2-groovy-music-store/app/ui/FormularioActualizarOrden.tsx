'use client'; // ¡Muy importante! Esto le dice a Next.js que este componente se ejecuta en el navegador.

import { useActionState } from 'react';
import { actualizarOrden } from '@/app/lib/actions/actions-admin'; // Chequeá que esta ruta sea la correcta

type FormState = {
    success: boolean;
    message: string;
    errors: {
        nro_orden?: string[];
        estado?: string[];
        empresa_envio?: string[];
    };
};

export default function FormularioActualizarOrden({ orden }: { orden: any }) {
    
   
    const initialState: FormState = { 
        success: false, 
        message: "", 
        errors: {} 
    };
    
    const [state, formAction, isPending] = useActionState(actualizarOrden, initialState);

    return (
        <form action={formAction} className="flex flex-col gap-2 p-3 bg-background/40 rounded-lg border border-border/60 max-w-[180px] mx-auto">
            {/* ID oculto para que el servidor sepa qué orden actualizar */}
            <input type="hidden" name="nro_orden" value={orden.nro_orden} />
            
            <div className="flex flex-col gap-0.5">
                <span className="text-[10px] uppercase font-bold text-foreground/50">Estado:</span>
                <select 
                    name="estado" 
                    defaultValue={orden.estado}
                    className="bg-background border border-border text-foreground text-xs rounded p-1 outline-none focus:border-primary font-medium"
                >
                    <option value="Pendiente">Pendiente</option>
                    <option value="Pagado">Pagado</option>
                    <option value="Enviado">Enviado</option>
                    <option value="Cancelado">Cancelado</option>
                </select>
                
                {/* Si Zod rebota el estado, mostramos el error acá */}
                {state?.errors?.estado && (
                    <span className="text-red-500 text-[10px] leading-tight">{state.errors.estado[0]}</span>
                )}
            </div>

            <div className="flex flex-col gap-0.5">
                <span className="text-[10px] uppercase font-bold text-foreground/50">Transporte:</span>
                <input 
                    type="text" 
                    name="empresa_envio" 
                    defaultValue={orden.empresa_envio || ""}
                    placeholder="Ej: Correo Arg."
                    className="bg-background border border-border text-foreground text-xs rounded p-1 outline-none focus:border-primary w-full"
                />
            </div>

            
            {state?.message && !state?.success && (
                <span className="text-red-500 text-[10px] font-bold leading-tight text-center mt-1">
                    {state.message}
                </span>
            )}

            
            {state?.success && (
                <span className="text-green-500 text-[10px] font-bold leading-tight text-center mt-1">
                    ¡Actualizado!
                </span>
            )}

            <button 
                type="submit" 
                disabled={isPending}
                className="bg-primary text-white hover:opacity-90 px-2 py-1 rounded text-xs font-bold transition-opacity mt-1 w-full uppercase tracking-wider disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isPending ? 'Guardando...' : 'Aplicar'}
            </button>
        </form>
    );
}