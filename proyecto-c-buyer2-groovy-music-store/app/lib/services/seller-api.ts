
import { ProductSummary, Product } from '../definitions';
import { 
    mockProductSummaries, 
    detallesProductosMock, 
    mockProducts 
} from '../placeholder-data';

/* Los returns de las funciones de abajo van a 
cambiar cuando conecte la api de la seller app */

// 1. Obtener catálogo de productos
export async function getCatalog(params: {
    page?: number;
    limit?: number;
    query?: string;
    formato?: string;
}) {
    const { page = 1, limit = 12, query = "", formato } = params;

    let filtered = mockProducts;
    
    // 1. Filtro de búsqueda por texto
    if (query) {
        const q = query.toLowerCase();
        filtered = filtered.filter((p) => {
            const matchTitulo = p.titulo.toLowerCase().includes(q);
            const matchArtista = p.artista?.toLowerCase().includes(q);
            return matchTitulo || matchArtista;
        });
    }

    // 2. Filtro por Formato
    if (formato && formato !== 'TODO') {
        filtered = filtered.filter((p) => {
            const formatoDB = p.formato?.toLowerCase() || '';
            const filtro = formato.toLowerCase();

            if (filtro === 'vinilos' && formatoDB.includes('vinilo')) return true;
            if (filtro === 'cds' && formatoDB === 'cd') return true;
            if (filtro === 'cassettes' && formatoDB === 'cassette') return true;
            
            return false;
        });
    }

    // 3. Paginación y TRANSFORMACIÓN al tipo "Summary" que espera tu app
    const totalItems = filtered.length;
    const totalPages = Math.ceil(totalItems / limit);
    const startIndex = (page - 1) * limit;
    
    
    const paginatedData = filtered.slice(startIndex, startIndex + limit).map(p => ({
        id: p.id,
        titulo: p.titulo,
        artista: p.artista,
        precio: p.precio,
        stock: p.stock,
        imagen_principal: p.imagenes?.[0] || null, 
    }));

    return {
        data: paginatedData,
        meta: {
            totalItems,
            totalPages,
            currentPage: page,
        }
    };
}

//2. Obtener detalle de producto
//GET /api/products/:id
//para la vista de carrito y la pagina de checkout
export async function getProductQuickDetail(id: string): Promise<ProductSummary | null> {
    const producto = detallesProductosMock[id];
    if (!producto) {
        return null;
    }
    return producto;
}

//2. Obtener detalle de producto
// GET /api/products/:id
//para  la pagina de detalle del producto
export async function getFullProduct(id: string): Promise<Product | null> {
    const product = mockProducts.find(p => p.id === id);
    return product || null;
}

