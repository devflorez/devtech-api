import {
  Payment,
  PaymentBodyDto,
  PaymentDto,
} from '../../domain/entities/payment.entity';
import { Token } from 'src/domain/entities/token.entity';
import { Card } from 'src/domain/entities/card.entity';
import { Acceptance } from 'src/domain/entities/acceptance.entity';
export interface PaymentPort {
  createPayment(payment: PaymentDto): Promise<Payment>;
  createTokenCard(card: Card): Promise<Token | null>;
  getAcceptanceToken(): Promise<Acceptance>;
  getPaymentByReference(reference: string): Promise<Payment | null>;
  updatePaymentStatus(id: number, status: string): Promise<Payment>;
  getPaymentById(id: number): Promise<Payment | null>;
}
