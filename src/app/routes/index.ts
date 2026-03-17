import express from "express";
import { UserRoutes } from "../modules/user/user.routes";
import { AuthRoutes } from "../modules/auth/auth.routes";
import { BannerRoutes } from "../modules/banner/banner.routes";
import { OccasionsRoutes } from "../modules/occasions/occasions.route";
import { CardsRoutes } from "../modules/cards/cards.route";
import { SendGiftRoutes } from "../modules/sendgift/sendgift.route";
import { RuleRoutes } from "../modules/rule/rule.route";
import { NotificationRoutes } from "../modules/notification/notification.routes";
import { PaymentRoutes } from "../modules/payment/payment.route";
import { ContuctRoutes } from "../modules/contuct/contuct.route";
const router = express.Router();

const apiRoutes = [
  { path: "/user", route: UserRoutes },
  { path: "/auth", route: AuthRoutes },
  { path: "/banner", route: BannerRoutes },
  { path: "/occasions", route: OccasionsRoutes },
  { path: "/cards", route: CardsRoutes },
  { path: "/send-gift", route: SendGiftRoutes },
  { path: "/rule", route: RuleRoutes },
  { path: "/notification", route: NotificationRoutes },
  { path: "/payment", route: PaymentRoutes },
  { path: "/contuct", route: ContuctRoutes },
];

apiRoutes.forEach((route) => router.use(route.path, route.route));
export default router;
