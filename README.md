# DevTech API

## Descripción

DevTech API es una aplicación para gestionar productos, clientes, transacciones y envíos, con integración para pagos a través de Wompi. La aplicación está construida utilizando NestJS y Prisma.

[SWAGGER](https://devtech-api.onrender.com/api/docs)

## Estructura del Proyecto

El proyecto sigue una arquitectura hexagonal, separando las preocupaciones de la lógica de negocio, la infraestructura y las interfaces.

### Directorios Principales

- `src/application`: Contiene los casos de uso y puertos (interfaces).
- `src/domain`: Define las entidades del dominio.
- `src/infrastructure`: Contiene adaptadores y la configuración de infraestructura.
- `src/infrastructure/adapters`: Implementaciones de los puertos, servicios de terceros y controladores.
- `src/infrastructure/config`: Configuraciones de módulos y bases de datos.

## Modelos de Prisma

El esquema de Prisma define los modelos para productos, clientes, pagos, transacciones y envíos.

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

```

## Instalación
 - Clona el repositorio
 - Instala las dependencias
 - Configura las variables de entorno
 - Ejecuta las migraciones de Prisma
 - Genera el cliente de Prisma

## Uso
```
npm run start
```