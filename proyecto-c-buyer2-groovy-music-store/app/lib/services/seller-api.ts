import { ProductSummary, Product, CatalogResponse, SellerInfoResponse, SellerSummary } from '../definitions';
import { ReservePayload, ReserveResponse } from '../definitions';
import { SignJWT } from 'jose';

const SELLER_API_URL = process.env.NEXT_PUBLIC_SELLER_API_URL;

// ============================================================================
// FUNCIONES AUXILIARES
// ============================================================================

// Función asincrónica para firmar el token con jose
// Acepta un payload personalizado (necesario para reservarStock), si no, usa uno por defecto.
async function generarToken(customPayload: any = { origin: 'buyer-app' }) {
    if (!process.env.SELLER_JWT_SECRET) {
        throw new Error("Falta configurar SELLER_JWT_SECRET en las variables de entorno");
    }
    
    const secret = new TextEncoder().encode(process.env.SELLER_JWT_SECRET);
    const alg = 'HS256';

    const token = await new SignJWT(customPayload)
        .setProtectedHeader({ alg })
        .setIssuedAt()
        .setExpirationTime('5m') // Expira en 5 minutos
        .sign(secret);

    return token;
}

// ============================================================================
// APIS PÚBLICAS (Sin Token)
// ============================================================================

// 1. Obtener catálogo de productos
export async function getCatalog(params: {
    page?: number;
    limit?: number;
    query?: string;
    formato?: string;
}) {
    const { page = 1, limit = 24, query = "", formato } = params;

    try {
        const url = new URL(`${SELLER_API_URL}/api/products`);
        
        url.searchParams.append('pagina', page.toString());
        url.searchParams.append('limite', limit.toString());
        
        if (query) {
            url.searchParams.append('busqueda', query);
        }

        if (formato && formato !== 'TODO') {
            let formatoAPI = formato;
            const formatLower = formato.toLowerCase();
            
            if (formatLower === 'cds') formatoAPI = 'CD';
            if (formatLower === 'vinilos') formatoAPI = 'VINILO';
            if (formatLower === 'cassettes') formatoAPI = 'CASSETTE';
            
            url.searchParams.append('formato', formatoAPI);
        }

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

        const jsonResponse: CatalogResponse = await response.json();

        const paginatedData: ProductSummary[] = (jsonResponse.datos || []).map((p) => ({
            id: p.id,
            titulo: p.titulo,
            artista: p.artista,
            precio: p.precio,
            stock: p.stock,
            seller_id: p.seller_id,
            imagen_principal: p.imagenes?.[0] || '', 
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

// 2. Obtener detalle reducido de producto para carrito y checkout
export async function getProductQuickDetail(id: string): Promise<ProductSummary | null> {
    try {
        const url = `${SELLER_API_URL}/api/products/${id}`;
        
        const response = await fetch(url, {
            method: 'GET',
            headers: { 
                'Content-Type': 'application/json'
            },
            next: { revalidate: 10 } 
        });

        if (!response.ok) return null;

        const data = await response.json(); 

        const summary: ProductSummary = {
            id: data.id,
            titulo: data.título || data.titulo || 'Sin título', 
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

// 3. Obtener detalle de producto para vista detallada
export async function getFullProduct(id: string): Promise<Product | null> {
    try {
        const url = `${SELLER_API_URL}/api/products/${id}`;
        
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            next: { revalidate: 10 } 
        });

        if (!response.ok) {
            if (response.status === 404) {
                return null;
            }
            throw new Error(`Error HTTP de la Seller App: ${response.status}`);
        }
        
        const data = await response.json();

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
        return null; 
    }
}

// 4. Obtener un lote de productos 
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

// ============================================================================
// APIS PRIVADAS (Requieren Token JWT)
// ============================================================================

// 5. Obtener información resumida del vendedor
export async function getSellerInfo(sellerId: string): Promise<SellerSummary | null> {
    if (!sellerId) return null;

    try {
        const token = await generarToken({ origen: 'buyer_app' });

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

// 6. Reservar stock
export async function reservarStock(payload: ReservePayload): Promise<ReserveResponse> {
  const token = await generarToken({ seller_id: payload.seller_id });

  const response = await fetch(`${SELLER_API_URL}/api/orders/reserve`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: "Error desconocido en el servidor externo" }));
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

  return response.json();
}

// 7. Confirmar la orden 
export async function confirmarOrden(payload: {
  order_id: string;
  buyer_id: string;
  seller_id: string;
  items: Array<{ producto_id: string; cantidad: number; precio_unit: number }>;
  direccion_envio?: { calle: string; ciudad: string; provincia: string; cod_postal: string; pais: string };
}) {
  const token = await generarToken();

  const response = await fetch(`${SELLER_API_URL}/api/orders/confirm`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}` 
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Error al confirmar la orden en el servidor externo');
  }

  return await response.json();
}

// 8. Liberar la orden
export async function liberarStock(payload: {
  order_id: string;
  items: Array<{ producto_id: string; cantidad: number }>;
}) {
  const token = await generarToken();

  const response = await fetch(`${SELLER_API_URL}/api/orders/release`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}` 
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Error al liberar el stock en el servidor externo');
  }

  return await response.json();
}