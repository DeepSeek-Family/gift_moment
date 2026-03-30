import { Queue, QueueOptions } from "bullmq";

/**
 * Single source of truth for Redis — ioredis (`redis.config.ts`) spreads this
 * so queues/workers and the ping client never point at different instances.
 */
const bullMQHost =
  process.env.BULLMQIP || process.env.REDIS_HOST || "127.0.0.1";
const bullMQPort = process.env.BULLMQPORT || process.env.REDIS_PORT || 6379;

const redisPassword = process.env.REDIS_PASSWORD;

/** Plain options — use for ioredis (avoid spreading BullMQ-typed connection objects). */
export const redisConnectionOptions = {
  host: bullMQHost,
  port: Number(bullMQPort),
  ...(redisPassword ? { password: redisPassword } : {}),
};

export const connectionBullMQ: QueueOptions["connection"] =
  redisConnectionOptions;

const createQueue = (name: string) => {
  return new Queue(name, {
    connection: connectionBullMQ,
    defaultJobOptions: {
      attempts: 3,
      backoff: {
        type: "exponential",
        delay: 5000,
      },
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
export const messageQueue = createQueue("messageQueue");

