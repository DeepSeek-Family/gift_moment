import { Model, Types } from 'mongoose';

export type IBookedCard = {
    cardId: Types.ObjectId;
    senderId: Types.ObjectId;
    bookingDate: string;
    bookingTime: string;
    receiverEmail: string;
    receiverId: Types.ObjectId;
    message?: string;
    status: "booked" | "cancelled";
};

export type BookedCardModel = Model<IBookedCard>;
