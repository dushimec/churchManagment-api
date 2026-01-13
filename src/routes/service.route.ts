import { Router } from "express";
import { ServiceController } from "../controllers/service.controller";
import { serviceValidator, attendanceValidator } from "../middlewares/validations/service.validation";
import { verifyAccess, restrictTo } from "../middlewares/authMiddleware";
import { Role } from "@prisma/client";
import { validate } from "../middlewares/validate";

const router = Router();

// Public/Member access for listing and viewing
router.get("/", verifyAccess, ServiceController.getAllServices);
router.get("/:id", verifyAccess, ServiceController.getServiceById);

// Management routes (Admin/Pastor)
router.post(
    "/",
    verifyAccess,
    restrictTo(Role.ADMIN, Role.PASTOR),
    serviceValidator,
    validate,
    ServiceController.createService
);

router.put(
    "/:id",
    verifyAccess,
    restrictTo(Role.ADMIN, Role.PASTOR),
    serviceValidator,
    validate,
    ServiceController.updateService
);

router.delete(
    "/:id",
    verifyAccess,
    restrictTo(Role.ADMIN, Role.PASTOR),
    ServiceController.deleteService
);

// Attendance routes
router.post(
    "/attendance",
    verifyAccess,
    restrictTo(Role.ADMIN, Role.PASTOR),
    attendanceValidator,
    validate,
    ServiceController.markAttendance
);

router.get(
    "/:id/attendance",
    verifyAccess,
    restrictTo(Role.ADMIN, Role.PASTOR),
    ServiceController.getServiceAttendance
);

export default router;
