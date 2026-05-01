/**
 * Cliente genérico para envio de e-mails
 */
export interface EmailClient {
  /**
   * Envia um e-mail
   * @param to destinatário(s)
   * @param subject assunto
   * @param body conteúdo (texto ou HTML)
   */
  sendEmail(
    to: string | string[],
    subject: string,
    body: string
  ): Promise<void>;
}