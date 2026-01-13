import { body } from "express-validator";
import { ServiceType } from "@prisma/client";

export const serviceValidator = [
    body("title").isString().notEmpty().withMessage("Title is required"),
    body("description").optional().isString(),
    body("serviceType")
        .isIn(Object.values(ServiceType))
        .withMessage(`Service type must be one of: ${Object.values(ServiceType).join(", ")}`),
    body("date").isISO8601().withMessage("Valid date is required"),
    body("location").isString().notEmpty().withMessage("Location is required"),
    body("preacherId").optional().isString(),
    body("choirLeaderId").optional().isString(),
    body("startTime").isISO8601().withMessage("Valid start time is required"),
    body("endTime").isISO8601().withMessage("Valid end time is required"),
];

export const attendanceValidator = [
    body("serviceId").isString().notEmpty().withMessage("Service ID is required"),
    body("memberId").isString().notEmpty().withMessage("Member ID is required"),
    body("method").optional().isString(),
];
