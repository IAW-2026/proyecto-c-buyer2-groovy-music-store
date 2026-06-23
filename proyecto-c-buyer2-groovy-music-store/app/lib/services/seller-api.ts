
import { ProductSummary, Product, CatalogResponse } from '../definitions';
import { ReservePayload, ReserveResponse } from '../definitions';
import { 
    mockProductSummaries, 
    detallesProductosMock, 
    mockProducts 
} from '../placeholder-data';

const SELLER_API_URL = process.env.NEXT_PUBLIC_SELLER_API_URL;


// 1. Obtener catálogo de productos
export async function getCatalog(params: {
    page?: number;
    limit?: number;
    query?: string;
    formato?: string;
}) {
    const { page = 1, limit = 24, query = "", formato } = params;

    try {
        // url api
        const url = new URL(`${SELLER_API_URL}/api/products`);
        
        // paginado
        url.searchParams.append('pagina', page.toString());
        url.searchParams.append('limite', limit.toString());
        
        // busqueda
        if (query) {
            url.searchParams.append('busqueda', query);
        }

        // filtro de formato
        if (formato && formato !== 'TODO') {
            let formatoAPI = formato;
            const formatLower = formato.toLowerCase();
            
            if (formatLower === 'cds') formatoAPI = 'CD';
            if (formatLower === 'vinilos') formatoAPI = 'VINILO';
            if (formatLower === 'cassettes') formatoAPI = 'CASSETTE';
            
            url.searchParams.append('formato', formatoAPI);
        }

        // llamada a la api de la seller app
        const response = await fetch(url.toString(), {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            next: { revalidate: 300 }
        });

        if (!response.ok) {
            throw new Error(`Error HTTP de la Seller App: ${response.status}`);
        }

        // parseo de la respuesta
        const jsonResponse: CatalogResponse = await response.json();

        // transformar el formato
        const paginatedData: ProductSummary[] = (jsonResponse.datos || []).map((p) => ({
            id: p.id,
            titulo: p.titulo,
            artista: p.artista,
            precio: p.precio,
            stock: p.stock,
            seller_id: p.seller_id,
            imagen_principal: p.imagenes?.[0] || '', // Tomamos la primera imagen
        }));
        
        return {
            data: paginatedData,
            meta: {
                totalItems: jsonResponse.paginacion?.total || 0,
                totalPages: jsonResponse.paginacion?.totalPaginas || 1,
                currentPage: jsonResponse.paginacion?.pagina || page,
            }
        };

    } catch (error) {
        console.error("Error al obtener el catálogo desde la Seller App:", error);
        
        // Retorno de fallback si la api esta caida
        return {
            data: [],
            meta: {
                totalItems: 0,
                totalPages: 1,
                currentPage: page,
            }
        };
    }
}

//2. Obtener detalle reducido de producto para carrito y checkout
export async function getProductQuickDetail(id: string): Promise<ProductSummary | null> {
    try {
        const url = `${SELLER_API_URL}/api/products/${id}`;
        
        const response = await fetch(url, {
            method: 'GET',
            headers: { 
                'Content-Type': 'application/json'
            },
            next: { revalidate: 10 } // Cacheado por 10 segundos
        });

        if (!response.ok) return null;

        // La API devuelve el producto directamente en la raíz
        const data = await response.json(); 

        const summary: ProductSummary = {
            id: data.id,
            // Soporta 'título' con acento según tu especificación actual
            titulo: data.título || data.titulo || 'Sin título', 
            // Anticipamos 'artista' y 'seller_id' para cuando se actualice la API
            artista: data.artista || 'Artista Desconocido',
            precio: data.precio || 0,
            stock: data.stock || 0,
            seller_id: data.seller_id || { id: 'default_seller' },
            imagen_principal: data.imagenes?.[0] || '/placeholder-record.png',
        };

        return summary;

    } catch (error) {
        console.error(`Error al obtener detalle rápido del producto ${id}:`, error);
        return null;
    }
}

