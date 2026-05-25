
export type Product = {
  id: string; // Unificamos a UUID (string)
  titulo: string;
  artista: string;
  precio: number;
  stock: number;
  formato: string;
  condicion: string;
  genero: string;
  imagenes: string[]; // Unificamos a arreglo de strings
  seller_id: string;  // Unificamos el nombre del campo para el Seller
};

export type ProductSummary = Pick<Product, 'id' | 'titulo' | 'artista' | 'precio'> & {
  imagen_principal: string; // Adaptamos para UI rápida
};


export type HydratedCartItem = {
  id_carrito: string;
  producto_id: string;
  cantidad: number;
  producto: Product; 
};