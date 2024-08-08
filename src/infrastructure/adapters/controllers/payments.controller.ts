import { Controller, Version, Body, Post } from '@nestjs/common';

import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { WompiPaymentService } from '../services/wompi-payment.service';

import { Payment } from 'src/domain/entities/payment.entity';

@ApiTags('payments')
@Controller('payments')
export class PaymentController {
  constructor(private readonly wompiPaymentService: WompiPaymentService) {}

  @Version('1')
  @Post()
  @ApiOperation({ summary: 'Create payment' })
  @ApiResponse({
    status: 201,
    description: 'Return created payment',
    example: {
      amount: 100,
      currency: 'USD',
      transactionId: '123456',
      status: 'pending',
    },
  })
  async createPayment(@Body() payment: Payment): Promise<Payment> {
    return this.wompiPaymentService.createPayment(payment);
  }

  @Version('1')
  @Post('token')
  @ApiOperation({ summary: 'Create token card' })
  @ApiResponse({
    status: 201,
    description: 'Return created token card',
    example: {
      token: '123456',
    },
  })
  async createTokenCard(
    @Body()
    card: {
      number: string;
      cvc: string;
      exp_month: string;
      exp_year: string;
      card_holder: string;
    },
  ): Promise<string> {
    return this.wompiPaymentService.createTokenCard(card);
  }
}
