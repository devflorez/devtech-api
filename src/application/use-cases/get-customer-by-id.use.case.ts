import { CustomerPort } from "../ports/customer.port";
import { Customer } from "src/domain/entities/customer.entity";

export class GetCustomerByIdUseCase {
  constructor(private readonly customerPort: CustomerPort) {}

  async execute(id: number): Promise<Customer | null> {
    return this.customerPort.findCustomerById(id);
  }
}