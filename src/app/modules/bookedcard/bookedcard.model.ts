import { Schema, model } from 'mongoose';
import { IBookedCard, BookedCardModel } from './bookedcard.interface';


const bookedCardSchema = new Schema<IBookedCard, BookedCardModel>({
    bookingDate: { type: String, required: true },
    bookingTime: { type: String, required: true },
    cardId: { type: Schema.Types.ObjectId, ref: 'Cards', required: true },
    senderId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    receiverId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    receiverEmail: { type: String, required: true },
    message: { type: String },
    status: { type: String, enum: ['booked', 'cancelled'], required: true }
}, {
    timestamps: true
});
bookedCardSchema.index({ cardId: 1, status: 1 });
bookedCardSchema.index({ receiverId: 1, status: 1 });
bookedCardSchema.index({ senderId: 1, status: 1 });
export const BookedCard = model<IBookedCard, BookedCardModel>('BookedCard', bookedCardSchema); 