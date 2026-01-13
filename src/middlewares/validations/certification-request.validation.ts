import { body } from "express-validator";
import { RequestStatus } from "@prisma/client";

export const marriageRequestValidator = [
    body("brideId")
        .isString()
        .notEmpty()
        .withMessage("Bride ID is required"),
    body("groomId")
        .isString()
        .notEmpty()
        .withMessage("Groom ID is required"),
    body("weddingDate")
        .isISO8601()
        .withMessage("Valid wedding date is required")
        .custom((value) => {
            if (new Date(value) < new Date()) {
                throw new Error("Wedding date must be in the future");
            }
            return true;
        }),
    body("location")
        .optional()
        .isString()
        .withMessage("Location must be a string"),
    body("witness1Name")
        .isString()
        .notEmpty()
        .withMessage("Witness 1 name is required"),
    body("witness1Phone")
        .isString()
        .notEmpty()
        .withMessage("Witness 1 phone is required"),
    body("witness2Name")
        .isString()
        .notEmpty()
        .withMessage("Witness 2 name is required"),
    body("witness2Phone")
        .isString()
        .notEmpty()
        .withMessage("Witness 2 phone is required"),
];

export const baptismRequestValidator = [
    body("childName")
        .isString()
        .notEmpty()
        .withMessage("Child name is required"),
    body("dateOfBirth")
        .isISO8601()
        .withMessage("Valid date of birth is required"),
];

export const requestStatusValidator = [
    body("status")
        .isIn(Object.values(RequestStatus))
        .withMessage(`Status must be one of: ${Object.values(RequestStatus).join(", ")}`),
    body("scheduledDate")
        .optional()
        .isISO8601()
        .withMessage("Scheduled date must be a valid ISO8601 date"),
];
