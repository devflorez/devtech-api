import { ProductPort } from '../ports/product.port';
import { Product } from '../../domain/entities/product.entity';

export class GetFeaturedProductsUseCase {
  constructor(private readonly productPort: ProductPort) {}

  async execute(): Promise<Product[]> {
    return this.productPort.getFeaturedProducts();
  }
}
