'use server'

import prisma from '@/app/lib/prisma';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';


const DireccionSchema = z.object({
    // Regex /\d+/ verifica que haya al menos un número en cualquier parte del string
    calle: z.string().regex(/\d+/, "La calle debe incluir un número (altura)"),
    
    ciudad: z.string().min(2, "La ciudad es obligatoria"),
    provincia: z.string().min(2, "La provincia es obligatoria"),
    
    // Regex /^\d{4}$/ asegura que sean exactamente 4 dígitos, ni más ni menos
    cod_postal: z.string().regex(/^\d{4}$/, "El código postal debe tener exactamente 4 dígitos"),
    
    pais: z.string().min(2, "El país es obligatorio"),
    clerk_id: z.string().min(1, "Error de sesión"),
});


const EditarDireccionSchema = DireccionSchema.extend({
    id: z.string().min(1, "ID requerido"),
});

export async function guardarNuevaDireccion(formData: FormData) {

    const result = DireccionSchema.safeParse({
        calle: formData.get('calle'),
        ciudad: formData.get('ciudad'),
        provincia: formData.get('provincia'),
        cod_postal: formData.get('cod_postal'),
        pais: formData.get('pais'),
        clerk_id: formData.get('clerk_id'),
    });

    
    if (!result.success) {
        return { 
            success: false, 
            errors: result.error.flatten().fieldErrors,
            message: "Por favor, completa correctamente todos los campos." 
        };
    }

    try {
        
        const nuevaDireccion = await prisma.direccion.create({
            data: result.data 
        });

        revalidatePath('/checkout'); 
        
        return { 
            success: true, 
            data: nuevaDireccion 
        };

    } catch (error) {
        console.error("Error al guardar dirección:", error);
        return { 
            success: false, 
            message: "Hubo un problema al guardar la dirección en la base de datos." 
        };
    }
}



export async function actualizarDireccion(formData: FormData) {
    const result = EditarDireccionSchema.safeParse({
        id: formData.get('id'),
        calle: formData.get('calle'),
        ciudad: formData.get('ciudad'),
        provincia: formData.get('provincia'),
        cod_postal: formData.get('cod_postal'),
        pais: formData.get('pais'),
        clerk_id: formData.get('clerk_id'),
    });

    if (!result.success) {
        return { 
            success: false, 
            errors: result.error.flatten().fieldErrors,
            message: "Por favor, completa correctamente todos los campos." 
        };
    }

    try {
        const direccionActualizada = await prisma.direccion.update({
            where: { 
                id: result.data.id,
                clerk_id: result.data.clerk_id // Seguridad externa
            },
            data: {
                calle: result.data.calle,
                ciudad: result.data.ciudad,
                provincia: result.data.provincia,
                cod_postal: result.data.cod_postal,
                pais: result.data.pais,
            }
        });

        revalidatePath('/account/addresses');
        revalidatePath('/checkout'); 
        
        return { success: true, data: direccionActualizada };
    } catch (error) {
        console.error("Error al actualizar dirección:", error);
        return { success: false, message: "Hubo un problema al actualizar la dirección." };
    }
}

export async function eliminarDireccion(id: string, clerkId: string) {
    try {
        await prisma.direccion.delete({
            where: { 
                id: id,
                clerk_id: clerkId 
            }
        });

        revalidatePath('/account/addresses');
        revalidatePath('/checkout');
        
        return { success: true };
    } catch (error) {
        console.error("Error al eliminar dirección:", error);
        return { success: false, message: "No se pudo eliminar la dirección de la base de datos." };
    }
}