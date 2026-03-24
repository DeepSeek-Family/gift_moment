import { Request, Response, NextFunction } from 'express';
import { ContactServices } from './contact.service';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { StatusCodes } from 'http-status-codes';
const createContact = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body;

    const contact = await ContactServices.createContactIntoDB(payload, req.user);
    sendResponse(res, {
        statusCode: StatusCodes.CREATED,
        success: true,
        message: "Contact created successfully",
        data: contact,
    })
});
export const ContactController = {
    createContact
};
