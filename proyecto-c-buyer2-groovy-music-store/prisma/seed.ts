import { PrismaClient } from '@prisma/client';
import {
  SELLER_ID,
  BUYERS,
  DIRECCIONES,
  PRODUCTOS,
  ORDENES,
  ENVIO_IDS,
} from './contrato-datos';

const prisma = new PrismaClient();

// estado_global del contrato -> Orden.estado real de Buyer.
// Usamos los strings literales que esta app YA acepta en sus propios webhooks
// (payment-status y shipping-status) — no el enum EstadoOrden a secas: para
// "despachado / en preparación logística" el webhook de shipping-status espera
// literalmente "Pendiente de envio", no "Envío en preparación" como dice
// definitions.ts. Quedaron desalineados entre sí; usamos el que valida la ruta real.
const MAPA_ESTADO: Record<string, string> = {
  RESERVADO: "Procesando",
  PAGO_FALLIDO: "Pago Rechazado",
  PREPARANDO_PENDIENTE: "Pago Aprobado",
  PREPARANDO: "Pago Aprobado",
  LISTO_PARA_ENVIO: "Pago Aprobado",
  ENVIADO_EN_PREPARACION: "Pendiente de envio",
  EN_CAMINO: "En camino",
  ENTREGADO: "Entregado",
};

async function main() {
  console.log("🌱 Iniciando seed de Buyer...");

  await prisma.itemOrden.deleteMany();
  await prisma.orden.deleteMany();
  await prisma.itemCarrito.deleteMany();
  await prisma.carrito.deleteMany();
  await prisma.direccion.deleteMany();
  await prisma.usuario.deleteMany();

  console.log("✓ Tablas limpiadas");

  // ─── Usuarios + direcciones ────────────────────────────────────────────
  const direccionPorBuyer: Record<string, string> = {};

  for (const buyer of BUYERS) {
    await prisma.usuario.create({
      data: {
        clerk_id: buyer.id,
        nombre: buyer.nombre,
        mail: buyer.mail,
        // Uno de los compradores de fondo queda ya suspendido, para que el
        // Control Plane (PATCH /api/users/:id) tenga algo real para reactivar,
        // además de poder suspender a otro en vivo durante la demo.
        activo: buyer.id !== "user_mock_buyer_006",
      },
    });

    const dir = DIRECCIONES[buyer.id];
    const direccion = await prisma.direccion.create({
      data: {
        clerk_id: buyer.id,
        calle: dir.calle,
        ciudad: dir.ciudad,
        provincia: dir.provincia,
        cod_postal: dir.cod_postal,
        pais: dir.pais,
      },
    });
    direccionPorBuyer[buyer.id] = direccion.id;
  }

  console.log(`✓ ${BUYERS.length} usuarios creados (1 suspendido: user_mock_buyer_006)`);

  // ─── Carrito de ejemplo para el buyer real (demo en vivo) ───────────────
  const buyerReal = BUYERS.find((b) => b.real)!;
  const prod1 = PRODUCTOS.find((p) => p.titulo === "A Love Supreme")!;
  const prod2 = PRODUCTOS.find((p) => p.titulo === "Goodbye Yellow Brick Road")!;

  await prisma.carrito.create({
    data: {
      clerk_id: buyerReal.id,
      items: {
        create: [
          { producto_id: prod1.id, cantidad: 1, id_seller: SELLER_ID },
          { producto_id: prod2.id, cantidad: 2, id_seller: SELLER_ID },
        ],
      },
    },
  });

  console.log("✓ Carrito de ejemplo creado para el buyer real");

  // ─── Órdenes, a partir del mismo libro de órdenes que usa Seller ────────
  let creadas = 0;

  for (const orden of ORDENES) {
    const fecha = new Date(Date.now() - orden.dias_atras * 86_400_000);

    // empresa_envio: el checkout real siempre lo fija en "Logística Standard"
    // y nada lo actualiza después (gap de wiring, no es algo que rompamos
    // nosotros). Para la demo, una vez que la orden tiene un envío real en
    // Shipping, mostramos la empresa real para que coincida con lo que se ve
    // ahí — si no, antes de despachar, se queda en el valor real de checkout.
    const empresaEnvio = ENVIO_IDS[orden.id] ? orden.empresa_envio : "Logística Standard";

    await prisma.orden.create({
      data: {
        nro_orden: orden.id,
        monto: orden.monto_total,
        estado: MAPA_ESTADO[orden.estado_global],
        fecha,
        empresa_envio: empresaEnvio,
        id_buyer: orden.buyer_id,
        id_seller: SELLER_ID,
        id_direccion: direccionPorBuyer[orden.buyer_id],
        items: {
          create: orden.items.map((it) => ({
            producto_id: it.product_id,
            cantidad: it.cantidad,
            precio_unit: it.precio_unit,
          })),
        },
      },
    });
    creadas++;
  }

  console.log(`✓ ${creadas} órdenes creadas`);

  // ─── Resumen ──────────────────────────────────────────────────────────
  const porEstado = await prisma.orden.groupBy({ by: ["estado"], _count: { _all: true } });
  const totalGastado = await prisma.orden.aggregate({ _sum: { monto: true } });

  console.log("");
  console.log("📊 Resumen del seed:");
  console.log(`   Usuarios:  ${BUYERS.length}`);
  console.log(`   Órdenes:   ${creadas}`);
  for (const g of porEstado) console.log(`     - ${g.estado}: ${g._count._all}`);
  console.log(`   Monto total acumulado: $${(totalGastado._sum.monto ?? 0).toLocaleString("es-AR")}`);
  console.log("");
  console.log("✅ Seed completado. Login real: buyer+clerktest@iaw.com");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });