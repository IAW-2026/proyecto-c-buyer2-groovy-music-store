# Buyer App

[🔗 https://proyecto-c-buyer2-groovy-music-store.vercel.app/ ]

## Usuarios disponibles para pruebas

Para evaluar la plataforma y el panel de administración, puedes utilizar las siguientes credenciales (gestionadas vía Clerk):

* **Usuario Administrador:**
    * Email: `admin_buyer+clerk_test@iaw.com` 
    * Contraseña: `iawuser#` 
* **Usuario Comprador (Cliente):**
    * Email: `buyer+clerk_test@iaw.com` 
    * Contraseña: `iawuser#` 

## Instrucciones de uso y evaluación

La aplicación en producción ya cuenta con datos relevantes precargados para su evaluación inmediata. 

Para levantar el entorno de desarrollo local, el proyecto cuenta con scripts automatizados a prueba de errores:

1. **Instalar dependencias:**
   
   pnpm install

2. **Variables de entorno:**

Copiar el archivo .env.example a .env.local y completar las variables necesarias, incluyendo la DATABASE_URL provista por Neon.

3. **Ejecutar migraciones (Estructura de tablas):**

pnpm run db:migrate

4. **Poblar la base de datos (Datos de demo):**

pnpm run seed
(Este comando limpia la base de datos en Neon y carga los usuarios, órdenes, productos y carritos necesarios para la demo. Se agregó una nueva seed que coincide y está sincronizada con el resto de las apps del ecosistema).

Tip: Si deseas limpiar y reiniciar la base de datos completamente, puedes usar: pnpm run db:fresh

5. **Iniciar el servidor de desarrollo:**

pnpm run dev

## Descripción del proyecto
Buyer App es la interfaz dedicada a los compradores dentro de nuestro ecosistema. Desarrollada con Next.js, utiliza una base de datos PostgreSQL alojada en Neon y gestionada mediante Prisma ORM. El objetivo principal de la app es ofrecer una experiencia fluida para la búsqueda de productos, gestión del carrito de compras, visualización del historial de transacciones y seguimiento de pedidos.

La aplicación cuenta con su propia API REST y es dueña absoluta de sus datos. Además, integra un panel de administración completo donde los usuarios autorizados pueden gestionar el catálogo y visualizar reportes relevantes del sistema.

## Notas para la corrección
**Integración de Aplicaciones**: Las webapps individuales de la Etapa 2 se encuentran debidamente conectadas entre sí. Se reemplazaron los mocks de la etapa anterior por llamadas reales a las APIs de las otras aplicaciones, logrando que los flujos principales del sistema funcionen integrados de punta a punta.

**Flujo Demostrable y Checkout (Mercado Pago)**: El sistema cuenta con un flujo completo de fin a fin demostrable en la defensa que se inicia desde la Buyer App. Para completar el pago de prueba en el checkout de Mercado Pago, utilizar las siguientes credenciales de test:
* **Comprador de test:** `TESTUSER7971489035181850335` (código `965242`)
* **Tarjeta:** `4002 7686 9439 5619` · Nombre: `APRO` · CVV: `123` · Vencimiento: `11/30` · DNI: `12345678` (pago aprobado). 
Nombre: `OTHE` (Pago rechazado)


**Arquitectura**: Este proyecto implementa una capa de servicios (lib/services/) para gestionar datos externos de forma limpia, manteniendo una persistencia transaccional propia en Neon mediante Prisma.

**Datos cargados**: Gracias a la nueva seed unificada, el sistema completo cuenta con datos relevantes precargados (viajes realizados, pedidos en distintos estados, transacciones procesadas) que permiten recorrer y evaluar la plataforma de punta a punta sin necesidad de registrar información manualmente.
