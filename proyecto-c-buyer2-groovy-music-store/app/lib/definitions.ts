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

export type ProductSummary = Pick<Product, 'id' | 'titulo' | 'artista' | 'precio'> & {
  imagen_principal: string; 
};

export type HydratedCartItem = {
  id_carrito: string;
  producto_id: string;
  cantidad: number;
  producto: Product; 
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

