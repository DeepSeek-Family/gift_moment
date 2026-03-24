import express from 'express';
import { SendGiftController } from './sendgift.controller';
import { USER_ROLES } from '../../../enums/user';
import auth from '../../middlewares/auth';

const router = express.Router();

router.route('/')
    .post(auth(USER_ROLES.USER, USER_ROLES.SUPER_ADMIN),
        SendGiftController.sendGift)
    .get(auth(USER_ROLES.USER, USER_ROLES.SUPER_ADMIN), SendGiftController.getMyGifts);

export const SendGiftRoutes = router;
