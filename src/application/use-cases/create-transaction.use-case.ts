import { TransactionBodyDto } from './../../domain/entities/transaction.entity';
import { TransactionPort } from '../ports/transaction.port';
import { CustomerPort } from '../ports/customer.port';
import { ShipmentPort } from '../ports/shipment.port';
import { Transaction } from '../../domain/entities/transaction.entity';
import { CustomerDto } from '../../domain/entities/customer.entity';
import { ProductTransactionDto } from 'src/domain/entities/product-transaction.entity';

export class CreateTransactionUseCase {
  constructor(
    private customerPort: CustomerPort,
    private transactionPort: TransactionPort,
    private shipmentPort: ShipmentPort,
  ) {}

  async execute(transactionBodyDto: TransactionBodyDto
  ): Promise<Transaction> {
    let customer = await this.customerPort.findCustomerByEmail(
      transactionBodyDto.customer.email,
    );
    if (!customer) {
      customer = await this.customerPort.createCustomer(transactionBodyDto.customer);
    }

    const createdTransaction = await this.transactionPort.createTransaction({
      customerId: customer.id,
      productTransactions: transactionBodyDto.productTransactions,
      total: transactionBodyDto.total,
    });

    const { shipment } = transactionBodyDto;

     await this.shipmentPort.createShipment({
      address: shipment.address,
      city: shipment.city,
      state: shipment.state,
      country: shipment.country,
      postalCode: shipment.postalCode,
      transactionId: createdTransaction.id,
      status: 'PENDING',
    });
    return createdTransaction;
  }
}
