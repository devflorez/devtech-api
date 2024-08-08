import { Transaction } from '../../domain/entities/transaction.entity';

export interface TransactionPort {
  createTransaction(transaction: Transaction): Promise<Transaction>;
  updateTransactionStatus(id: number, status: string): Promise<Transaction>;
  getTransactionById(id: number): Promise<Transaction | null>;
}
