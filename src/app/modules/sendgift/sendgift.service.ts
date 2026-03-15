import { JwtPayload } from 'jsonwebtoken';
import { Cards } from '../cards/cards.model';
import { User } from '../user/user.model';
import { ISendGift } from './sendgift.interface';
import { USER_ROLES } from '../../../enums/user';
import { SendGift } from './sendgift.model';
import { giftQueue } from '../../../config/bullMQ.config';
import { sendNotifications } from '../../../helpers/notificationsHelper';
import { Types } from 'mongoose';


const createSendGiftForUserIntoDB = async (user: JwtPayload, payload: ISendGift) => {
    payload.senderId = user.id;
    const [card, sender, receiverEmail] = await Promise.all([
        Cards.findById(payload.cardId),
        User.findById(payload.senderId),
        User.findOne({ email: payload.receiverEmail }),
    ]);

    if (receiverEmail) {
        payload.receiverId = receiverEmail._id;
    }

    if (!card || !sender) {
        return {
            status: "card_error",
            message: "Failed to create gift",
        } as const
    }
    if (sender.role !== USER_ROLES.USER) {
        return {
            status: "unauthorized",
            message: "Unauthorized to create gift",
        } as const
    }

    const result = await SendGift.create(payload);
    if (!result) {
        return {
            status: "failed",
            message: "Failed to create gift",
        } as const
    }
    // TODO: need to send email to receiver if email failed than also need to send email to sender
    const scheduleDateTime = new Date(`${payload.bookingDate} ${payload.bookingTime}`);
    if (scheduleDateTime < new Date()) {
        return {
            status: "booking_error",
            message: "Booking date and time must be in the future",
        } as const
    }

    await giftQueue.add(
        "sendGift",
        { giftId: result._id.toString() },
        {
            delay: scheduleDateTime.getTime() - new Date().getTime(),
        }
    );
    await sendNotifications({
        text: "Scheduled Gift Sent",
        receiver: receiverEmail?._id as any as Types.ObjectId || new Types.ObjectId(),
        referenceId: result._id as any as Types.ObjectId,
        message: `Your birthday card to ${sender?.name as string} was scheduled`,
        sender: sender?._id as any as Types.ObjectId,
        screen: "GIFT",
        type: "USER",
    });


    return result;
}

export const SendGiftServices = { createSendGiftForUserIntoDB };
