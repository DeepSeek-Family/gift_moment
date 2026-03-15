import { Worker } from "bullmq";
import { sendEmail } from "../services/email.service";
import { connectionBullMQ } from "../config/bullMQ.config";
import { SendGift } from "../app/modules/sendgift/sendgift.model";
import { emailTemplate } from "../shared/emailTemplate";
import config from "../config";
import { Cards } from "../app/modules/cards/cards.model";
import { Types } from "mongoose";
import ApiError from "../errors/ApiErrors";
import { StatusCodes } from "http-status-codes";
import { Chat } from "../app/modules/chat/chat.model";
import { ChatService } from "../app/modules/chat/chat.service";
import { MessageService } from "../app/modules/message/message.service";
import { sendNotifications } from "../helpers/notificationsHelper";
const giftWorker = new Worker(
    "giftQueue",
    async (job: any) => {
        const { giftId } = job.data;
        try {
            const gift = await SendGift.findById(giftId).populate("senderId");
            if (!gift) throw new ApiError(StatusCodes.NOT_FOUND, "Gift not found");
            const baseUrl = (config as any).app_url?.replace(/\/$/, "") || "http://localhost:9990";
            const card = await Cards.findById((gift as any).cardId as Types.ObjectId);
            const viewGiftUrl = card?.file ? `${baseUrl}/${card.file.replace(/^\//, "")}` : baseUrl;
            const html = emailTemplate.giftEmailTemplate((gift as any).senderId?.name || "Gift Moment", gift.message || "No message provided", viewGiftUrl);
            await sendEmail(gift.receiverEmail, "🎁 You received a gift!", html);
            gift.status = "sent";
            await gift.save();
            //TODO: Need to create chat room with sender and receiver also need to send message to receiver. if receiver is not found then no need to create chat room and send message.
            if ((gift as any).receiverId) {
                const chat: any = await ChatService.createChatToDB([
                    (gift as any).senderId?._id,
                    (gift as any).receiverId?._id,
                ]);
                await MessageService.sendMessageToDB({
                    chatId: chat._id as any as Types.ObjectId,
                    sender: (gift as any).senderId?._id,
                    text: gift.message || "No message provided",
                });
                await sendNotifications({
                    text: "Gift received!",
                    receiver: (gift as any).receiverId?._id as any as Types.ObjectId || new Types.ObjectId(),
                    sender: (gift as any).senderId?._id as any as Types.ObjectId,
                    message: `${(gift as any).senderId?.name} sent you a gift`,
                    referenceId: gift._id as any as Types.ObjectId,
                    screen: "GIFT",
                    type: "ADMIN",
                });

            }
            await sendNotifications({
                text: "Scheduled Gift Sent",
                receiver: (gift as any).receiverId?._id as any as Types.ObjectId || new Types.ObjectId(),
                referenceId: gift._id as any as Types.ObjectId || new Types.ObjectId(),
                message: `Your birthday card to ${(gift as any).senderId?.name as string} was delivered`,
                sender: (gift as any).senderId?._id as any as Types.ObjectId || new Types.ObjectId(),
                screen: "GIFT",
                type: "USER",
            });
            console.log(`✅ Gift sent and status updated for ${gift._id}`);
        } catch (error) {
            console.error(`❌ Failed to process gift ${job.id}:`, error);
            if (job.data?.giftId) {
                await SendGift.findByIdAndUpdate(job.data.giftId, { status: "failed" });
            }
            throw error;
        }
    },
    { connection: connectionBullMQ, concurrency: 5 }
);

giftWorker.on("ready", () => {
    console.log("✅ Gift worker is ready to process jobs");
});

giftWorker.on("error", (err) => {
    console.error("❌ Gift worker error:", err);
});

giftWorker.on("completed", (job) => {
    console.log(`🎉 Job ${job.id} has been completed ${new Date().toLocaleString()}`);
});

giftWorker.on("failed", (job, err) => {
    console.error(`❌ Job ${job?.id} has failed with error: ${err.message}`);
});

export default giftWorker;