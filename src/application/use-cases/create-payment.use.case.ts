import { PaymentBodyDto } from 'src/domain/entities/payment.entity';
import { PaymentPort } from '../ports/payment.port';
import { CustomerPort } from '../ports/customer.port';
import { ShipmentPort } from '../ports/shipment.port';
import { TransactionPort } from '../ports/transaction.port';
import { UnauthorizedException, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import * as crypto from 'crypto'; // Use `import * as` to ensure proper import

export class CreatePaymentUseCase {
  constructor(
    private readonly paymentPort: PaymentPort,
    private customerPort: CustomerPort,
    private shipmentPort: ShipmentPort,
    private transactionPort: TransactionPort,
    private configService: ConfigService,
    private httpService: HttpService,
  ) {}

  async execute(payment: PaymentBodyDto) {
    const transaction = await this.transactionPort.getTransactionById(
      payment.transaction_id,
    );
    if (!transaction) {
      throw new BadRequestException('Transaction not found');
    }

    const customer = await this.customerPort.findCustomerById(
      transaction.customerId,
    );

    if (!customer) {
      throw new UnauthorizedException('Customer not found');
    }

    const shipment = await this.shipmentPort.getShipmentByTransactionId(
      transaction.id,
    );

    if (!shipment) {
      throw new BadRequestException('Shipment not found');
    }

    const REFERENCE =
      'ref-' +
      Math.floor(Math.random() * 1000000) +
      transaction.id +
      '-' +
      shipment.id +
      '-' +
      customer.id;

    const AMOUNT_IN_CENTS = transaction.total * 100;

    const SIGNATURE =
      REFERENCE +
      AMOUNT_IN_CENTS +
      'COP' +
      this.configService.get('wompi.integrity');

    // Encrypt SIGNATURE using SHA256 with Node.js crypto module
    const hash = crypto.createHash('sha256').update(SIGNATURE).digest('hex');

    const body = {
      acceptance_token: payment.acceptance_token,
      amount_in_cents: AMOUNT_IN_CENTS,
      currency: 'COP',
      customer_email: customer.email,
      payment_method: {
        type: payment.payment_method.type,
        installments: payment.payment_method.installments,
        token: payment.payment_method.token,
      },
      reference: REFERENCE,
      signature: hash,
      session_id: payment.session_id,
      shipping_address: {
        address_line_1: shipment.address,
        city: shipment.city,
        country: shipment.country,
        postal_code: shipment.postalCode,
        region: shipment.state,
        phone_number: customer.phoneNumber,
      },
    };

    let paymentTransaction;
    try {
      paymentTransaction = await this.httpService.axiosRef
        .post(this.configService.get('wompi.apiUrl') + '/transactions', body, {
          headers: {
            Authorization: `Bearer ${this.configService.get('wompi.privateKey')}`,
            Content_Type: 'application/json',
          },
        })
        .then((response) => response.data.data);
    } catch (error) {
      throw new BadRequestException('Error creating payment');
    }

    return this.paymentPort.createPayment({
      amount: AMOUNT_IN_CENTS,
      reference: REFERENCE,
      currency: 'COP',
      status: paymentTransaction.status,
      wompiTransactionId: paymentTransaction.id,
      transactionId: transaction.id,
      type: payment.payment_method.type,
      installments: payment.payment_method.installments,
      token: payment.payment_method.token,
    });
  }
}
