import { Product, ProductSummary } from './definitions';

// Productos bien detallados, para página de detalle
export const mockProducts: Product[] = [
  // --- VENDEDOR: clerk_123 ---
  {
    id: '123e4567-e89b-12d3-a456-426614174001',
    titulo: 'Groovy Vinyl 1',
    artista: 'Artist A',
    precio: 19.99,
    stock: 5,
    formato: 'Vinilo LP',
    condicion: 'Nuevo',
    genero: 'Rock',
    imagenes: ['/placeholder-record.png'],
    seller_id: 'clerk_123',
  },
  {
    id: '123e4567-e89b-12d3-a456-426614174002',
    titulo: 'Groovy Vinyl 2',
    artista: 'Artist B',
    precio: 24.50,
    stock: 2,
    formato: 'Vinilo 7"',
    condicion: 'Usado',
    genero: 'Jazz',
    imagenes: ['/placeholder-record.png'],
    seller_id: 'clerk_123',
  },
  {
    id: '123e4567-e89b-12d3-a456-426614174004',
    titulo: 'Midnight Echoes',
    artista: 'The Synthetics',
    precio: 12.00,
    stock: 15,
    formato: 'CD',
    condicion: 'Nuevo',
    genero: 'Electrónica',
    imagenes: ['/placeholder-record.png'],
    seller_id: 'clerk_123',
  },

  // --- VENDEDOR: clerk_456 ---
  {
    id: '123e4567-e89b-12d3-a456-426614174003',
    titulo: 'Groovy Vinyl 3',
    artista: 'Artist C',
    precio: 15.00,
    stock: 0,
    formato: 'Cassette',
    condicion: 'Nuevo',
    genero: 'Pop',
    imagenes: ['/placeholder-record.png'],
    seller_id: 'clerk_456',
  },
  {
    id: '123e4567-e89b-12d3-a456-426614174005',
    titulo: 'Urban Poetry',
    artista: 'MC Flow',
    precio: 8.50,
    stock: 4,
    formato: 'Cassette',
    condicion: 'Usado',
    genero: 'Hip-Hop',
    imagenes: ['/placeholder-record.png'],
    seller_id: 'clerk_456',
  },

  // --- VENDEDOR: clerk_789 ---
  {
    id: '123e4567-e89b-12d3-a456-426614174006',
    titulo: 'Acoustic Sessions',
    artista: 'Indie Kids',
    precio: 35.00,
    stock: 1,
    formato: 'Vinilo LP',
    condicion: 'Nuevo',
    genero: 'Indie',
    imagenes: ['/placeholder-record.png'],
    seller_id: 'clerk_789',
  },
  {
    id: '123e4567-e89b-12d3-a456-426614174007',
    titulo: 'Live in Tokyo',
    artista: 'The Rockers',
    precio: 45.00,
    stock: 3,
    formato: 'Vinilo LP',
    condicion: 'Usado',
    genero: 'Rock',
    imagenes: ['/placeholder-record.png'],
    seller_id: 'clerk_789',
  },

  // --- VENDEDOR: clerk_999  ---
  {
    id: '123e4567-e89b-12d3-a456-426614174008',
    titulo: 'Classic Saxophone',
    artista: 'Jazz Master',
    precio: 18.00,
    stock: 0, 
    formato: 'CD',
    condicion: 'Nuevo',
    genero: 'Jazz',
    imagenes: ['/placeholder-record.png'],
    seller_id: 'clerk_999',
  },
];

// Para el carrito y el checkout
export const detallesProductosMock = mockProducts.reduce((acc, product) => {
  acc[product.id] = {
    titulo: product.titulo,
    artista: product.artista,
    precio: product.precio,
    imagen: product.imagenes[0], // Toma la primera imagen del array
  };
  return acc;
}, {} as Record<string, { titulo: string; artista: string; precio: number; imagen: string }>);

// Para el catálogo
export const mockProductSummaries: ProductSummary[] = mockProducts.map((product) => ({
  id: product.id,
  titulo: product.titulo,
  artista: product.artista,
  precio: product.precio,
  imagen_principal: product.imagenes[0],
}));