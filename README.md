# DevTech API

## Descripción

evTech API es una aplicación diseñada para gestionar productos, clientes, transacciones y envíos, con integración de pagos a través de Wompi. La aplicación está construida utilizando NestJS y Prisma, y sigue un enfoque modular basado en la arquitectura hexagonal.

[SWAGGER](https://devtech-api.onrender.com/api/docs)

## Estructura del Proyecto
El proyecto sigue una arquitectura hexagonal, que separa las diferentes capas de la aplicación, permitiendo que la lógica de negocio sea independiente de la infraestructura y las interfaces externas. Esto facilita el mantenimiento y escalabilidad del proyecto.

### Directorios Principales

- `src/application`: Contiene los casos de uso y puertos (interfaces), encargados de orquestar la lógica de negocio.
- `src/domain`: Define las entidades del dominio.
- `src/infrastructure`: Aloja los adaptadores, la configuración de infraestructura y las implementaciones concretas de los puertos.
- `src/infrastructure/adapters`: Implementaciones de los puertos, servicios de terceros, y los controladores que manejan las solicitudes HTTP.
- `src/infrastructure/config`: Configuraciones de módulos y bases de datos.

## Modelos de Prisma

El esquema de Prisma se utiliza para definir los modelos de la base de datos, que incluyen productos, clientes, pagos, transacciones y envíos. La base de datos utilizada es SQLite, lo que facilita el desarrollo y las pruebas locales.

```prisma
datasource db {
  provider = "sqlite"
  url      = "file:./dev.db"
}

generator client {
  provider = "prisma-client-js"
}

model Product {
  id                Int          @id @default(autoincrement())
  name              String
  shortDescription  String
  description       String
  price             Int
  stock             Int
  imageUrl          String
  imageAltText      String
  slug              String       @unique
  images            Image[]
  isFeatured        Boolean
  productTransactions ProductTransaction[]
}

model Image {
  id         Int      @id @default(autoincrement())
  url        String
  altText    String
  productId  Int
  product    Product  @relation(fields: [productId], references: [id])
}

model Customer {
  id         Int           @id @default(autoincrement())
  name       String
  email      String        @unique
  phoneNumber String
  transactions Transaction[]
}

model Payment {
  id                    Int           @id @default(autoincrement())
  amount                Int
  reference             String
  currency              String
  status                String
  transactionId         Int           @unique
  transaction           Transaction   @relation(fields: [transactionId], references: [id])
  wompiTransactionId    String?
  token                 String?
  type                  String?
  installments          Int?
}

model Transaction {
  id          Int         @id @default(autoincrement())
  customerId  Int
  paymentId   Int?        @unique
  quantity    Int
  total       Int
  status      String
  createdAt   DateTime    @default(now())
  customer    Customer    @relation(fields: [customerId], references: [id])
  payment     Payment?
  shipment    Shipment?
  productTransactions ProductTransaction[]
}

model Shipment {
  id             Int          @id @default(autoincrement())
  transactionId  Int          @unique
  address        String
  city           String
  state          String
  postalCode     String
  country        String
  status         String       @default("PENDING")
  transaction    Transaction  @relation(fields: [transactionId], references: [id])
}

model ProductTransaction {
  id            Int          @id @default(autoincrement())
  productId     Int
  transactionId Int
  product       Product      @relation(fields: [productId], references: [id])
  transaction   Transaction  @relation(fields: [transactionId], references: [id])
  quantity      Int
}


model Event  {
  id          Int          @id @default(autoincrement())
  type        String
  data        String
}
```

## Instalación
 - Clona el repositorio
 - Instala las dependencias con `yarn install`.
 - Configura las variables de entorno según el archivo `.env.example`
 - Ejecuta las migraciones de Prisma para crear la base de datos y las tablas necesarias: `npx prisma migrate dev`.
 - Genera el cliente de Prisma: `npx prisma generate`.

## Uso
Para iniciar la aplicación, ejecuta:
```
npm run start
```

## Test
Todos los test han sido ejecutados y pasaron con éxito, cubriendo los casos de uso de cada una de las rutas y operaciones críticas de la API. Los tests validan la funcionalidad de los controladores y repositorios, asegurando que la lógica de negocio y la integración con la base de datos funcionen como se espera.