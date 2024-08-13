import { Customer, CustomerDto } from '../../domain/entities/customer.entity';

export interface CustomerPort {
  createCustomer(customer: CustomerDto): Promise<Customer>;
  findCustomerByEmail(email: string): Promise<Customer | null>;
  findCustomerById(id: number): Promise<Customer | null>;
}
