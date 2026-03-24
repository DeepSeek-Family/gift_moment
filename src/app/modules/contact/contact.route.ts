import express from 'express';
import { ContactController } from './contact.controller';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../../../enums/user';

const router = express.Router();

router.post('/', auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.USER, USER_ROLES.ADMIN), ContactController.createContact);

export const ContactRoutes = router;
