import { Worker } from "bullmq";
import { sendEmail } from "../services/email.service";
import { connectionBullMQ } from "../config/bullMQ.config";
import { errorLogger, logger } from "../shared/logger";

const worker = new Worker(
  "emailQueue",
  async (job) => {
    try {
      const { to, subject, html } = job.data;
      logger.info(`emailQueue jobId=${job.id} processing to=${to}`);
      await sendEmail(to, subject, html);
      logger.info(`emailQueue jobId=${job.id} completed to=${to}`);
    } catch (error: any) {
      errorLogger.error(
        `emailQueue jobId=${job.id} failed: ${error?.message || error}${error?.stack ? `\n${error.stack}` : ""}`
      );
      throw error;
    }
  },
  {
    connection: connectionBullMQ,
    concurrency: 5,
  },
);


worker.on("ready", () => {
  logger.info("Email worker ready (emailQueue)");
});

worker.on("error", (err) => {
  errorLogger.error(`Email worker runtime error: ${err?.message || err}`);
});

worker.on("completed", (job) => {
  logger.info(`emailQueue jobId=${job.id} completed`);
});

worker.on("failed", (job, err) => {
  errorLogger.error(
    `emailQueue jobId=${job?.id} permanently failed: ${err?.message || err}`
  );
});

export default worker;
