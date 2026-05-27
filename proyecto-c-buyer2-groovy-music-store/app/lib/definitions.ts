//buyer app

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


//seller app

export type Product = {
  id: string;
  titulo: string; 
  descripcion?: string; //ver si hac al final hace falta o no
  artista: string;
  precio: number;
  stock: number;
  formato: string;
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


// Shipping app
export type ShippingEstimate = {
  costo: number;
  fechaEntregaEstimada: number;
};

export type EstadoEnvio = 'pendiente' | 'en_transito' | 'entregado' | 'cancelado';

export interface ShipmentResponse {
    id: string;
    codigoSeguimiento: string;
    estado: EstadoEnvio;
    fechaEntregaEstimada: string;
}

