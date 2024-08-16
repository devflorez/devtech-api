import { Test, TestingModule } from '@nestjs/testing';
import { TransactionController } from './transaction.controller';
import { GetTransactionByIdUseCase } from '../../../application/use-cases/get-transaction-by-id.use-case';
import { CreateTransactionUseCase } from '../../../application/use-cases/create-transaction.use-case';
import { UpdateTransactionStatusUseCase } from '../../../application/use-cases/update-transaction-status.use-case';
import {
  Transaction,
  TransactionBodyDto,
} from '../../../domain/entities/transaction.entity';

describe('TransactionController', () => {
  let controller: TransactionController;

  const mockGetTransactionByIdUseCase = {
    execute: jest.fn(),
  };

  const mockCreateTransactionUseCase = {
    execute: jest.fn(),
  };

  const mockUpdateTransactionStatusUseCase = {
    execute: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransactionController],
      providers: [
        {
          provide: GetTransactionByIdUseCase,
          useValue: mockGetTransactionByIdUseCase,
        },
        {
          provide: CreateTransactionUseCase,
          useValue: mockCreateTransactionUseCase,
        },
        {
          provide: UpdateTransactionStatusUseCase,
          useValue: mockUpdateTransactionStatusUseCase,
        },
      ],
    }).compile();

    controller = module.get<TransactionController>(TransactionController);
  });

  it('should return a transaction by id', async () => {
    const id = 1;
    const transaction = new Transaction(
      1,
      1,
      10,
      199.99,
      'PENDING',
      [
        {
          productId: 1,
          quantity: 1,
          product: {
            name: 'Product 1',
            imageUrl: 'image1.jpg',
            price: 199.99,
          },
        },
      ],
      1,
    );
    mockGetTransactionByIdUseCase.execute.mockResolvedValue(transaction);

    const result = await controller.getTransactionById(id);
    expect(result).toEqual(transaction);
  });

  it('should create a transaction', async () => {
    const transactionData: TransactionBodyDto = {
      customer: {
        name: 'John Doe',
        email: 'me@email.com',
        phoneNumber: '3012345678',
      },
      total: 100,
      shipment: {
        address: '123 Main St',
        city: 'Springfield',
        state: 'IL',
        postalCode: '62701',
        country: 'USA',
      },
      productTransactions: [
        {
          productId: 1,
          quantity: 1,
        },
      ],
    };
    const createdTransaction: Transaction = {
      id: 1,
      customerId: 1,
      quantity: 1,
      total: 100,
      status: 'PENDING',
      productTransactions: [
        {
          productId: 1,
          quantity: 1,
          product: {
            name: 'Product 1',
            imageUrl: 'image1.jpg',
            price: 100,
          },
        },
      ],
    };
    mockCreateTransactionUseCase.execute.mockResolvedValue(createdTransaction);

    const result = await controller.createTransaction(transactionData);

    expect(result).toEqual(createdTransaction);
  });

  it('should update the transaction status', async () => {
    const id = 1;
    const status = 'completed';
    const updatedTransaction: Transaction = {
      id: 1,
      customerId: 1,
      quantity: 1,
      total: 100,
      status: 'completed',
      productTransactions: [
        {
          productId: 1,
          quantity: 1,
          product: {
            name: 'Product 1',
            imageUrl: 'image1.jpg',
            price: 100,
          }
        },
      ],
    };
    mockUpdateTransactionStatusUseCase.execute.mockResolvedValue(
      updatedTransaction,
    );

    const result = await controller.updateTransactionStatus(id, status);

    expect(result).toEqual(updatedTransaction);
  });
});
