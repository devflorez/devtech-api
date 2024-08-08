import { ProductTransaction } from './product-transaction.entity';

export class Transaction {
  id: number;
  constructor(
    public customerId: number,
    public quantity: number,
    public total: number,
    public status: string,
    public productTransactions: { productId: number; quantity: number }[],
    public paymentId?: number | null,
  ) {}
}
