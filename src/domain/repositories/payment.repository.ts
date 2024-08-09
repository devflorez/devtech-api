import { Payment } from '../../domain/entities/payment.entity';
import { Card } from '../entities/card.entity';
import { Token } from '../entities/token.entity';

export interface PaymentRepository {
  createPayment(payment: Payment): Promise<Payment>;
  createTokenCard(card: Card): Promise<Token | null>;
}
