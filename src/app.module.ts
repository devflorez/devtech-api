import { Module } from '@nestjs/common';
import { ProductController } from './infrastructure/adapters/controllers/product.controller';
import { GetAllProductsUseCase } from './application/use-cases/get-all-products.use-case';
import { GetProductBySlugUseCase } from './application/use-cases/get-product-by-slug.use-case';
import { GetFeaturedProductsUseCase } from './application/use-cases/get-featured-products.use-case';
import { DatabaseModule } from './infrastructure/config/database.module';
import { ProductPort } from './application/ports/product.port';

@Module({
  imports: [DatabaseModule],
  controllers: [ProductController],
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
  ],
})
export class AppModule {}
