
import { ProductSummary, Product, CatalogResponse } from '../definitions';
import { 
    mockProductSummaries, 
    detallesProductosMock, 
    mockProducts 
} from '../placeholder-data';


/* Los returns de las funciones de abajo van a 
cambiar cuando conecte la api de la seller app */

// 1. Obtener catálogo de productos
//MOCKEADO (BORRAR CUANDO INTEGRE LA API)
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
        filtered = filtered.filter((p: any) => {
            const matchTitulo = p.titulo?.toLowerCase().includes(q);
            const matchArtista = p.artista?.toLowerCase().includes(q);
            return matchTitulo || matchArtista;
        });
    }

    // 2. Filtro por Formato 
    if (formato && formato !== 'TODO') {
        const filtro = formato.toLowerCase();
        
        filtered = filtered.filter((p: any) => {
            const formatoDB = p.formato?.toLowerCase() || '';

            if ((filtro === 'vinilos' ) && formatoDB.includes('vinilo')) return true;
            if ((filtro === 'cds' ) && formatoDB === 'cd') return true;
            if ((filtro === 'cassettes' ) && formatoDB === 'cassette') return true;
            
            return false;
        });
    }

    // 3. Paginación
    const totalItems = filtered.length;
    const totalPages = Math.ceil(totalItems / limit) || 1; //1 es default
    const startIndex = (page - 1) * limit;
    
    // 4. Transformación estricta al tipo "ProductSummary" 
    const paginatedData: ProductSummary[] = filtered.slice(startIndex, startIndex + limit).map((p: any) => ({
        id: p.id,
        titulo: p.titulo,
        artista: p.artista,
        precio: p.precio,
        stock: p.stock,
        seller_id: p.seller_id || { id: 'seller_mock_123' }, 
        imagen_principal: p.imagenes?.[0] || '', 
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

// //para integrar api
// export async function getCatalog(params: {
//     page?: number;
//     limit?: number;
//     query?: string;
//     formato?: string;
//     token?: string;
// }) {
//     const { page = 1, limit = 24, query = "", formato, token } = params;

//     try {
            //url api
//         const url = new URL(`${process.env.NEXT_PUBLIC_SELLER_API_URL }/api/products`);
        
            //paginado
//         url.searchParams.append('pagina', page.toString());
//         url.searchParams.append('limite', limit.toString());
        
//         //busqueda
//         if (query) {
//             url.searchParams.append('busqueda', query);
//         }

//         //filtro de formato
//         if (formato && formato !== 'TODO') {
//             let formatoAPI = formato;
//             const formatLower = formato.toLowerCase();
            
//             if (formatLower === 'cds') formatoAPI = 'CD';
//             if (formatLower === 'vinilos') formatoAPI = 'VINILO';
//             if (formatLower === 'cassettes') formatoAPI = 'CASSETTE';
            
//             url.searchParams.append('formato', formatoAPI);
//         }

//         //jwt
//         //es opcional porque el catalogo no es informacion sensible.
//         const headers: HeadersInit = {
//             'Content-Type': 'application/json',
//         };

//         if (token) {
//             headers['Authorization'] = `Bearer ${token}`;
//         }

//         //llamada a la api de la seller app
//         const response = await fetch(url.toString(), {
//             method: 'GET',
//             headers,
//             // next: { revalidate: 30 } // Descomentá esto si querés usar caché de Next.js
//         });

//         if (!response.ok) {
//             throw new Error(`Error HTTP de la Seller App: ${response.status}`);
//         }

//         //parseo de la respuesta
//         const jsonResponse: CatalogResponse = await response.json();

//         //transformar el formato
//         const paginatedData: ProductSummary[] = (jsonResponse.datos || []).map((p) => ({
//             id: p.id,
//             titulo: p.titulo,
//             artista: p.artista,
//             precio: p.precio,
//             stock: p.stock,
//             seller_id: p.seller_id,
//             imagen_principal: p.imagenes?.[0] || '', // Tomamos la primera imagen
//         }));

        
//         return {
//             data: paginatedData,
//             meta: {
//                 totalItems: jsonResponse.paginacion?.total || 0,
//                 totalPages: jsonResponse.paginacion?.totalPaginas || 1,
//                 currentPage: jsonResponse.paginacion?.pagina || page,
//             }
//         };

//     } catch (error) {
//         console.error("Error al obtener el catálogo desde la Seller App:", error);
        
//         // Retorno de fallback si la api esta caida
//         return {
//             data: [],
//             meta: {
//                 totalItems: 0,
//                 totalPages: 1,
//                 currentPage: page,
//             }
//         };
//     }
// }

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

