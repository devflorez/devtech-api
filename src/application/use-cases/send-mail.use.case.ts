import { MailPort } from '../ports/mail.port';

export class SendMailUseCase {
  constructor(private readonly mailPort: MailPort) {}

  async execute(
    to: string,
    subject: string,
    template: string,
    context: any,
  ): Promise<void> {
    await this.mailPort.sendEmail(to, subject, template, context);
  }
}
