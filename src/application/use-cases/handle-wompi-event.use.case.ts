import { TransactionPort } from '../ports/transaction.port';
import { WebhookPort } from '../ports/webhook.port';
import { EventWompi, ResponseWompi } from 'src/domain/entities/webhook.entity';
import { BadRequestException } from '@nestjs/common';
import { PaymentPort } from '../ports/payment.port';
import { ProductPort } from '../ports/product.port';
import { MailPort } from '../ports/mail.port';
import { CustomerPort } from '../ports/customer.port';
import { ShipmentPort } from '../ports/shipment.port';

export class HandleWompiEventUseCase {
  constructor(
    private readonly webhookPort: WebhookPort,
    private readonly transactionPort: TransactionPort,
    private readonly paymentPort: PaymentPort,
    private readonly productPort: ProductPort,
    private readonly mailPort: MailPort,
    private readonly customerPort: CustomerPort,
    private readonly shipmentPort: ShipmentPort,
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

    const customer = await this.customerPort.findCustomerById(
      transaction.customerId,
    );

    const shipment = await this.shipmentPort.getShipmentByTransactionId(
      transaction.id,
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
       this.mailPort.sendEmail(
        customer.email,
        'Compra exitosa',
        'payment-approved',
        {
          shipping: {
            address: shipment.address,
            city: shipment.city,
            state: shipment.state,
            postalCode: shipment.postalCode,
            country: shipment.country,
          },
          customer,
          products: transaction.productTransactions.map((product) => ({
            quantity: product.quantity,
            name: product.product.name,
            price: product.product.price,
            image: product.product.imageUrl,
          })),
          totalPrice: new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
          }).format(transaction.total),
        },
      );
    }

    if (event.data.transaction.status === 'REJECTED') {
      await this.transactionPort.updateTransactionStatus(
        transaction.id,
        'REJECTED',
      );
      await this.paymentPort.updatePaymentStatus(payment.id, 'REJECTED');
       this.mailPort.sendEmail(
        customer.email,
        'Compra rechazada',
        'payment-rejected',
        {
          shipping: {
            address: shipment.address,
            city: shipment.city,
            state: shipment.state,
            postalCode: shipment.postalCode,
            country: shipment.country,
          },
          customer,
          products: transaction.productTransactions.map((product) => ({
            quantity: product.quantity,
            name: product.product.name,
            price: product.product.price,
            image: product.product.imageUrl,
          })),
          totalPrice: new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
          }).format(transaction.total),
        },
      );
    }

    return this.webhookPort.handleWompiEvent(event);
  }
}
