// --- TYPESCRIPT ENUMS ---
export enum FormatoProducto {
  VINILO = 'VINILO',
  CD = 'CD',
  CASSETTE = 'CASSETTE',
  OTRO = 'OTRO'
}

// BUYER APP 
export type Direccion = {
    id: string;
    calle: string;
    ciudad: string;
    provincia: string;
    cod_postal: string;
    pais: string;
};

export type ItemCheckout = ProductSummary & {
  cantidad: number;
};


export enum EstadoOrden {
  PROCESANDO = 'Procesando',
  PAGO_APROBADO = 'Pago Aprobado',
  PAGO_RECHAZADO = 'Pago Rechazado',
  CANCELADO = 'Cancelado',
  EN_PREPARACION='Envío en preparación',
  EN_CAMINO = 'En camino',
  ENTREGADO = 'Entregado'
}
//  SELLER APP
export type Product = {
    id: string;
    titulo: string; 
    descripcion?: string;
    artista: string;
    precio: number;
    stock: number;
    formato: FormatoProducto; 
    condicion: string;
    genero: string;
    imagenes: string[];
    seller_id: { 
        id: string 
    }; 
};

export type ProductSummary = Pick<Product, 'id' | 'titulo' | 'artista' | 'precio' | 'stock' | 'seller_id'> & {
  imagen_principal: string; 
};

export type HydratedCartItem = {
    id_carrito: string;
    producto_id: string;
    cantidad: number;
    producto: ProductSummary; 
};

export type CatalogResponse = {
    datos: Product[];
    paginacion: {
        pagina: number;
        limite: number;
        total: number;
        totalPaginas: number;
    };
};

export interface ReserveItemPayload {
  producto_id: string;
  cantidad: number;
  precio_unit: number;
}

export interface ReservePayload {
  order_id: string;
  buyer_id: string;
  seller_id: string;
  items: ReserveItemPayload[];
}


export interface ReserveResponse {
  estado: string;
  items: Array<{
    producto_id: string;
    titulo: string;
    stockRestante: number;
  }>;
}

export interface SellerInfoResponse {
  datos: {
    id: string;
    nombre_fantasia: string;
    codigo_postal: string;
    ciudad: string;
    fecha_alta: string;
  }
}

export interface SellerSummary {
  nombre_fantasia: string;
  codigo_postal: string;
}

//  SHIPPING APP 
export type ShippingEstimate = {
  costo: number;
  fechaEntregaEstimada: string;
};

export type EstadoEnvio = 'pendiente' | 'en_transito' | 'entregado' | 'cancelado';

export interface ShipmentResponse {
    id: string;
    codigoSeguimiento: string;
    estado: EstadoEnvio;
    fechaEntregaEstimada: string;
    empresa?: {
        id: string;
        nombre: string;
    };
}

//PAYMENTS APP
export interface CheckoutPayload {
    order_id: string;
    buyer_id: string;
    seller_id: string; 
    costoEnvio: number;
    monto_total: number;
}

export interface PaymentServiceResult {
    success: boolean;
    data?: {
        transaccion_id: number;
        init_point: string;
    };
    error?: string;
}