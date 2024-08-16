export interface MailPort {
  sendEmail(
    to: string,
    subject: string,
    template: string,
    context: any,
  ): Promise<void>;
}
