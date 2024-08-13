import { ProductPort } from '../ports/product.port';
import { Product } from 'src/domain/entities/product.entity';
import { BadGatewayException, UnauthorizedException } from '@nestjs/common';

export class UpdateStockProductUseCase {
  constructor(private readonly productPort: ProductPort) {}

  async execute(
    productId: number,
    quantity: number,
    type: 'increment' | 'decrement',
  ): Promise<Product> {
    const product = await this.productPort.getProductById(productId);
    if (!product) {
      throw new BadGatewayException('Product not found');
    }
    return this.productPort.updateStockProduct(productId, quantity, type);
  }
}
