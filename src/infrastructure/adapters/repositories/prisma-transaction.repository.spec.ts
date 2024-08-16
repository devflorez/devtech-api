import { Test, TestingModule } from '@nestjs/testing';
import { PrismaTransactionRepository } from './prisma-transaction.repository';
import { PrismaClient } from '@prisma/client';
import {
  TransactionDto,
  Transaction,
} from '../../../domain/entities/transaction.entity';

describe('PrismaTransactionRepository', () => {
  let repository: PrismaTransactionRepository;
  let prismaClient: PrismaClient;

  const mockPrismaClient = {
    transaction: {
      create: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PrismaTransactionRepository,
        { provide: PrismaClient, useValue: mockPrismaClient },
      ],
    }).compile();

    repository = module.get<PrismaTransactionRepository>(
      PrismaTransactionRepository,
    );
    prismaClient = module.get<PrismaClient>(PrismaClient);
  });

  it('should create a transaction', async () => {
    const transactionDto: TransactionDto = {
      customerId: 1,
      total: 100,
      productTransactions: [
        { productId: 1, quantity: 2 },
        { productId: 2, quantity: 3 },
      ],
    };

    const createdTransaction = {
      id: 1,
      customerId: 1,
      quantity: 5,
      total: 100,
      status: 'PENDING',
      productTransactions: [
        {
          productId: 1,
          quantity: 2,
          product: { name: 'Product 1', imageUrl: 'image1.jpg', price: 10 },
        },
        {
          productId: 2,
          quantity: 3,
          product: { name: 'Product 2', imageUrl: 'image2.jpg', price: 20 },
        },
      ],
    };

    mockPrismaClient.transaction.create.mockResolvedValue(createdTransaction);

    const result = await repository.createTransaction(transactionDto);

    expect(mockPrismaClient.transaction.create).toHaveBeenCalledWith({
      data: {
        customerId: transactionDto.customerId,
        total: transactionDto.total,
        status: 'PENDING',
        productTransactions: {
          createMany: {
            data: transactionDto.productTransactions,
          },
        },
        quantity: transactionDto.productTransactions.reduce(
          (acc, pt) => acc + pt.quantity,
          0,
        ),
      },
      include: {
        productTransactions: {
          include: {
            product: true,
          },
        },
      },
    });

    expect(result).toEqual(createdTransaction);
  });

  it('should get a transaction by id', async () => {
    const id = 1;

    const transaction = {
      id: 1,
      customerId: 1,
      quantity: 5,
      total: 100,
      status: 'PENDING',
      productTransactions: [
        {
          productId: 1,
          quantity: 2,
          product: { name: 'Product 1', imageUrl: 'image1.jpg', price: 10 },
        },
        {
          productId: 2,
          quantity: 3,
          product: { name: 'Product 2', imageUrl: 'image2.jpg', price: 20 },
        },
      ],
    };

    mockPrismaClient.transaction.findUnique.mockResolvedValue(transaction);

    const result = await repository.getTransactionById(id);

    expect(result).toEqual(
      new Transaction(
        transaction.id,
        transaction.customerId,
        transaction.quantity,
        transaction.total,
        transaction.status,
        transaction.productTransactions.map((pt) => ({
          productId: pt.productId,
          quantity: pt.quantity,
          product: {
            name: pt.product.name,
            imageUrl: pt.product.imageUrl,
            price: pt.product.price,
          },
        })),
      ),
    );
  });

  it('should return null if transaction is not found', async () => {
    const id = 1;

    mockPrismaClient.transaction.findUnique.mockResolvedValue(null);

    const result = await repository.getTransactionById(id);

    expect(mockPrismaClient.transaction.findUnique).toHaveBeenCalledWith({
      where: { id },
      include: {
        productTransactions: {
          include: {
            product: true,
          },
        },
      },
    });

    expect(result).toBeNull();
  });

  it('should update the transaction status', async () => {
    const id = 1;
    const status = 'COMPLETED';

    const updatedTransaction = {
      id: 1,
      customerId: 1,
      quantity: 5,
      total: 100,
      status: 'COMPLETED',
      productTransactions: [
        {
          productId: 1,
          quantity: 2,
          product: { name: 'Product 1', imageUrl: 'image1.jpg', price: 10 },
        },
        {
          productId: 2,
          quantity: 3,
          product: { name: 'Product 2', imageUrl: 'image2.jpg', price: 20 },
        },
      ],
    };

    mockPrismaClient.transaction.update.mockResolvedValue(updatedTransaction);

    const result = await repository.updateTransactionStatus(id, status);

    expect(mockPrismaClient.transaction.update).toHaveBeenCalledWith({
      where: { id },
      data: { status },
      include: {
        productTransactions: {
          include: {
            product: true,
          },
        },
      },
    });

    expect(result).toEqual(updatedTransaction);
  });
});
