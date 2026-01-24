import { Router } from "express";
import { UserController } from "../controllers/user.controller";
import { verifyAccess } from "../middlewares/authMiddleware";
import { isAccountOwnerOrAdmin } from "../middlewares/isAccountOwnerOrAdmin"
import { isAdmin } from "../middlewares/isAdmin";
import { languagePreference } from "../middlewares/languagePreference";

const router = Router();
router.use(verifyAccess, languagePreference);

router.route("/").get(isAdmin, UserController.getUsers).post(isAdmin, UserController.createUser);

router
  .route("/:id")
  .get(isAccountOwnerOrAdmin, UserController.getUser)
  .patch(isAccountOwnerOrAdmin, UserController.updateUser);

router
  .route("/:id/avatar")
  .post(isAccountOwnerOrAdmin, UserController.uploadAvatar);

router
  .route("/:id/resend-code")
  .post(isAccountOwnerOrAdmin, UserController.resendVerificationCode);

router
  .route("/:id/role")
  .patch(isAdmin, UserController.updateUserRole);

router
  .route("/:id/delete")
  .patch(isAdmin, UserController.softDeleteUser);

export default router;
