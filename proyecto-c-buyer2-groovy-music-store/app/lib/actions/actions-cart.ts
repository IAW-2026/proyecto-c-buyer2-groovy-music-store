'use server';

import prisma from '@/app/lib/prisma';
import { auth, currentUser } from '@clerk/nextjs/server'; 
import { revalidatePath } from 'next/cache';

// 1. Modificamos la firma para recibir también el id_seller
export async function agregarAlCarrito(producto_id: number, id_seller: string) {
    const { userId } = await auth();
    if (!userId) throw new Error("Debes iniciar sesión para comprar");

    try {
        // Buscamos si el usuario ya existe localmente
        const usuarioExiste = await prisma.usuario.findUnique({
            where: { clerk_id: userId } 
        });

        // Si no existe, le pedimos a Clerk sus datos completos antes de crearlo
        if (!usuarioExiste) {
            const datosClerk = await currentUser();
            
            const emailUsuario = datosClerk?.emailAddresses[0]?.emailAddress || "sin-email@groovy.com";
            const nombreUsuario = datosClerk?.firstName 
                ? `${datosClerk.firstName} ${datosClerk.lastName || ''}`.trim()
                : "Usuario de Groovy"; 

            await prisma.usuario.create({
                data: { 
                    clerk_id: userId,
                    nombre: nombreUsuario,
                    mail: emailUsuario
                }
            });
        }

        let carrito = await prisma.carrito.findFirst({
            where: { clerk_id: userId }
        });

        if (!carrito) {
            carrito = await prisma.carrito.create({
                data: { clerk_id: userId }
            });
        }

        const itemExistente = await prisma.itemCarrito.findUnique({
            where: {
                id_carrito_producto_id: {
                    id_carrito: carrito.id_carrito,
                    producto_id: producto_id
                }
            }
        });

        if (itemExistente) {
            await prisma.itemCarrito.update({
                where: {
                    id_carrito_producto_id: {
                        id_carrito: carrito.id_carrito,
                        producto_id: producto_id
                    }
                },
                data: { cantidad: itemExistente.cantidad + 1 }
            });
        } else {
            await prisma.itemCarrito.create({
                data: {
                    id_carrito: carrito.id_carrito,
                    producto_id: producto_id,
                    cantidad: 1,
                    id_seller: id_seller 
                }
            });
        }

        revalidatePath('/', 'layout');
        
        return { success: true };
    } catch (error) {
        console.error("Error al mutar el carrito:", error);
        return { success: false, error: "Error de base de datos" };
    }
}