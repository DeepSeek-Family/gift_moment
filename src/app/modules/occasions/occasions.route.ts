import express from 'express';
import { OccasionsController } from './occasions.controller';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../../../enums/user';
import validateRequest from '../../middlewares/validateRequest';
import { OccasionsValidations } from './occasions.validation';
import { getSingleFilePath, getUploadFields } from '../../middlewares/fileUploaderHandelar';

const router = express.Router();

router.route('/')
    .post(auth(USER_ROLES.SUPER_ADMIN),
        getUploadFields(),
        async (req, res, next) => {
            try {
                const image = getSingleFilePath(req.files as Record<string, Express.Multer.File[]>, "image");
                if (!image) {
                    return res.status(400).json({
                        success: false,
                        message: 'Image is required',
                    });
                }
                req.body.isAdmin = req.user.id;
                req.body.image = image;
                next();
            } catch (error) {
                next(error);
            }
        },
        validateRequest(OccasionsValidations.createOccasionsSchema),

        OccasionsController.createOccasions)
    .get(auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.USER), OccasionsController.getAllOccasions);

router.route('/:id')
    .get(auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.USER), OccasionsController.getSingleOccasions)
    .patch(auth(USER_ROLES.SUPER_ADMIN),
        validateRequest(OccasionsValidations.updateOccasionsSchema),
        getUploadFields(),
        async (req, res, next) => {
            const image = getSingleFilePath(req.files as Record<string, Express.Multer.File[]>, "image");
            if (image) {
                req.body.image = image;
            }
            req.body.isAdmin = req.user.id;
            next();
        },
        OccasionsController.updateOccasions)
    .delete(auth(USER_ROLES.SUPER_ADMIN), OccasionsController.deleteOccasions);


export const OccasionsRoutes = router;
