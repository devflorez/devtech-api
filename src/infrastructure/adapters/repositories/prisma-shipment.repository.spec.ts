import { Test, TestingModule } from '@nestjs/testing';
import { PrismaShipmentRepository } from './prisma-shipment.repository';
import {
  ShipmentDto,
  Shipment,
} from '../../../domain/entities/shipment.entity';
import { PrismaClient } from '@prisma/client';

describe('PrismaShipmentRepository', () => {
  let repository: PrismaShipmentRepository;
  let prismaClient: PrismaClient;

  const mockPrismaClient = {
    shipment: {
      create: jest.fn(),
      findUnique: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PrismaShipmentRepository,
        { provide: PrismaClient, useValue: mockPrismaClient },
      ],
    }).compile();

    repository = module.get<PrismaShipmentRepository>(PrismaShipmentRepository);
    prismaClient = module.get<PrismaClient>(PrismaClient);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createShipment', () => {
    it('should create a shipment', async () => {
      const shipmentDto: ShipmentDto = {
        transactionId: 123456,
        address: '123 Main St',
        city: 'New York',
        postalCode: '12345',
        country: 'USA',
        state: 'NY',
        status: 'PENDING',
      };

      const createdShipment = {
        transactionId: 123456,
        address: '123 Main St',
        city: 'New York',
        postalCode: '12345',
        country: 'USA',
        state: 'NY',
        status: 'PENDING',
      };

      mockPrismaClient.shipment.create.mockResolvedValue(createdShipment);

      const result = await repository.createShipment(shipmentDto);

      expect(mockPrismaClient.shipment.create).toHaveBeenCalledWith({
        data: {
          transactionId: shipmentDto.transactionId,
          address: shipmentDto.address,
          city: shipmentDto.city,
          postalCode: shipmentDto.postalCode,
          country: shipmentDto.country,
          state: shipmentDto.state,
          status: 'PENDING',
        },
      });

      expect(result).toEqual(
        new Shipment(
          createdShipment.transactionId,
          createdShipment.address,
          createdShipment.city,
          createdShipment.postalCode,
          createdShipment.country,
          createdShipment.state,
          createdShipment.status,
        ),
      );
    });
  });

  describe('getShipmentByTransactionId', () => {
    it('should get a shipment by transaction ID', async () => {
      const transactionId = 123456;

      const shipment = {
        transactionId: 123456,
        address: '123 Main St',
        city: 'New York',
        postalCode: '12345',
        country: 'USA',
        state: 'NY',
        status: 'PENDING',
      };

      mockPrismaClient.shipment.findUnique.mockResolvedValue(shipment);

      const result = await repository.getShipmentByTransactionId(transactionId);

      expect(mockPrismaClient.shipment.findUnique).toHaveBeenCalledWith({
        where: { transactionId },
      });

      expect(result).toEqual(
        new Shipment(
          shipment.transactionId,
          shipment.address,
          shipment.city,
          shipment.postalCode,
          shipment.country,
          shipment.state,
          shipment.status,
        ),
      );
    });

    it('should return null if shipment is not found', async () => {
      const transactionId = 123456;

      mockPrismaClient.shipment.findUnique.mockResolvedValue(null);

      const result = await repository.getShipmentByTransactionId(transactionId);

      expect(mockPrismaClient.shipment.findUnique).toHaveBeenCalledWith({
        where: { transactionId },
      });

      expect(result).toBeNull();
    });
  });
});
