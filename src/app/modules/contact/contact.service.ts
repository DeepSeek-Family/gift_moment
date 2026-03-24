import { JwtPayload } from 'jsonwebtoken';

import { emailQueue } from '../../../config/bullMQ.config';
import { User } from '../user/user.model';
import { Contact } from './contact.model';
import { IContact } from './contact.interface';

const createContactIntoDB = async (payload: IContact, user: JwtPayload) => {
    payload.user = user.id;
    const userDetails = await User.findById(payload.user).lean();

    await emailQueue.add(
        "emailQueue",
        {
            to: userDetails?.email || "",
            subject: payload.subject,
            html: "",
        }
    );
    const result = await Contact.create(payload);
    return result;
}
export const ContactServices = {
    createContactIntoDB
};
