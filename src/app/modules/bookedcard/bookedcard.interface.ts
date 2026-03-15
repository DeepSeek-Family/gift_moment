import { Model, Types } from 'mongoose';

export type IBookedcard = {
    cardId: Types.ObjectId;
    senderId: Types.ObjectId;
    bookingDate: string;
    bookingTime: string;
    receiverEmail: string;
    receiverId: Types.ObjectId;
    message?: string;
    status: "booked" | "cancelled";
};

export type BookedcardModel = Model<IBookedcard>;
