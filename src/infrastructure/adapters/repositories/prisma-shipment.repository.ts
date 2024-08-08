import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

import { Shipment } from 'src/domain/entities/shipment.entity';
import { ShipmentRepository } from 'src/domain/repositories/shipment.repository';
import { ShipmentPort } from 'src/application/ports/shipment.port';

@Injectable()
export class PrismaShipmentRepository
  implements ShipmentRepository, ShipmentPort
{
  constructor(private readonly prisma: PrismaClient) {}

  async createShipment(shipment: Shipment): Promise<Shipment> {
    const createdShipment = await this.prisma.shipment.create({
      data: {
        transactionId: shipment.transactionId,
        address: shipment.address,
        city: shipment.city,
        postalCode: shipment.postalCode,
        country: shipment.country,
        state: shipment.state,
        status: 'PENDING',
      },
    });
    return new Shipment(
      createdShipment.transactionId,
      createdShipment.address,
      createdShipment.city,
      createdShipment.postalCode,
      createdShipment.country,
      createdShipment.state,
      createdShipment.status,
    );
  }
}
