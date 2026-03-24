import { Worker, Job } from "bullmq";
import { IMessage } from "../app/modules/message/message.interface";
import { Message } from "../app/modules/message/message.model";
import { connectionBullMQ } from "../config/bullMQ.config";
import { sendNotifications } from "../helpers/notificationsHelper";
import { Chat } from "../app/modules/chat/chat.model";
import { Types } from "mongoose";

const messageWorker = new Worker(
    "messageQueue",
    async (job: Job) => {
        const { payload } = job.data as { payload: IMessage };

        try {
            // Save message to DB
            const savedMessage = await Message.create(payload);
            console.log(`✅ Message saved to DB: ${savedMessage._id}`);
            const chat = await Chat.findById(payload.chatId);
            //  CALL NOTIFICATION HERE
            await sendNotifications({
                text: "New message received",
                receiver: chat?.participants.find((participant: Types.ObjectId) => participant.toString() !== payload.sender.toString()) as Types.ObjectId,
                sender: payload.sender,
                message: payload.text,
                referenceId: savedMessage._id,
                screen: "CHAT",
                type: "USER",
            });

            console.log(`🔔 Notification sent → User: ${chat?.participants.find((participant: Types.ObjectId) => participant.toString() !== payload.sender.toString()) as Types.ObjectId}`);

            return { success: true, message: "Message sent successfully" };

        } catch (error) {
            console.error("Message Worker Error:", error);
            throw error;
        }
    },
    {
        connection: connectionBullMQ,
        concurrency: 5,
    }
);

messageWorker.on("completed", (job) => {
    console.log(`😁😁😁 Queue completed successfully`);
});

messageWorker.on("failed", (job, err) => {
    console.error(`❌ Queue failed: ${job?.id}`, err);
});
messageWorker.on("failed", (job, err) => {
    if (!job) return;

    const attemptsMade = job.attemptsMade;
    const maxAttempts = job.opts.attempts ?? 1;

    if (attemptsMade < maxAttempts) {
        console.log(
            `🔁 Retrying Queue ${job.id} (${attemptsMade}/${maxAttempts})`
        );
    } else {
        console.error(`💀 Queue permanently failed: ${job.id}`, err);
    }
});

export default messageWorker;