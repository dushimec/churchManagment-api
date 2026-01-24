import { body } from "express-validator";
import { RequestStatus } from "@prisma/client";

export const prayerRequestValidator = [
    body("request")
        .isString()
        .notEmpty()
        .withMessage("Prayer request content is required")
        .isLength({ min: 5 })
        .withMessage("Prayer request must be at least 5 characters long"),
    body("isPrivate")
        .optional()
        .isBoolean()
        .withMessage("isPrivate must be a boolean"),
    body("requesterName").optional().isString(),
    body("requesterEmail").optional().isEmail(),
];

export const prayerResponseValidator = [
    body("response")
        .isString()
        .notEmpty()
        .withMessage("Response content is required")
        .isLength({ min: 5 })
        .withMessage("Response must be at least 5 characters long"),
];

export const counselingAppointmentValidator = [
    body("pastorId")
        .optional()
        .isString(),
    body("date")
        .optional() // We might get it from preferredDate
        .isISO8601()
        .withMessage("Valid date is required"),
    body("preferredDate")
        .optional()
        .isISO8601()
        .withMessage("Valid preferred date is required"),
    body("duration")
        .optional()
        .isInt({ min: 15, max: 120 })
        .withMessage("Duration must be between 15 and 120 minutes"),
    body("purpose")
        .optional()
        .isString(),
    body("reason")
        .optional()
        .isString(),
    body("requesterName").optional().isString(),
    body("requesterEmail").optional().isEmail(),
    body("requesterPhone").optional().isString(),
    body("preferredTime").optional().isString(),
];

export const counselingStatusValidator = [
    body("status")
        .isIn(Object.values(RequestStatus))
        .withMessage(`Status must be one of: ${Object.values(RequestStatus).join(", ")}`),
    body("notes")
        .optional()
        .isString()
        .withMessage("Notes must be a string"),
];
