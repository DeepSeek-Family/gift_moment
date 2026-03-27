import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../../shared/catchAsync';
import { DashboardServices } from './dashboard.service';
import sendResponse from '../../../../shared/sendResponse';


const getDashboardAnalytic = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const result = await DashboardServices.getDashboardAnalytics(req.user);
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'Dashboard Analytics Retrieved Successfully',
        data: result,
    })
});


const getUserMonthlyProgresss = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const result = await DashboardServices.getUserMonthlyProgress();
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'User Monthly Progress Retrieved Successfully',
        data: result,
    })
});

const getSubscriptionMonthlyProgresss = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const result = await DashboardServices.getSubscriptionMonthlyProgress();
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'Subscription Monthly Progress Retrieved Successfully',
        data: result,
    })
});


const getRecentSubscribers = catchAsync(async (_req: Request, res: Response, next: NextFunction) => {
    const result = await DashboardServices.getRecentSubscriber();
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'Recent Subscribers Retrieved Successfully',
        data: result,
    })
});


export const DashboardController = {
    getDashboardAnalytic,
    getUserMonthlyProgresss,
    getSubscriptionMonthlyProgresss,
    getRecentSubscribers
};
