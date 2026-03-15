import { Model, Types } from 'mongoose';

export type ICards = {
    file: string;
    isFree: boolean;
    price: number;
    type: "image" | "video";
    isActive: "active" | "inactive";
    occasionId: Types.ObjectId;
    isAdmin: Types.ObjectId;
};

export type CardsModel = Model<ICards>;
