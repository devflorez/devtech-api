import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { Payment } from 'src/domain/entities/payment.entity';
import { PaymentRepository } from 'src/domain/repositories/payment.repository';
import { PaymentPort } from 'src/application/ports/payment.port';
import { Token } from 'src/domain/entities/token.entity';
import { Card } from 'src/domain/entities/card.entity';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { UnauthorizedException, UnprocessableEntityException } from '@nestjs/common';
import { Acceptance } from 'src/domain/entities/acceptance.entity';
@Injectable()
export class PrismaPaymentRepository implements PaymentRepository, PaymentPort {
  constructor(
    private readonly prisma: PrismaClient,
    private httpService: HttpService,
    private configService: ConfigService,
  ) {}

  async createPayment(payment: Payment): Promise<Payment> {
    const createdPayment = await this.prisma.payment.create({
      data: {
        amount: payment.amount,
        currency: payment.currency,
        status: payment.status,
        transactionId: payment.transactionId,
        reference: payment.reference,
      },
    });
    return new Payment(
      createdPayment.amount,
      createdPayment.currency,
      createdPayment.transactionId,
      createdPayment.status,
      createdPayment.reference,
    );
  }
  async createTokenCard(card: Card): Promise<Token | null> {
    try {
      const response = await this.httpService.axiosRef.post(
        this.configService.get('wompi.apiUrl') + '/tokens/cards',
        {
          number: card.number,
          exp_month: card.exp_month,
          exp_year: card.exp_year,
          cvc: card.cvc,
          card_holder: card.card_holder,
        },
        {
          headers: {
            Authorization: `Bearer ${this.configService.get('wompi.publicKey')}`,
            Content_Type: 'application/json',
          },
        },
      ).then((response) => response.data.data);

      return new Token(
        response.id,
        response.created_at,
        response.brand,
        response.name,
        response.last_four,
        response.bin,
        response.exp_year,
        response.exp_month,
        response.card_holder,
        response.expires_at,
      );
    } catch (error) {
      if (error.response.status === 401) {
        throw new UnauthorizedException('Unauthorized');
      }
      throw new UnprocessableEntityException('Unprocessable Entity');
    }
  }

  async getAcceptanceToken(): Promise<Acceptance> {
    const response = await this.httpService.axiosRef
      .get(this.configService.get('wompi.apiUrl') + '/merchants/' + this.configService.get('wompi.publicKey'))
      .then((response) => response.data);

    return new Acceptance(
      response.data.presigned_acceptance.acceptance_token,
      response.data.presigned_acceptance.permalink,
      response.data.presigned_acceptance.type,
    );
  }
}
