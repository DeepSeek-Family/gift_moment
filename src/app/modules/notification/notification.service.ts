import { JwtPayload } from 'jsonwebtoken';
import { INotification } from './notification.interface';
import { Notification } from './notification.model';
import QueryBuilder from '../../builder/queryBuilder';
import ApiError from '../../../errors/ApiErrors';
import { StatusCodes } from 'http-status-codes';

// get notifications
const getNotificationFromDB = async (user: JwtPayload, query: Record<string, any>) => {
    const qb = new QueryBuilder(Notification.find({ receiver: user.id }), query).fields().sort().paginate();
    const [result, meta] = await Promise.all([
        qb.modelQuery.exec(),
        qb.getPaginationInfo(),
    ])
    return {
        data: result || [],
        pagination: meta,
    }
};

// read notifications only for user
const readNotificationToDB = async (user: JwtPayload, id: string) => {
    const notification = await Notification.findByIdAndUpdate(id, { read: true }, { new: true }).lean();
    if (!notification) {
        throw new ApiError(StatusCodes.NOT_FOUND, "Notification not found!");
    }
    return notification;
};

export const NotificationService = {
    getNotificationFromDB,
    readNotificationToDB,
};
