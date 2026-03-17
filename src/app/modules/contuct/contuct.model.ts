import { Schema, Types, model } from 'mongoose';
import { IContuct, ContuctModel } from './contuct.interface';

const contuctSchema = new Schema<IContuct, ContuctModel>({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    subject: { type: String, required: true },
    message: { type: String, required: true },
}, {
    timestamps: true,
});

export const Contuct = model<IContuct, ContuctModel>('Contuct', contuctSchema);
