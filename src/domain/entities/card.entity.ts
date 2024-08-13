import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CardDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: '4242424242424242',
  })
  number: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: '12',
  })
  exp_month: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: '25',
  })
  exp_year: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: 'John Doe',
  })
  card_holder: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: '123',
  })
  cvc: string;
}

export class Card {
  constructor(
    public number: string,
    public exp_month: string,
    public exp_year: string,
    public card_holder: string,
    public cvc: string,
  ) {}
}
