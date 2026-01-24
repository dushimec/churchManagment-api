import { Router } from "express";
import { ContactController } from "../controllers/contact.controller";
import { verifyAccess, restrictTo } from "../middlewares/authMiddleware";
import { Role } from "@prisma/client";

const router = Router();

// Public route
router.post("/submit", ContactController.createMessage);

// Protected routes
router.get("/messages", verifyAccess, restrictTo(Role.ADMIN), ContactController.getAllMessages);
router.patch("/messages/:id/read", verifyAccess, restrictTo(Role.ADMIN), ContactController.markAsRead);
router.delete("/messages/:id", verifyAccess, restrictTo(Role.ADMIN), ContactController.deleteMessage);

export default router;
