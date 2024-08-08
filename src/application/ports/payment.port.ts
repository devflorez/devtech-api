import { Payment } from '../../domain/entities/payment.entity';

export interface PaymentPort {
  createPayment(payment: Payment): Promise<Payment>;
}
