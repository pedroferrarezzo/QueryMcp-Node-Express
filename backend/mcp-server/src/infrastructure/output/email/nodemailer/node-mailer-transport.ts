import nodemailer, { Transporter } from "nodemailer";
import { ENV } from "../../../../config/env-config";

let transporter: Transporter;

/**
 * Obtém o transporter do Nodemailer
 * @returns Transporter
 */
export const getNodeMailerTransporter = () => {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: ENV.EMAIL_HOST,
      port: ENV.EMAIL_PORT,
      secure: ENV.EMAIL_SECURE,
      auth: {
        user: ENV.EMAIL_USER,
        pass: ENV.EMAIL_PASS,
      },
      pool: true, 
      maxConnections: 5,
    });
  }
  return transporter;
};