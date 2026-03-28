import { Types } from "mongoose";
import { Chat } from "../chat/chat.model";
import { Message } from "../message/message.model";

const findOrCreateChat = async (
    senderId: Types.ObjectId,
    receiverId: Types.ObjectId
) => {
    let chat = await Chat.findOne({
        participants: { $all: [senderId, receiverId] },
        status: true,
    });

    if (!chat) {
        chat = await Chat.create({
            participants: [senderId, receiverId],
        });
    }

    return chat;
};


export const sendGiftMessage = async (
    senderId: Types.ObjectId,
    receiverId: Types.ObjectId,
    giftData: {
        giftId: Types.ObjectId;
        message?: string;
        image?: string;
    }
) => {
    const chat = await findOrCreateChat(senderId, receiverId);

    const message = await Message.create({
        chatId: chat._id,
        sender: senderId,
        text: giftData.message ?? "🎁 Sent you a gift card!",
        image: giftData.image ?? undefined,
    });

    return { chat, message };
};
