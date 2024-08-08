import { Module } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaProductRepository } from '../adapters/repositories/prisma-product.repository';

@Module({
  providers: [
    PrismaClient,
    {
      provide: 'ProductPort',
      useClass: PrismaProductRepository,
    },
  ],
  exports: ['ProductPort'],
})
export class DatabaseModule {}
