import { Model, Types } from 'mongoose';

export type INotification = {
    text: string;
    message?: string;
    receiver?: Types.ObjectId;
    sender?: Types.ObjectId;
    read: boolean;
    referenceId?: Types.ObjectId;
    screen?: "GIFT" | "BOOKED_CARD" | "CHAT";
    type?: "ADMIN" | "USER";
};

export type NotificationModel = Model<INotification>;