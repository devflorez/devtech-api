import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { Payment } from 'src/domain/entities/payment.entity';
import { PaymentRepository } from 'src/domain/repositories/payment.repository';
import { PaymentPort } from 'src/application/ports/payment.port';

@Injectable()
export class PrismaPaymentRepository implements PaymentRepository, PaymentPort {
  constructor(private readonly prisma: PrismaClient) {}

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
}
