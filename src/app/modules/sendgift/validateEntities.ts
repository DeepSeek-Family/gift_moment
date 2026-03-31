

import { StatusCodes } from "http-status-codes";
import { USER_ROLES } from "../../../enums/user";
import { parseBookingDateTime } from "../../../util/parseBookingDateTime";
import { ISendGift } from "./sendgift.interface";

const TOLERANCE_MS = 60_000; // 1 minute

const validateEntities = (
    card: any,
    sender: any,
    receiver: any,
    payload: ISendGift
) => {
    if (!card)
        console.log(`Card not found with ID: ${payload.cardId}`);
    if (!sender)
        console.log(`Sender not found with ID: ${payload.senderId}`);
    if (payload.receiverEmail && !receiver)
        console.log(`Receiver not found with email: ${payload.receiverEmail}`);
    if (sender?.role !== USER_ROLES.USER)
        console.log(`Unauthorized to send gifts`);
};

const validateSchedule = (bookingDate: string, bookingTime: string): Date => {
    const scheduleDateTime = parseBookingDateTime(bookingDate, bookingTime);

    if (isNaN(scheduleDateTime.getTime()))
        console.log(`Invalid booking date or time format`);

    if (scheduleDateTime.getTime() < Date.now() - TOLERANCE_MS)
        console.log(`Booking date and time must be in the future`);

    return scheduleDateTime;
};

export { validateEntities, validateSchedule };