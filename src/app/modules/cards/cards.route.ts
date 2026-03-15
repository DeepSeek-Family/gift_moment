import express from 'express';
import { CardsController } from './cards.controller';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../../../enums/user';
import { getSingleFilePath, getUploadFields } from '../../middlewares/fileUploaderHandelar';
import sendResponse from '../../../shared/sendResponse';

const router = express.Router();

router.route("/")
    .post(auth(USER_ROLES.SUPER_ADMIN),
        getUploadFields(),
        async (req, res, next) => {
            try {
                const file = getSingleFilePath(req.files as Record<string, Express.Multer.File[]>, "file");
                if (!file) {
                    return sendResponse(res, {
                        statusCode: 400,
                        success: false,
                        message: 'Image or video is required',
                    });
                }
                req.body.isAdmin = req.user.id;
                req.body.file = file;
                req.body.isFree = req.body.isFree === 'true' ? true : false;

                next();
            } catch (error) {
                next(error);
            }
        },
        CardsController.createCards)
    .get(auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.USER), CardsController.getAllCards);

router.route("/occasion/:id")
    .get(auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.USER), CardsController.getAllCardBasedOnOccasion);
export const CardsRoutes = router;
