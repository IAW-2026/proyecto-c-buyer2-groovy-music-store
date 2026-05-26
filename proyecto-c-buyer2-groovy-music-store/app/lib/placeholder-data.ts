import { Product, ProductSummary, ShippingEstimate } from './definitions';

//SELLER APP
export const mockProducts: Product[] = [
  // --- VENDEDOR: clerk_123 ---
  {
    id: '123e4567-e89b-12d3-a456-426614174009',
    titulo: 'The Beatles 1967-1970 (2023 Limited Edition) - 3LP Blue Vinyl',
    descripcion: 'La colección 3LP ahora incluye 37 pistas, 6 de las cuales tienen nuevas mezclas para 2023. Las 9 pistas recién agregadas al conjunto se recopilan en su tercer LP. Un encarte contiene nuevas notas de portada del periodista y autor John Harris. Tanto para los fans actuales como para las generaciones futuras, la nueva colección 1966 - 1970 es una alegre celebración del legado musical atemporal de los Beatles.',
    artista: 'The Beatles',
    precio: 95410, 
    stock: 8,
    formato: 'Vinilo LP',
    condicion: 'Nuevo',
    genero: 'Rock',
    imagenes: ['/images/products/beatles-blue-vinyl.jpg'],
    seller_id: { id: 'clerk_123' },
  },
  {
    id: '123e4567-e89b-12d3-a456-426614174010',
    titulo: 'THE LIFE OF A SHOWGIRL: SWEAT AND VANILLA PERFUME PORTOFINO ORANGE GLITTER VINILO',
    descripcion: '12 TRACKS. VINILO PORTOFINO ORANGE GLITTER (Vinilo naranja translúcido con purpurina dorada). FUNDA DOBLE COLECCIONABLE con portada y contraportada únicas. Fotografía de Taylor a tamaño completo en la funda. Panel desplegable de doble cara adjunto a la carátula desplegable que incluye un poema único escrito por Taylor en una cara y una tira de fotos con 4 fotos únicas en la otra cara. Fundas de álbum coleccionables que incluyen fotos inéditas y letras del álbum.',
    artista: 'Taylor Swift',
    precio: 97900, 
    stock: 10,
    formato: 'Vinilo LP',
    condicion: 'Nuevo',
    genero: 'Pop',
    
    imagenes: [
        '/images/products/swift-showgirl-1.jpg',
        '/images/products/swift-showgirl-2.jpg',
        '/images/products/swift-showgirl-3.jpg',
        '/images/products/swift-showgirl-4.jpg'
    ],
    seller_id: { id: 'clerk_123' },
  },
  {
    id: '123e4567-e89b-12d3-a456-426614174014',
    titulo: '4LP COLOR CON POSTER  UN DIA NORMAL (20th Anniversary - Demos with Commentary)',
    descripcion: 'Celebra el 20 aniversario del álbum icónico de Juanes con esta exclusiva edición de 4LP de vinilos a color remasterizados y extendidos. Incluye un póster de 12 x 24" del arte oficial. Como declaró Juanes: "Un día normal fue un álbum muy importante para mi carrera, marcó la expansión internacional de mi música y me permitió comenzar a viajar por todo el mundo".',
    artista: 'Juanes',
    precio: 45500, 
    stock: 0, 
    formato: 'Vinilo LP',
    condicion: 'Nuevo',
    genero: 'Pop Latino',
    imagenes: [
        '/images/products/juanes-un-dia-normal.jpg'
    ],
    seller_id: { id: 'clerk_123' },
  },

  // --- VENDEDOR: clerk_456 ---
 {
    id: '123e4567-e89b-12d3-a456-426614174011',
    titulo: 'Soda Stereo - Canción Animal (Vinilo Original 1990)',
    descripcion: 'Edición original de época (1990). La tapa de cartón presenta un leve desgaste en los bordes debido al paso del tiempo, pero se mantiene entera (Calificación VG+). El disco de vinilo está impecable, sin rayas profundas, saltos ni ruidos de fritura molestos (Calificación EX). Incluye el inserto original con las letras de las canciones. Una verdadera pieza de colección.',
    artista: 'Soda Stereo',
    precio: 55000, 
    stock: 1, 
    formato: 'Vinilo LP',
    condicion: 'Usado', 
    genero: 'Rock',
    imagenes: ['/images/products/soda-cancion.jpg'],
    seller_id: { id: 'clerk_456' }, 
  },
  {
    id: '123e4567-e89b-12d3-a456-426614174015',
    titulo: 'MAYHEM - CD Estándar Nacional',
    descripcion: 'MAYHEM CD Estándar. Tracklist: 1. Disease, 2. Abracadabra, 3. Garden of Eden, 4. Perfect Celebrity, 5. Vanish Into You.',
    artista: 'Lady Gaga',
    precio: 16450, 
    stock: 5, 
    formato: 'CD',
    condicion: 'Nuevo',
    genero: 'Pop',
    imagenes: [
        '/images/products/gaga-mayhem-1.jpg',
        '/images/products/gaga-mayhem-2.jpg',
        '/images/products/gaga-mayhem-3.jpg'
    ],
    seller_id: { id: 'clerk_456' },
  },

  // --- VENDEDOR: clerk_789 ---
 {
    id: '123e4567-e89b-12d3-a456-426614174012',
    titulo: '143 - CD Estándar - Importado',
    descripcion: '¡143 ES UNA FIESTA Y TODO EL MUNDO ESTÁ INVITADO! Katy Perry ha lanzado oficialmente una nueva y emocionante era con el esperado sexto álbum de estudio 143. Katy se propuso crear un álbum dance-pop audaz, exuberante y festivo con la simbólica expresión numérica del amor 143 como mensaje principal. El resultado es un regreso sexy y audaz a la forma de la polifacética músico, con un álbum repleto de los himnos pop provocativos, sexys y llenos de fuerza que tanto te gustan. Un álbum con mucho corazón y mucho BPM. ¡Prepárate para explotar! CD estándar. Portada estándar (Nota: Al ser un artículo usado, la caja de acrílico puede presentar leves marcas de roce, pero el disco se reproduce perfectamente).',
    artista: 'Katy Perry',
    precio: 24700, 
    stock: 1, 
    formato: 'CD',
    condicion: 'Usado', 
    genero: 'Pop',
    imagenes: [
        '/images/products/katy-perry-143.jpg'
    ],
    seller_id: { id: 'clerk_789' },
  },
  {
    id: '123e4567-e89b-12d3-a456-426614174016',
    titulo: 'Songs Of A Lost World - Cassette',
    descripcion: "'SONGS OF A LOST WORLD' es el esperado nuevo álbum de The Cure, su 14º álbum de estudio y el primero en 16 años. Fue escrito y arreglado por Robert Smith, producido y mezclado por Robert Smith & Paul Corkett e interpretado por The Cure. El álbum se grabó en los Rockfield Studios de Gales.",
    artista: 'The Cure',
    precio: 18500, 
    stock: 7, 
    formato: 'Cassette',
    condicion: 'Nuevo',
    genero: 'Rock',
    imagenes: [
        '/images/products/the-cure-songs.jpg'
    ],
    seller_id: { id: 'clerk_789' },
  },

  // --- VENDEDOR: clerk_999  ---
  {
    id: '123e4567-e89b-12d3-a456-426614174013',
    titulo: "Man's Best Friend Cassette Estándar",
    descripcion: "'Man's Best Friend' es el último álbum de la multifacética estrella del pop internacional Sabrina Carpenter. Tras su proyecto ganador del GRAMMY, Short n' Sweet, y numerosos sencillos multiplatino, el nuevo álbum de Carpenter incluye su nuevo sencillo 'Manchild', ya disponible. Edición limitada. Especificaciones: Cassette estándar azul claro.",
    artista: 'Sabrina Carpenter',
    precio: 25500, 
    stock: 12, 
    formato: 'Cassette',
    condicion: 'Nuevo', 
    genero: 'Pop',
    imagenes: [
        '/images/products/sabrina-mans-best-friend.jpg'
    ],
    seller_id: { id: 'clerk_999' },
  },
];

// Para el carrito y el checkout
export const detallesProductosMock = mockProducts.reduce((acc, product) => {
  acc[product.id] = {
    id: product.id,
    titulo: product.titulo,
    artista: product.artista,
    precio: product.precio,
    stock: product.stock,                  
    seller_id: product.seller_id,          
    imagen_principal: product.imagenes[0], 
  };
  return acc;
}, {} as Record<string, ProductSummary>);

// Para el catálogo
export const mockProductSummaries: ProductSummary[] = mockProducts.map((product) => ({
  id: product.id,
  titulo: product.titulo,
  artista: product.artista,
  precio: product.precio,
  stock: product.stock,                 
  seller_id: product.seller_id,
  imagen_principal: product.imagenes[0],
}));


//SHIPPING APP
export const simularCalculoEnvio = (
  origen_cp: string, 
  destino_cp: string, 
  peso: number
): ShippingEstimate => {
  return {
    costo: 5500, 
    fechaEntregaEstimada: 3
  };
};