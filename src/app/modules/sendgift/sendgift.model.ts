import { Schema, model } from 'mongoose';
import { ISendGift, SendGiftModel } from './sendgift.interface';

const sendGiftSchema = new Schema<ISendGift, SendGiftModel>({
    cardId: { type: Schema.Types.ObjectId, ref: 'Card', required: true },
    senderId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    receiverId: { type: Schema.Types.ObjectId, ref: 'User', required: false },
    receiverEmail: { type: String, required: true },
    message: { type: String, required: false },
    bookingDate: { type: String, required: true },
    bookingTime: { type: String, required: true },
    status: { type: String, enum: ["sent", "failed", "cancelled", "pending"], default: "pending", required: true },
}, {
    timestamps: true
});
export const SendGift = model<ISendGift, SendGiftModel>('SendGift', sendGiftSchema);
