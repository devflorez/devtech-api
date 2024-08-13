import { EventWompi, ResponseWompi } from "../entities/webhook.entity";

export interface WebhookRepository {
  handleWompiEvent(event: EventWompi): Promise<ResponseWompi>;
}