//2. Obtener detalle de producto para vista detallada
export async function getFullProduct(id: string): Promise<Product | null> {
    try {
        const url = `${SELLER_API_URL}/api/products/${id}`;
        
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            next: { revalidate: 10 } // Cacheado por solo 10 segundos
        });

        if (!response.ok) {
            if (response.status === 404) {
                return null;
            }
            throw new Error(`Error HTTP de la Seller App: ${response.status}`);
        }

        
        const data = await response.json();

        // JSON a tipo Product
        const product: Product = {
            id: data.id,
            titulo: data.título || data.titulo || 'Sin título',
            descripcion: data.descripcion || '',
            precio: data.precio || 0,
            stock: data.stock || 0,
            formato: data.formato || 'OTRO',
            genero: data.genero || 'Desconocido',
            imagenes: data.imagenes || [], 
            artista: data.artista || 'Artista Desconocido',
            seller_id: data.seller_id || { id: 'default_seller' },
            condicion: data.condicion || 'No especificada',
        };

        return product;

    } catch (error) {
        console.error(`Error de red al obtener el producto con ID ${id}:`, error);
        
        // Si el servidor está caído o hay un problema de conexión, 
        // devolvemos null 
        return null; 
    }
}


// TODO: Reemplazar con la llamada real a la Seller App cuando esté lista
export async function getSellerPostalCode(sellerId: string, token: string): Promise<string> {
  // Simulamos un pequeño retraso de red (400ms)
  await new Promise(resolve => setTimeout(resolve, 400));
  
  // Retornamos el código postal mockeado
  return "1000"; 
}

//TODO: DESCOMENTAR CUANDO ESTE LISTA LA API
// export async function getSellerPostalCode(sellerId: string, token: string): Promise<string> {
  

//   try {
//     const response = await fetch(`${SELLER_API_URL}/api/sellers/${sellerId}`, {
//       method: 'GET',
//       headers: {
//         'Content-Type': 'application/json',
//         'Authorization': `Bearer ${token}`
//       },
//     });

//     if (!response.ok) {
//       const errorData = await response.json().catch(() => ({})); 
//       throw new Error(errorData.mensaje || `HTTP error! status: ${response.status}`);
//     }

//     const json = await response.json();
    
//     return json.datos.codigo_postal;

//   } catch (error) {
//     console.error("Error al obtener el código postal del seller:", error);
//     throw error; 
//   }
// }



//MOCKEADO 
//TODO: BORRAR CUANDO SE INTEGRE LA API
export const reservarStock = async (
  payload: ReservePayload,
  token: string
): Promise<ReserveResponse> => {
  
 
  await new Promise(resolve => setTimeout(resolve, 600));

 
  if (!token) {
    throw new Error("unauthorized: No se proporcionó un token de acceso válido");
  }

  
  const itemsRespondidos = payload.items.map((item) => {
    // Buscamos el producto en el  listado de mockProducts
    const productoExistente = mockProducts.find(p => p.id === item.producto_id);

    // Validación: Producto no encontrado (Error 404)
    if (!productoExistente) {
      throw new Error(`producto_no_encontrado: El producto con ID ${item.producto_id} no existe en el catálogo`);
    }

    // Validación: Stock insuficiente (Error 409)
    if (productoExistente.stock < item.cantidad) {
      throw new Error(`stock_insuficiente: No hay suficiente stock para ${productoExistente.titulo}. Disponible: ${productoExistente.stock}, Solicitado: ${item.cantidad}`);
    }

    // Si pasa las validaciones, devolvemos el objeto con el formato correcto
    return {
      producto_id: item.producto_id,
      titulo: productoExistente.titulo,
      stockRestante: productoExistente.stock - item.cantidad
    };
  });

 
  return {
    estado: "reservado",
    items: itemsRespondidos
  };
};

//para cuando integre la api
// export async function reservarStock(payload: ReservePayload, token: string): Promise<ReserveResponse> {
  
  
//   const response = await fetch(`${SELLER_API_URL}/api/orders/reserve`, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       "Authorization": `Bearer ${token}`
//     },
//     body: JSON.stringify(payload),
//   });

//   if (!response.ok) {
//     if (response.status === 409) {
//       throw new Error("stock_insuficiente");
//     } else if (response.status === 404) {
//       throw new Error("producto_no_encontrado");
//     }
//     const errorData = await response.json();
//     throw new Error(errorData.mensaje || "Error al reservar stock");
//   }

//   return response.json();
// }