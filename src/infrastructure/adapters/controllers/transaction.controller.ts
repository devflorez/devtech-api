import {
  Controller,
  Get,
  Param,
  Version,
  Body,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { GetTransactionByIdUseCase } from 'src/application/use-cases/get-transaction-by-id.use-case';
import { CreateTransactionUseCase } from 'src/application/use-cases/create-transaction.use-case';
import { UpdateTransactionStatusUseCase } from 'src/application/use-cases/update-transaction-status.use-case';
import { Transaction } from 'src/domain/entities/transaction.entity';


@ApiTags('transactions')
@Controller('transactions')
export class TransactionController {
  constructor(
    private readonly getTransactionByIdUseCase: GetTransactionByIdUseCase,
    private readonly createTransactionUseCase: CreateTransactionUseCase,
    private readonly updateTransactionStatusUseCase: UpdateTransactionStatusUseCase,
  ) {}

  @Version('1')
  @Get(':id')
  @ApiOperation({ summary: 'Get transaction by id' })
  @ApiResponse({
    status: 200,
    description: 'Return transaction by id',
    example: {
      id: 1,
      customerId: 1,
      quantity: 1,
      total: 100,
      status: 'pending',
      productTransactions: [
        {
          productId: 1,
          quantity: 1,
        },
      ],
    },
  })
  async getTransactionById(
    @Param('id') id: number,
  ): Promise<Transaction | null> {
    return this.getTransactionByIdUseCase.execute(id);
  }

  @Version('1')
  @Post()
  @ApiOperation({ summary: 'Create transaction' })
  @ApiResponse({
    status: 201,
    description: 'Return created transaction',
    example: {
      id: 1,
      customerId: 1,
      quantity: 1,
      total: 100,
      status: 'pending',
      productTransactions: [
        {
          productId: 1,
          quantity: 1,
        },
      ],
    },
  })
  async createTransaction(
    @Body()
    transactionData: {
      customer: { name: string; email: string };
      transaction: {
        productTransactions: { productId: number; quantity: number }[];
        total: number;
      };
      payment: { amount: number; currency: string };
      shipment: {
        address: string;
        city: string;
        postalCode: string;
        country: string;
        state: string;
      };
    },
  ): Promise<Transaction> {
    return this.createTransactionUseCase.execute(
      transactionData.customer,
      transactionData.transaction,
      transactionData.payment,
      transactionData.shipment,
    );
  }

  @Version('1')
  @Patch(':id')
  @ApiOperation({ summary: 'Update transaction status' })
  @ApiResponse({
    status: 200,
    description: 'Return updated transaction',
    example: {
      id: 1,
      customerId: 1,
      quantity: 1,
      total: 100,
      status: 'completed',
      productTransactions: [
        {
          productId: 1,
          quantity: 1,
        },
      ],
    },
  })
  async updateTransactionStatus(
    @Param('id') id: number,
    @Body('status') status: string,
  ): Promise<Transaction> {
    return this.updateTransactionStatusUseCase.execute(id, status);
  }
}
