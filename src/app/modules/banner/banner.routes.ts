import { Router } from "express";
import auth from "../../middlewares/auth";
import { USER_ROLES } from "../../../enums/user";
import { BannerController } from "./banner.controller.ts";
import validateRequest from "../../middlewares/validateRequest";
import { BannerValidation } from "./banner.validation";
import { getSingleFilePath, getUploadFields } from "../../middlewares/fileUploaderHandelar";

const router = Router();
router.route("/")
  .post(auth(USER_ROLES.SUPER_ADMIN),
    getUploadFields(),
    async (req, _res, next) => {
      try {
        const image = getSingleFilePath(req.files as Record<string, Express.Multer.File[]>, "image");
        if (!image) {
          return {
            success: false,
            message: "Image file is required",
          }
        }
        req.body.image = image;
        next();
      } catch (error) {
        next(error);
      }
    },
    validateRequest(BannerValidation.createBannerZodSchema),
    BannerController.bannerCreate)
  .get(BannerController.getAllBanner);

router.route("/:id")
  .delete(auth(USER_ROLES.SUPER_ADMIN), BannerController.deleteBanner)
  .patch(auth(USER_ROLES.SUPER_ADMIN), validateRequest(BannerValidation.updateBannerZodSchema), BannerController.updateBannerStatus);



export const BannerRoutes = router;