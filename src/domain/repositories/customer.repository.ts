import { Customer } from '../entities/customer.entity';

export interface CustomerRepository {
  createCustomer(customer: Customer): Promise<Customer>;
  findCustomerByEmail(email: string): Promise<Customer | null>;
}
