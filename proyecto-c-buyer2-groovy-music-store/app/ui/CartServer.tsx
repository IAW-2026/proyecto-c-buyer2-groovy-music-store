import { auth } from '@clerk/nextjs/server';
import prisma from '@/app/lib/prisma';
import CartDropdown from './CartDropdown';

import { mockProducts } from '@/app/lib/placeholder-data';
import { HydratedCartItem } from '@/app/lib/definitions';



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

        const itemsHidratados: HydratedCartItem[] = itemsLocales.map(itemLocal => {
            const detalleProducto = mockProducts.find(p => p.id === itemLocal.producto_id);
            
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
                    seller_id: 'desconocido',
                    id_seller: 'desconocido'
                }
            };
        });

        return <CartDropdown items={itemsHidratados} />;

    } catch (error) {
        console.error("Error en CartServer:", error);
        return <CartDropdown items={[]} />;
    }
}