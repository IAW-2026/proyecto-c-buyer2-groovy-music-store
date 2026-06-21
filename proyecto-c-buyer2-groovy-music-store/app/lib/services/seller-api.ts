
import { ProductSummary, Product, CatalogResponse } from '../definitions';
import { 
    mockProductSummaries, 
    detallesProductosMock, 
    mockProducts 
} from '../placeholder-data';

const SELLER_API_URL = process.env.NEXT_PUBLIC_SELLER_API_URL;


// 1. Obtener catálogo de productos
//MOCKEADO
// TODO:  (BORRAR CUANDO INTEGRE LA API)
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
//         const url = new URL(`${SELLER_API_URL }/api/products`);
        
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
//             //  Guarda esta respuesta en cache por 60 segundos
               // next: { revalidate: 300 }
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
//MOCKEADO 
//TODO: BORRAR CUANDO INTEGRE LA API
export async function getProductQuickDetail(id: string): Promise<ProductSummary | null> {
    const producto = detallesProductosMock[id];
    if (!producto) {
        return null;
    }
    return producto;
}


//PARA INTEGRAR CON LA API
//TODO: DESCOMENTAR CUANDO INTEGRE LA API
// export async function getProductQuickDetail(id: string): Promise<ProductSummary | null> {
//     try {
//         const url = `${SELLER_API_URL}/api/products/${id}`;
        
//         const response = await fetch(url, {
//             method: 'GET',
//             headers: { 'Content-Type': 'application/json' },
//             next: { revalidate: 10 } // Cacheado por solo 10 segundos
//         });

//         if (!response.ok) return null;

//         const data = await response.json();

        
//         const summary: ProductSummary = {
//             id: data.id,
//             titulo: data.título || data.titulo || 'Sin título',
//             artista: data.artista || 'Artista Desconocido',
//             precio: data.precio || 0,
//             stock: data.stock || 0,
//             seller_id: data.seller_id || { id: 'default_seller' },
//             imagen_principal: data.imagenes?.[0] || '',
//         };

//         return summary;

//     } catch (error) {
//         console.error(`Error al obtener detalle rápido del producto ${id}:`, error);
//         return null;
//     }
// }

//2. Obtener detalle de producto
// GET /api/products/:id
//para  la pagina de detalle del producto
//MOCKEADO
//TODO : borrar cuando integre la api
export async function getFullProduct(id: string): Promise<Product | null> {
    const product = mockProducts.find(p => p.id === id);
    return product || null;
}

//para integrar api
// export async function getFullProduct(id: string): Promise<Product | null> {
//     try {
//         const url = `${SELLER_API_URL}/api/products/${id}`;
        
//         const response = await fetch(url, {
//             method: 'GET',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             next: { revalidate: 10 } // Cacheado por solo 10 segundos
//         });

//         if (!response.ok) {
//             if (response.status === 404) {
//                 return null;
//             }
//             throw new Error(`Error HTTP de la Seller App: ${response.status}`);
//         }

//         const data = await response.json();

//         // JSON a tipo Product
//        const product: Product = {
//             id: data.id,
//             titulo: data.título || data.titulo || 'Sin título',
//             descripcion: data.descripcion || '',
//             precio: data.precio || 0,
//             stock: data.stock || 0,
//             formato: data.formato || 'OTRO',
//             genero: data.genero || 'Desconocido',
//             imagenes: data.imagenes || [],
            
//             // TODO: acomodar cuando la API de la seller esté actualizada 
//             artista: data.artista || 'Artista Desconocido',
//             seller_id: data.seller_id || { id: 'default_seller' },
//             condicion: data.condicion || 'No especificada',
//         };

//         return product;

//     } catch (error) {
//         console.error(`Error de red al obtener el producto con ID ${id}:`, error);
        
//         // Si el servidor está caído o hay un problema de conexión, 
//         // devolvemos null 
//         return null; 
//     }
// }
