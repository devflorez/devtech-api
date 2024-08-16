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
import { CreatePaymentUseCase } from './application/use-cases/create-payment.use.case';
import { CreateCustomerUseCase } from './application/use-cases/create-customer.use.case';
import { GetCustomerByIdUseCase } from './application/use-cases/get-customer-by-id.use.case';
import { GetShipmentByTransactionIdUseCase } from './application/use-cases/get-shipment-by-transaction-id.use.case';
import { GetPaymentByIdUseCase } from './application/use-cases/get-payment-by-id.use.case';
import { GetPaymentByReferenceUseCase } from './application/use-cases/get-payment-by-reference.use.case';
import { UpdatePaymentStatusUseCase } from './application/use-cases/update-payment-status.use.case';
import { UpdateStockProductUseCase } from './application/use-cases/update-stock-product.use.case';
import { HandleWompiEventUseCase } from './application/use-cases/handle-wompi-event.use.case';
import { CreateShipmentUseCase } from './application/use-cases/create-shipment.use.case';
import { DatabaseModule } from './infrastructure/config/database.module';
import { ProductPort } from './application/ports/product.port';
import { TransactionPort } from './application/ports/transaction.port';
import { CustomerPort } from './application/ports/customer.port';
import { PaymentPort } from './application/ports/payment.port';
import { ShipmentPort } from './application/ports/shipment.port';
import { TransactionController } from './infrastructure/adapters/controllers/transaction.controller';
import { HttpModule, HttpService } from '@nestjs/axios';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from './configuration';
import { PaymentController } from './infrastructure/adapters/controllers/payments.controller';
import { WebhookController } from './infrastructure/adapters/controllers/webhook.controller';
import { WebhookPort } from './application/ports/webhook.port';
import { MailPort } from './application/ports/mail.port';
import { SendMailUseCase } from './application/use-cases/send-mail.use.case';
import { OtherModule } from './infrastructure/config/other.module';
@Module({
  imports: [
    OtherModule,
    DatabaseModule,
    HttpModule,
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
      envFilePath: ['.env.development.local', '.env.development'],
    }),
  ],
  controllers: [
    ProductController,
    TransactionController,
    PaymentController,
    WebhookController,
  ],
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
      provide: CreateCustomerUseCase,
      useFactory: (customerPort: CustomerPort) => {
        return new CreateCustomerUseCase(customerPort);
      },
      inject: ['CustomerPort'],
    },
    {
      provide: GetCustomerByIdUseCase,
      useFactory: (customerPort: CustomerPort) => {
        return new GetCustomerByIdUseCase(customerPort);
      },
      inject: ['CustomerPort'],
    },
    {
      provide: GetShipmentByTransactionIdUseCase,
      useFactory: (shipmentPort: ShipmentPort) => {
        return new GetShipmentByTransactionIdUseCase(shipmentPort);
      },
      inject: ['ShipmentPort'],
    },
    {
      provide: CreateShipmentUseCase,
      useFactory: (shipmentPort: ShipmentPort) => {
        return new CreateShipmentUseCase(shipmentPort);
      },
      inject: ['ShipmentPort'],
    },
    {
      provide: CreatePaymentUseCase,
      useFactory: (
        paymentPort: PaymentPort,
        customerPort: CustomerPort,
        shipmentPort: ShipmentPort,
        transactionPort: TransactionPort,
        configService: ConfigService,
        httpService: HttpService,
      ) => {
        return new CreatePaymentUseCase(
          paymentPort,
          customerPort,
          shipmentPort,
          transactionPort,
          configService,
          httpService,
        );
      },
      inject: [
        'PaymentPort',
        'CustomerPort',
        'ShipmentPort',
        'TransactionPort',
        ConfigService,
        HttpService,
      ],
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
      inject: ['CustomerPort', 'TransactionPort', 'ShipmentPort'],
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
    {
      provide: GetPaymentByIdUseCase,
      useFactory: (paymentPort: PaymentPort) => {
        return new GetPaymentByIdUseCase(paymentPort);
      },
      inject: ['PaymentPort'],
    },
    {
      provide: GetPaymentByReferenceUseCase,
      useFactory: (paymentPort: PaymentPort) => {
        return new GetPaymentByReferenceUseCase(paymentPort);
      },
      inject: ['PaymentPort'],
    },
    {
      provide: UpdatePaymentStatusUseCase,
      useFactory: (paymentPort: PaymentPort) => {
        return new UpdatePaymentStatusUseCase(paymentPort);
      },
      inject: ['PaymentPort'],
    },
    {
      provide: UpdateStockProductUseCase,
      useFactory: (productPort: ProductPort) => {
        return new UpdateStockProductUseCase(productPort);
      },
      inject: ['ProductPort'],
    },
    {
      provide: SendMailUseCase,
      useFactory: (mailPort: MailPort) => {
        return new SendMailUseCase(mailPort);
      },
      inject: ['MailPort'],
    },
    {
      provide: HandleWompiEventUseCase,
      useFactory: (
        webhookPort: WebhookPort,
        transactionPort: TransactionPort,
        paymentPort: PaymentPort,
        productPort: ProductPort,
        mailPort: MailPort,
        customerPort: CustomerPort,
        shipmentPort: ShipmentPort,
      ) => {
        return new HandleWompiEventUseCase(
          webhookPort,
          transactionPort,
          paymentPort,
          productPort,
          mailPort,
          customerPort,
          shipmentPort,
        );
      },
      inject: [
        'WebhookPort',
        'TransactionPort',
        'PaymentPort',
        'ProductPort',
        'MailPort',
        'CustomerPort',
        'ShipmentPort',
      ],
    },
  ],
})
export class AppModule {}
