import {Token} from '../../domain/entities/token.entity';
import {Card} from '../../domain/entities/card.entity';
import { PaymentPort } from '../ports/payment.port';

export class CreateTokenCardUseCase {
  constructor(private readonly paymentPort: PaymentPort) {}

  async execute(card: Card): Promise<Token> {
    return this.paymentPort.createTokenCard(card);
  }
}