import { JwtPayload } from 'jsonwebtoken';
import { Model } from 'mongoose';

export type IContact = {
    user: JwtPayload,
    subject: string,
    message: string,
};

export type ContactModel = Model<IContact>;
