import { Product } from '../../domain/entities/product.entity';

export interface ProductPort {
  getAllProducts(
    page: number,
    limit: number,
    search?: string,
  ): Promise<{ products: Product[]; total: number }>;
  getProductBySlug(slug: string): Promise<Product | null>;
  getProductById(id: number): Promise<Product | null>;
  getFeaturedProducts(): Promise<Product[]>;
  updateStockProduct(
    productId: number,
    quantity: number,
    type: 'increment' | 'decrement',
  ): Promise<Product>;
}
