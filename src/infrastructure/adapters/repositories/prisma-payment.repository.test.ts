import { Test, TestingModule } from '@nestjs/testing';
import { PrismaPaymentRepository } from './prisma-payment.repository';
import { PaymentDto } from '../../../domain/entities/payment.entity';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import {
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';

describe('PrismaPaymentRepository', () => {
  let repository: PrismaPaymentRepository;
  let httpService: HttpService;
  let configService: ConfigService;

  const mockPrismaClient = {
    payment: {
      create: jest.fn(),
      findFirst: jest.fn(),
      update: jest.fn(),
    },
  };

  const mockHttpService = {
    axiosRef: {
      post: jest.fn(),
      get: jest.fn(),
    },
  };

  const mockConfigService = {
    get: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PrismaPaymentRepository,
        { provide: HttpService, useValue: mockHttpService },
        { provide: ConfigService, useValue: mockConfigService },
        { provide: 'PrismaClient', useValue: mockPrismaClient },
      ],
    }).compile();

    repository = module.get<PrismaPaymentRepository>(PrismaPaymentRepository);
    httpService = module.get<HttpService>(HttpService);
    configService = module.get<ConfigService>(ConfigService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createPayment', () => {
    it('should create a payment', async () => {
      const paymentDto: PaymentDto = {
        amount: 100,
        currency: 'COP',
        status: 'success',
        transactionId: 123456,
        reference: 'payment-ref',
        token: 'payment-token',
        installments: 1,
        type: 'card',
        wompiTransactionId: 'wompi-123',
      };

      const createdPayment = {
        id: 1,
        amount: 100,
        currency: 'COP',
        transactionId: 123456,
        status: 'success',
        reference: 'payment-ref',
      };

      mockPrismaClient.payment.create.mockResolvedValue(createdPayment);

      const result = await repository.createPayment(paymentDto);

      expect(mockPrismaClient.payment.create).toHaveBeenCalledWith({
        data: paymentDto,
      });
      expect(result).toEqual(createdPayment);
    });
  });

  describe('createTokenCard', () => {
    it('should create a token card', async () => {
      const card = {
        number: '4242424242424242',
        exp_month: '12',
        exp_year: '2026',
        cvc: '123',
        card_holder: 'John Doe',
      };

      const token = {
        id: 'token-id',
        created_at: '2022-01-01',
        brand: 'Visa',
        name: 'John Doe',
        last_four: '6789',
        bin: '1234',
        exp_year: 2023,
        exp_month: 12,
        card_holder: 'John Doe',
        expires_at: '2023-01-01',
      };

      const response = {
        data: {
          data: token,
        },
      };

      mockHttpService.axiosRef.post.mockResolvedValue(response);

      const result = await repository.createTokenCard(card);

      expect(mockHttpService.axiosRef.post).toHaveBeenCalledWith(
        expect.any(String),
        card,
        {
          headers: {
            Authorization: expect.any(String),
            Content_Type: 'application/json',
          },
        },
      );
      expect(result).toEqual(token);
    });

    it('should throw UnauthorizedException if response status is 401', async () => {
      const card = {
        number: '4242414242131313',
        exp_month: '12',
        exp_year: '2023',
        cvc: '123',
        card_holder: 'John Doe',
      };

      const error = {
        response: {
          status: 401,
        },
      };

      mockHttpService.axiosRef.post.mockRejectedValue(error);

      await expect(repository.createTokenCard(card)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw UnprocessableEntityException for other error responses', async () => {
      const card = {
        number: '123456789',
        exp_month: '12',
        exp_year: '2023',
        cvc: '123',
        card_holder: 'John Doe',
      };

      const error = {
        response: {
          status: 500,
        },
      };

      mockHttpService.axiosRef.post.mockRejectedValue(error);

      await expect(repository.createTokenCard(card)).rejects.toThrow(
        UnprocessableEntityException,
      );
    });
  });

  describe('getAcceptanceToken', () => {
    it('should get the acceptance token', async () => {
      const acceptance = {
        acceptance_token: 'acceptance-token',
        permalink: 'acceptance-permalink',
        type: 'acceptance-type',
      };

      const response = {
        data: {
          data: {
            presigned_acceptance: acceptance,
          },
        },
      };

      mockHttpService.axiosRef.get.mockResolvedValue(response);

      const result = await repository.getAcceptanceToken();

      expect(mockHttpService.axiosRef.get).toHaveBeenCalledWith(
        expect.any(String),
      );
      expect(result).toEqual(acceptance);
    });
  });

  describe('getPaymentByReference', () => {
    it('should get a payment by reference', async () => {
      const reference = 'payment-ref';

      const payment = {
        id: 1,
        amount: 100,
        currency: 'USD',
        transactionId: '123456',
        status: 'success',
        reference: 'payment-ref',
      };

      mockPrismaClient.payment.findFirst.mockResolvedValue(payment);

      const result = await repository.getPaymentByReference(reference);

      expect(mockPrismaClient.payment.findFirst).toHaveBeenCalledWith({
        where: {
          reference,
        },
      });
      expect(result).toEqual(payment);
    });

    it('should return null if payment is not found', async () => {
      const reference = 'payment-ref';

      mockPrismaClient.payment.findFirst.mockResolvedValue(null);

      const result = await repository.getPaymentByReference(reference);

      expect(mockPrismaClient.payment.findFirst).toHaveBeenCalledWith({
        where: {
          reference,
        },
      });
      expect(result).toBeNull();
    });
  });

  describe('updatePaymentStatus', () => {
    it('should update the payment status', async () => {
      const id = 1;
      const status = 'success';

      const updatedPayment = {
        id: 1,
        amount: 100,
        currency: 'USD',
        transactionId: '123456',
        status: 'success',
        reference: 'payment-ref',
      };

      mockPrismaClient.payment.update.mockResolvedValue(updatedPayment);

      const result = await repository.updatePaymentStatus(id, status);

      expect(mockPrismaClient.payment.update).toHaveBeenCalledWith({
        where: {
          id,
        },
        data: {
          status,
        },
      });
      expect(result).toEqual(updatedPayment);
    });
  });

  describe('getPaymentById', () => {
    it('should get a payment by id', async () => {
      const id = 1;

      const payment = {
        id: 1,
        amount: 100,
        currency: 'USD',
        transactionId: '123456',
        status: 'success',
        reference: 'payment-ref',
      };

      mockPrismaClient.payment.findFirst.mockResolvedValue(payment);

      const result = await repository.getPaymentById(id);

      expect(mockPrismaClient.payment.findFirst).toHaveBeenCalledWith({
        where: {
          id,
        },
      });
      expect(result).toEqual(payment);
    });

    it('should return null if payment is not found', async () => {
      const id = 1;

      mockPrismaClient.payment.findFirst.mockResolvedValue(null);

      const result = await repository.getPaymentById(id);

      expect(mockPrismaClient.payment.findFirst).toHaveBeenCalledWith({
        where: {
          id,
        },
      });
      expect(result).toBeNull();
    });
  });
});
