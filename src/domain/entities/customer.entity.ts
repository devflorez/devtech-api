import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsEmail,
  IsNumber,
  IsArray,
  ValidateNested,
  IsPositive,
  IsInt,
  IsNotEmpty,
  IsCurrency,
  IsOptional,
} from 'class-validator';
export class CustomerDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'JohnDoe',
  })
  name: string;

  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({
    example: 'me@emaill.com',
  })
  email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: '3012345678',
  })
  phoneNumber: string;
}

export class Customer {
  constructor(
    public id: number,
    public name: string,
    public email: string,
    public phoneNumber: string,
  ) {}
}
