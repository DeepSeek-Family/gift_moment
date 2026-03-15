import { Schema, model } from 'mongoose';
import { ICards, CardsModel } from './cards.interface';

const cardsSchema = new Schema<ICards, CardsModel>({
    file: { type: String, required: true },
    isFree: { type: Boolean, required: true },
    price: { type: Number, required: true },
    type: { type: String, enum: ["image", "video"], required: true },
    isActive: { type: String, enum: ["active", "inactive"], default: "active" },
    isAdmin: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    occasionId: { type: Schema.Types.ObjectId, ref: 'Occasions', required: true },

}, {
    timestamps: true,
});

export const Cards = model<ICards, CardsModel>('Cards', cardsSchema);
