import { Request, Response, NextFunction } from 'express';
import { PaymentServices } from './payment.service';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
const getAllPayments = catchAsync(async (req: Request, res: Response) => {
    const result = await PaymentServices.getAllPaymentsFromDB();
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Payments retrieved successfully',
        pagination: result.pagination,
        data: result.data,
    });
});
export const PaymentController = {
    getAllPayments,
};
