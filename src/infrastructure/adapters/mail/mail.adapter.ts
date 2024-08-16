import { createTransport } from 'nodemailer';
import { MailPort } from '../../../application/ports/mail.port';

import * as pug from 'pug';
import { resolve } from 'path';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailAdapter implements MailPort {
  private transporter;

  constructor(private readonly configService: ConfigService) {
    this.transporter = createTransport({
      host: this.configService.get('mail.host'),
      port: this.configService.get('mail.port'),
      auth: {
        user: this.configService.get('mail.user'),
        pass: this.configService.get('mail.pass'),
      },
    });
  }

  async sendEmail(
    to: string,
    subject: string,
    template: string,
    context: unknown,
  ): Promise<void> {
    const templatePath = resolve(`./src/templates/${template}.pug`);
    const html = pug.renderFile(templatePath, context);

    await this.transporter.sendMail({
      from: process.env.SMTP_USER,
      to,
      subject,
      html,
    });
  }
}
