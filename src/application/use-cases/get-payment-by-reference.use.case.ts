import { PaymentPort } from "../ports/payment.port";
import { Payment } from "src/domain/entities/payment.entity";

export class GetPaymentByReferenceUseCase {
  constructor(private readonly paymentPort: PaymentPort) {}

  async execute(reference: string): Promise<Payment | null> {
    return this.paymentPort.getPaymentByReference(reference);
  }
}