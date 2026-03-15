import { JwtPayload } from 'jsonwebtoken';
import { Cards } from '../cards/cards.model';
import { User } from '../user/user.model';
import { ISendGift } from './sendgift.interface';
import { USER_ROLES } from '../../../enums/user';
import { SendGift } from './sendgift.model';
import { giftQueue } from '../../../config/bullMQ.config';
import { sendNotifications } from '../../../helpers/notificationsHelper';
import { Types } from 'mongoose';
import stripe from '../../../config/stripe';


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
            message: "Failed to create gift or sender not found",
        } as const
    }
    if (sender.role !== USER_ROLES.USER) {
        return {
            status: "unauthorized",
            message: "Unauthorized to create gift",
        } as const
    }

    const result = await SendGift.create(payload);
    console.log("result", result);

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

    // TODO: need to implement payment gateway stripe for this gift
    // if (card.isFree !== true && card.price > 0) {
    //     await stripe.paymentIntents.create({
    //         amount: Number(card.price) * 100,
    //         currency: "usd",
    //         description: `Gift card payment for ${card._id.toString()}`,
    //         // payment_method: payload.paymentMethodId,
    //         confirm: true,
    //     });
    // }
    // *
    // send notification to receiver and sender
    // * / 
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
