import { auth } from '@clerk/nextjs/server';
import prisma from '@/app/lib/prisma';
import CartDropdown from './CartDropdown';

import { HydratedCartItem } from '@/app/lib/definitions'
import { getFullProduct } from '@/app/lib/services/seller-api' 

export default async function CartServer() {
    const { userId } = await auth();

    if (!userId) return <CartDropdown items={[]} />;

    try {
        const carritoUsuario = await prisma.carrito.findFirst({
            where: { clerk_id: userId },
            include: { items: true }
        });

        const itemsLocales = carritoUsuario?.items || [];
        if (itemsLocales.length === 0) return <CartDropdown items={[]} />;

        const itemsHidratados: HydratedCartItem[] = await Promise.all(
            itemsLocales.map(async (itemLocal) => {
                
                const detalleProducto = await getFullProduct(itemLocal.producto_id);
                
                return {
                    id_carrito: itemLocal.id_carrito,
                    producto_id: itemLocal.producto_id,
                    cantidad: itemLocal.cantidad,
                    producto: detalleProducto || {
                        id: itemLocal.producto_id,
                        titulo: 'Producto no disponible',
                        artista: 'Desconocido',
                        precio: 0,
                        stock: 0,
                        formato: '-',
                        condicion: '-',
                        genero: '-',
                        imagenes: ['/placeholder-record.png'],
                        seller_id: { id: 'desconocido' } 
                    }
                };
            })
        );

        return <CartDropdown items={itemsHidratados} />;

    } catch (error) {
        console.error("Error en CartServer:", error);
        return <CartDropdown items={[]} />;
    }
}