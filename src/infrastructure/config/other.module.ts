import { Module } from '@nestjs/common';
import { MailAdapter } from '../adapters/mail/mail.adapter';
@Module({
  imports: [],
  controllers: [],
  providers: [
    {
      provide: 'MailPort',
      useClass: MailAdapter,
    },
  ],
  exports: ['MailPort'],
})
export class OtherModule {}
