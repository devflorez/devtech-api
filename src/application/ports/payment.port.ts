import { Payment } from '../../domain/entities/payment.entity';
import { Token } from 'src/domain/entities/token.entity';
import { Card } from 'src/domain/entities/card.entity';
import { Acceptance } from 'src/domain/entities/acceptance.entity';
export interface PaymentPort {
  createPayment(payment: Payment): Promise<Payment>;
  createTokenCard(card: Card): Promise<Token | null>;
  getAcceptanceToken(): Promise<Acceptance>;
}
