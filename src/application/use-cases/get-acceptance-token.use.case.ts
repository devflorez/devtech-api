import { PaymentPort } from "../ports/payment.port";
import { Acceptance } from "src/domain/entities/acceptance.entity";

export class GetAcceptanceTokenUseCase {
  constructor(private readonly paymentPort: PaymentPort) {}

  async execute(): Promise<Acceptance> {
    return this.paymentPort.getAcceptanceToken();
  }
}