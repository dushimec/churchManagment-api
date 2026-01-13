import { Router } from "express";
import { FinancialController } from "../controllers/financial.controller";
import { verifyAccess, restrictTo } from "../middlewares/authMiddleware";
import { Role } from "@prisma/client";
import { validate } from "../middlewares/validate";
import { contributionValidator } from "../middlewares/validations/financial.validation";

const router = Router();

router.post(
    "/",
    verifyAccess,
    contributionValidator,
    validate,
    FinancialController.createContribution
);

router.get(
    "/",
    verifyAccess,
    restrictTo(Role.ADMIN, Role.TREASURER),
    FinancialController.getAllContributions
);

router.get(
    "/:id",
    verifyAccess,
    FinancialController.getContributionById
);

router.patch(
    "/:id/verify",
    verifyAccess,
    restrictTo(Role.ADMIN, Role.TREASURER),
    FinancialController.verifyContribution
);

export default router;
