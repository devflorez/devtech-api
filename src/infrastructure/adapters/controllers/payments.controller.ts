import { CreatePaymentUseCase } from './../../../application/use-cases/create-payment.use.case';
import { Controller, Version, Body, Post, Get } from '@nestjs/common';

import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';

import {
  Payment,
  PaymentBodyDto,
} from '../../../domain/entities/payment.entity';
import { CreateTokenCardUseCase } from '../../../application/use-cases/create-token-card.use.case';
import { Card, CardDto } from '../../../domain/entities/card.entity';
import { Token } from '../../../domain/entities/token.entity';
import { Acceptance } from '../../../domain/entities/acceptance.entity';
import { GetAcceptanceTokenUseCase } from '../../../application/use-cases/get-acceptance-token.use.case';

@ApiTags('payments')
@Controller('payments')
export class PaymentController {
  constructor(
    private readonly createTokenCardUseCase: CreateTokenCardUseCase,
    private readonly getAcceptanceTokenUseCase: GetAcceptanceTokenUseCase,
    private readonly createPaymentUseCase: CreatePaymentUseCase,
  ) {}

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
  @ApiBody({ type: PaymentBodyDto })
  async createPayment(@Body() payment: PaymentBodyDto): Promise<Payment> {
    return this.createPaymentUseCase.execute(payment);
  }

  @Version('1')
  @Post('token')
  @ApiOperation({ summary: 'Create token card' })
  @ApiResponse({
    status: 201,
    description: 'Return created token card',
    example: {
      id: 'tok_prod_1_BBb749EAB32e97a2D058Dd538a608301',
      created_at: '2020-01-02T18:52:35.850+00:00',
      brand: 'VISA',
      name: 'VISA-4242',
      last_four: '4242',
      bin: '424242',
      exp_year: '28',
      exp_month: '08',
      card_holder: 'José Pérez',
      expires_at: '2020-06-30T18:52:35.000Z',
    },
  })
  @ApiBody({ type: CardDto })
  async createTokenCard(
    @Body()
    card: Card,
  ): Promise<Token | null> {
    return this.createTokenCardUseCase.execute(card);
  }

  @Version('1')
  @Get('acceptance-token')
  @ApiOperation({ summary: 'Get acceptance token' })
  @ApiResponse({
    status: 200,
    description: 'Return acceptance token',
    example: {
      acceptance_token:
        'eyJhbGciOiJIUzI1NiJ9.eyJjb250cmFjdF9pZCI6MSwicGVybWFsaW5rIjoiaHR0cHM6Ly93b21waS5jby93cC1jb250ZW50L3VwbG9hZHMvMjAxOS8wOS9URVJNSU5PUy1ZLUNPTkRJQ0lPTkVTLURFLVVTTy1VU1VBUklPUy1XT01QSS5wZGYiLCJmaWxlX2hhc2giOiIzZGNkMGM5OGU3NGFhYjk3OTdjZmY3ODExNzMxZjc3YiIsImppdCI6IjE1ODEwOTIzNjItMzk1NDkiLCJleHAiOjE1ODEwOTU5NjJ9.JwGfnfXsP9fbyOiQXFtQ_7T4r-tjvQrkFx0NyfIED5s',
      permalink:
        'https://wompi.co/wp-content/uploads/2019/09/TERMINOS-Y-CONDICIONES-DE-USO-USUARIOS-WOMPI.pdf',
      type: 'END_USER_POLICY',
    },
  })
  async getAcceptanceToken(): Promise<Acceptance> {
    return this.getAcceptanceTokenUseCase.execute();
  }
}
