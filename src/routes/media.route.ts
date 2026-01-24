import { Router } from "express";
import { SermonMediaController } from "../controllers/sermon-media.controller";
import { verifyAccess, restrictTo } from "../middlewares/authMiddleware";
import { Role } from "@prisma/client";
import { validate } from "../middlewares/validate";
import { mediaValidator } from "../middlewares/validations/sermon-media.validation";

const router = Router();

router.post(
    "/",
    verifyAccess,
    restrictTo(Role.ADMIN, Role.PASTOR),
    mediaValidator,
    validate,
    SermonMediaController.createMedia
);

router.get(
    "/",
    verifyAccess,
    SermonMediaController.getAllMedia
);

router.put(
    "/:id",
    verifyAccess,
    restrictTo(Role.ADMIN, Role.PASTOR),
    mediaValidator,
    validate,
    SermonMediaController.updateMedia
);

router.delete(
    "/:id",
    verifyAccess,
    restrictTo(Role.ADMIN, Role.PASTOR),
    SermonMediaController.deleteMedia
);

export default router;
