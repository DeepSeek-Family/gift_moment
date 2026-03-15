import { Request, Response, NextFunction } from 'express';
import { SendGiftServices } from './sendgift.service';
import sendResponse from '../../../shared/sendResponse';
import catchAsync from '../../../shared/catchAsync';
import { StatusCodes } from 'http-status-codes';

const sendGift = catchAsync(async (req: Request, res: Response) => {
    const user = req.user;
    const payload = req.body;
    const result = await SendGiftServices.createSendGiftForUserIntoDB(user, payload);
    if ('status' in result && result.status === "failed") {
        return sendResponse(res, {
            statusCode: StatusCodes.BAD_REQUEST,
            success: false,
            message: result.message,
        });
    }
    if ('status' in result && result.status === "booking_error") {
        return sendResponse(res, {
            statusCode: StatusCodes.BAD_REQUEST,
            success: false,
            message: result.message,
        });
    }
    if ('status' in result && result.status === "card_error") {
        return sendResponse(res, {
            statusCode: StatusCodes.BAD_REQUEST,
            success: false,
            message: result.message,
        });
    }
    if ('status' in result && result.status === "unauthorized") {
        return sendResponse(res, {
            statusCode: StatusCodes.UNAUTHORIZED,
            success: false,
            message: result.message,
        });
    }
    sendResponse(res, {
        statusCode: StatusCodes.CREATED,
        success: true,
        message: 'Gift sent successfully',
        data: result,
    });
});

export const SendGiftController = { sendGift };
