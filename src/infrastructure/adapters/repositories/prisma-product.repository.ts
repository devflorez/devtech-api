import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { Product } from '../../../domain/entities/product.entity';
import { ProductRepository } from '../../../domain/repositories/product.repository';
import { ProductPort } from '../../../application/ports/product.port';

@Injectable()
export class PrismaProductRepository implements ProductRepository, ProductPort {
  constructor(private readonly prisma: PrismaClient) {}

  async getAllProducts(
    page: number,
    limit: number,
    search?: string,
  ): Promise<{ products: Product[]; total: number }> {
    const skip = (page - 1) * limit;
    const where: any = {};

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { description: { contains: search } },
        {
          price: {
            equals: isNaN(parseFloat(search)) ? undefined : parseFloat(search),
          },
        },
      ];
    }

    const products = await this.prisma.product.findMany({
      skip,
      take: +limit,
      where,
    });

    const total = await this.prisma.product.count({ where });

    return {
      products: products.map(
        (product) =>
          new Product(
            product.id,
            product.name,
            product.shortDescription,
            product.description,
            product.price,
            product.stock,
            product.imageUrl,
            product.imageAltText,
            product.slug,
            product.isFeatured,
          ),
      ),
      total,
    };
  }

  async getProductBySlug(slug: string): Promise<Product | null> {
    const product = await this.prisma.product.findUnique({
      where: { slug },
      include: {
        images: true,
      },
    });

    if (!product) return null;
    return new Product(
      product.id,
      product.name,
      product.shortDescription,
      product.description,
      product.price,
      product.stock,
      product.imageUrl,
      product.imageAltText,
      product.slug,
      product.isFeatured,
      product.images,
    );
  }

  async getFeaturedProducts(): Promise<Product[]> {
    const products = await this.prisma.product.findMany({
      where: { isFeatured: true },
    });
    return products.map(
      (product) =>
        new Product(
          product.id,
          product.name,
          product.shortDescription,
          product.description,
          product.price,
          product.stock,
          product.imageUrl,
          product.imageAltText,
          product.slug,
          product.isFeatured,
        ),
    );
  }

  async getProductById(id: number): Promise<Product | null> {
    const product = await this.prisma.product.findUnique({
      where: { id },
    });

    if (!product) return null;
    return new Product(
      product.id,
      product.name,
      product.shortDescription,
      product.description,
      product.price,
      product.stock,
      product.imageUrl,
      product.imageAltText,
      product.slug,
      product.isFeatured,
    );
  }

  async updateStockProduct(
    productId: number,
    quantity: number,
    type: 'increment' | 'decrement' = 'increment',
  ): Promise<Product> {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) return null;

    const newStock =
      type === 'increment'
        ? product.stock + quantity
        : product.stock - quantity;

    if (newStock < 0) {
      throw new Error('Stock cannot be negative');
    }

    return this.prisma.product.update({
      where: { id: productId },
      data: { stock: newStock },
    });
  }
}
