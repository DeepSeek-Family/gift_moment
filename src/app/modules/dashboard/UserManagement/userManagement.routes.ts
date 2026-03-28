import { Router } from "express";
import { UserManagementController } from "./userManagement.controller";
import auth from "../../../middlewares/auth";
import { USER_ROLES } from "../../../../enums/user";

const router = Router();
router.route("/users", ).get(auth(USER_ROLES.SUPER_ADMIN), UserManagementController.getAllUsers);
router.route("/users/:id").get(auth(USER_ROLES.SUPER_ADMIN), UserManagementController.getSingleUser);
router.route("/user/ban/:id").patch(auth(USER_ROLES.SUPER_ADMIN), UserManagementController.banTheUserAsAdmin);

export const UserManagementRoutes = router;