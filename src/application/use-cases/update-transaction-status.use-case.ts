import { TransactionPort } from '../ports/transaction.port';
import { Transaction } from '../../domain/entities/transaction.entity';

export class UpdateTransactionStatusUseCase {
  constructor(private readonly transactionPort: TransactionPort) {}

  async execute(id: number, status: string): Promise<Transaction | null> {
    const transaction = await this.transactionPort.getTransactionById(id);
    if (!transaction) {
      return null;
    }

    return this.transactionPort.updateTransactionStatus(id, status);
  }
}
