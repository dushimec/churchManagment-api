import { Router } from "express";
import { WebsiteController } from "../controllers/website.controller";
import { verifyAccess, restrictTo } from "../middlewares/authMiddleware";
import { Role } from "@prisma/client";

const router = Router();

// Public routes
router.get("/about", WebsiteController.getAboutSections);
router.get("/leadership", WebsiteController.getLeadership);
router.get("/info", WebsiteController.getContactInfo);

// Protected routes
router.post("/about", verifyAccess, restrictTo(Role.ADMIN), WebsiteController.upsertAboutSection);
router.post("/leadership", verifyAccess, restrictTo(Role.ADMIN), WebsiteController.addLeadership);
router.put("/leadership/:id", verifyAccess, restrictTo(Role.ADMIN), WebsiteController.updateLeadership);
router.delete("/leadership/:id", verifyAccess, restrictTo(Role.ADMIN), WebsiteController.deleteLeadership);
router.post("/info", verifyAccess, restrictTo(Role.ADMIN), WebsiteController.upsertContactInfo);

export default router;
