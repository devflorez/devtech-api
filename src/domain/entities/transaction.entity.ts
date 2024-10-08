import { ProductTransactionDto } from './product-transaction.entity';
import { IsArray, IsNotEmpty, IsNumber, ValidateNested } from 'class-validator';
import { CustomerDto } from './customer.entity';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { ShipmentBodyDto } from './shipment.entity';
import { Product } from './product.entity';
import { of } from 'rxjs';

export class TransactionBodyDto {
  @ValidateNested()
  @Type(() => CustomerDto)
  @ApiProperty({
    example: {
      name: 'John Doe',
      email: 'me@email.com',
      phoneNumber: '3012345678',
    },
  })
  customer: CustomerDto;

  @ValidateNested({ each: true })
  @Type(() => ProductTransactionDto)
  @IsArray()
  @ApiProperty({
    example: [
      {
        productId: 1,
        quantity: 1,
      },
    ],
  })
  productTransactions: ProductTransactionDto[];

  @ValidateNested({ each: true })
  @Type(() => ShipmentBodyDto)
  @ApiProperty({
    example: {
      address: '123 Main St',
      city: 'Springfield',
      state: 'IL',
      postalCode: '62701',
      country: 'USA',
    },
  })
  shipment: ShipmentBodyDto;

  @IsNumber()
  @IsNotEmpty()
  total: number;
}

export class TransactionDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductTransactionDto)
  productTransactions: ProductTransactionDto[];

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    example: 1,
  })
  customerId: number;

  @IsNumber()
  @IsNotEmpty()
  total: number;
}

export class Transaction {
  constructor(
    public id: number,
    public customerId: number,
    public quantity: number,
    public total: number,
    public status: string,
    public productTransactions: { productId: number; quantity: number,
      product: {
        name: string,
        imageUrl: string,
        price: number,
      }
     }[],
    public paymentId?: number | null,
  ) {}
}
