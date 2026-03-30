import { Types } from "mongoose";
import { giftQueue } from "../config/bullMQ.config";
import { logger } from "../shared/logger";

export const enqueueGift = async (giftId: Types.ObjectId, scheduleDateTime: Date) => {
    const delayMs = Math.max(0, scheduleDateTime.getTime() - Date.now());
    const job = await giftQueue.add(
        "sendGift",
        { giftId: giftId.toString() },
        { delay: delayMs }
    );
    const runAt = new Date(Date.now() + delayMs).toISOString();
    logger.info(
        `giftQueue scheduled jobId=${job.id} giftId=${giftId.toString()} delayMs=${delayMs} runAt=${runAt}`
    );
};

