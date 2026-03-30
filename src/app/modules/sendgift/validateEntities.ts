

import { StatusCodes } from "http-status-codes";
import { USER_ROLES } from "../../../enums/user";
import ApiError from "../../../errors/ApiErrors";
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
        throw new ApiError(StatusCodes.NOT_FOUND, `Card not found with ID: ${payload.cardId}`);
    if (!sender)
        throw new ApiError(StatusCodes.NOT_FOUND, `Sender not found with ID: ${payload.senderId}`);
    if (payload.receiverEmail && !receiver)
        console.log(`Receiver not found with email: ${payload.receiverEmail}`);
    if (sender?.role !== USER_ROLES.USER)
        throw new ApiError(StatusCodes.FORBIDDEN, "Unauthorized to send gifts");
};

const validateSchedule = (bookingDate: string, bookingTime: string): Date => {
    const scheduleDateTime = parseBookingDateTime(bookingDate, bookingTime);

    if (isNaN(scheduleDateTime.getTime()))
        throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid booking date or time format");

    if (scheduleDateTime.getTime() < Date.now() - TOLERANCE_MS)
        throw new ApiError(StatusCodes.BAD_REQUEST, "Booking date and time must be in the future");

    return scheduleDateTime;
};

export { validateEntities, validateSchedule };