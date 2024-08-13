import { TransactionPort } from '../ports/transaction.port';
import { WebhookPort } from '../ports/webhook.port';
import { EventWompi, ResponseWompi } from 'src/domain/entities/webhook.entity';
import { BadRequestException } from '@nestjs/common';
import { PaymentPort } from '../ports/payment.port';
import { ProductPort } from '../ports/product.port';

export class HandleWompiEventUseCase {
  constructor(
    private readonly webhookPort: WebhookPort,
    private readonly transactionPort: TransactionPort,
    private readonly paymentPort: PaymentPort,
    private readonly productPort: ProductPort,
  ) {}

  async execute(event: EventWompi): Promise<ResponseWompi> {
    if (event.data.transaction.status === 'PENDING') {
      return {
        success: true,
        message: 'Event handled',
      };
    }

    const payment = await this.paymentPort.getPaymentByReference(
      event.data.transaction.reference,
    );

    if (!payment) {
      throw new BadRequestException('Payment not found');
    }

    const transaction = await this.transactionPort.getTransactionById(
      payment.transactionId,
    );

    if (!transaction) {
      throw new BadRequestException('Transaction not found');
    }

    if (event.data.transaction.status === 'APPROVED') {
      await this.transactionPort.updateTransactionStatus(
        transaction.id,
        'APPROVED',
      );
      await this.paymentPort.updatePaymentStatus(payment.id, 'APPROVED');
      for (const product of transaction.productTransactions) {
        await this.productPort.updateStockProduct(
          product.productId,
          product.quantity,
          'decrement',
        );
      }
    }

    if (event.data.transaction.status === 'REJECTED') {
      await this.transactionPort.updateTransactionStatus(
        transaction.id,
        'REJECTED',
      );
      await this.paymentPort.updatePaymentStatus(payment.id, 'REJECTED');
    }

    return this.webhookPort.handleWompiEvent(event);
  }
}
