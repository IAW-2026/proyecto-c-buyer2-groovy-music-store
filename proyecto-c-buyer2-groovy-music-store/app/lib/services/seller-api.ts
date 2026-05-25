
import { ProductSummary, Product } from '../definitions';
import { 
    mockProductSummaries, 
    detallesProductosMock, 
    mockProducts 
} from '../placeholder-data';

/* Los retruns de las funciones de abajo van a 
cambiar cuando conecte la api de la seller app */



// 1. Obtener catálogo de productos
export async function getCatalog(): Promise<ProductSummary[]> {
    return mockProductSummaries;
}

//2. Obtener detalle de producto
//GET /api/products/:id
//para la vista de carrito y la pagina de checkout
export async function getProductQuickDetail(id: string) {
    const detalle = detallesProductosMock[id];
    if (!detalle) return null;
    return detalle;
}

//2. Obtener detalle de producto
// GET /api/products/:id
//para  la pagina de detalle del producto
export async function getFullProduct(id: string): Promise<Product | null> {
    const product = mockProducts.find(p => p.id === id);
    return product || null;
}