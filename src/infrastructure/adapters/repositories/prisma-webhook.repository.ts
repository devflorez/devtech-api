import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

import {
  EventWompi,
  ResponseWompi,
} from '../../../domain/entities/webhook.entity';
import { WebhookRepository } from '../../../domain/repositories/webhook.repository';
import { WebhookPort } from '../../../application/ports/webhook.port';

@Injectable()
export class PrismaWebhookRepository implements WebhookRepository, WebhookPort {
  constructor(private readonly prisma: PrismaClient) {}

  async handleWompiEvent(event: EventWompi): Promise<ResponseWompi> {
    await this.prisma.event.create({
      data: {
        type: 'WOMPI',
        data: JSON.stringify(event),
      },
    });
    return new ResponseWompi(true, 'Event handled');
  }
}
