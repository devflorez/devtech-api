import { Test, TestingModule } from '@nestjs/testing';
import { PaymentController } from './payments.controller';
import { CreateTokenCardUseCase } from '../../../application/use-cases/create-token-card.use.case';
import { GetAcceptanceTokenUseCase } from '../../../application/use-cases/get-acceptance-token.use.case';
import { CreatePaymentUseCase } from '../../../application/use-cases/create-payment.use.case';
import {
  Payment,
  PaymentBodyDto,
} from '../../../domain/entities/payment.entity';
import { Card, CardDto } from '../../../domain/entities/card.entity';
import { Token } from '../../../domain/entities/token.entity';
import { Acceptance } from '../../../domain/entities/acceptance.entity';

describe('PaymentController', () => {
  let controller: PaymentController;
  let createTokenCardUseCase: CreateTokenCardUseCase;
  let getAcceptanceTokenUseCase: GetAcceptanceTokenUseCase;
  let createPaymentUseCase: CreatePaymentUseCase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PaymentController],
      providers: [
        {
          provide: CreateTokenCardUseCase,
          useValue: {
            execute: jest.fn(),
          },
        },
        {
          provide: GetAcceptanceTokenUseCase,
          useValue: {
            execute: jest.fn(),
          },
        },
        {
          provide: CreatePaymentUseCase,
          useValue: {
            execute: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<PaymentController>(PaymentController);
    createTokenCardUseCase = module.get<CreateTokenCardUseCase>(
      CreateTokenCardUseCase,
    );
    getAcceptanceTokenUseCase = module.get<GetAcceptanceTokenUseCase>(
      GetAcceptanceTokenUseCase,
    );
    createPaymentUseCase =
      module.get<CreatePaymentUseCase>(CreatePaymentUseCase);
  });

  describe('createPayment', () => {
    it('should create a payment', async () => {
      const paymentDto: PaymentBodyDto = {
        acceptance_token: 'eyJhbGciOiJIUzI1NiJ9',
        session_id: '123456',
        payment_method: {
          type: 'CARD',
          token: 'tok_prod_280_32326B334c47Ec49a516bf1785247ba2',
          installments: 2,
        },
        transaction_id: 123456,
      };
      const createdPayment: Payment = {
        id: 1,
        amount: 100,
        currency: 'COP',
        transactionId: 123456,
        status: 'PENDING',
        reference: '123456',
      };
      jest
        .spyOn(createPaymentUseCase, 'execute')
        .mockResolvedValue(createdPayment);

      const result = await controller.createPayment(paymentDto);

      expect(createPaymentUseCase.execute).toHaveBeenCalledWith(paymentDto);
      expect(result).toEqual(createdPayment);
    });
  });

  describe('createTokenCard', () => {
    it('should create a token card', async () => {
      const card: Card = {
        number: '4242424242424242',
        exp_month: '12',
        exp_year: '2026',
        cvc: '123',
        card_holder: 'John Doe',
      };
      const createdToken: Token = {
        id: 'tok_prod_1_BBb749EAB32e97a2D058Dd538a608301',
        createdAt: new Date('2020-01-02T18:52:35.850+00:00'),
        brand: 'VISA',
        name: 'VISA-4242',
        lastFour: '4242',
        bin: '424242',
        expYear: '28',
        expMonth: '08',
        cardHolder: 'José Pérez',
        expiresAt: new Date('2020-06-30T18:52:35.000Z'),
      };
      jest
        .spyOn(createTokenCardUseCase, 'execute')
        .mockResolvedValue(createdToken);

      const result = await controller.createTokenCard(card);

      expect(createTokenCardUseCase.execute).toHaveBeenCalledWith(card);
      expect(result).toEqual(createdToken);
    });
  });

  describe('getAcceptanceToken', () => {
    it('should get the acceptance token', async () => {
      const acceptance: Acceptance = {
        acceptance_token:
          'eyJhbGciOiJIUzI1NiJ9.eyJjb250cmFjdF9pZCI6MSwicGVybWFsaW5rIjoiaHR0cHM6Ly93b21waS5jby93cC1jb250ZW50L3VwbG9hZHMvMjAxOS8wOS9URVJNSU5PUy1ZLUNPTkRJQ0lPTkVTLURFLVVTTy1VU1VBUklPUy1XT01QSS5wZGYiLCJmaWxlX2hhc2giOiIzZGNkMGM5OGU3NGFhYjk3OTdjZmY3ODExNzMxZjc3YiIsImppdCI6IjE1ODEwOTIzNjItMzk1NDkiLCJleHAiOjE1ODEwOTU5NjJ9.JwGfnfXsP9fbyOiQXFtQ_7T4r-tjvQrkFx0NyfIED5s',
        permalink:
          'https://wompi.co/wp-content/uploads/2019/09/TERMINOS-Y-CONDICIONES-DE-USO-USUARIOS-WOMPI.pdf',
        type: 'END_USER_POLICY',
      };
      jest
        .spyOn(getAcceptanceTokenUseCase, 'execute')
        .mockResolvedValue(acceptance);

      const result = await controller.getAcceptanceToken();

      expect(getAcceptanceTokenUseCase.execute).toHaveBeenCalled();
      expect(result).toEqual(acceptance);
    });
  });
});
