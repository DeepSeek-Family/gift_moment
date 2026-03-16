import { Model, Types } from 'mongoose';

export type IPayment = {
    amount: number;
    user: Types.ObjectId;
    giftId: Types.ObjectId;
    trxId: string;
    status: "pending" | "success" | "failed";
};

export type PaymentModel = Model<IPayment>;
