import { Customer } from '../../domain/entities/customer.entity';

export interface CustomerPort {
  createCustomer(customer: Customer): Promise<Customer>;
  findCustomerByEmail(email: string): Promise<Customer | null>;
}
