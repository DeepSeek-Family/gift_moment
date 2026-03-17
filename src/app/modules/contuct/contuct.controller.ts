import { Request, Response, NextFunction } from 'express';
import { ContuctServices } from './contuct.service';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { StatusCodes } from 'http-status-codes';
const createContuct = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body;

    const contuct = await ContuctServices.createContuctIntoDB(payload, req.user);
    sendResponse(res, {
        statusCode: StatusCodes.CREATED,
        success: true,
        message: "Contuct created successfully",
        data: contuct,
    })
});
export const ContuctController = {
    createContuct
};
