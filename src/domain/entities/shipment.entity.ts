export class Shipment {
  constructor(
    public transactionId: number,
    public address: string,
    public city: string,
    public state: string,
    public country: string,
    public postalCode: string,
    public status: string,
  ) {}
}
