import { Model, Types } from 'mongoose';

export type ISendGift = {
    cardId: Types.ObjectId;
    senderId: Types.ObjectId;
    receiverId?: Types.ObjectId;
    receiverEmail: string;
    message?: string;
    bookingDate: string;
    bookingTime: string;
    paymentIntentId?: string; // store Stripe session ID for later verification
    status: "sent" | "failed" | "cancelled" | "pending";
    paymentStatus?: "unpaid" | "paid" | "failed"; // track payment status for paid gifts
};

export type SendGiftModel = Model<ISendGift>;
