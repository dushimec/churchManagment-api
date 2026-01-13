import { body } from "express-validator";
import { RequestStatus } from "@prisma/client";

export const prayerRequestValidator = [
    body("request")
        .isString()
        .notEmpty()
        .withMessage("Prayer request content is required")
        .isLength({ min: 10 })
        .withMessage("Prayer request must be at least 10 characters long"),
    body("isPrivate")
        .optional()
        .isBoolean()
        .withMessage("isPrivate must be a boolean"),
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
        .isString()
        .notEmpty()
        .withMessage("Pastor ID is required"),
    body("date")
        .isISO8601()
        .withMessage("Valid date is required")
        .custom((value) => {
            if (new Date(value) < new Date()) {
                throw new Error("Appointment date must be in the future");
            }
            return true;
        }),
    body("duration")
        .isInt({ min: 15, max: 120 })
        .withMessage("Duration must be between 15 and 120 minutes"),
    body("purpose")
        .isString()
        .notEmpty()
        .withMessage("Purpose of appointment is required"),
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
