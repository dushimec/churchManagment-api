import { body } from "express-validator";
import { EventType } from "@prisma/client";

export const eventValidator = [
    body("title")
        .isString()
        .notEmpty()
        .withMessage("Title is required"),
    body("description")
        .optional()
        .isString()
        .withMessage("Description must be a string"),
    body("eventType")
        .isIn(Object.values(EventType))
        .withMessage(`Event type must be one of: ${Object.values(EventType).join(", ")}`),
    body("date")
        .isISO8601()
        .withMessage("Valid date is required")
        .custom((value) => {
            if (new Date(value) < new Date()) {
                throw new Error("Event date must be in the future");
            }
            return true;
        }),
    body("location")
        .isString()
        .notEmpty()
        .withMessage("Location is required"),
];
