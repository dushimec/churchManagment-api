import { Router } from "express";
import { CertificationRequestController } from "../controllers/certification-request.controller";
import { verifyAccess, restrictTo, protectOptional } from "../middlewares/authMiddleware";
import { Role } from "@prisma/client";
import { validate } from "../middlewares/validate";
import {
    marriageRequestValidator,
    baptismRequestValidator,
    requestStatusValidator,
} from "../middlewares/validations/certification-request.validation";

const router = Router();

// Marriage Requests
router.post(
    "/marriage",
    protectOptional,
    marriageRequestValidator,
    validate,
    CertificationRequestController.createMarriageRequest
);

router.get(
    "/marriage",
    CertificationRequestController.getAllMarriageRequests
);

router.patch(
    "/marriage/:id/status",
    verifyAccess,
    restrictTo(Role.ADMIN, Role.PASTOR),
    requestStatusValidator,
    validate,
    CertificationRequestController.updateMarriageRequestStatus
);

// Baptism Requests
router.post(
    "/baptism",
    protectOptional,
    baptismRequestValidator,
    validate,
    CertificationRequestController.createBaptismRequest
);

router.get(
    "/baptism",
    CertificationRequestController.getAllBaptismRequests
);

router.patch(
    "/baptism/:id/status",
    verifyAccess,
    restrictTo(Role.ADMIN, Role.PASTOR),
    requestStatusValidator,
    validate,
    CertificationRequestController.updateBaptismRequestStatus
);

export default router;
