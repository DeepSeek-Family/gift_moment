import { Model, Types } from 'mongoose';

export type ISendGift = {
    cardId: Types.ObjectId;
    senderId: Types.ObjectId;
    receiverId?: Types.ObjectId;
    receiverEmail: string;
    message?: string;
    bookingDate: string;
    bookingTime: string;
    status: "sent" | "failed" | "cancelled" | "pending";
};

export type SendGiftModel = Model<ISendGift>;
