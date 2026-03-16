import { Types } from "mongoose";
import { giftQueue } from "../config/bullMQ.config";

export const enqueueGift = async (giftId: Types.ObjectId, scheduleDateTime: Date) => {
    await giftQueue.add(
        "sendGift",
        { giftId: giftId.toString() },
        { delay: Math.max(0, scheduleDateTime.getTime() - Date.now()) }
    );
};

