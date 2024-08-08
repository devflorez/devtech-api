import { Controller, Get, Param, Query, Version } from '@nestjs/common';
import { ApiQuery, ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { GetAllProductsUseCase } from '../../../application/use-cases/get-all-products.use-case';
import { GetProductBySlugUseCase } from '../../../application/use-cases/get-product-by-slug.use-case';
import { GetFeaturedProductsUseCase } from '../../../application/use-cases/get-featured-products.use-case';
import { Product } from '../../../domain/entities/product.entity';

@ApiTags('products')
@Controller('products')
export class ProductController {
  constructor(
    private readonly getAllProductsUseCase: GetAllProductsUseCase,
    private readonly getProductBySlugUseCase: GetProductBySlugUseCase,
    private readonly getFeaturedProductsUseCase: GetFeaturedProductsUseCase,
  ) {}

  @Version('1')
  @Get()
  @ApiOperation({ summary: 'Get all products' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  @ApiQuery({ name: 'search', required: false, example: 'product' })
  @ApiResponse({
    status: 200,
    description: 'Return all products with pagination',
    example: {
      products: [
        {
          id: 1,
          name: 'Product 1',
          shortDescription: 'Short description',
          description: 'Description',
          price: 100,
          stock: 10,
          imageUrl: 'https://example.com/image.jpg',
          imageAltText: 'Image alt text',
          slug: 'product-1',
          isFeatured: false,
        },
      ],
      total: 1,
    },
  })
  async getAllProducts(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('search') search?: string,
  ): Promise<{ products: Product[]; total: number }> {
    return this.getAllProductsUseCase.execute(page, limit, search);
  }

  @Version('1')
  @Get('featured')
  @ApiOperation({ summary: 'Get featured products' })
  @ApiResponse({
    status: 200,
    description: 'Return featured products',
    example: [
      {
        id: 1,
        name: 'Product 1',
        shortDescription: 'Short description',
        description: 'Description',
        price: 100,
        stock: 10,
        imageUrl: 'https://example.com/image.jpg',
        imageAltText: 'Image alt text',
        slug: 'product-1',
        isFeatured: true,
      },
    ],
  })
  async getFeaturedProducts(): Promise<Product[]> {
    return this.getFeaturedProductsUseCase.execute();
  }

  @Version('1')
  @Get(':slug')
  @ApiOperation({ summary: 'Get product by slug' })
  @ApiResponse({
    status: 200,
    description: 'Return product by slug',
    example: {
      id: 1,
      name: 'Product 1',
      shortDescription: 'Short description',
      description: 'Description',
      price: 100,
      stock: 10,
      imageUrl: 'https://example.com/image.jpg',
      imageAltText: 'Image alt text',
      slug: 'product-1',
      isFeatured: false,
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Product not found',
    example: {
      statusCode: 404,
      message: 'Product not found',
    },
  })
  async getProductBySlug(@Param('slug') slug: string): Promise<Product | null> {
    return this.getProductBySlugUseCase.execute(slug);
  }
}
