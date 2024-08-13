import { Shipment, ShipmentDto } from 'src/domain/entities/shipment.entity';
export interface ShipmentPort {
  createShipment(shipment: ShipmentDto): Promise<Shipment>;
  getShipmentByTransactionId(transactionId: number): Promise<Shipment | null>;
}
