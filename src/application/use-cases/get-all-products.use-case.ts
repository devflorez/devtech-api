import { ProductPort } from '../ports/product.port';
import { Product } from '../../domain/entities/product.entity';

export class GetAllProductsUseCase {
  constructor(private readonly productPort: ProductPort) {}

  async execute(
    page: number,
    limit: number,
    search?: string,
  ): Promise<{ products: Product[]; total: number }> {
    return this.productPort.getAllProducts(page, limit, search);
  }
}
