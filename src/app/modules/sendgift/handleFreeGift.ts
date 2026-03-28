import { Types } from "mongoose";
import { sendNotifications } from "../../../helpers/notificationsHelper";
import { enqueueGift } from "../../../util/enqueueGift";
import { ISendGift } from "./sendgift.interface";
import { SendGift } from "./sendgift.model";
import { sendGiftMessage } from "./sendGiftMessage";
import { Message } from "../message/message.model";
import { Chat } from "../chat/chat.model";
import { Cards } from "../cards/cards.model";

export const handleFreeGift = async (
    payload: ISendGift,
    sender: any,
    receiver: any,
    scheduleDateTime: Date
) => {
    const gift = await SendGift.create({
        ...payload,
        status: "pending",
        paymentStatus: "paid",
    });

    await enqueueGift(gift._id, scheduleDateTime);

    // Send chat message
    if (receiver) {
        await sendGiftMessage(
            sender._id as Types.ObjectId,
            receiver._id as Types.ObjectId,
            {
                giftId: gift._id as Types.ObjectId,
                message: payload.message ?? "🎁 Sent you a gift card!",
            }
        );
    }

    // Send notification
    await sendGiftNotification(gift, sender, receiver);
    const giftId = await Cards.findById(payload.cardId);
    await Message.create({
        chatId: (await Chat.findOne({ participants: { $in: [sender._id, receiver._id] } }).select("_id"))?._id as Types.ObjectId,
        sender: sender._id as Types.ObjectId,
        image: giftId?.type,
        text: "🎉 Gift Moment Card",
    });
    return gift;
};


const sendGiftNotification = async (
    gift: any,
    sender: any,
    receiver: any
) => {
    await sendNotifications({
        text: "Scheduled Gift Sent",
        receiver: (receiver?._id ?? new Types.ObjectId()) as Types.ObjectId,
        referenceId: gift._id as Types.ObjectId,
        message: `Your birthday card to ${sender?.name} was scheduled`,
        sender: sender?._id as Types.ObjectId,
        screen: "GIFT",
        type: "USER",
    });
};