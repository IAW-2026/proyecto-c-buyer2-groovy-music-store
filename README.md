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
(Este comando limpia la base de datos en Neon y carga los usuarios, órdenes, productos y carritos necesarios para la demo).

Tip: Si deseas limpiar y reiniciar la base de datos completamente, puedes usar: pnpm run db:fresh

5. **Iniciar el servidor de desarrollo:**

pnpm run dev

## Descripción del proyecto
Buyer App es la interfaz dedicada a los compradores dentro de nuestro ecosistema. Desarrollada con Next.js, utiliza una base de datos PostgreSQL alojada en Neon y gestionada mediante Prisma ORM. El objetivo principal de la app es ofrecer una experiencia fluida para la búsqueda de productos, gestión del carrito de compras, visualización del historial de transacciones y seguimiento de pedidos.

La aplicación cuenta con su propia API REST y es dueña absoluta de sus datos. Además, integra un panel de administración completo donde los usuarios autorizados pueden gestionar el catálogo y visualizar reportes relevantes del sistema.

## Notas para la corrección
**Aislamiento y Mocks**: Cumpliendo con los requisitos de la Etapa 2, la aplicación funciona de forma completamente independiente. Las llamadas a otras webapps del ecosistema han sido mockeadas o simuladas respetando los contratos definidos en la Etapa 1.

**Consumo de API Externa**: Se integraran las APIs de las otras webapps en la Etapa 3.

**Arquitectura**: Este proyecto implementa una capa de servicios (lib/services/) para gestionar datos externos de forma limpia, manteniendo una persistencia transaccional propia en Neon mediante Prisma.

**Datos de prueba**: El script de seed fue diseñado específicamente para garantizar que haya suficientes datos (búsqueda, paginación, historiales) para evaluar todas las funcionalidades sin necesidad de carga manual previa.
