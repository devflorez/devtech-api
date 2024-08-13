import { EventWompi, ResponseWompi } from 'src/domain/entities/webhook.entity';

export interface WebhookPort {
  handleWompiEvent(event: EventWompi): Promise<ResponseWompi>;
}
