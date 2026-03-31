import { Worker } from "bullmq";
import { sendEmail } from "../services/email.service";
import { connectionBullMQ } from "../config/bullMQ.config";
import { SendGift } from "../app/modules/sendgift/sendgift.model";
import { emailTemplate } from "../shared/emailTemplate";
import config from "../config";
import { Cards } from "../app/modules/cards/cards.model";
import { Types } from "mongoose";
import { ChatService } from "../app/modules/chat/chat.service";
import { MessageService } from "../app/modules/message/message.service";
import { sendNotifications } from "../helpers/notificationsHelper";
import { JwtPayload } from "jsonwebtoken";
import { logger, errorLogger } from "../shared/logger";

const giftWorker = new Worker(
    "giftQueue",
    async (job: any) => {
        const { giftId } = job.data;
        try {
            logger.info(`giftQueue processing jobId=${job.id} giftId=${giftId}`);
            const gift = await SendGift.findById(giftId).populate("senderId");
            if (!gift) {
                console.log(`Gift not found`);
            }
            if (!gift?.receiverEmail || !String(gift?.receiverEmail).trim()) {
                console.log(`Gift has no receiver email`);
            }
            const baseUrl = (config as any).app_url?.replace(/\/$/, "") || "http://localhost:9990";
            const card = await Cards.findById((gift as any).cardId as Types.ObjectId);
            const viewGiftUrl = card?.file ? `${baseUrl}/${card.file.replace(/^\//, "")}` : baseUrl;
            const html = emailTemplate.giftEmailTemplate((gift as any).senderId?.name || "Gift Moment", gift?.message || "No message provided", viewGiftUrl);
            try {
                await sendEmail(gift?.receiverEmail as string, "🎁 You received a gift!", html);
            } catch (mailErr: any) {
                errorLogger.error(
                    `giftQueue sendEmail failed giftId=${giftId} to=${gift?.receiverEmail as string}: ${mailErr?.message || mailErr}${mailErr?.code ? ` code=${mailErr.code}` : ""}${mailErr?.stack ? `\n${mailErr.stack}` : ""}`
                );
                throw mailErr;
            }
            gift!.status = "sent";
            await gift?.save();
            //TODO: Need to create chat room with sender and receiver also need to send message to receiver. if receiver is not found then no need to create chat room and send message.
            if ((gift as any).receiverId) {
                const chat: any = await ChatService.createChatToDB((gift as any).senderId?._id, (gift as any).receiverId?._id);
                await MessageService.sendMessageToQueue(
                    {
                        chatId: chat._id as any as Types.ObjectId,
                        sender: (gift as any).senderId?._id,
                        text: gift?.message || "No message provided",
                    },
                    { user: (gift as any).senderId as any as JwtPayload }
                );
                await sendNotifications({
                    text: "Gift received!",
                    receiver: (gift as any).receiverId?._id as any as Types.ObjectId || new Types.ObjectId(),
                    sender: (gift as any).senderId?._id as any as Types.ObjectId,
                    message: `${(gift as any).senderId?.name} sent you a gift`,
                    referenceId: gift?._id as any as Types.ObjectId,
                    screen: "GIFT",
                    type: "ADMIN",
                });
            }
            await sendNotifications({
                text: "Scheduled Gift Sent",
                receiver: (gift as any).receiverId?._id as any as Types.ObjectId || new Types.ObjectId(),
                referenceId: gift?._id as any as Types.ObjectId || new Types.ObjectId(),
                message: `Your birthday card to ${(gift as any).senderId?.name as string} was delivered`,
                sender: (gift as any).senderId?._id as any as Types.ObjectId || new Types.ObjectId(),
                screen: "GIFT",
                type: "USER",
            });
            logger.info(`giftQueue giftId=${gift?._id} email sent, status=sent`);
        } catch (error: any) {
            const msg = error?.message || String(error);
            const stack = error?.stack ? `\n${error.stack}` : "";
            errorLogger.error(
                `giftQueue job failed jobId=${job.id} giftId=${job.data?.giftId}: ${msg}${stack}`
            );
            if (job.data?.giftId) {
                await SendGift.findByIdAndUpdate(job.data.giftId, { status: "failed" });
            }
            throw error;
        }
    },
    { connection: connectionBullMQ, concurrency: 5 }
);

giftWorker.on("ready", () => {
    logger.info("Gift worker ready (giftQueue)");
});

giftWorker.on("error", (err) => {
    errorLogger.error(`Gift worker runtime error: ${err?.message || err}`);
});

giftWorker.on("completed", (job) => {
    logger.info(`giftQueue jobId=${job.id} completed`);
});

giftWorker.on("failed", (job, err) => {
    errorLogger.error(
        `giftQueue jobId=${job?.id} permanently failed: ${err?.message || err}`
    );
});

export default giftWorker;