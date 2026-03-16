import Stripe from "stripe";
import { Types } from "mongoose";
import { StatusCodes } from "http-status-codes";
import { SendGift } from "../app/modules/sendgift/sendgift.model";
import ApiError from "../errors/ApiErrors";
import { parseBookingDateTime } from "../util/parseBookingDateTime";
import { enqueueGift } from "../util/enqueueGift";
import { User } from "../app/modules/user/user.model";
import { sendNotifications } from "../helpers/notificationsHelper";
import { Payment } from "../app/modules/payment/payment.model";

export const handleCheckoutSessionCompleted = async (
    session: Stripe.Checkout.Session
) => {
    const { giftId, senderId } = session.metadata ?? {};
    if (!giftId) return;

    const gift = await SendGift.findById(giftId);
    if (!gift) throw new ApiError(StatusCodes.NOT_FOUND, `Gift not found: ${giftId}`);

    await Payment.create({
        amount: (session.amount_total ?? 0) / 100,
        user: new Types.ObjectId(senderId),
        giftId: new Types.ObjectId(giftId),
        trxId: session.payment_intent as string,
        status: "success",
    });

    const scheduleDateTime = parseBookingDateTime(gift.bookingDate, gift.bookingTime);
    await enqueueGift(gift._id, scheduleDateTime);

    const sender = await User.findById(gift.senderId);
    await sendNotifications({
        text: "Scheduled Gift Sent",
        receiver: (gift.receiverId ?? new Types.ObjectId()) as Types.ObjectId,
        referenceId: gift._id as Types.ObjectId,
        message: `Your  card to ${sender?.name ?? "recipient"} was scheduled`,
        sender: gift.senderId as Types.ObjectId,
        screen: "GIFT",
        type: "USER",
    });
};

export const handleCheckoutSessionExpired = async (
    session: Stripe.Checkout.Session
) => {
    const { giftId, senderId } = session.metadata ?? {};
    if (!giftId) return;

    await Payment.create({
        amount: (session.amount_total ?? 0) / 100,
        user: new Types.ObjectId(senderId),
        giftId: new Types.ObjectId(giftId),
        trxId: session.id,
        status: "failed",
    });
};