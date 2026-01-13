import { Router } from "express";
import { PastoralController } from "../controllers/pastoral.controller";
import { verifyAccess, restrictTo } from "../middlewares/authMiddleware";
import { Role } from "@prisma/client";
import { validate } from "../middlewares/validate";
import {
    prayerRequestValidator,
    prayerResponseValidator,
    counselingAppointmentValidator,
    counselingStatusValidator,
} from "../middlewares/validations/pastoral.validation";

const router = Router();

// Prayer Request Routes
router.post(
    "/prayer-requests",
    verifyAccess,
    prayerRequestValidator,
    validate,
    PastoralController.createPrayerRequest
);

router.get(
    "/prayer-requests",
    verifyAccess,
    PastoralController.getAllPrayerRequests
);

router.get(
    "/prayer-requests/:id",
    verifyAccess,
    PastoralController.getPrayerRequestById
);

router.patch(
    "/prayer-requests/:id/respond",
    verifyAccess,
    restrictTo(Role.PASTOR, Role.ADMIN),
    prayerResponseValidator,
    validate,
    PastoralController.respondToPrayerRequest
);

// Counseling Appointment Routes
router.post(
    "/counseling-appointments",
    verifyAccess,
    counselingAppointmentValidator,
    validate,
    PastoralController.createCounselingAppointment
);

router.get(
    "/counseling-appointments",
    verifyAccess,
    PastoralController.getAllCounselingAppointments
);

router.patch(
    "/counseling-appointments/:id/status",
    verifyAccess,
    restrictTo(Role.PASTOR, Role.ADMIN),
    counselingStatusValidator,
    validate,
    PastoralController.updateCounselingStatus
);

export default router;
