import { Module } from '@nestjs/common';
import { ProductController } from './infrastructure/adapters/controllers/product.controller';
import { GetAllProductsUseCase } from './application/use-cases/get-all-products.use-case';
import { GetProductBySlugUseCase } from './application/use-cases/get-product-by-slug.use-case';
import { GetFeaturedProductsUseCase } from './application/use-cases/get-featured-products.use-case';
import { CreateTransactionUseCase } from './application/use-cases/create-transaction.use-case';
import { UpdateTransactionStatusUseCase } from './application/use-cases/update-transaction-status.use-case';
import { GetTransactionByIdUseCase } from './application/use-cases/get-transaction-by-id.use-case';
import { CreateTokenCardUseCase } from './application/use-cases/create-token-card.use.case';
import { GetAcceptanceTokenUseCase } from './application/use-cases/get-acceptance-token.use.case';
import { DatabaseModule } from './infrastructure/config/database.module';
import { ProductPort } from './application/ports/product.port';
import { TransactionPort } from './application/ports/transaction.port';
import { CustomerPort } from './application/ports/customer.port';
import { PaymentPort } from './application/ports/payment.port';
import { ShipmentPort } from './application/ports/shipment.port';
import { TransactionController } from './infrastructure/adapters/controllers/transaction.controller';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import configuration from './configuration';
import { PaymentController } from './infrastructure/adapters/controllers/payments.controller';
@Module({
  imports: [
    DatabaseModule,
    HttpModule,
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
      envFilePath: ['.env.development.local', '.env.development'],
    }),
  ],
  controllers: [ProductController, TransactionController, PaymentController],
  providers: [
    {
      provide: GetAllProductsUseCase,
      useFactory: (productPort: ProductPort) => {
        return new GetAllProductsUseCase(productPort);
      },
      inject: ['ProductPort'],
    },
    {
      provide: GetProductBySlugUseCase,
      useFactory: (productPort: ProductPort) => {
        return new GetProductBySlugUseCase(productPort);
      },
      inject: ['ProductPort'],
    },
    {
      provide: GetFeaturedProductsUseCase,
      useFactory: (productPort: ProductPort) => {
        return new GetFeaturedProductsUseCase(productPort);
      },
      inject: ['ProductPort'],
    },
    {
      provide: CreateTokenCardUseCase,
      useFactory: (paymentPort: PaymentPort) => {
        return new CreateTokenCardUseCase(paymentPort);
      },
      inject: ['PaymentPort'],
    },
    {
      provide: GetAcceptanceTokenUseCase,
      useFactory: (paymentPort: PaymentPort) => {
        return new GetAcceptanceTokenUseCase(paymentPort);
      },
      inject: ['PaymentPort'],
    },
    {
      provide: CreateTransactionUseCase,
      useFactory: (
        customerPort: CustomerPort,
        transactionPort: TransactionPort,

        shipmentPort: ShipmentPort,
      ) => {
        return new CreateTransactionUseCase(
          customerPort,
          transactionPort,

          shipmentPort,
        );
      },
      inject: [
        'CustomerPort',
        'TransactionPort',
        'PaymentPort',
        'ShipmentPort',
      ],
    },
    {
      provide: UpdateTransactionStatusUseCase,
      useFactory: (transactionPort: TransactionPort) => {
        return new UpdateTransactionStatusUseCase(transactionPort);
      },
      inject: ['TransactionPort'],
    },
    {
      provide: GetTransactionByIdUseCase,
      useFactory: (transactionPort: TransactionPort) => {
        return new GetTransactionByIdUseCase(transactionPort);
      },
      inject: ['TransactionPort'],
    },
  ],
})
export class AppModule {}
