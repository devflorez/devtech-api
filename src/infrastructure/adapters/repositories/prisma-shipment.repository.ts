import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

import { Shipment, ShipmentDto } from 'src/domain/entities/shipment.entity';
import { ShipmentRepository } from 'src/domain/repositories/shipment.repository';
import { ShipmentPort } from 'src/application/ports/shipment.port';

@Injectable()
export class PrismaShipmentRepository
  implements ShipmentRepository, ShipmentPort
{
  constructor(private readonly prisma: PrismaClient) {}

  async createShipment(shipment: ShipmentDto): Promise<Shipment> {
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


  async getShipmentByTransactionId(transactionId: number): Promise<Shipment | null> {
    const shipment = await this.prisma.shipment.findUnique({
      where: { transactionId },
    });

    if (!shipment) {
      return null;
    }

    return new Shipment(
      shipment.transactionId,
      shipment.address,
      shipment.city,
      shipment.postalCode,
      shipment.country,
      shipment.state,
      shipment.status,
    );
  }
}
