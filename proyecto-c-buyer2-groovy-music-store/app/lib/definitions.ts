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
}