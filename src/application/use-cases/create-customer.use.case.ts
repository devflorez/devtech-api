import { CustomerDto, Customer } from 'src/domain/entities/customer.entity';
import { CustomerPort } from '../ports/customer.port';

export class CreateCustomerUseCase {
  constructor(private readonly customerPort: CustomerPort) {}

  async execute(customer: CustomerDto): Promise<Customer> {
    return this.customerPort.createCustomer(customer);
  }
}
