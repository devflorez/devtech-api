import { Payment } from '../../domain/entities/payment.entity';

export interface PaymentRepository {
  createPayment(payment: Payment): Promise<Payment>;
}
