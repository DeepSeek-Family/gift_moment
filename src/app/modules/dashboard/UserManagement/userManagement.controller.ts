import { StatusCodes } from "http-status-codes";
import catchAsync from "../../../../shared/catchAsync";
import sendResponse from "../../../../shared/sendResponse";
import { UserManagementService } from "./userManagement.service";

const getAllUsers = catchAsync(async (req, res) => {
    const { result, meta } = await UserManagementService.getAllUserListFromDB(req.query, req.user);
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'User List Retrieve Successfully',
        pagination: meta,
        data: result || [],
    });
});

const getSingleUser = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await UserManagementService.getSingleUserFromDB(id);
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'User Retrieve Successfully',
        data: result,
    });
});

export const UserManagementController = {
    getAllUsers,
    getSingleUser
}