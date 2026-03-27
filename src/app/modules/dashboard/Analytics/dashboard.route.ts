import express from 'express';
import { DashboardController } from './dashboard.controller';
import auth from '../../../middlewares/auth';
import { USER_ROLES } from '../../../../enums/user';

const router = express.Router();

router.route('/analytic').get(auth(USER_ROLES.SUPER_ADMIN), DashboardController.getDashboardAnalytic);
router.route('/user-monthly-progress').get(auth(USER_ROLES.SUPER_ADMIN), DashboardController.getUserMonthlyProgresss);
router.route('/subscription-monthly-progress').get(auth(USER_ROLES.SUPER_ADMIN), DashboardController.getSubscriptionMonthlyProgresss);
router.route('/recent-subscribers').get(auth(USER_ROLES.SUPER_ADMIN), DashboardController.getRecentSubscribers);

export const DashboardRoutes = router;
