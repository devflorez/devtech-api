

export class Payment {
  constructor(
    public amount: number,
    public currency: string,
    public transactionId: number,
    public status: string,
    public reference: string,
  ) {}
}
