import { Model, Types } from 'mongoose';

export type IOccasions = {
    image: string;
    name: string;
    isAdmin: Types.ObjectId;
    status: 'active' | 'inactive';
};

export type OccasionsModel = Model<IOccasions>;
