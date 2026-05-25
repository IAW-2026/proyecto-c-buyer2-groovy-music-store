
import { ProductSummary, Product } from '../definitions';
import { 
    mockProductSummaries, 
    detallesProductosMock, 
    mockProducts 
} from '../placeholder-data';

/* Los retruns de las funciones de abajo van a 
cambiar cuando conecte la api de la seller app */


// 1. Obtener catálogo completo (Para tu grilla principal)
export async function getCatalog(): Promise<ProductSummary[]> {
    return mockProductSummaries;
}

// 2. Obtener un detalle rápido por ID (Para el carrito / checkout)
export async function getProductQuickDetail(id: string) {
    const detalle = detallesProductosMock[id];
    if (!detalle) return null;
    return detalle;
}

// 3. Obtener el producto completo (Para la página de detalle del disco)
export async function getFullProduct(id: string): Promise<Product | null> {
    const product = mockProducts.find(p => p.id === id);
    return product || null;
}