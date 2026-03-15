import { Model, Types } from 'mongoose';

export type IBanner = {
    image: string;
    status: "active" | "inactive";
    isAdmin: Types.ObjectId;
}

export type ChatModel = Model<IBanner, Record<string, unknown>>;