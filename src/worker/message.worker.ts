import { Worker } from "bullmq";
import { Message } from "../app/modules/message/message.model";

const worker = new Worker("messageQueue", async (job) => {
    const { payload } = job.data;

    // Insert to DB
    const response = await Message.create(payload);

    // @ts-ignore
    const io = global.io;
    if (io) io.emit(`getMessage::${payload.chatId}`, response);

    return response;
});

worker.on("ready", () => {
    console.log("✅ Message worker is ready to process jobs");
});

worker.on("error", (err) => {
    console.error("❌ Message worker error:", err);
});

worker.on("completed", (job) => {
    console.log(
        `🎉 Job ${job.id} has been completed ${new Date().toLocaleString()}`,
    );
});

worker.on("failed", (job, err) => {
    console.error(`❌ Job ${job?.id} has failed with error: ${err.message}`);
});

export default worker;
