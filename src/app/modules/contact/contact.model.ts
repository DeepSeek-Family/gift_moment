import { Schema, model } from 'mongoose';    
import { ContactModel, IContact } from './contact.interface';

const contactSchema = new Schema<IContact, ContactModel>({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    subject: { type: String, required: true },
    message: { type: String, required: true },
}, {
    timestamps: true,
});

export const Contact = model<IContact, ContactModel>('Contact', contactSchema);
