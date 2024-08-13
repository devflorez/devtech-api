import { Product } from '../entities/product.entity';

export interface ProductRepository {
  getAllProducts(
    page: number,
    limit: number,
    search?: string,
  ): Promise<{ products: Product[]; total: number }>;
  getProductBySlug(slug: string): Promise<Product | null>;
  getFeaturedProducts(): Promise<Product[]>;
  getProductById(id: number): Promise<Product | null>;
  updateStockProduct(
    productId: number,
    quantity: number,
    type: 'increment' | 'decrement',
  ): Promise<Product>;
}
