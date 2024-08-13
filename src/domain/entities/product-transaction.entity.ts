 import { IsInt, IsPositive } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
export class ProductTransactionDto {
  @IsInt()
  @IsPositive()
  @ApiProperty({
    example: 1,
  })
  @Transform(({ value }) => parseInt(value))
  productId: number;

  @IsInt()
  @IsPositive()
  @ApiProperty({
    example: 1,
  })
  @Transform(({ value }) => parseInt(value))
  quantity: number;
}

export class ProductTransaction {
  constructor(
    public id: number,
    public productId: number,
    public quantity: number,
    public transactionId: number,
  ) {}
}
