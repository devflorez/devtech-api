import { PaymentPort } from '../ports/payment.port';
import { Payment } from 'src/domain/entities/payment.entity';

export class GetPaymentByIdUseCase {
  constructor(private readonly paymentPort: PaymentPort) {}

  async execute(id: number): Promise<Payment | null> {
    return this.paymentPort.getPaymentById(id);
  }
}
