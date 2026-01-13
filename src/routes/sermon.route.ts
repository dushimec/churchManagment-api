import { Router } from "express";
import { SermonMediaController } from "../controllers/sermon-media.controller";
import { verifyAccess, restrictTo } from "../middlewares/authMiddleware";
import { Role } from "@prisma/client";
import { validate } from "../middlewares/validate";
import { sermonValidator } from "../middlewares/validations/sermon-media.validation";

const router = Router();

router.post(
    "/",
    verifyAccess,
    restrictTo(Role.ADMIN, Role.PASTOR),
    sermonValidator,
    validate,
    SermonMediaController.createSermon
);

router.get(
    "/",
    verifyAccess,
    SermonMediaController.getAllSermons
);

router.get(
    "/:id",
    verifyAccess,
    SermonMediaController.getSermonById
);

router.put(
    "/:id",
    verifyAccess,
    restrictTo(Role.ADMIN, Role.PASTOR),
    sermonValidator,
    validate,
    SermonMediaController.updateSermon
);

router.delete(
    "/:id",
    verifyAccess,
    restrictTo(Role.ADMIN, Role.PASTOR),
    SermonMediaController.deleteSermon
);

export default router;
