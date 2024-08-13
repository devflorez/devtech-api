import { Shipment, ShipmentDto } from 'src/domain/entities/shipment.entity';
export interface ShipmentRepository {
  createShipment(shipment: ShipmentDto): Promise<Shipment>;
  getShipmentByTransactionId(transactionId: number): Promise<Shipment | null>;
}
