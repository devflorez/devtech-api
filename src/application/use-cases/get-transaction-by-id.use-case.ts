import { TransactionPort } from '../ports/transaction.port';
import { Transaction } from '../../domain/entities/transaction.entity';

export class GetTransactionByIdUseCase {
  constructor(private readonly transactionPort: TransactionPort) {}

  async execute(id: number): Promise<Transaction | null> {
    return this.transactionPort.getTransactionById(id);
  }
}
