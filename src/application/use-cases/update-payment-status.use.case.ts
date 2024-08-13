import { PaymentPort } from '../ports/payment.port';
import { Payment } from 'src/domain/entities/payment.entity';

export class UpdatePaymentStatusUseCase {
  constructor(private readonly paymentPort: PaymentPort) {}

  async execute(id: number, status: string): Promise<Payment | null> {
    const payment = await this.paymentPort.getPaymentById(id);
    if (!payment) {
      return null;
    }
    return this.paymentPort.updatePaymentStatus(id, status);
  }
}
