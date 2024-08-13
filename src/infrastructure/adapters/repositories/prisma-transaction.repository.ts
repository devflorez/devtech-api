import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

import {
  Transaction,
  TransactionDto,
} from '../../../domain/entities/transaction.entity';
import { TransactionRepository } from '../../../domain/repositories/transaction.repository';
import { TransactionPort } from '../../../application/ports/transaction.port';

@Injectable()
export class PrismaTransactionRepository
  implements TransactionRepository, TransactionPort
{
  constructor(private readonly prisma: PrismaClient) {}

  async createTransaction(transaction: TransactionDto): Promise<Transaction> {
    const createdTransaction = await this.prisma.transaction.create({
      data: {
        customerId: transaction.customerId,
        total: transaction.total,
        status: 'PENDING',
        productTransactions: {
          createMany: {
            data: transaction.productTransactions,
          },
        },
        quantity: transaction.productTransactions.reduce(
          (acc, pt) => acc + pt.quantity,
          0,
        ),
      },
      include: {
        productTransactions: true,
      },
    });

    return new Transaction(
      createdTransaction.id,
      createdTransaction.customerId,
      createdTransaction.quantity,
      createdTransaction.total,
      createdTransaction.status,
      createdTransaction.productTransactions.map((pt) => ({
        productId: pt.productId,
        quantity: pt.quantity,
      })),
    );
  }

  async getTransactionById(id: number): Promise<Transaction | null> {
    const transaction = await this.prisma.transaction.findUnique({
      where: { id },
      include: {
        productTransactions: true,
      },
    });

    if (!transaction) {
      return null;
    }

    return new Transaction(
      transaction.id,
      transaction.customerId,
      transaction.quantity,
      transaction.total,
      transaction.status,
      transaction.productTransactions.map((pt) => ({
        productId: pt.productId,
        quantity: pt.quantity,
      })),
    );
  }

  async updateTransactionStatus(
    id: number,
    status: string,
  ): Promise<Transaction> {
    const updatedTransaction = await this.prisma.transaction.update({
      where: { id },
      data: { status },
      include: {
        productTransactions: true,
      },
    });

    return new Transaction(
      updatedTransaction.id,
      updatedTransaction.customerId,
      updatedTransaction.quantity,
      updatedTransaction.total,
      updatedTransaction.status,
      updatedTransaction.productTransactions.map((pt) => ({
        productId: pt.productId,
        quantity: pt.quantity,
      })),
    );
  }
}
