import express from 'express';
import { ContuctController } from './contuct.controller';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../../../enums/user';

const router = express.Router();

router.post('/', auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.USER, USER_ROLES.ADMIN), ContuctController.createContuct);

export const ContuctRoutes = router;
