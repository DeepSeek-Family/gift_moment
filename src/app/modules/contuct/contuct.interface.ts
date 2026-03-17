import { JwtPayload } from 'jsonwebtoken';
import { Model } from 'mongoose';

export type IContuct = {
    user: JwtPayload,
    subject: string,
    message: string,
};

export type ContuctModel = Model<IContuct>;
