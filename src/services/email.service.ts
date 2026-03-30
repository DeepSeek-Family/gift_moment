import nodemailer from "nodemailer";
import config from "../config";
import { errorLogger } from "../shared/logger";

const port = Number(config.email.port) || 587;
const transporter = nodemailer.createTransport({
  host: config.email.host,
  port,
  secure: port === 465,
  pool: true,
  maxConnections: 5,
  auth: {
    user: config.email.user,
    pass: config.email.pass,
  },
  ...(port === 587 ? { requireTLS: true } : {}),
});

export const sendEmail = async (to: string, subject: string, html: string) => {
  try {
    await transporter.sendMail({
      from: config.email.from
        ? `${config.email.from}`
        : `Gift Moment <${config.email.user}>`,
      to,
      subject,
      html,
    });
  } catch (err: any) {
    errorLogger.error(
      `Nodemailer sendMail failed to=${to}: ${err?.message || err}`
    );
    throw err;
  }
};
