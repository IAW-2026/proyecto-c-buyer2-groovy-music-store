import { auth } from '@clerk/nextjs/server';
import prisma from '@/app/lib/prisma';
import CartDropdown from './CartDropdown';

import { HydratedCartItem } from '@/app/lib/definitions';
import { getProductsBatch } from '@/app/lib/services/seller-api';

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

        // Extraemos todos los IDs de los productos en el carrito
        const productIds = itemsLocales.map((item) => item.producto_id);

        // llamada a la api
        const productosBatch = await getProductsBatch(productIds);

        // Hidratamos los items de forma síncrona
        const itemsHidratados: HydratedCartItem[] = itemsLocales.map((itemLocal) => {
            
            
            const resumenProducto = productosBatch.find((p) => p.id === itemLocal.producto_id);
            
            // Si el producto existe pero no tiene stock, se pasará tal cual (con stock: 0).
            // Si el producto fue eliminado o está inactivo en la Seller App, resumenProducto será undefined
            // y entrará en este fallback, enviando también stock: 0 y un título genérico.
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
        });

        return <CartDropdown items={itemsHidratados} />;

    } catch (error) {
        console.error("Error en CartServer:", error);
        return <CartDropdown items={[]} />;
    }
}