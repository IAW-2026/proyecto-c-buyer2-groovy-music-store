
import { ProductSummary, Product, CatalogResponse, SellerInfoResponse, SellerSummary } from '../definitions';
import { ReservePayload, ReserveResponse } from '../definitions';

import { SignJWT } from 'jose';

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

// 3. Obtener un lote de productos 
export async function getProductsBatch(ids: string[]): Promise<ProductSummary[]> {
    
    if (!ids || ids.length === 0) {
        return [];
    }

    try {
        const url = `${SELLER_API_URL}/api/products/batch`;
        
        const response = await fetch(url, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ ids }),
            
            next: { revalidate: 10 } 
        });

        if (!response.ok) {
            if (response.status === 400) {
                console.warn("Error 400: Se requiere un array de IDs válido");
                return [];
            }
            throw new Error(`Error HTTP de la Seller App: ${response.status}`);
        }

        const jsonResponse = await response.json();
        const productos = jsonResponse.datos || [];

        
        return productos.map((data: any): ProductSummary => ({
            id: data.id,
            titulo: data.título || data.titulo || 'Sin título', 
            artista: data.artista || 'Artista Desconocido',
            precio: data.precio || 0,
            stock: data.stock || 0,
            seller_id: data.seller_id || { id: 'default_seller' },
            imagen_principal: data.imagenes?.[0] || '/placeholder-record.png',
        }));

    } catch (error) {
        console.error(`Error al obtener el batch de productos:`, error);
       
        return [];
    }
}

// 2. Obtener información resumida del vendedor
export async function getSellerInfo(sellerId: string): Promise<SellerSummary | null> {
    if (!sellerId) return null;

    try {
        const secretString = process.env.SELLER_JWT_SECRET;

        if (!secretString) {
            console.error("Falta SELLER_JWT_SECRET en el archivo .env.local");
            return null; 
        }

        
        const secret = new TextEncoder().encode(secretString);
        const token = await new SignJWT({ origen: 'buyer_app' }) 
            .setProtectedHeader({ alg: 'HS256' }) 
            .setIssuedAt()
            .setExpirationTime('5m') 
            .sign(secret);

        
        const url = new URL(`${SELLER_API_URL}/api/sellers/${sellerId}`);

        const response = await fetch(url.toString(), {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` 
            },
            next: { revalidate: 3600 } 
            
        });

        if (response.status === 404) {
            console.warn(`Vendedor no encontrado (ID: ${sellerId})`);
            return null;
        }

        if (!response.ok) {
            throw new Error(`Error HTTP de la Seller App al buscar vendedor: ${response.status}`);
        }

        const jsonResponse: SellerInfoResponse = await response.json();

        return {
            nombre_fantasia: jsonResponse.datos.nombre_fantasia,
            codigo_postal: jsonResponse.datos.codigo_postal,
        };

    } catch (error) {
        console.error(`Error al obtener la información del seller (${sellerId}):`, error);
        return null;
    }
}



export async function reservarStock(payload: ReservePayload): Promise<ReserveResponse> {
  const secretKey = process.env.SELLER_JWT_SECRET;

  if (!secretKey ) {
    throw new Error("Faltan variables de entorno (SELLER_JWT_SECRET o SELLER_API_URL)");
  }

 
  const secret = new TextEncoder().encode(secretKey);
  const token = await new SignJWT({ 
    seller_id: payload.seller_id 
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("5m")
    .sign(secret);

  
  const response = await fetch(`${SELLER_API_URL}/api/orders/reserve`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify(payload),
  });

  
  if (!response.ok) {
    // 🔴 DEBUG: Leemos la respuesta como texto crudo primero y la imprimimos en consola
    const rawText = await response.text();
    console.error(`ERROR DE LA API - STATUS: ${response.status}`, rawText);

    // Intentamos parsearlo a JSON, si falla usamos el rawText
    let errorData;
    try {
        errorData = JSON.parse(rawText);
    } catch (e) {
        throw new Error(`La API falló y no devolvió JSON. Status: ${response.status}. Respuesta: ${rawText.substring(0, 100)}...`);
    }





    //const errorData = await response.json().catch(() => ({ error: "Error desconocido en el servidor" }));
    const mensajeError = errorData.error || "Fallo en la reserva";

    switch (response.status) {
      case 400:
        throw new Error(`Faltan campos: ${mensajeError}`);
      case 404:
        throw new Error(`Producto no encontrado: ${mensajeError}`);
      case 409:
        throw new Error(`Conflicto: ${mensajeError}`);
      default:
        throw new Error(mensajeError);
    }
  }

  // Retorna la respuesta 200 tipada correctamente
  return response.json();
}