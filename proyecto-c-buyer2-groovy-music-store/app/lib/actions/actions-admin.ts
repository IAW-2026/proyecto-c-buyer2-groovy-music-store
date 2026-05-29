'use server'

import prisma from "@/app/lib/prisma"
import { revalidatePath } from "next/cache"

export async function actualizarOrden(formData: FormData) {
    const nro_orden = formData.get('nro_orden') as string;
    const nuevoEstado = formData.get('estado') as string;
    const nuevaEmpresa = formData.get('empresa_envio') as string;

    if (!nro_orden) return;

    await prisma.orden.update({
        where: { nro_orden: nro_orden },
        data: { 
            estado: nuevoEstado,
            empresa_envio: nuevaEmpresa || ""
        }
    });

    
    revalidatePath('/admin/ordenes');
}