import { TransactionPort } from '../ports/transaction.port';
import { CustomerPort } from '../ports/customer.port';
import { PaymentPort } from '../ports/payment.port';
import { ShipmentPort } from '../ports/shipment.port';
import { Transaction } from '../../domain/entities/transaction.entity';
import { Customer } from '../../domain/entities/customer.entity';
import { Payment } from '../../domain/entities/payment.entity';
import { Shipment } from '../../domain/entities/shipment.entity';

export class CreateTransactionUseCase {
  constructor(
    private customerPort: CustomerPort,
    private transactionPort: TransactionPort,
    private paymentPort: PaymentPort,
    private shipmentPort: ShipmentPort,
  ) {}

  async execute(
    customerData: { name: string; email: string },
    transactionData: {
      productTransactions: { productId: number; quantity: number }[];
      total: number;
    },
    paymentData: { amount: number; currency: string },
    shipmentData: {
      address: string;
      city: string;
      postalCode: string;
      country: string;
      state: string;
    },
  ): Promise<Transaction> {
    let customer = await this.customerPort.findCustomerByEmail(
      customerData.email,
    );
    if (!customer) {
      customer = await this.customerPort.createCustomer(
        new Customer(0, customerData.name, customerData.email),
      );
    }

    const transaction = new Transaction(
      customer.id,
      transactionData.productTransactions.reduce(
        (sum, pt) => sum + pt.quantity,
        0,
      ),
      transactionData.total,
      'PENDING',
      transactionData.productTransactions.map((pt) => ({
        productId: pt.productId,
        quantity: pt.quantity,
      })),
    );

    const createdTransaction =
      await this.transactionPort.createTransaction(transaction);

    const payment = new Payment(
      paymentData.amount,
      paymentData.currency,
      createdTransaction.id,
      'PENDING',
      new Date().toISOString() + Math.random().toString(36).substring(7) +  createdTransaction.id,
    );

    await this.paymentPort.createPayment(payment);

    const shipment = new Shipment(
      createdTransaction.id,
      shipmentData.address,
      shipmentData.city,
      shipmentData.state,
      shipmentData.country,
      shipmentData.postalCode,
      'PENDING',
    );

    await this.shipmentPort.createShipment(shipment);

    return createdTransaction;
  }
}
