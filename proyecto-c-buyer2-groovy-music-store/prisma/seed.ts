import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// IDs consistentes con tu placeholder-data
const P_BEATLES = '123e4567-e89b-12d3-a456-426614174009'; // Seller 123
const P_TAYLOR = '123e4567-e89b-12d3-a456-426614174010';  // Seller 123
const P_SODA = '123e4567-e89b-12d3-a456-426614174011';    // Seller 456

async function main() {
  console.log("Limpiando base de datos...");
  await prisma.itemOrden.deleteMany({});
  await prisma.orden.deleteMany({});
  await prisma.itemCarrito.deleteMany({});
  await prisma.carrito.deleteMany({});
  await prisma.direccion.deleteMany({});
  await prisma.usuario.deleteMany({});

  console.log("Comenzando el seeding...");

  // --- USUARIO 1: Buyer (El protagonista de la demo) ---
  const user1 = await prisma.usuario.create({
    data: {
      clerk_id: 'user_3EYEzILbnG1u5nBVAItSCkgSWZ4',
      nombre: 'Buyer',
      mail: 'buyer+clerktest@iaw.com',
    }
  });

  const dir1_casa = await prisma.direccion.create({
    data: {
      clerk_id: user1.clerk_id,
      calle: 'Av. Alem 1234',
      ciudad: 'Bahía Blanca',
      provincia: 'Buenos Aires',
      cod_postal: '8000',
      pais: 'Argentina'
    }
  });

  const dir1_trabajo = await prisma.direccion.create({
    data: {
      clerk_id: user1.clerk_id,
      calle: 'Donado 50',
      ciudad: 'Bahía Blanca',
      provincia: 'Buenos Aires',
      cod_postal: '8000',
      pais: 'Argentina'
    }
  });

  await prisma.carrito.create({
    data: {
      clerk_id: user1.clerk_id,
      items: {
        create: [
          { producto_id: P_BEATLES, cantidad: 1, id_seller: 'clerk_123' },
          { producto_id: P_SODA, cantidad: 1, id_seller: 'clerk_456' }
        ]
      }
    }
  });

  await prisma.orden.createMany({
    data: [
      {
        monto: 95410,
        estado: 'entregado',
        empresa_envio: 'OCA',
        id_buyer: user1.clerk_id,
        id_direccion: dir1_casa.id,
        id_seller: 'clerk_123'
      },
      {
        monto: 97900,
        estado: 'en_transito',
        empresa_envio: 'Andreani',
        id_buyer: user1.clerk_id,
        id_direccion: dir1_trabajo.id,
        id_seller: 'clerk_123'
      },
      {
        monto: 55000,
        estado: 'pendiente',
        empresa_envio: 'Correo Argentino',
        id_buyer: user1.clerk_id,
        id_direccion: dir1_casa.id,
        id_seller: 'clerk_456'
      }
    ]
  });

  // --- USUARIO 2: Juan Perez ---
  const user2 = await prisma.usuario.create({
    data: { clerk_id: 'clerk_123_test', nombre: 'Juan Perez', mail: 'juan@test.com' }
  });
  const dir2 = await prisma.direccion.create({
    data: { clerk_id: user2.clerk_id, calle: 'Calle Falsa 123', ciudad: 'CABA', provincia: 'CABA', cod_postal: '1000', pais: 'Argentina' }
  });
  await prisma.orden.create({
    data: {
      monto: 55000,
      estado: 'entregado',
      empresa_envio: 'OCA',
      id_buyer: user2.clerk_id,
      id_direccion: dir2.id,
      id_seller: 'clerk_456',
      items: { create: [{ producto_id: P_SODA, cantidad: 1, precio_unit: 55000 }] }
    }
  });

  console.log("Seeding finalizado correctamente (sin Admin).");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });