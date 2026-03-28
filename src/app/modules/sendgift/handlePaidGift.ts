import { Types } from "mongoose";
import { Chat } from "../chat/chat.model";
import { Message } from "../message/message.model";
import { createCheckoutSession } from "./createCheckoutSession";
import { ISendGift } from "./sendgift.interface";
import { SendGift } from "./sendgift.model";
import { Cards } from "../cards/cards.model";
import { IMessage } from "../message/message.interface";

export const handlePaidGift = async (
    payload: ISendGift,
    card: any,
    sender: any,
    receiver: any
) => {
    const gift = await SendGift.create({
        ...payload,
        status: "pending",
        paymentStatus: "unpaid",
    });

    const session = await createCheckoutSession(
        card,
        gift,
        sender,
        receiver,
        payload.message
    );

    await SendGift.findByIdAndUpdate(gift._id, {
        paymentIntentId: session.id,
    });

    // TODO: need to send message with this chat id if chat id not found then create a new chat after that then send message
    const giftId = await Cards.findById(card._id);
    await Message.create({
        chatId: (await Chat.findOne({ participants: { $in: [sender._id, receiver._id] } }).select("_id"))?._id as Types.ObjectId,
        sender: sender._id as Types.ObjectId,
        image: giftId?.type === "image" ? giftId?.file : undefined,
        text: "🎉 Gift Moment Card",
    });

    return { url: session.url, giftId: gift._id };
};