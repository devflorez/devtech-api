import { ShipmentDto, Shipment } from "src/domain/entities/shipment.entity";
import { ShipmentPort } from "../ports/shipment.port";

export class CreateShipmentUseCase {
  constructor(private readonly shipmentPort: ShipmentPort) {}

  async execute(shipment: ShipmentDto): Promise<Shipment> {
    return this.shipmentPort.createShipment(shipment);
  }
}