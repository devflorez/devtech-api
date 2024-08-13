import { ShipmentPort } from "../ports/shipment.port";
import { Shipment } from "src/domain/entities/shipment.entity";

export class GetShipmentByTransactionIdUseCase {
  constructor(private readonly shipmentPort: ShipmentPort) {}

  async execute(transactionId: number): Promise<Shipment | null> {
    return this.shipmentPort.getShipmentByTransactionId(transactionId);
  }
}