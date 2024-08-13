import { Body, Controller, Post, Version } from '@nestjs/common';

import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { HandleWompiEventUseCase } from 'src/application/use-cases/handle-wompi-event.use.case';
import { EventWompi, ResponseWompi } from 'src/domain/entities/webhook.entity';

@ApiTags('webhooks')
@Controller('webhooks')
export class WebhookController {
  constructor(
    private readonly handleWompiEventUseCase: HandleWompiEventUseCase,
  ) {}

  @Version('1')
  @Post('wompi')
  @ApiOperation({ summary: 'Handle wompi event' })
  @ApiBody({ type: EventWompi, examples: {} })
  @ApiResponse({
    status: 200,
    description: 'Return response wompi',
    example: {
      success: true,
      message: 'Event handled',
    },
  })
  async handleWompiEvent(@Body() event: EventWompi): Promise<ResponseWompi> {
    return this.handleWompiEventUseCase.execute(event);
  }
}
