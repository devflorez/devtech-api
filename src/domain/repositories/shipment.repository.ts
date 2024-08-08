import { Shipment } from 'src/domain/entities/shipment.entity';
export interface ShipmentRepository {
  createShipment(shipment: Shipment): Promise<Shipment>;
}
