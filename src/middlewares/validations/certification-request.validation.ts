import { body } from "express-validator";
import { RequestStatus } from "@prisma/client";

export const marriageRequestValidator = [
    body("brideNationalId")
        .isString()
        .notEmpty()
        .withMessage("Bride National ID is required"),
    body("groomNationalId")
        .isString()
        .notEmpty()
        .withMessage("Groom National ID is required"),
    body("requesterNationalId")
        .optional()
        .isString(),
    body("brideId").optional().isString(),
    body("groomId").optional().isString(),
    body("requesterId").optional().isString(),
    body("brideName")
        .isString()
        .notEmpty()

        .withMessage("Bride name is required"),
    body("bridePhone")
        .isString()
        .notEmpty()
        .withMessage("Bride phone is required"),
    body("brideEmail")
        .optional()
        .isEmail()
        .withMessage("Valid bride email is required"),
    body("groomName")
        .isString()
        .notEmpty()
        .withMessage("Groom name is required"),
    body("groomPhone")
        .isString()
        .notEmpty()
        .withMessage("Groom phone is required"),
    body("groomEmail")
        .optional()
        .isEmail()
        .withMessage("Valid groom email is required"),
    body("requesterName")
        .optional()
        .isString(),
    body("requesterPhone")
        .optional()
        .isString(),
    body("requesterEmail")
        .isEmail()
        .withMessage("Valid requester email is required for notification"),
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
    body("requesterName")
        .optional()
        .isString(),
    body("requesterPhone")
        .optional()
        .isString(),
    body("requesterEmail")
        .isEmail()
        .withMessage("Valid requester email is required for notification"),
    body("requesterId")
        .optional()
        .isString(),
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
