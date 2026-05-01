import { Transporter } from "nodemailer";
import { EmailClient } from "../email-client";

/**
 * Implementação concreta usando SMTP (ex: Nodemailer)
 */
export class NodeMailerClient implements EmailClient {
  
  constructor(
    private readonly transporter: Transporter,
    private readonly from: string
  ) {}

  /**
   * Envia um e-mail usando Nodemailer
   * @param to destinatário(s)
   * @param subject assunto
   * @param body conteúdo (HTML)
   */
  async sendEmail(
    to: string | string[],
    subject: string,
    body: string
  ): Promise<void> {
    await this.transporter.sendMail({
      from: this.from,
      to,
      subject,
      html: body,
    });
  }
}