export class ProductTransaction {
  constructor(
    public id: number,
    public productId: number,
    public quantity: number,
    public transactionId: number,
  ) {}
}
