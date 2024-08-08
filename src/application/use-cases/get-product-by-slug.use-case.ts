import { ProductPort } from '../ports/product.port';
import { Product } from '../../domain/entities/product.entity';

export class GetProductBySlugUseCase {
  constructor(private readonly productPort: ProductPort) {}

  async execute(slug: string): Promise<Product | null> {
    return this.productPort.getProductBySlug(slug);
  }
}
