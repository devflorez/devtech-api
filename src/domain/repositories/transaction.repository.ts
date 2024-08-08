import { Transaction } from '../entities/transaction.entity';

export interface TransactionRepository {
  createTransaction(transaction: Transaction): Promise<Transaction>;
  updateTransactionStatus(id: number, status: string): Promise<Transaction>;
  getTransactionById(id: number): Promise<Transaction | null>;
}
