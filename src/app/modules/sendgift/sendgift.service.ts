import { Types } from "mongoose";
import { StatusCodes } from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";
import { ISendGift } from "./sendgift.interface";
import { SendGift } from "./sendgift.model";
import { Cards } from "../cards/cards.model";
import { User } from "../user/user.model";
import config from "../../../config";
import ApiError from "../../../errors/ApiErrors";
import { USER_ROLES } from "../../../enums/user";
import stripe from "../../../config/stripe";
import { sendNotifications } from "../../../helpers/notificationsHelper";
import { enqueueGift } from "../../../util/enqueueGift";
import { parseBookingDateTime } from "../../../util/parseBookingDateTime";
import QueryBuilder from "../../builder/queryBuilder";

const TOLERANCE_MS = 60_000;

export const createSendGiftForUserIntoDB = async (
    user: JwtPayload,
    payload: ISendGift
) => {
    payload.senderId = user.id;

    const [card, sender, receiver] = await Promise.all([
        Cards.findById(payload.cardId),
        User.findById(payload.senderId),
        User.findOne({ email: payload.receiverEmail }),
    ]);


    if (!card) console.error(`Card not found with ID: ${payload.cardId}`);
    if (!sender) console.error(`Sender not found with ID: ${payload.senderId}`);
    if (payload.receiverEmail && !receiver) console.error(`Receiver not found with email: ${payload.receiverEmail}`);
    if (sender?.role !== USER_ROLES.USER)
        console.error("Unauthorized to send gifts");

    const scheduleDateTime = parseBookingDateTime(payload.bookingDate, payload.bookingTime);
    if (isNaN(scheduleDateTime.getTime()))
        console.error("Invalid booking date or time format");
    if (scheduleDateTime.getTime() < Date.now() - TOLERANCE_MS)
        console.error("Booking date and time must be in the future");

    if (receiver) payload.receiverId = receiver._id as Types.ObjectId;


    if (card?.isFree !== true && card?.price! > 0) {
        const gift = await SendGift.create({
            ...payload,
            status: "pending",
            paymentStatus: "unpaid",
        });

        let session: Awaited<ReturnType<typeof stripe.checkout.sessions.create>>;
        try {
            session = await stripe.checkout.sessions.create({
                mode: "payment",
                payment_method_types: ["card"],
                line_items: [
                    {
                        price_data: {
                            currency: "usd",
                            unit_amount: Math.round(card?.price! * 100),
                            product_data: {
                                name: "Gift Card",
                                description: payload.message ?? "Gift Card Purchase",
                            },
                        },
                        quantity: 1,
                    },
                ],
                metadata: {
                    giftId: gift._id.toString(),
                    senderId: sender?._id?.toString() ?? "",
                    receiverId: receiver?._id?.toString() ?? "",
                },
                success_url: config.stripe.paymentSuccess,
                cancel_url: config.stripe.paymentCancel,
            });
        } catch (error) {
            await SendGift.findByIdAndDelete(gift._id);
            console.error("Failed to create checkout session");
        }

        await SendGift.findByIdAndUpdate(gift._id, {
            // @ts-ignore
            paymentIntentId: session?.id,
        });

        return {
            // @ts-ignore
            url: session?.url,
            giftId: gift._id,
        };
    }

    const gift = await SendGift.create({
        ...payload,
        status: "pending",
        paymentStatus: "paid",
    });

    await enqueueGift(gift._id, scheduleDateTime);

    await sendNotifications({
        text: "Scheduled Gift Sent",
        receiver: (receiver?._id ?? new Types.ObjectId()) as Types.ObjectId,
        referenceId: gift._id as Types.ObjectId,
        message: `Your birthday card to ${sender?.name} was scheduled`,
        sender: sender?._id as Types.ObjectId,
        screen: "GIFT",
        type: "USER",
    });

    return gift;
};



const getMyGiftsFromDB = async (user: JwtPayload, query: any) => {
    const qb = new QueryBuilder(SendGift.find({ receiverId: user.id }), query).fields().sort().paginate();
    const [result, paginationInfo] = await Promise.all([
        qb.modelQuery.exec(),
        qb.getPaginationInfo(),
    ]);
    return {
        data: result || [],
        pagination: paginationInfo,
    };
}


export const sendGiftServices = {
    createSendGiftForUserIntoDB,
    getMyGiftsFromDB,
};