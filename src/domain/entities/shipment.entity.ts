import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';


export class ShipmentBodyDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: '1234 Main St',
  })
  address: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: 'Anytown',
  })
  city: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: 'NY',
  })
  state: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: 'USA',
  })
  country: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: '12345',
  })
  postalCode: string;
}

export class ShipmentDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: '1234',
  })
  transactionId: number;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: '1234 Main St',
  })
  address: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: 'Anytown',
  })
  city: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: 'NY',
  })
  state: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: 'USA',
  })
  country: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: '12345',
  })
  postalCode: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: 'Shipped',
  })
  status: string;
}

export class Shipment {
  constructor(
    public id: number,
    public address: string,
    public city: string,
    public state: string,
    public country: string,
    public postalCode: string,
    public status: string,
    public transactionId?: number,
  ) {}
}
