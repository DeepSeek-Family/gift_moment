import express from 'express';
import { USER_ROLES } from '../../../enums/user';
import auth from '../../middlewares/auth';
import { MessageController } from './message.controller';
import { fileUploadHandler } from '../../../shared/fileUploadHandler';
import { getSingleFilePath } from '../../middlewares/fileUploaderHandelar';
const router = express.Router();

router.post(
  '/',
  auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN, USER_ROLES.USER),
  fileUploadHandler(),
  async (req, res, next) => {
    try {
      const image = getSingleFilePath(
        req.files as Record<string, Express.Multer.File[]>,
        "image"
      );
      if (image) {
        req.body.image = image;
      }
      const audio = getSingleFilePath(
        req.files as Record<string, Express.Multer.File[]>,
        "audio"
      );
      if (audio) {
        req.body.audio = audio;
      }
      console.log("audio\n\n", audio);

      console.log("req.body", req.body);
      next();
    } catch (error) {
      next(error);
    }
  },
  MessageController.sendMessage
);
router.get(
  '/:id',
  auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN, USER_ROLES.USER),
  MessageController.getMessage
);

export const MessageRoutes = router;
