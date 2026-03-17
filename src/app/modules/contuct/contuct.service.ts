import { JwtPayload } from 'jsonwebtoken';
import { IContuct } from './contuct.interface';
import { Contuct } from './contuct.model';
import { emailQueue } from '../../../config/bullMQ.config';
import { User } from '../user/user.model';

const createContuctIntoDB = async (payload: IContuct, user: JwtPayload) => {
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
    const result = await Contuct.create(payload);
    return result;
}
export const ContuctServices = {
    createContuctIntoDB
};
