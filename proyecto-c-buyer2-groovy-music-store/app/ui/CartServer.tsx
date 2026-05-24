import { auth } from '@clerk/nextjs/server';
import prisma from '@/app/lib/prisma';
import CartDropdown from './CartDropdown';

// Definicion de productos e items para procesamiento interno en CartServer
export type SellerProduct = {
    id: string;
    titulo: string;
    artista: string;
    precio: number;
    stock: number;
    formato: string;
    condicion: string;
    genero: string;
    imagenes: string[];
    id_seller: string;
};

export type HydratedCartItem = {
    id_carrito: string;
    producto_id: string;
    cantidad: number;
    producto: SellerProduct;
};

const sampleProducts: SellerProduct[] = [
    { id: '1', titulo: 'Groovy Vinyl 1', artista: 'Artist A', precio: 19.99, stock: 5, formato: 'Vinilo LP', condicion: 'Nuevo', genero: 'Rock', imagenes: ['/placeholder-record.png'], id_seller: 'clerk_123' },
    { id: '2', titulo: 'Groovy Vinyl 2', artista: 'Artist B', precio: 24.50, stock: 2, formato: 'Vinilo 7"', condicion: 'Usado', genero: 'Jazz', imagenes: ['/placeholder-record.png'], id_seller: 'clerk_123' },
    { id: '3', titulo: 'Groovy Vinyl 3', artista: 'Artist C', precio: 15.00, stock: 0, formato: 'Cassette', condicion: 'Nuevo', genero: 'Pop', imagenes: ['/placeholder-record.png'], id_seller: 'clerk_456' }
];

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
            const detalleProducto = sampleProducts.find(p => p.id === itemLocal.producto_id);
            
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