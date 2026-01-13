import { Router } from "express";
import { CommunityController } from "../controllers/community.controller";
import { verifyAccess, restrictTo } from "../middlewares/authMiddleware";
import { Role } from "@prisma/client";
import { validate } from "../middlewares/validate";
import { eventValidator } from "../middlewares/validations/community.validation";

const router = Router();

// Event Routes
router.post(
    "/",
    verifyAccess,
    restrictTo(Role.ADMIN, Role.PASTOR),
    eventValidator,
    validate,
    CommunityController.createEvent
);

router.get(
    "/",
    verifyAccess,
    CommunityController.getAllEvents
);

router.get(
    "/:id",
    verifyAccess,
    CommunityController.getEventById
);

router.put(
    "/:id",
    verifyAccess,
    restrictTo(Role.ADMIN, Role.PASTOR),
    eventValidator,
    validate,
    CommunityController.updateEvent
);

router.delete(
    "/:id",
    verifyAccess,
    restrictTo(Role.ADMIN, Role.PASTOR),
    CommunityController.deleteEvent
);

// Registration Routes
router.post(
    "/:id/register",
    verifyAccess,
    CommunityController.registerForEvent
);

router.delete(
    "/:id/unregister",
    verifyAccess,
    CommunityController.unregisterFromEvent
);

router.get(
    "/:id/registrations",
    verifyAccess,
    restrictTo(Role.ADMIN, Role.PASTOR),
    CommunityController.getEventRegistrations
);

export default router;
