import { Request, Response, NextFunction } from 'express';
import sendResponse from '../../../shared/sendResponse';
import catchAsync from '../../../shared/catchAsync';
import { StatusCodes } from 'http-status-codes';
import { sendGiftServices } from './sendgift.service';

const sendGift = catchAsync(async (req: Request, res: Response) => {
    const user = req.user;
    const payload = req.body;
    const result = await sendGiftServices.createSendGiftForUserIntoDB(user, payload);
    if ('status' in result && result.status === "failed") {
        return sendResponse(res, {
            statusCode: StatusCodes.BAD_REQUEST,
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


const getMyGifts = catchAsync(async (req: Request, res: Response) => {
    const user = req.user;
    const query = req.query;
    const result = await sendGiftServices.getMyGiftsFromDB(user, query);
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'My gifts retrieved successfully',
        data: result.data,
        pagination: result.pagination,
    });
});


export const SendGiftController = { sendGift, getMyGifts };
