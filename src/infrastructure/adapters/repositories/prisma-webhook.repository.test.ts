import { Test, TestingModule } from '@nestjs/testing';
import { PrismaWebhookRepository } from './prisma-webhook.repository';
import { PrismaClient } from '@prisma/client';
import {
  EventWompi,
  ResponseWompi,
} from '../../../domain/entities/webhook.entity';

describe('PrismaWebhookRepository', () => {
  let repository: PrismaWebhookRepository;
  let prismaClient: PrismaClient;

  const mockPrismaClient = {
    event: {
      create: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PrismaWebhookRepository,
        {
          provide: PrismaClient,
          useValue: mockPrismaClient,
        },
      ],
    }).compile();

    repository = module.get<PrismaWebhookRepository>(PrismaWebhookRepository);
    prismaClient = module.get<PrismaClient>(PrismaClient);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('handleWompiEvent', () => {
    it('should handle Wompi event and return response', async () => {
      const event: EventWompi = {
        event: 'transaction.updated',
        data: {
          transaction: {
            id: '1234-1610641025-49201',
            amount_in_cents: 4490000,
            reference: 'MZQ3X2DE2SMX',
            customer_email: 'juan.perez@gmail.com',
            currency: 'COP',
            payment_method_type: 'NEQUI',
            redirect_url: 'https://mitienda.com.co/pagos/redireccion',
            status: 'APPROVED',
            shipping_address: null,
            payment_link_id: null,
            payment_source_id: null,
          },
        },
        environment: 'prod',
        signature: {
          properties: [
            'transaction.id',
            'transaction.status',
            'transaction.amount_in_cents',
          ],
          checksum:
            '3476DDA50F64CD7CBD160689640506FEBEA93239BC524FC0469B2C68A3CC8BD0',
        },
        timestamp: 1530291411,
        sent_at: '2018-07-20T16:45:05.000Z',
      };

      const response: ResponseWompi = {
        success: true,
        message: 'Event handled',
      };

      mockPrismaClient.event.create.mockResolvedValue({
        type: 'WOMPI',
        data: JSON.stringify(event),
      });

      const result = await repository.handleWompiEvent(event);

      expect(prismaClient.event.create).toHaveBeenCalledWith({
        data: {
          type: 'WOMPI',
          data: JSON.stringify(event),
        },
      });

      expect(result).toEqual(response);
    });
  });
});
