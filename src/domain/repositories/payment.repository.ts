import {
  Payment,
  PaymentBodyDto,
  PaymentDto,
} from '../../domain/entities/payment.entity';
import { Acceptance } from '../entities/acceptance.entity';
import { Card } from '../entities/card.entity';
import { Token } from '../entities/token.entity';

export interface PaymentRepository {
  createPayment(payment: PaymentDto): Promise<Payment>;
  createTokenCard(card: Card): Promise<Token | null>;
  getAcceptanceToken(): Promise<Acceptance>;
  getPaymentByReference(reference: string): Promise<Payment | null>;
  updatePaymentStatus(id: number, status: string): Promise<Payment>;
  getPaymentById(id: number): Promise<Payment | null>;
}
