import { Schema, model } from 'mongoose';
import { IBookedcard, BookedcardModel } from './bookedcard.interface';


const bookedcardSchema = new Schema<IBookedcard, BookedcardModel>({
    bookingDate: { type: String, required: true },
    bookingTime: { type: String, required: true },
    cardId: { type: Schema.Types.ObjectId, ref: 'Card', required: true },
    senderId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    receiverId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    receiverEmail: { type: String, required: true },
    message: { type: String },
    status: { type: String, enum: ['booked', 'cancelled'], required: true }
}, {
    timestamps: true
});
bookedcardSchema.index({ cardId: 1, status: 1 });
bookedcardSchema.index({ receiverId: 1, status: 1 });
bookedcardSchema.index({ senderId: 1, status: 1 });
export const Bookedcard = model<IBookedcard, BookedcardModel>('Bookedcard', bookedcardSchema); 