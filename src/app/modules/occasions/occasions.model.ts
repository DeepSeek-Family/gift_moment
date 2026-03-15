import { Schema, model } from 'mongoose';
import { IOccasions, OccasionsModel } from './occasions.interface';

const occasionsSchema = new Schema<IOccasions, OccasionsModel>({
    image: { type: String, required: true },
    name: { type: String, required: true, lowercase: true, unique: true },
    isAdmin: { type: Schema.Types.ObjectId, ref: 'Admin', required: true },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
}, {
    timestamps: true,
});

occasionsSchema.index({ _id: 1 });

export const Occasions = model<IOccasions, OccasionsModel>('Occasions', occasionsSchema);
