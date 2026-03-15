import { Request, Response, NextFunction } from 'express';
import { OccasionsServices } from './occasions.service';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';



const createOccasions = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const result = await OccasionsServices.createOccasionsIntoDB(req.user, req.body);
    if (result.status === "failed") {
        return sendResponse(res, {
            statusCode: 400,
            success: false,
            message: 'Failed to create occasion',
        });
    }
    if (result.status === "duplicate") {
        return sendResponse(res, {
            statusCode: 409,
            success: false,
            message: 'Occasion already exists',
        });
    }
    if (result.status === "unauthorized") {
        return sendResponse(res, {
            statusCode: 401,
            success: false,
            message: 'Unauthorized to create occasion',
        });
    }
    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: 'Occasion created successfully',
        data: result,
    });
});

const getAllOccasions = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const result = await OccasionsServices.getAllOccasionsFromDB();
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Occasions retrieved successfully',
        data: result,
    });
});

const updateOccasions = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const result = await OccasionsServices.updateOccasionsIntoDB(id, req.body);
    if (result.status === "failed") {
        return sendResponse(res, {
            statusCode: 400,
            success: false,
            message: 'Failed to update occasion',
        });
    }
    if (result.status === "unauthorized") {
        return sendResponse(res, {
            statusCode: 401,
            success: false,
            message: 'Unauthorized to update occasion',
        });
    }
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Occasion updated successfully',
        data: result,
    });
});

const deleteOccasions = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const result = await OccasionsServices.deleteOccasionsFromDB(id);
    if (result.status === "failed") {
        return sendResponse(res, {
            statusCode: 400,
            success: false,
            message: 'Failed to delete occasion',
        });
    }
    if (result.status === "unauthorized") {
        return sendResponse(res, {
            statusCode: 401,
            success: false,
            message: 'Unauthorized to delete occasion',
        });
    }
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Occasion deleted successfully',
        data: result,
    });
});

const getSingleOccasions = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const result = await OccasionsServices.getSingleOccasionsFromDB(id);
    if (result === "Not found") {
        return sendResponse(res, {
            statusCode: 404,
            success: false,
            message: 'Occasion not found',
        });
    }
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Occasion retrieved successfully',
        data: result,
    });
});


export const OccasionsController = {
    createOccasions,
    getAllOccasions,
    updateOccasions,
    deleteOccasions,
    getSingleOccasions
};

export const OccasionsController2 = {
    createOccasions,
    getAllOccasions,
    updateOccasions,
    deleteOccasions
};
