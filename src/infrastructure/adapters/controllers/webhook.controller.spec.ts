import { Test, TestingModule } from '@nestjs/testing';
import { WebhookController } from './webhook.controller';
import { HandleWompiEventUseCase } from '../../../application/use-cases/handle-wompi-event.use.case';

describe('WebhookController', () => {
  let controller: WebhookController;
  let handleWompiEventUseCase: HandleWompiEventUseCase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WebhookController],
      providers: [HandleWompiEventUseCase],
    }).compile();

    controller = module.get<WebhookController>(WebhookController);
    handleWompiEventUseCase = module.get<HandleWompiEventUseCase>(
      HandleWompiEventUseCase,
    );
  });

  describe('handleWompiEvent', () => {
    it('should handle wompi event and return response', async () => {
      const event = {
        event: 'transaction.updated',
        data: {
          transaction: {
            id: '1234-1610641025-49201',
            amount_in_cents: 4490000,
            reference: 'MZQ3X2DE2SMX',
            customer_email: 'juan.perez@gmail.com',
            currency: 'COP',
            payment_method_type: 'NEQUI',
            redirect_url: 'https://mitienda.com.co/pagos/redireccion',
            status: 'APPROVED',
            shipping_address: null,
            payment_link_id: null,
            payment_source_id: null,
          },
        },
        environment: 'prod',
        signature: {
          properties: [
            'transaction.id',
            'transaction.status',
            'transaction.amount_in_cents',
          ],
          checksum:
            '3476DDA50F64CD7CBD160689640506FEBEA93239BC524FC0469B2C68A3CC8BD0',
        },
        timestamp: 1530291411,
        sent_at: '2018-07-20T16:45:05.000Z',
      };

      const response = {
        success: true,
        message: 'Event handled',
      };

      jest
        .spyOn(handleWompiEventUseCase, 'execute')
        .mockResolvedValue(response);

      const result = await controller.handleWompiEvent(event);

      expect(handleWompiEventUseCase.execute).toHaveBeenCalledWith(event);
      expect(result).toEqual(response);
    });
  });
});
