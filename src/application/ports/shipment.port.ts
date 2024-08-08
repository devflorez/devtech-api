import { Shipment } from "src/domain/entities/shipment.entity";
export interface ShipmentPort {
  createShipment(shipment: Shipment): Promise<Shipment>;
}
