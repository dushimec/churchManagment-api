import { Router } from "express";
import { CommunicationController } from "../controllers/communication.controller";
import { verifyAccess } from "../middlewares/authMiddleware";
import { validate } from "../middlewares/validate";
import { messageValidator } from "../middlewares/validations/communication.validation";

const router = Router();

// Notification Routes
router.get(
    "/notifications",
    verifyAccess,
    CommunicationController.getMyNotifications
);

router.patch(
    "/notifications/:id/read",
    verifyAccess,
    CommunicationController.markAsRead
);

router.patch(
    "/notifications/read-all",
    verifyAccess,
    CommunicationController.markAllAsRead
);

// Message Routes
router.post(
    "/messages",
    verifyAccess,
    messageValidator,
    validate,
    CommunicationController.sendMessage
);

router.get(
    "/messages/:userId",
    verifyAccess,
    CommunicationController.getChatHistory
);

export default router;
