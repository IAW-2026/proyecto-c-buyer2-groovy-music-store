'use server'

import prisma from "@/app/lib/prisma"
import { revalidatePath } from "next/cache"
import { z } from "zod"

// 1. Definimos las reglas estrictas de validación para los datos recibidos
const ActualizarOrdenSchema = z.object({
    nro_orden: z.string().min(1, "El número de orden es requerido"),
    
    estado: z.string().refine(
        (valor) => ['Pendiente', 'Pagado', 'Enviado', 'Cancelado'].includes(valor),
        { message: "El estado seleccionado no es válido" }
    ),
    
    empresa_envio: z.string().trim().default("")
});

// 2. Agregamos prevState para que sea compatible con el hook de estado del formulario en el cliente
export async function actualizarOrden(prevState: any, formData: FormData) {
    
    // 3. safeParse valida los datos sin lanzar excepciones que rompan el servidor
    const result = ActualizarOrdenSchema.safeParse({
        nro_orden: formData.get('nro_orden'),
        estado: formData.get('estado'),
        empresa_envio: formData.get('empresa_envio'),
    });

    // 4. Si la validación de Zod falla, retornamos los errores específicos por campo
    if (!result.success) {
        return {
            success: false,
            errors: result.error.flatten().fieldErrors,
            message: "Faltan campos obligatorios o el formato es incorrecto."
        };
    }

    // 5. Si los datos son válidos, extraemos la información limpia y tipada
    const { nro_orden, estado, empresa_envio } = result.data;

    try {
        await prisma.orden.update({
            where: { nro_orden: nro_orden },
            data: { 
                estado: estado,
                empresa_envio: empresa_envio
            }
        });

        // Forzamos la actualización de la caché para ver el cambio inmediatamente
        revalidatePath('/admin/ordenes');
        
        return { 
            success: true, 
            message: "Orden actualizada correctamente.",
            errors: {} 
        };

    } catch (error) {
        console.error("Error al actualizar la orden en Prisma:", error);
        return { 
            success: false, 
            message: "Hubo un problema de conexión con la base de datos al guardar los cambios.",
            errors: {} 
        };
    }
}