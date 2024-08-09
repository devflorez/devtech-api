import { Module } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaProductRepository } from '../adapters/repositories/prisma-product.repository';
import { PrismaPaymentRepository } from '../adapters/repositories/prisma-payment.repository';
import { PrismaTransactionRepository } from '../adapters/repositories/prisma-transaction.repository';
import { PrismaShipmentRepository } from '../adapters/repositories/prisma-shipment.repository';
import { PrismaCustomerRepository } from '../adapters/repositories/prisma-customer.repository';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  providers: [
    PrismaClient,
    {
      provide: 'ProductPort',
      useClass: PrismaProductRepository,
    },
    {
      provide: 'PaymentPort',
      useClass: PrismaPaymentRepository,
    },
    {
      provide: 'TransactionPort',
      useClass: PrismaTransactionRepository,
    },
    {
      provide: 'ShipmentPort',
      useClass: PrismaShipmentRepository,
    },
    {
      provide: 'CustomerPort',
      useClass: PrismaCustomerRepository,
    },

  ],
  exports: [
    'ProductPort',
    'PaymentPort',
    'TransactionPort',
    'ShipmentPort',
    'CustomerPort',
  ],
})
export class DatabaseModule {}
