import { Router } from "express";
import { OverviewController } from "../controllers/overview.controller";
import { verifyAccess } from "../middlewares/authMiddleware";

const router = Router();

router.get("/stats", verifyAccess, OverviewController.getStats);

export default router;
