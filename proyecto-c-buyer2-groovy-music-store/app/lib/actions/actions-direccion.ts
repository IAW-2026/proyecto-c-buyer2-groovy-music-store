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