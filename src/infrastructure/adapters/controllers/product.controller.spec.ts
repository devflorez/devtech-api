import { Test, TestingModule } from '@nestjs/testing';
import { ProductController } from './product.controller';
import { GetAllProductsUseCase } from '../../../application/use-cases/get-all-products.use-case';
import { GetProductBySlugUseCase } from '../../../application/use-cases/get-product-by-slug.use-case';
import { GetFeaturedProductsUseCase } from '../../../application/use-cases/get-featured-products.use-case';
import { Product } from '../../../domain/entities/product.entity';

describe('ProductController', () => {
  let controller: ProductController;

  const mockGetAllProductsUseCase = {
    execute: jest.fn(),
  };

  const mockGetProductBySlugUseCase = {
    execute: jest.fn(),
  };

  const mockGetFeaturedProductsUseCase = {
    execute: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductController],
      providers: [
        { provide: GetAllProductsUseCase, useValue: mockGetAllProductsUseCase },
        {
          provide: GetProductBySlugUseCase,
          useValue: mockGetProductBySlugUseCase,
        },
        {
          provide: GetFeaturedProductsUseCase,
          useValue: mockGetFeaturedProductsUseCase,
        },
      ],
    }).compile();

    controller = module.get<ProductController>(ProductController);
  });

  it('should get all products', async () => {
    const result = {
      products: [
        new Product(
          1,
          'Product 1',
          'Short description 1',
          'Description 1',
          100,
          10,
          'imageUrl1',
          'imageAltText1',
          'slug1',
          true,
        ),
        new Product(
          2,
          'Product 2',
          'Short description 2',
          'Description 2',
          200,
          20,
          'imageUrl2',
          'imageAltText2',
          'slug2',
          false,
        ),
      ],
      total: 2,
    };

    mockGetAllProductsUseCase.execute.mockResolvedValue(result);

    expect(await controller.getAllProducts(1, 10)).toEqual(result);
  });

  it('should get product by slug', async () => {
    const result = new Product(
      1,
      'Product 1',
      'Short description 1',
      'Description 1',
      100,
      10,
      'imageUrl1',
      'imageAltText1',
      'slug1',
      true,
    );

    mockGetProductBySlugUseCase.execute.mockResolvedValue(result);

    expect(await controller.getProductBySlug('slug1')).toEqual(result);
  });

  it('should get featured products', async () => {
    const result = [
      new Product(
        1,
        'Product 1',
        'Short description 1',
        'Description 1',
        100,
        10,
        'imageUrl1',
        'imageAltText1',
        'slug1',
        true,
      ),
      new Product(
        2,
        'Product 2',
        'Short description 2',
        'Description 2',
        200,
        20,
        'imageUrl2',
        'imageAltText2',
        'slug2',
        false,
      ),
    ];

    mockGetFeaturedProductsUseCase.execute.mockResolvedValue(result);

    expect(await controller.getFeaturedProducts()).toEqual(result);
  });
});
