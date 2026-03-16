import { Schema, Types, model } from 'mongoose';
import { IPayment, PaymentModel } from './payment.interface';

const paymentSchema = new Schema<IPayment, PaymentModel>({
    amount: { type: Number, required: true, min: 0 },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    giftId: { type: Schema.Types.ObjectId, ref: 'SendGift', required: true },
    trxId: { type: String, required: true },
    status: { type: String, enum: ['pending', 'success', 'failed'], default: 'pending' },
}, {
    timestamps: true,
});

export const Payment = model<IPayment, PaymentModel>('Payment', paymentSchema);
