import { Worker } from "bullmq";
import { sendEmail } from "../services/email.service";
import { connectionBullMQ } from "../config/bullMQ.config";
import { SendGift } from "../app/modules/sendgift/sendgift.model";
import { emailTemplate } from "../shared/emailTemplate";
import config from "../config";
import { Cards } from "../app/modules/cards/cards.model";
import { Types } from "mongoose";
const giftWorker = new Worker(
    "giftQueue",
    async (job: any) => {
        const { giftId } = job.data;
        try {
            const gift = await SendGift.findById(giftId).populate("senderId");
            if (!gift) throw new Error("Gift not found");
            const baseUrl = (config as any).app_url?.replace(/\/$/, "") || "http://localhost:9990";
            const card = await Cards.findById((gift as any).cardId as Types.ObjectId);
            const filePath = card?.file ? card.file.replace(/^\//, "") : "";
            const viewGiftUrl = `${baseUrl}/${filePath}`;

            const html = emailTemplate.giftEmailTemplate(
                (gift as any).senderId?.name || "Gift Moment",
                gift.message || "No message provided",
                viewGiftUrl
            );

            await sendEmail(gift.receiverEmail, "🎁 You received a gift!", html);

            gift.status = "sent";
            await gift.save();

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