import { auth } from '@clerk/nextjs/server'
import prisma from '@/app/lib/prisma'
import CartDropdown from './CartDropdown';

// Definimos la interfaz estricta para asegurarnos de que coincida con el cliente
type SellerProduct = {
    id: number;
    titulo: string;
    artista: string;
    precio: number;
    imagenes: string[];
    id_seller: string;
};

type HydratedCartItem = {
    id_carrito: number;
    producto_id: number;
    cantidad: number;
    producto: SellerProduct;
};

// DATOS FALSOS SIMULANDO LA API DE LA SELLER APP
const fakeApiProducts: SellerProduct[] = [
    { id: 1, titulo: 'Groovy Vinyl 1', artista: 'Artist A', precio: 19.99, imagenes: ['/placeholder-record.png'], id_seller: 'Vendedor A' },
    { id: 2, titulo: 'Groovy Vinyl 2', artista: 'Artist B', precio: 24.50, imagenes: ['/placeholder-record.png'], id_seller: 'Vendedor B' },
    { id: 3, titulo: 'Groovy Vinyl 3', artista: 'Artist C', precio: 15.00, imagenes: ['/placeholder-record.png'], id_seller: 'Vendedor A' },
];

export default async function CartServer() {
    // Obtener el id de clerk
    const { userId } = await auth();

    if (!userId) {
        return <CartDropdown items={[]} />;
    }

    try {
        // Buscar en la BD de Neon 
        const carritoUsuario = await prisma.carrito.findFirst({
            where: { clerk_id: userId },
            include: { items: true } // Trae la lista de producto_id y cantidad
        });

        const itemsLocales = carritoUsuario?.items || [];

        if (itemsLocales.length === 0) {
            return <CartDropdown items={[]} />;
        }

        // Extraemos todos los IDs únicos del carrito desde Neon
        const productIds = itemsLocales.map(item => item.producto_id);

        //  SIMULAMOS LA RESPUESTA DE LA API
        // Filtramos nuestra lista falsa para devolver solo los productos que el usuario tiene en su base de datos
        const productosDesdeLaApi = fakeApiProducts.filter(p => productIds.includes(p.id));

        // 4. Hidratamos los datos mezclando las cantidades locales con la información de los productos falsos
        const itemsHidratados: HydratedCartItem[] = itemsLocales.map(itemLocal => {
            const detalleProducto = productosDesdeLaApi.find(p => p.id === itemLocal.producto_id);
            
            return {
                id_carrito: itemLocal.id_carrito,
                producto_id: itemLocal.producto_id,
                cantidad: itemLocal.cantidad,
                producto: detalleProducto || {
                    id: itemLocal.producto_id,
                    titulo: 'Producto no disponible',
                    artista: 'Desconocido',
                    precio: 0,
                    imagenes: ['/placeholder-record.png'],
                    id_seller: 'Desconocido'
                }
            };
        });

        // Inyectamos la información combinada al dropdown del cliente
        return <CartDropdown items={itemsHidratados} />;

    } catch (error) {
        console.error("Error en el procesamiento del servidor del carrito:", error);
        return <CartDropdown items={[]} />;
    }
}