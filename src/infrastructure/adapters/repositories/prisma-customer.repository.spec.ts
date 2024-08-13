import {
  CustomerDto,
  Customer,
} from '../../../domain/entities/customer.entity';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClient } from '@prisma/client';
import { PrismaCustomerRepository } from './prisma-customer.repository';

describe('PrismaCustomerRepository', () => {
  let repository: PrismaCustomerRepository;
  let prismaClient: PrismaClient;

  const mockPrismaClient = {
    customer: {
      create: jest.fn(),
      findUnique: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PrismaCustomerRepository,
        { provide: PrismaClient, useValue: mockPrismaClient },
      ],
    }).compile();

    repository = module.get<PrismaCustomerRepository>(PrismaCustomerRepository);
    prismaClient = module.get<PrismaClient>(PrismaClient);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createCustomer', () => {
    it('should create a customer', async () => {
      const customerDto: CustomerDto = {
        name: 'John Doe',
        email: 'john.doe@example.com',
        phoneNumber: '1234567890',
      };

      const createdCustomer = {
        id: 1,
        name: 'John Doe',
        email: 'john.doe@example.com',
        phoneNumber: '1234567890',
      };

      mockPrismaClient.customer.create.mockResolvedValue(createdCustomer);

      const result = await repository.createCustomer(customerDto);

      expect(mockPrismaClient.customer.create).toHaveBeenCalledWith({
        data: customerDto,
      });

      expect(result).toEqual(
        new Customer(
          createdCustomer.id,
          createdCustomer.name,
          createdCustomer.email,
          createdCustomer.phoneNumber,
        ),
      );
    });
  });

  describe('findCustomerByEmail', () => {
    it('should find a customer by email', async () => {
      const email = 'john.doe@example.com';

      const customer = {
        id: 1,
        name: 'John Doe',
        email: 'john.doe@example.com',
        phoneNumber: '1234567890',
      };

      mockPrismaClient.customer.findUnique.mockResolvedValue(customer);

      const result = await repository.findCustomerByEmail(email);

      expect(mockPrismaClient.customer.findUnique).toHaveBeenCalledWith({
        where: { email },
      });

      expect(result).toEqual(
        new Customer(
          customer.id,
          customer.name,
          customer.email,
          customer.phoneNumber,
        ),
      );
    });

    it('should return null if customer is not found', async () => {
      const email = 'john.doe@example.com';

      mockPrismaClient.customer.findUnique.mockResolvedValue(null);

      const result = await repository.findCustomerByEmail(email);

      expect(mockPrismaClient.customer.findUnique).toHaveBeenCalledWith({
        where: { email },
      });

      expect(result).toBeNull();
    });
  });

  describe('findCustomerById', () => {
    it('should find a customer by id', async () => {
      const id = 1;

      const customer = {
        id: 1,
        name: 'John Doe',
        email: 'john.doe@example.com',
        phoneNumber: '1234567890',
      };

      mockPrismaClient.customer.findUnique.mockResolvedValue(customer);

      const result = await repository.findCustomerById(id);

      expect(mockPrismaClient.customer.findUnique).toHaveBeenCalledWith({
        where: { id },
      });

      expect(result).toEqual(
        new Customer(
          customer.id,
          customer.name,
          customer.email,
          customer.phoneNumber,
        ),
      );
    });

    it('should return null if customer is not found', async () => {
      const id = 1;

      mockPrismaClient.customer.findUnique.mockResolvedValue(null);

      const result = await repository.findCustomerById(id);

      expect(mockPrismaClient.customer.findUnique).toHaveBeenCalledWith({
        where: { id },
      });

      expect(result).toBeNull();
    });
  });
});
