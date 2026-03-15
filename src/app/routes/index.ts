import express from "express";
import { UserRoutes } from "../modules/user/user.routes";
import { AuthRoutes } from "../modules/auth/auth.routes";
import { BannerRoutes } from "../modules/banner/banner.routes";
import { OccasionsRoutes } from "../modules/occasions/occasions.route";
import { CardsRoutes } from "../modules/cards/cards.route";
import { SendGiftRoutes } from "../modules/sendgift/sendgift.route";
const router = express.Router();

const apiRoutes = [
  { path: "/user", route: UserRoutes },
  { path: "/auth", route: AuthRoutes },
  { path: "/banner", route: BannerRoutes },
  { path: "/occasions", route: OccasionsRoutes },
  { path: "/cards", route: CardsRoutes },
  { path: "/send-gift", route: SendGiftRoutes },
];

apiRoutes.forEach((route) => router.use(route.path, route.route));
export default router;
