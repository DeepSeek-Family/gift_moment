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
import QueryBuilder from '../../builder/queryBuilder';


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
    const rawDate = payload.bookingDate;
    const rawTime = payload.bookingTime;
    let formattedDate = rawDate;

    if (/^\d{2}-\d{2}-\d{4}$/.test(rawDate)) {
        const [day, month, year] = rawDate.split("-");
        formattedDate = `${year}-${month}-${day}`;
    }

    const isoString = `${formattedDate}T${rawTime}`;

    const scheduleDateTime = new Date(isoString);
    const timestamp = scheduleDateTime.getTime();
    const now = new Date();
    // 1 minute tolerance window (in milliseconds)
    const toleranceMs = 60_000;
    if (timestamp < (now.getTime() - toleranceMs)) {
        return {
            status: "booking_error",
            message: "Booking date and time must be in the future!",
        } as const;
    }
    let delay = timestamp - now.getTime();
    if (delay < 0) {
        delay = 0; // run immediately
    }

    await giftQueue.add(
        "sendGift",
        { giftId: result._id.toString() },
        {
            delay: Number.isFinite(delay) ? delay : 0,
            attempts: 3,
            backoff: {
                type: "exponential",
                delay: 5000,
            },
        }
    );

    // TODO: need to implement payment gateway stripe for this gift
    // if (card.isFree !== true && card.price > 0) {
    //     await stripe.paymentIntents.create({
    //         amount: Number(card.price) * 100,
    //         currency: "usd",
    //         description: `Gift card payment for ${card._id.toString()}`,
    //         payment_method: payload.paymentMethodId || "card_default",
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



// my all gift
const getMyGiftsFromDB = async (user: JwtPayload, query: Record<string, any>) => {
    const qb = new QueryBuilder(SendGift.find({ receiverId: user.id }), query).fields().sort().paginate().populate(["cardId", "receiverId"], {});
    const [result, paginationInfo] = await Promise.all([
        qb.modelQuery.exec(),
        qb.getPaginationInfo(),
    ]);
    return {
        data: result || [],
        pagination: paginationInfo,
    };
}

export const SendGiftServices = { createSendGiftForUserIntoDB, getMyGiftsFromDB };
