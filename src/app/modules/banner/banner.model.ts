import { model, Schema } from 'mongoose';
import { ChatModel, IBanner, } from './banner.interface';

const bannerSchema = new Schema<IBanner, ChatModel>(
    {
        image: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            enum: ["active", "inactive"],
            default: "active",
        },
        isAdmin: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        }

    }
)


export const BannerModel = model<IBanner, ChatModel>('Banner', bannerSchema);