import { Queue, QueueOptions } from "bullmq";
import config from ".";

const bullMQHost = process.env.BULLMQIP || process.env.REDIS_HOST || "localhost";
const bullMQPort = process.env.BULLMQPORT || process.env.REDIS_PORT || 6379;

export const connectionBullMQ: QueueOptions["connection"] = {
  host: bullMQHost,
  port: Number(bullMQPort),
};

const createQueue = (name: string) => {
  return new Queue(name, {
    connection: connectionBullMQ,
    defaultJobOptions: {
      attempts: 3,
      backoff: { type: "exponential", delay: 5000 },
      removeOnComplete: {
        age: 3600,
        count: 100,
      },
      removeOnFail: false,
    },
  });
};

export const emailQueue = createQueue("emailQueue");
export const giftQueue = createQueue("giftQueue");

