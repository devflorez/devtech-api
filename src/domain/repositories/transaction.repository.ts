import { Transaction, TransactionDto } from '../entities/transaction.entity';

export interface TransactionRepository {
  createTransaction(transaction: TransactionDto): Promise<Transaction>;
  updateTransactionStatus(id: number, status: string): Promise<Transaction>;
  getTransactionById(id: number): Promise<Transaction | null>;
}
