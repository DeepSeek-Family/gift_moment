import { StatusCodes } from "http-status-codes";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { BannerService } from "./banner.service";
import { Request, Response } from "express";

const bannerCreate = catchAsync(async (req: Request, res: Response) => {
    const result = await BannerService.createBannerToDB(req.user!, req.body);
    if (result.status === "Unauthorized") {
        sendResponse(res, {
            success: false,
            statusCode: StatusCodes.UNAUTHORIZED,
            message: 'You are not authorized to create a banner',
        });
        return;
    }
    if (result.status === "Failed") {
        sendResponse(res, {
            success: false,
            statusCode: StatusCodes.BAD_REQUEST,
            message: 'Failed to create banner',
        });
        return;
    }

    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: 'Banner created successfully',
        data: result
    });
});

const getAllBanner = catchAsync(async (req: Request, res: Response) => {
    const result = await BannerService.getAllBannerFromDB();
    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: 'Banner fetched successfully',
        data: result
    });
});



const deleteBanner = catchAsync(async (req: Request, res: Response) => {
    const result = await BannerService.deleteBannerFromDB(req.user!, req.params.id);
    if (result.status === "Unauthorized") {
        sendResponse(res, {
            success: false,
            statusCode: StatusCodes.UNAUTHORIZED,
            message: 'You are not authorized to delete a banner',
        });
        return;
    }
    if (result.status === "Failed") {
        sendResponse(res, {
            success: false,
            statusCode: StatusCodes.BAD_REQUEST,
            message: 'Failed to delete banner',
        });
        return;
    }

    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: 'Banner deleted successfully',
        data: result
    });
});


const updateBannerStatus = catchAsync(async (req: Request, res: Response) => {
    const result = await BannerService.turnOffStatusOfBannerFromDB(req.user!, req.params.id, req.body);
    if (result.status === "Unauthorized") {
        sendResponse(res, {
            success: false,
            statusCode: StatusCodes.UNAUTHORIZED,
            message: 'You are not authorized to update banner status',
        });
        return;
    }
    if (result.status === "Failed") {
        sendResponse(res, {
            success: false,
            statusCode: StatusCodes.BAD_REQUEST,
            message: 'Failed to update banner status',
        });
        return;
    }

    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: 'Banner status updated successfully',
        data: result
    })
})


export const BannerController = {
    bannerCreate,
    getAllBanner,
    deleteBanner,
    updateBannerStatus
}