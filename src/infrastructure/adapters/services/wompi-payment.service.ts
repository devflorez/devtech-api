import { Injectable } from '@nestjs/common';
import { PaymentPort } from '../../../application/ports/payment.port';
import { Payment } from '../../../domain/entities/payment.entity';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class WompiPaymentService implements PaymentPort {
  constructor(private httpService: HttpService) {}

  async createPayment(payment: Payment): Promise<Payment> {
    const response = await this.httpService.axiosRef
      .post('https://sandbox.wompi.co/v1/transactions', {
        amount_in_cents: payment.amount,
        currency: payment.currency,
        acceptance_token: '',
        signature: '',
        customer_email: '',
        reference: '',
        payment_method_type: 'CARD',
        payment_method: {
          type: 'CARD',
          installments: 1,
          token: '',
        },
      })
      .then((response) => response.data);

    return new Payment(
      response.data.amount_in_cents,
      response.data.currency,
      response.data.transaction_id,
      response.data.status,
    );
  }

  async createTokenCard(card: {
    number: string;
    cvc: string;
    exp_month: string;
    exp_year: string;
    card_holder: string;
  }): Promise<string> {
    const response = await this.httpService.axiosRef
      .post('https://sandbox.wompi.co/v1/tokens/cards', {
        number: card.number,
        cvc: card.cvc,
        exp_month: card.exp_month,
        exp_year: card.exp_year,
        card_holder: card.card_holder,
      })
      .then((response) => response.data);
    return response;
  }
}
