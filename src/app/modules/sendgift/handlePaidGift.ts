import { Types } from "mongoose";
import { Chat } from "../chat/chat.model";
import { Message } from "../message/message.model";
import { createCheckoutSession } from "./createCheckoutSession";
import { ISendGift } from "./sendgift.interface";
import { SendGift } from "./sendgift.model";
import { Cards } from "../cards/cards.model";
import { IMessage } from "../message/message.interface";

const findOrCreateChatId = async (
    senderId: Types.ObjectId,
    receiverId: Types.ObjectId
) => {
    let chat = await Chat.findOne({
        participants: { $all: [senderId, receiverId] },
        status: true,
    }).select("_id");

    if (!chat) {
        chat = await Chat.create({
            participants: [senderId, receiverId],
        });
    }

    return chat._id as Types.ObjectId;
};

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

    // Only create/send chat message if receiver exists
    if (receiver) {
        const chatId = await findOrCreateChatId(
            sender._id as Types.ObjectId,
            receiver._id as Types.ObjectId
        );
        await Message.create({
            chatId,
            sender: sender._id as Types.ObjectId,
            image: giftId?.type === "image" ? giftId?.file : undefined,
            text: "🎉 Gift Moment Card",
        });
    }

    return { url: session.url, giftId: gift._id };
};