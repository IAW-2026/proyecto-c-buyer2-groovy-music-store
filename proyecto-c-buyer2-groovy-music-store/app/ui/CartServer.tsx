import { auth } from '@clerk/nextjs/server';
import prisma from '@/app/lib/prisma';
import CartDropdown from './CartDropdown';

import { HydratedCartItem } from '@/app/lib/definitions';
import { getProductQuickDetail } from '@/app/lib/services/seller-api';

export default async function CartServer() {
    
    const { userId, getToken } = await auth();

    if (!userId) return <CartDropdown items={[]} />;

    const token = await getToken();

    if (!token) {
        console.error("No se pudo obtener el token para el carrito");
        return <CartDropdown items={[]} />;
    }

    try {
        const carritoUsuario = await prisma.carrito.findFirst({
            where: { clerk_id: userId },
            include: { items: true }
        });

        const itemsLocales = carritoUsuario?.items || [];
        if (itemsLocales.length === 0) return <CartDropdown items={[]} />;

      
        const itemsHidratadosRaw = await Promise.all(
            itemsLocales.map(async (itemLocal) => {
                
                const resumenProducto = await getProductQuickDetail(itemLocal.producto_id);
                
                
                if (resumenProducto && resumenProducto.stock <= 0) {
                    // Lo eliminamos silenciosamente de la base de datos de la Buyer App
                    await prisma.itemCarrito.deleteMany({
                        where: {
                            id_carrito: itemLocal.id_carrito,
                            producto_id: itemLocal.producto_id
                        }
                    });
                    
                    // Retornamos null para luego filtrarlo del array final
                    return null; 
                }
                
                // Mantenemos el fallback por si resumenProducto es null 
                // (por ejemplo, si la Seller App se cae por un error de red, 
                // es mejor mostrar "No disponible" )
                return {
                    id_carrito: itemLocal.id_carrito,
                    producto_id: itemLocal.producto_id,
                    cantidad: itemLocal.cantidad,
                    producto: resumenProducto || {
                        id: itemLocal.producto_id,
                        titulo: 'Producto no disponible',
                        artista: 'Desconocido',
                        precio: 0,
                        stock: 0,
                        seller_id: { id: 'desconocido' } ,
                        imagen_principal: '/placeholder-record.png',
                    }
                };
            })
        );

        // 2. Filtramos los ítems que fueron eliminados 
        const itemsHidratados = itemsHidratadosRaw.filter(
            (item): item is HydratedCartItem => item !== null
        );

        return <CartDropdown items={itemsHidratados} />;

    } catch (error) {
        console.error("Error en CartServer:", error);
        return <CartDropdown items={[]} />;
    }
}