import nodemailer, { Transporter } from "nodemailer";
import config from "../config";
import { errorLogger, logger } from "../shared/logger";

let transporter: Transporter | null = null;

export function isSmtpConfigured(): boolean {
  const host = config.email.host?.trim();
  const user = config.email.user?.trim();
  const pass = config.email.pass;
  return Boolean(
    host &&
      user &&
      pass !== undefined &&
      pass !== null &&
      String(pass).length > 0
  );
}

function getTransporter(): Transporter {
  if (transporter) {
    return transporter;
  }

  if (!isSmtpConfigured()) {
    errorLogger.error(
      "SMTP misconfigured: need EMAIL_HOST, EMAIL_USER, and a non-empty EMAIL_PASS"
    );
    throw new Error(
      "SMTP is not configured. Set EMAIL_HOST, EMAIL_USER, and EMAIL_PASS in the environment."
    );
  }

  const port = Number(config.email.port) || 587;
  const host = config.email.host!.trim();

  transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    pool: true,
    maxConnections: 5,
    auth: {
      user: config.email.user!.trim(),
      pass: config.email.pass,
    },
    ...(port === 587 ? { requireTLS: true } : {}),
  });

  return transporter;
}

/**
 * Verifies SMTP credentials at startup. Does not throw — logs success or failure.
 */
export async function verifySmtpConnection(): Promise<boolean> {
  try {
    if (!isSmtpConfigured()) {
      logger.warn(
        "SMTP verification skipped — set EMAIL_HOST, EMAIL_USER, and EMAIL_PASS"
      );
      return false;
    }

    const port = Number(config.email.port) || 587;
    logger.info(
      `SMTP verify: host=${config.email.host} port=${port} user=${config.email.user ? "(set)" : "(missing)"}`
    );

    await getTransporter().verify();
    logger.info("SMTP verification succeeded");
    return true;
  } catch (err: any) {
    errorLogger.error(
      `SMTP verify failed — check EMAIL_* vars, firewall, and provider (e.g. app passwords): ${err?.message || err}${err?.code ? ` [code=${err.code}]` : ""}`
    );
    return false;
  }
}

export const sendEmail = async (
  to: string,
  subject: string,
  html: string
) => {
  const port = Number(config.email.port) || 587;

  try {
    if (!to?.trim()) {
      throw new Error("sendEmail: recipient address is empty");
    }

    const preview =
      subject.length > 80 ? `${subject.slice(0, 80)}…` : subject;
    logger.info(`sendEmail: start to=${to.trim()} subject="${preview}"`);

    const transport = getTransporter();
    await transport.sendMail({
      from: config.email.from
        ? `${config.email.from}`
        : `Gift Moment <${config.email.user}>`,
      to: to.trim(),
      subject,
      html,
    });

    logger.info(`sendEmail: success to=${to.trim()}`);
  } catch (err: any) {
    const host = config.email.host || "(unset)";
    const meta = `to=${to} host=${host} port=${port} userConfigured=${Boolean(config.email.user?.trim())} code=${err?.code ?? "n/a"}`;
    const stack = err?.stack ? `\n${err.stack}` : "";
    errorLogger.error(`sendEmail failed (${meta}): ${err?.message || err}${stack}`);
    throw err;
  }
};
