import { ProductPort } from '../ports/product.port';
import { Product } from '../../domain/entities/product.entity';

export class GetProductByIdUseCase {
  constructor(private readonly productPort: ProductPort) {}

  async execute(id: number): Promise<Product | null> {
    return this.productPort.getProductById(id);
  }
}
