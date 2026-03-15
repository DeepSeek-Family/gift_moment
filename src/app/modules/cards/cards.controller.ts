import { Request, Response, NextFunction } from 'express';
import { CardsServices } from './cards.service';
import sendResponse from '../../../shared/sendResponse';



const createCards = async (req: Request, res: Response, next: NextFunction) => {
    const result = await CardsServices.createCardsIntoDB(req.user, req.body);
    if ('status' in result && result.status === "price_error") {
        return sendResponse(res, {
            statusCode: 400,
            success: false,
            message: result.message,
        });
    }
    if ('status' in result && result.status === "failed") {
        return sendResponse(res, {
            statusCode: 400,
            success: false,
            message: 'Failed to create card',
        });
    }
    if ('status' in result && result.status === "unauthorized") {
        return sendResponse(res, {
            statusCode: 401,
            success: false,
            message: 'Unauthorized to create card',
        });
    }
    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: 'Card created successfully',
        data: result,
    });
};

const getAllCards = async (req: Request, res: Response, next: NextFunction) => {
    const result = await CardsServices.getAllFilesFromDB(req.query);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Cards retrieved successfully',
        data: result,
    });
};

const updateCards = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const result = await CardsServices.updateCardsIntoDB(id, req.user, req.body);
    if ('status' in result && result.status === "failed") {
        return sendResponse(res, {
            statusCode: 400,
            success: false,
            message: 'Failed to update card',
        });
    }
    if ('status' in result && result.status === "unauthorized") {
        return sendResponse(res, {
            statusCode: 401,
            success: false,
            message: 'Unauthorized to update card',
        });
    }
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Card updated successfully',
        data: result,
    });
}

const deleteCards = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const result = await CardsServices.deleteCardsFromDB(id, req.user);
    if ('status' in result && result.status === "failed") {
        return sendResponse(res, {
            statusCode: 400,
            success: false,
            message: 'Failed to delete card',
        });
    }
    if ('status' in result && result.status === "unauthorized") {
        return sendResponse(res, {
            statusCode: 401,
            success: false,
            message: 'Unauthorized to delete card',
        });
    }
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Card deleted successfully',
        data: result,
    });
};

const getAllCardBasedOnOccasion = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const result = await CardsServices.getAllCardBasedOnOccasionFromDB(id, req.query);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Cards retrieved successfully',
        pagination: result.pagination,
        data: result.data,
    });
};

export const CardsController = {
    createCards,
    getAllCards,
    updateCards,
    deleteCards,
    getAllCardBasedOnOccasion
};
