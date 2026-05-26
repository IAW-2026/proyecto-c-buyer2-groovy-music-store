'use server'

import prisma from '@/app/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function guardarNuevaDireccion(formData: FormData) {
    const clerkId = formData.get('clerk_id') as string;
    
    const nuevaDireccion = await prisma.direccion.create({
        data: {
            calle: formData.get('calle') as string,
            ciudad: formData.get('ciudad') as string,
            provincia: formData.get('provincia') as string,
            cod_postal: formData.get('cod_postal') as string,
            pais: formData.get('pais') as string,
            clerk_id: clerkId
        }
    });

    // Esto fuerza a Next.js a recargar los datos de la página actual para que 
    // la nueva dirección aparezca inmediatamente si la consultas de la BD.
    revalidatePath('/checkout'); 

    return nuevaDireccion;
}