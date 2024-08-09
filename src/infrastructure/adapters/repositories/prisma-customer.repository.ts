import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { Customer, CustomerDto } from 'src/domain/entities/customer.entity';
import { CustomerRepository } from 'src/domain/repositories/customer.repository';
import { CustomerPort } from 'src/application/ports/customer.port';

@Injectable()
export class PrismaCustomerRepository
  implements CustomerRepository, CustomerPort
{
  constructor(private readonly prisma: PrismaClient) {}

  async createCustomer(customer: CustomerDto): Promise<Customer> {
    const createdCustomer = await this.prisma.customer.create({
      data: {
        name: customer.name,
        email: customer.email,
      },
    });

    return new Customer(
      createdCustomer.id,
      createdCustomer.name,
      createdCustomer.email,
    );
  }

  async findCustomerByEmail(email: string): Promise<Customer | null> {
    const customer = await this.prisma.customer.findUnique({
      where: { email },
    });

    if (!customer) {
      return null;
    }

    return new Customer(customer.id, customer.name, customer.email);
  }
}
