import { Test, TestingModule } from '@nestjs/testing';
import { PrismaProductRepository } from './prisma-product.repository';
import { PrismaClient } from '@prisma/client';
import { Product } from '../../../domain/entities/product.entity';

describe('PrismaProductRepository', () => {
  let repository: PrismaProductRepository;
  let prisma: PrismaClient;

  const mockPrismaClient = {
    product: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      count: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PrismaProductRepository,
        { provide: PrismaClient, useValue: mockPrismaClient },
      ],
    }).compile();

    repository = module.get<PrismaProductRepository>(PrismaProductRepository);
    prisma = module.get<PrismaClient>(PrismaClient);
  });

  it('should find all products with pagination and search', async () => {
    const products = [
      {
        id: 1,
        name: 'Product 1',
        shortDescription: 'Short description 1',
        description: 'Description 1',
        price: 100,
        stock: 10,
        imageUrl: 'imageUrl1',
        imageAltText: 'imageAltText1',
        slug: 'slug1',
        isFeatured: true,
      },
      {
        id: 2,
        name: 'Product 2',
        shortDescription: 'Short description 2',
        description: 'Description 2',
        price: 200,
        stock: 20,
        imageUrl: 'imageUrl2',
        imageAltText: 'imageAltText2',
        slug: 'slug2',
        isFeatured: false,
      },
    ];
    const total = 2;

    mockPrismaClient.product.findMany.mockResolvedValue(products);
    mockPrismaClient.product.count.mockResolvedValue(total);

    const result = await repository.getAllProducts(1, 10, 'Product');

    expect(result).toEqual({
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
    });
    expect(prisma.product.findMany).toHaveBeenCalledWith({
      skip: 0,
      take: 10,
      where: {
        OR: [
          { name: { contains: 'Product' } },
          { description: { contains: 'Product' } },
          { price: {} },
        ],
      },
    });
    expect(prisma.product.count).toHaveBeenCalledWith({
      where: {
        OR: [
          { name: { contains: 'Product' } },
          { description: { contains: 'Product' } },
          { price: {} },
        ],
      },
    });
  });

  it('should find product by slug', async () => {
    const product = {
      id: 1,
      name: 'Product 1',
      shortDescription: 'Short description 1',
      description: 'Description 1',
      price: 100,
      stock: 10,
      imageUrl: 'imageUrl1',
      imageAltText: 'imageAltText1',
      slug: 'slug1',
      isFeatured: true,
    };

    mockPrismaClient.product.findUnique.mockResolvedValue(product);

    const result = await repository.getProductBySlug('slug1');

    expect(result).toEqual(
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
    expect(prisma.product.findUnique).toHaveBeenCalledWith({
      where: { slug: 'slug1' },
    });
  });

  it('should find featured products', async () => {
    const products = [
      {
        id: 1,
        name: 'Product 1',
        shortDescription: 'Short description 1',
        description: 'Description 1',
        price: 100,
        stock: 10,
        imageUrl: 'imageUrl1',
        imageAltText: 'imageAltText1',
        slug: 'slug1',
        isFeatured: true,
      },
      {
        id: 2,
        name: 'Product 2',
        shortDescription: 'Short description 2',
        description: 'Description 2',
        price: 200,
        stock: 20,
        imageUrl: 'imageUrl2',
        imageAltText: 'imageAltText2',
        slug: 'slug2',
        isFeatured: false,
      },
    ];

    mockPrismaClient.product.findMany.mockResolvedValue(products);

    const result = await repository.getFeaturedProducts();

    expect(result).toEqual(
      products.map(
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
    );
    expect(prisma.product.findMany).toHaveBeenCalledWith({
      where: { isFeatured: true },
    });
  });
});
